/**
 * Flow ribbon — a smooth light trail that orbits and converges toward center.
 * Inspired by Apple's fluid event animations.
 */
export interface Flow {
  /** Trail history — ring buffer of recent positions */
  trail: Array<{ x: number; y: number }>;
  /** Current orbital angle (radians) */
  angle: number;
  /** Angular velocity (radians per frame) */
  speed: number;
  /** Phase offset for variety */
  phase: number;
  /** Orbital radius multiplier */
  radiusX: number;
  radiusY: number;
  /** Whether this flow uses the accent color */
  isAccent: boolean;
  /** Trail max length */
  maxTrail: number;
}

/**
 * Create a set of flowing light ribbons with varied orbital parameters.
 */
export function createFlows(isMobile: boolean): Flow[] {
  const count = isMobile ? 4 : 5;
  const flows: Flow[] = [];

  for (let i = 0; i < count; i++) {
    const t = i / count;
    flows.push({
      trail: [],
      angle: t * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.008,
      phase: t * Math.PI * 2,
      radiusX: 0.25 + Math.random() * 0.15,
      radiusY: 0.15 + Math.random() * 0.1,
      isAccent: i === count - 1, // last one is accent color
      maxTrail: isMobile ? 40 : 60,
    });
  }

  return flows;
}

/**
 * Update flow positions for the current frame.
 * `converge` (0–1) controls how tightly the ribbons orbit center.
 */
export function updateFlows(
  flows: Flow[],
  canvasWidth: number,
  canvasHeight: number,
  converge: number,
  elapsed: number,
) {
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  for (const flow of flows) {
    flow.angle += flow.speed;

    // Radius shrinks as converge increases (ribbons tighten toward center)
    const radiusFactor = 1 - converge * 0.85;
    const rx = canvasWidth * flow.radiusX * radiusFactor;
    const ry = canvasHeight * flow.radiusY * radiusFactor;

    // Gentle figure-8 / lissajous motion for organic feel
    const freqX = 1 + Math.sin(flow.phase) * 0.3;
    const freqY = 1 + Math.cos(flow.phase * 0.7) * 0.2;

    const x = cx + Math.cos(flow.angle * freqX + flow.phase) * rx;
    const y =
      cy +
      Math.sin(flow.angle * freqY + flow.phase * 1.3) * ry +
      Math.sin(elapsed * 0.5 + flow.phase) * 15 * radiusFactor;

    flow.trail.push({ x, y });
    if (flow.trail.length > flow.maxTrail) {
      flow.trail.shift();
    }
  }
}
