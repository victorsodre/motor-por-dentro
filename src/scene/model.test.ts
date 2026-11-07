import test from 'node:test';
import assert from 'node:assert/strict';
import {Vector3} from 'three';
import {createModel} from './model.ts';
import {applyEngine} from './rig.ts';
import {sampleEngine,ROD_LENGTH} from '../simulation/engine.ts';

test('model maintains crank–rod–piston joints, clearance and reset',()=>{
 const m=createModel();assert.equal(new Set(m.parts.map(p=>p.id)).size,8);
 for(let angle=0;angle<=720;angle+=5){
  const s=sampleEngine(angle);applyEngine(m,s,true,0);m.root.updateMatrixWorld(true);
  const small=m.rod.localToWorld(new Vector3(0,ROD_LENGTH,0));
  const pin=m.piston.localToWorld(new Vector3());
  assert.ok(small.distanceTo(pin)<1e-7);
  const crank=m.crank.localToWorld(new Vector3(0,.8,0));
  assert.ok(crank.distanceTo(m.rod.getWorldPosition(new Vector3()))<1e-7);
  assert.ok(s.gasHeight>.29);
  assert.ok(4.29-Math.max(s.intakeLift,s.exhaustLift)>s.pistonY+.55);
 }
 const pose=sampleEngine(227);applyEngine(m,pose,true,0);
 const initial=m.parts.map(p=>p.group.position.toArray());
 applyEngine(m,pose,true,1);applyEngine(m,pose,true,0);
 assert.deepEqual(m.parts.map(p=>p.group.position.toArray()),initial);
 m.root.traverse(o=>assert.ok([...o.position.toArray(),...o.scale.toArray(),...o.quaternion.toArray()].every(Number.isFinite)));
 m.dispose();
});
