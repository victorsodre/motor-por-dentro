import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3, PerspectiveCamera, Vector3 } from 'three';
import { aspectRescale, fit, framing } from './camera.ts';
import { TURBO_BOUNDS } from './turbo.ts';

test('landscape and portrait frame the motor and separated groups, including a vertical view', () => {
  const limits = [new Box3(new Vector3(-2.5,-1.4,-1.8),new Vector3(2.5,6.8,1.5)),new Box3(new Vector3(-5,-2.5,-3),new Vector3(5,9,3)),TURBO_BOUNDS];
  for(const bounds of limits) for(const aspect of [1920/830,1080/1570]) for(const direction of [new Vector3(7,3.5,13),new Vector3(0,1,0)]) {
    const camera=new PerspectiveCamera(38,aspect,.01,200);
    fit(camera,bounds,direction);camera.updateMatrixWorld();
    for(const x of [bounds.min.x,bounds.max.x]) for(const y of [bounds.min.y,bounds.max.y]) for(const z of [bounds.min.z,bounds.max.z]) {
      const p=new Vector3(x,y,z).project(camera);
      assert.ok(Math.abs(p.x)<1 && Math.abs(p.y)<1 && p.z>-1 && p.z<1);
    }
  }
});

test('an aspect change keeps the user direction and only rescales the distance', () => {
  const bounds = TURBO_BOUNDS, target = bounds.getCenter(new Vector3());
  for (const direction of [new Vector3(7,3.5,13), new Vector3(-4,9,2), new Vector3(0,1,0)]) for (const [from, to] of [[1920/830, 390/480], [390/480, 1920/1080]]) {
    const before = framing(bounds, from!, direction).position, factor = aspectRescale(bounds, direction, from!, to!);
    const after = before.clone().sub(target).multiplyScalar(factor).add(target);
    const expected = framing(bounds, to!, direction).position;
    assert.ok(after.distanceTo(expected) < 1e-9);
    assert.ok(after.clone().sub(target).normalize().distanceTo(before.clone().sub(target).normalize()) < 1e-12);
  }
  assert.equal(aspectRescale(bounds, new Vector3(1,1,1), 1.5, 1.5), 1);
});
