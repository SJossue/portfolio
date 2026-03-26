import type { Flow } from './particles';

/**
 * Draw a smooth flowing ribbon from a trail of points.
 * Opacity tapers from bright (head) to invisible (tail).
 */
function drawRibbon(
  ctx: CanvasRenderingContext2D,
  trail: Array<{ x: number; y: number }>,
  color: [number, number, number],
  baseAlpha: number,
) {
  const len = trail.length;
  if (len < 3) return;

  // Draw as a series of line segments with tapering opacity and width
  for (let i = 1; i < len; i++) {
    const t = i / len; // 0 (tail) → 1 (head)
    const alpha = t * t * baseAlpha; // quadratic fade — soft tail, bright head
    const width = 1 + t * 2.5; // tapers from thin tail to thicker head

    if (alpha < 0.005) continue;

    ctx.beginPath();
    ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
    ctx.lineTo(trail[i].x, trail[i].y);
    ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

/**
 * Draw a subtle glow dot at the head of each ribbon.
 */
function drawHead(
  ctx: CanvasRenderingContext2D,
  trail: Array<{ x: number; y: number }>,
  color: [number, number, number],
  alpha: number,
) {
  if (trail.length === 0 || alpha < 0.01) return;

  const head = trail[trail.length - 1];
  const gradient = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 8);
  gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 0.5})`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(head.x - 8, head.y - 8, 16, 16);
}

/**
 * Render the "JOSSUE" text — fades in as textAlpha increases.
 */
function drawText(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  textAlpha: number,
  canvasWidth: number,
) {
  if (textAlpha <= 0) return;

  const fontSize = Math.min(canvasWidth * 0.14, 220);
  ctx.font = `800 ${fontSize}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Subtle glow behind text
  if (textAlpha > 0.1) {
    const glowRadius = fontSize * 2;
    const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
    glow.addColorStop(0, `rgba(0, 240, 255, ${0.04 * textAlpha})`);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(centerX - glowRadius, centerY - glowRadius, glowRadius * 2, glowRadius * 2);
  }

  // White text with slight cyan tint
  ctx.fillStyle = `rgba(230, 245, 255, ${textAlpha})`;
  ctx.fillText('JOSSUE', centerX, centerY);
}

const CYAN: [number, number, number] = [0, 240, 255];
const ACCENT: [number, number, number] = [180, 120, 255]; // soft purple instead of harsh magenta

/**
 * Main render — clean and minimal. Just flowing ribbons + text.
 */
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  flows: Flow[],
  textAlpha: number,
  ribbonAlpha: number,
  dpr: number,
) {
  const w = ctx.canvas.width / dpr;
  const h = ctx.canvas.height / dpr;

  ctx.save();
  ctx.scale(dpr, dpr);

  // Pure black
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  // Flowing ribbons
  for (const flow of flows) {
    const color = flow.isAccent ? ACCENT : CYAN;
    drawRibbon(ctx, flow.trail, color, ribbonAlpha);
    drawHead(ctx, flow.trail, color, ribbonAlpha);
  }

  // Text
  drawText(ctx, w / 2, h / 2, textAlpha, w);

  ctx.restore();
}
