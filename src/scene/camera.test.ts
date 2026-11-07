import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3, PerspectiveCamera, Vector3 } from 'three';
import { fit } from './camera.ts';

test('landscape and portrait frame the motor and separated groups, including a vertical view', () => {
  const limits = [new Box3(new Vector3(-2.5,-1.4,-1.8),new Vector3(2.5,6.8,1.5)),new Box3(new Vector3(-5,-2.5,-3),new Vector3(5,9,3))];
  for(const bounds of limits) for(const aspect of [1920/830,1080/1570]) for(const direction of [new Vector3(7,3.5,13),new Vector3(0,1,0)]) {
    const camera=new PerspectiveCamera(38,aspect,.01,200);
    fit(camera,bounds,direction);camera.updateMatrixWorld();
    for(const x of [bounds.min.x,bounds.max.x]) for(const y of [bounds.min.y,bounds.max.y]) for(const z of [bounds.min.z,bounds.max.z]) {
      const p=new Vector3(x,y,z).project(camera);
      assert.ok(Math.abs(p.x)<1 && Math.abs(p.y)<1 && p.z>-1 && p.z<1);
    }
  }
});
