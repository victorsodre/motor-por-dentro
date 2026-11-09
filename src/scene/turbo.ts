import * as T from 'three';
import { box, mesh, mergeStatic } from './geometry.ts';

/** Shaft axis of the illustrative turbo, beside the exhaust side of the head. */
export const TURBO_AXIS = new T.Vector3(2.75, 5.35, 0);
const WHEEL_Z = .48, HOUSING_RADIUS = .42, DUCT_TOP = 7.1, DUCT_LEFT = -2.7;
/** Framing limits of the engine with the turbo and its duct. */
export const TURBO_BOUNDS = new T.Box3(new T.Vector3(-3, -1.4, -1.8), new T.Vector3(3.3, 7.4, 1.6));

/** Straight segments joined by quarter-round corners, so the tube reads as one bent duct. */
export function roundedDuct(points: T.Vector3[], radius: number) {
  const path = new T.CurvePath<T.Vector3>();
  let start = points[0]!.clone();
  for (let i = 1; i < points.length - 1; i++) {
    const corner = points[i]!, before = corner.clone().sub(points[i - 1]!).normalize(), after = points[i + 1]!.clone().sub(corner).normalize();
    const entry = corner.clone().addScaledVector(before, -radius), exit = corner.clone().addScaledVector(after, radius);
    path.add(new T.LineCurve3(start, entry));path.add(new T.QuadraticBezierCurve3(entry, corner.clone(), exit));start = exit;
  }
  path.add(new T.LineCurve3(start, points[points.length - 1]!.clone()));
  return path;
}

const transparent = (color: string, opacity: number) =>
  new T.MeshStandardMaterial({ color, metalness: .35, roughness: .4, transparent: true, opacity, depthWrite: false, side: T.DoubleSide });

function wheel(parent: T.Object3D, z: number, blades: number, material: T.Material, tilt: number) {
  const hub = mesh(parent, new T.CylinderGeometry(.1, .14, .22, 24), material, 0, 0, z);hub.rotation.x = Math.PI / 2;
  for (let i = 0; i < blades; i++) {
    const a = i / blades * Math.PI * 2, blade = box(parent, [.035, .26, .2], [Math.sin(a) * .22, Math.cos(a) * .22, z], material);
    blade.rotation.set(0, tilt, -a, 'ZYX');
  }
}

/**
 * Turbine on the exhaust and compressor on the intake, on the same shaft.
 * `intakeEnd` and `exhaustEnd` are the open ends of the engine's pipes.
 */
export function createTurbo(parent: T.Object3D, intakeEnd: T.Vector3, exhaustEnd: T.Vector3, metal: {steel: T.Material; silver: T.Material; dark: T.Material}) {
  const group = new T.Group();group.name = 'turbo';parent.add(group);
  const housings = new T.Group();group.add(housings);
  const exhaustMat = transparent('#ce7946', .4), airMat = transparent('#6caec5', .4);
  const { x, y } = TURBO_AXIS;
  const tubeZ = (from: number, to: number, radius: number, material: T.Material) => {
    const item = mesh(housings, new T.CylinderGeometry(radius, radius, Math.abs(to - from), 24, 1, true), material, x, y, (from + to) / 2);
    item.rotation.x = Math.PI / 2;item.castShadow = false;return item;
  };
  for (const [z, material] of [[-WHEEL_Z, exhaustMat], [WHEEL_Z, airMat]] as const) {
    const housing = mesh(housings, new T.CylinderGeometry(HOUSING_RADIUS, HOUSING_RADIUS, .3, 40), material, x, y, z);housing.rotation.x = Math.PI / 2;housing.castShadow = false;
  }
  tubeZ(-WHEEL_Z - .15, -1.35, .16, exhaustMat);
  tubeZ(WHEEL_Z + .15, 1.3, .16, airMat);
  const bearing = mesh(housings, new T.CylinderGeometry(.17, .17, 2 * WHEEL_Z - .3, 24), metal.dark, x, y, 0);bearing.rotation.x = Math.PI / 2;
  // Exhaust enters the turbine housing tangentially at its lower rim.
  const feed = new T.CubicBezierCurve3(exhaustEnd.clone(), exhaustEnd.clone().add(new T.Vector3(.3, 0, 0)), new T.Vector3(x - .25, y - HOUSING_RADIUS + .24, exhaustEnd.z), new T.Vector3(x + .05, y - HOUSING_RADIUS + .24, exhaustEnd.z));
  mesh(housings, new T.TubeGeometry(feed, 24, .24, 16, false), exhaustMat).castShadow = false;
  // Compressed air leaves the compressor rim, goes over the head and reaches the intake pipe.
  const duct = roundedDuct([
    new T.Vector3(x + HOUSING_RADIUS - .2, y, WHEEL_Z), new T.Vector3(x + HOUSING_RADIUS - .2, DUCT_TOP, WHEEL_Z),
    new T.Vector3(DUCT_LEFT, DUCT_TOP, WHEEL_Z), new T.Vector3(DUCT_LEFT, intakeEnd.y, WHEEL_Z), intakeEnd.clone(),
  ], .4);
  mesh(housings, new T.TubeGeometry(duct, 160, .2, 16, false), airMat).castShadow = false;
  for (const [point, normal] of [[new T.Vector3(x, y, -1.35), new T.Vector3(0, 0, 1)], [new T.Vector3(x, y, 1.3), new T.Vector3(0, 0, 1)]] as const) {
    const flange = mesh(housings, new T.TorusGeometry(.16, .03, 8, 24), metal.silver);flange.position.copy(point);flange.quaternion.setFromUnitVectors(new T.Vector3(0, 0, 1), normal);
  }
  mergeStatic(housings);
  const rotor = new T.Group();rotor.position.copy(TURBO_AXIS);group.add(rotor);
  const shaft = mesh(rotor, new T.CylinderGeometry(.05, .05, 2 * WHEEL_Z + .2, 12), metal.silver);shaft.rotation.x = Math.PI / 2;
  wheel(rotor, -WHEEL_Z, 9, metal.steel, .35);
  wheel(rotor, WHEEL_Z, 7, metal.silver, -.35);
  mergeStatic(rotor);
  const dots = Array.from({ length: 18 }, () => {
    const dot = mesh(group, new T.SphereGeometry(.045, 8, 6), new T.MeshBasicMaterial({ color: '#d7eef7' }));dot.castShadow = false;dot.receiveShadow = false;return dot;
  });
  return { group, rotor, duct, dots };
}
export type TurboModel = ReturnType<typeof createTurbo>;
