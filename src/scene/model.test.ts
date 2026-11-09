import test from 'node:test';
import assert from 'node:assert/strict';
import {Box3,Vector3} from 'three';
import {TURBO_BOUNDS} from './turbo.ts';
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

test('turbo connects exhaust to turbine and compressor to intake, and shows only when assembled',()=>{
 const m=createModel();
 const intakeEnd=m.ports.intake.curve.getPoint(1),exhaustEnd=m.ports.exhaust.curve.getPoint(1);
 assert.ok(m.turbo.duct.getPointAt(1).distanceTo(intakeEnd)<1e-9,'duct ends at the intake pipe');
 assert.ok(m.turbo.duct.getPointAt(0).y<m.turbo.duct.getPointAt(.5).y,'duct rises over the head');
 const pose=sampleEngine(450);
 applyEngine(m,pose,true,0,true);assert.ok(m.turbo.group.visible);
 for(const dot of m.turbo.dots)assert.ok([...dot.position.toArray()].every(Number.isFinite));
 for(const angle of [0,90,360,630]){
  applyEngine(m,sampleEngine(angle),true,0,true);
  const assembled=new Box3().setFromObject(m.turbo.group);for(const part of m.parts)assembled.expandByObject(part.group);
  assert.ok(TURBO_BOUNDS.containsBox(assembled),`turbo framing misses ${JSON.stringify(assembled)}`);
 }
 applyEngine(m,pose,true,1,true);assert.equal(m.turbo.group.visible,false);
 applyEngine(m,pose,true,0,false);assert.equal(m.turbo.group.visible,false);
 assert.ok(exhaustEnd.x>0&&intakeEnd.x<0);
 m.dispose();
});
test('spark is lit in the cut view and dark when the chamber is closed',()=>{
 const m=createModel(),spark=sampleEngine(360);
 applyEngine(m,spark,true,0);assert.ok(m.flash.visible&&m.sparkLight.intensity>0);
 applyEngine(m,spark,false,0);assert.equal(m.sparkLight.intensity,0);
 applyEngine(m,sampleEngine(300),true,0);assert.equal(m.flash.visible,false);assert.equal(m.sparkLight.intensity,0);
 m.dispose();
});
