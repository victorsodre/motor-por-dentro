export const CRANK_RADIUS = .8;
export const ROD_LENGTH = 2.7;
export const CAM_RADIUS = .65;
export const VALVE_LIFT = .08;
export type Port = 'intake' | 'exhaust';
export const rad = (degrees: number) => degrees * Math.PI / 180;
export const clampAngle = (angle: number) => Number.isFinite(angle) ? Math.max(0, Math.min(720, angle)) : 0;

export function valveLift(angle: number, port: Port) {
  const a = clampAngle(angle), start = port === 'intake' ? 0 : 540;
  if (a <= start || a >= start + 180) return 0;
  return VALVE_LIFT * Math.sin(rad(a - start)) ** 2;
}
/** Envelope of a cam against a flat follower: lowest point is -R-lift(phi). */
export function camPoint(phi: number, port: Port) {
  const angle = phi * 360 / Math.PI, h = valveLift(angle, port);
  const start = port === 'intake' ? 0 : 540;
  const derivative = angle > start && angle < start + 180 ? 2 * VALVE_LIFT * Math.sin(2 * rad(angle - start)) : 0;
  const x = -derivative, y = -CAM_RADIUS - h;
  return { x: x * Math.cos(phi) + y * Math.sin(phi), y: -x * Math.sin(phi) + y * Math.cos(phi) };
}
export function sampleEngine(value: number) {
  const angle = clampAngle(value), theta = rad(angle);
  const crankX = -CRANK_RADIUS * Math.sin(theta), crankY = CRANK_RADIUS * Math.cos(theta);
  const pistonY = crankY + Math.sqrt(ROD_LENGTH ** 2 - crankX ** 2);
  const phase = angle < 180 ? 'intake' : angle < 360 ? 'compression' : angle < 540 ? 'power' : 'exhaust';
  return {angle, theta, camAngle: theta / 2, crankX, crankY, pistonY,
    rodAngle: Math.atan2(crankX, pistonY - crankY),
    phase, intakeLift: valveLift(angle,'intake'), exhaustLift: valveLift(angle,'exhaust'),
    spark: angle >= 360 && angle < 378 ? 1 - (angle - 360) / 18 : 0,
    travel: (ROD_LENGTH + CRANK_RADIUS - pistonY) / (2 * CRANK_RADIUS),
    gasHeight: 4.35 - (pistonY + .55),
  } as const;
}
export type EngineState = ReturnType<typeof sampleEngine>;
export function advanceAngle(angle: number, seconds: number, speed: number, playing: boolean, visible: boolean) {
  if (!playing || !visible) return clampAngle(angle);
  const dt = Number.isFinite(seconds) ? Math.max(0,Math.min(.1, seconds)) : 0;
  const rate = Number.isFinite(speed) ? Math.max(.25,Math.min(2,speed)) : 1;
  return (clampAngle(angle) + dt * 45 * rate) % 720;
}
