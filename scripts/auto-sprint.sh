#!/usr/bin/env bash
set -euo pipefail

# ============================================
# auto-sprint.sh — unattended Aider sprint runner
# ============================================
#
# Features:
# - External queue file (default: specs/QUEUE.txt)
# - Unattended mode (NO interactive prompts)
# - Per-task timeout (default: 90m) via coreutils timeout
# - Timestamped logs under docs/worklog/
# - Heartbeat file updated per task (monitors liveness)
# - Unique run id + branch names (no collisions)
# - Writes blocked notes per run
# - Returns to main after each task (success or fail)
# - Optional PR creation via gh (--pr)
# - Dry-run mode (--list) to preview queue without executing
#
# Usage:
#   ./scripts/auto-sprint.sh
#   ./scripts/auto-sprint.sh --queue specs/QUEUE.txt
#   ./scripts/auto-sprint.sh --pr
#   ./scripts/auto-sprint.sh --timeout 60
#   ./scripts/auto-sprint.sh --list
#   ./scripts/auto-sprint.sh --queue specs/QUEUE.txt --pr --timeout 90
#
# Requirements:
# - git repo with clean working tree
# - aider available in PATH
# - npm + package-lock present
# - timeout (coreutils) available in PATH
# - (optional) gh authenticated if using --pr

QUEUE_FILE="specs/QUEUE.txt"
OPEN_PR=false
TASK_TIMEOUT_MIN=90
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --queue)
      QUEUE_FILE="${2:-}"
      shift 2
      ;;
    --pr)
      OPEN_PR=true
      shift
      ;;
    --timeout)
      TASK_TIMEOUT_MIN="${2:-90}"
      shift 2
      ;;
    --list)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [--queue <file>] [--pr] [--timeout <minutes>] [--list]"
      echo ""
      echo "Options:"
      echo "  --queue <file>      Queue file with spec paths (default: specs/QUEUE.txt)"
      echo "  --pr                Auto-create GitHub PRs via gh after each success"
      echo "  --timeout <min>     Max minutes per Aider task (default: 90)"
      echo "  --list              Dry run: print queue and exit without executing"
      echo "  -h, --help          Show this help"
      exit 0
      ;;
    *)
      echo "Unknown arg: $1"
      exit 1
      ;;
  esac
done

