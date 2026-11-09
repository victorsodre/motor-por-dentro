import { clampAngle, rad } from './engine.ts';
import type { EngineState } from './engine.ts';

/**
 * Illustrative turbo: turbine and compressor share one shaft (Garrett).
 * The spin ratio is didactic, not a real turbo speed. An integer ratio keeps
 * the rotor continuous when the 720° cycle wraps back to 0°.
 */
export const TURBO_SPIN_RATIO = 3;
/** Full trips of the boost-duct particles per 720° cycle; integer for a seamless wrap. */
export const BOOST_TRIPS_PER_CYCLE = 4;

export const turboSpin = (angle: number) => rad(clampAngle(angle)) * TURBO_SPIN_RATIO;

/** Position (0–1) of particle `index` along the compressor → intake duct. */
export function boostFlow(angle: number, index: number, count: number) {
  const value = clampAngle(angle) / 720 * BOOST_TRIPS_PER_CYCLE + index / Math.max(1, count);
  return value - Math.floor(value);
}

/** Opacity of the cylinder charge: compressed air is denser, so the turbo charge reads stronger until the exhaust stroke. */
export function chargeOpacity(phase: EngineState['phase'], turbo: boolean) {
  const base = phase === 'power' ? .28 : phase === 'compression' ? .22 : .15;
  return turbo && phase !== 'exhaust' ? base + .1 : base;
}
