#!/usr/bin/env bash
set -euo pipefail
export BROWSER=/bin/true

# aider-sprint.sh — runs aider tasks with whole-file edit format
# Usage: ./scripts/aider-sprint.sh

QUEUE_FILE="specs/QUEUE.txt"
LOG_DIR="docs/worklog"
mkdir -p "$LOG_DIR"
RUN_ID="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$LOG_DIR/aider-sprint-$RUN_ID.log"

log() { echo "$@" | tee -a "$LOG_FILE"; }

log "=== aider-sprint started: $RUN_ID ==="

# Preflight
if [[ -n "$(git status --porcelain)" ]]; then
  log "ERROR: Working tree dirty. Commit or stash first."
  exit 1
fi

log "Preflight: testing LLM connectivity..."
PREFLIGHT_OUT="$(aider --no-git --yes --no-stream --no-show-model-warnings --message "Say 'ok' and nothing else." 2>&1)"
if ! echo "$PREFLIGHT_OUT" | grep -qi "ok"; then
  log "ERROR: LLM not responding. Check LM Studio."
  exit 1
fi
log "LLM reachable."

# Baseline
git checkout main 2>&1 | tee -a "$LOG_FILE"
git pull --rebase 2>&1 | tee -a "$LOG_FILE"

TASK_COUNT=0
SUCCESS_COUNT=0
FAIL_COUNT=0

while IFS= read -r SPEC || [[ -n "$SPEC" ]]; do
  SPEC="$(echo "$SPEC" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
  [[ -z "$SPEC" ]] && continue
  [[ "$SPEC" =~ ^# ]] && continue

  TASK_COUNT=$((TASK_COUNT + 1))

  if [[ ! -f "$SPEC" ]]; then
    log "SKIP: $SPEC (file not found)"
    continue
  fi

  SPEC_BASE="$(basename "$SPEC" .md)"
  BRANCH="auto/${SPEC_BASE}-${RUN_ID}"

  log ""
  log "=== TASK $TASK_COUNT: $SPEC ==="

  git checkout main 2>&1 | tee -a "$LOG_FILE"
  git pull --rebase 2>&1 | tee -a "$LOG_FILE"
  git checkout -b "$BRANCH" 2>&1 | tee -a "$LOG_FILE"

  # Extract file list from spec (lines matching src/ paths)
  FILE_LIST=$(grep -oP 'src/[a-zA-Z0-9_./-]+\.(ts|tsx)' "$SPEC" | sort -u | tr '\n' ' ')
  log "Target files: $FILE_LIST"

  AIDER_PROMPT=$(cat <<EOF
Read $SPEC carefully.

Implement ALL the changes described in the spec. The spec contains exact code to use.
Only modify the files listed in the spec. Do not modify any other files.
After making changes, ensure the code compiles with no TypeScript errors.
EOF
  )

  log "--- Aider start (whole format) ---"
  set +e
  timeout 15m aider \
    --yes \
    --no-stream \
    --no-show-model-warnings \
    --auto-commits \
    --edit-format whole \
    --message "$AIDER_PROMPT" \
    $FILE_LIST \
    2>&1 | tee -a "$LOG_FILE"
  AIDER_EXIT=${PIPESTATUS[0]}
  set -e
  log "--- Aider end (exit=$AIDER_EXIT) ---"

  # Salvage uncommitted changes
  if [[ -n "$(git status --porcelain)" ]]; then
    log "Salvaging uncommitted changes..."
    git add -A
    git commit -m "feat: ${SPEC_BASE}" 2>&1 | tee -a "$LOG_FILE"
  fi

  # Check if any changes were made
  if git diff --quiet main...HEAD; then
    FAIL_COUNT=$((FAIL_COUNT + 1))
    log "FAIL: No changes produced for $SPEC"
    git checkout main 2>&1 | tee -a "$LOG_FILE"
    git branch -D "$BRANCH" 2>/dev/null
    continue
  fi

  # Validate
  log "Validating..."
  set +e
  npm run lint 2>&1 | tee -a "$LOG_FILE"
  LINT_EXIT=${PIPESTATUS[0]}
  npm run typecheck 2>&1 | tee -a "$LOG_FILE"
  TC_EXIT=${PIPESTATUS[0]}
  npm run test 2>&1 | tee -a "$LOG_FILE"
  TEST_EXIT=${PIPESTATUS[0]}
  npm run build 2>&1 | tee -a "$LOG_FILE"
  BUILD_EXIT=${PIPESTATUS[0]}
  set -e

  if [[ "$LINT_EXIT" -eq 0 && "$TC_EXIT" -eq 0 && "$TEST_EXIT" -eq 0 && "$BUILD_EXIT" -eq 0 ]]; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    log "VALIDATE: PASS"

    git push -u origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE"
    gh pr create --draft \
      --title "feat: ${SPEC_BASE}" \
      --body "Implements \`$SPEC\`. Run: $RUN_ID. Validation passed." \
      --base main --head "$BRANCH" 2>&1 | tee -a "$LOG_FILE" || true

  else
    FAIL_COUNT=$((FAIL_COUNT + 1))
    log "VALIDATE: FAIL (lint=$LINT_EXIT tc=$TC_EXIT test=$TEST_EXIT build=$BUILD_EXIT)"

    # Try to fix with aider
    log "Attempting auto-fix..."
    set +e
    timeout 10m aider \
      --yes \
      --no-stream \
      --no-show-model-warnings \
      --auto-commits \
      --edit-format whole \
      --message "Run npm run lint && npm run typecheck. Fix any errors. Do not change functionality." \
      $FILE_LIST \
      2>&1 | tee -a "$LOG_FILE"
    set -e

    if [[ -n "$(git status --porcelain)" ]]; then
      git add -A
      git commit -m "fix: lint/type fixes for ${SPEC_BASE}" 2>&1 | tee -a "$LOG_FILE"
    fi

    set +e
    npm run lint 2>&1 | tee -a "$LOG_FILE"
    LINT2=${PIPESTATUS[0]}
    npm run typecheck 2>&1 | tee -a "$LOG_FILE"
    TC2=${PIPESTATUS[0]}
    npm run test 2>&1 | tee -a "$LOG_FILE"
    TEST2=${PIPESTATUS[0]}
    npm run build 2>&1 | tee -a "$LOG_FILE"
    BUILD2=${PIPESTATUS[0]}
    set -e

    if [[ "$LINT2" -eq 0 && "$TC2" -eq 0 && "$TEST2" -eq 0 && "$BUILD2" -eq 0 ]]; then
      SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
      FAIL_COUNT=$((FAIL_COUNT - 1))
      log "VALIDATE (retry): PASS"
      git push -u origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE"
      gh pr create --draft \
        --title "feat: ${SPEC_BASE}" \
        --body "Implements \`$SPEC\`. Run: $RUN_ID. Validation passed (after auto-fix)." \
        --base main --head "$BRANCH" 2>&1 | tee -a "$LOG_FILE" || true
    else
      log "VALIDATE (retry): STILL FAILING — pushing WIP"
      git push -u origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE" || true
    fi
  fi

  git checkout main 2>&1 | tee -a "$LOG_FILE"

done < "$QUEUE_FILE"

log ""
log "=== aider-sprint finished: $RUN_ID ==="
log "Tasks: $TASK_COUNT | Success: $SUCCESS_COUNT | Failed: $FAIL_COUNT"