# ---------- dry run: list queue and exit ----------
if [[ "$DRY_RUN" == true ]]; then
  if [[ ! -f "$QUEUE_FILE" ]]; then
    echo "Queue file not found: $QUEUE_FILE"
    exit 1
  fi

  echo "Queue: $QUEUE_FILE"
  echo "Task timeout: ${TASK_TIMEOUT_MIN}m"
  echo "Auto PR: $OPEN_PR"
  echo ""
  echo "Tasks:"

  INDEX=0
  while IFS= read -r LINE || [[ -n "$LINE" ]]; do
    LINE="$(echo "$LINE" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    [[ -z "$LINE" ]] && continue
    [[ "$LINE" =~ ^# ]] && continue
    INDEX=$((INDEX + 1))

    if [[ -f "$LINE" ]]; then
      STATUS="OK"
    else
      STATUS="MISSING"
    fi

    echo "  $INDEX. $LINE [$STATUS]"
  done < "$QUEUE_FILE"

  if [[ "$INDEX" -eq 0 ]]; then
    echo "  (empty queue)"
  fi

  exit 0
fi

# ---------- preflight ----------
if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git not found"
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found"
  exit 1
fi
if ! command -v aider >/dev/null 2>&1; then
  echo "ERROR: aider not found in PATH"
  exit 1
fi
if ! command -v timeout >/dev/null 2>&1; then
  echo "ERROR: timeout (coreutils) not found. Install: sudo apt-get install -y coreutils"
  exit 1
fi
if [[ "$OPEN_PR" == true ]] && ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: --pr requires GitHub CLI (gh). Install it or run without --pr."
  exit 1
fi

if [[ ! -f "package-lock.json" ]]; then
  echo "ERROR: package-lock.json not found. Run from repo root."
  exit 1
fi

if [[ ! -f "$QUEUE_FILE" ]]; then
  echo "ERROR: Queue file not found: $QUEUE_FILE"
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: Working tree is dirty. Commit/stash changes before running."
  exit 1
fi

# ---------- logging ----------
LOG_DIR="docs/worklog"
mkdir -p "$LOG_DIR"
RUN_ID="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$LOG_DIR/auto-sprint-$RUN_ID.log"
BLOCKED_FILE="$LOG_DIR/blocked-$RUN_ID.md"
HEARTBEAT_FILE="$LOG_DIR/heartbeat.log"

log() {
  echo "$@" | tee -a "$LOG_FILE"
}

heartbeat() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') | run=$RUN_ID | task=$1 | status=$2" >> "$HEARTBEAT_FILE"
}

log "=== auto-sprint started: $RUN_ID ==="
log "Queue file: $QUEUE_FILE"
log "Open PRs: $OPEN_PR"
log "Task timeout: ${TASK_TIMEOUT_MIN}m"
log "Git branch (start): $(git rev-parse --abbrev-ref HEAD)"
log ""
heartbeat "init" "started"

# ---------- baseline ----------
log "== Baseline sync/install =="
git checkout main 2>&1 | tee -a "$LOG_FILE"
git pull 2>&1 | tee -a "$LOG_FILE"
npm ci 2>&1 | tee -a "$LOG_FILE"

log "== Baseline validate (must pass before sprint) =="
if ! npm run validate 2>&1 | tee -a "$LOG_FILE"; then
  log "ERROR: Baseline npm run validate failed on main. Fix main before running sprint."
  heartbeat "baseline" "FAILED"
  exit 1
fi
heartbeat "baseline" "passed"

log ""
log "== Starting task loop =="

# ---------- task loop ----------
TASK_COUNT=0
SUCCESS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0
TIMEOUT_COUNT=0

while IFS= read -r SPEC || [[ -n "$SPEC" ]]; do
  SPEC="$(echo "$SPEC" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
  [[ -z "$SPEC" ]] && continue
  [[ "$SPEC" =~ ^# ]] && continue

  TASK_COUNT=$((TASK_COUNT + 1))

  if [[ ! -f "$SPEC" ]]; then
    SKIP_COUNT=$((SKIP_COUNT + 1))
    log ""
    log "=== TASK $TASK_COUNT: SKIP (spec missing) ==="
    log "Spec: $SPEC"
    heartbeat "$SPEC" "skipped"
    continue
  fi

  SPEC_BASE="$(basename "$SPEC" .md)"
  BRANCH="auto/${SPEC_BASE}-${RUN_ID}"

  log ""
  log "=== TASK $TASK_COUNT: $SPEC -> $BRANCH ==="
  heartbeat "$SPEC" "starting"

  # Always start from a clean main state per task
  git checkout main 2>&1 | tee -a "$LOG_FILE"
  git pull 2>&1 | tee -a "$LOG_FILE"

  # Create branch
  git checkout -b "$BRANCH" 2>&1 | tee -a "$LOG_FILE"

  # Build the aider prompt
  AIDER_PROMPT=$(
    cat <<EOF
Read docs/ARCHITECTURE.md, docs/AGENTS.md, docs/PROJECT.md, docs/WORKFLOWS.md and $SPEC.

Implement the spec exactly. Keep changes minimal.
Do NOT add new dependencies unless the spec explicitly requests it.
Do NOT modify config files unless the spec explicitly requires it.
Only touch files listed or implied by the spec.
Add/update tests as required by the spec.
After changes, run: npm run validate.
If npm run validate fails, fix and retry (max 3 attempts). If still failing, STOP and summarize why in $BLOCKED_FILE.
EOF
  )

  log "--- Aider start (timeout: ${TASK_TIMEOUT_MIN}m) ---"
  set +e
  timeout "${TASK_TIMEOUT_MIN}m" aider --message "$AIDER_PROMPT" 2>&1 | tee -a "$LOG_FILE"
  AIDER_EXIT=${PIPESTATUS[0]}
  set -e

  # timeout returns 124 when the child is killed
  if [[ "$AIDER_EXIT" -eq 124 ]]; then
    log "--- Aider TIMED OUT after ${TASK_TIMEOUT_MIN}m ---"
    heartbeat "$SPEC" "timeout"
    TIMEOUT_COUNT=$((TIMEOUT_COUNT + 1))

    {
      echo ""
      echo "## Timed out: $SPEC"
      echo "- Branch: \`$BRANCH\`"
      echo "- Run: \`$RUN_ID\`"
      echo "- Reason: Aider exceeded ${TASK_TIMEOUT_MIN}m timeout"
    } >> "$BLOCKED_FILE"

    # Push WIP for the timed-out task
    set +e
    git add -A
    git commit -m "chore: wip ${SPEC_BASE} (timed out)" 2>&1 | tee -a "$LOG_FILE"
    git push -u origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE"
    set -e

    log "WIP pushed for timed-out task: $BRANCH"
    git checkout main 2>&1 | tee -a "$LOG_FILE"
    continue
  fi

  log "--- Aider end (exit=$AIDER_EXIT) ---"

  # Validate after aider
  log "Running npm run validate..."
  set +e
  npm run validate 2>&1 | tee -a "$LOG_FILE"
  VALID_EXIT=${PIPESTATUS[0]}
  set -e

  if [[ "$VALID_EXIT" -eq 0 ]]; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    log "VALIDATE: PASS"
    heartbeat "$SPEC" "success"

    # Push branch
    git push -u origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE"

    # Optionally open PR
    if [[ "$OPEN_PR" == true ]]; then
      PR_TITLE="feat: ${SPEC_BASE}"
      PR_BODY=$(
        cat <<EOF
Implements \`$SPEC\`.

- Run ID: $RUN_ID
- Validation: npm run validate passed
EOF
      )
      set +e
      gh pr create --title "$PR_TITLE" --body "$PR_BODY" --base main --head "$BRANCH" 2>&1 | tee -a "$LOG_FILE"
      set -e
    fi

  else
    FAIL_COUNT=$((FAIL_COUNT + 1))
    log "VALIDATE: FAIL"
    heartbeat "$SPEC" "blocked"

    {
      echo ""
      echo "## Blocked: $SPEC"
      echo "- Branch: \`$BRANCH\`"
      echo "- Run: \`$RUN_ID\`"
      echo "- Reason: npm run validate failed (see log: $LOG_FILE)"
    } >> "$BLOCKED_FILE"

    # Commit WIP so the branch has the failing state captured
    set +e
    git add -A
    git commit -m "chore: wip ${SPEC_BASE} (blocked)" 2>&1 | tee -a "$LOG_FILE"
    git push -u origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE"
    set -e

    log "WIP pushed for blocked task: $BRANCH"
  fi

  # Always return to main so next task starts clean
  git checkout main 2>&1 | tee -a "$LOG_FILE"

done < "$QUEUE_FILE"

log ""
log "=== auto-sprint finished: $RUN_ID ==="
log "Tasks: $TASK_COUNT | Success: $SUCCESS_COUNT | Failed: $FAIL_COUNT | Timed out: $TIMEOUT_COUNT | Skipped: $SKIP_COUNT"
log "Log: $LOG_FILE"
if [[ -f "$BLOCKED_FILE" ]]; then
  log "Blocked notes: $BLOCKED_FILE"
fi
heartbeat "sprint" "finished"
