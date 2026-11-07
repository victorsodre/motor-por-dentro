import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleEngine, advanceAngle, camPoint, CRANK_RADIUS, ROD_LENGTH, CAM_RADIUS, valveLift } from './engine.ts';
const near = (a: number, b: number, tolerance = 1e-7) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);

test('one cycle contains four strokes and two crankshaft revolutions', () => {
  assert.deepEqual([90,270,450,630].map(a => sampleEngine(a).phase), ['intake','compression','power','exhaust']);
  near(sampleEngine(0).pistonY, ROD_LENGTH + CRANK_RADIUS);
  near(sampleEngine(180).pistonY, ROD_LENGTH - CRANK_RADIUS);
  near(sampleEngine(360).pistonY, sampleEngine(0).pistonY);
  near(sampleEngine(720).pistonY, sampleEngine(0).pistonY);
  near(sampleEngine(720).camAngle, Math.PI * 2);
});
test('piston pin and crank pin stay connected by one rigid rod', () => {
  for(let angle=0;angle<=720;angle+=.5){
    const s=sampleEngine(angle);
    near(Math.hypot(s.crankX,s.crankY),CRANK_RADIUS);
    near(Math.hypot(s.crankX,s.pistonY-s.crankY),ROD_LENGTH);
    near(s.crankX-Math.sin(s.rodAngle)*ROD_LENGTH,0);
    near(s.crankY+Math.cos(s.rodAngle)*ROD_LENGTH,s.pistonY);
  }
});
test('ideal valve sequence has no overlap or opening during compression/power', () => {
  for(let a=0;a<=720;a++){
    const s=sampleEngine(a);
    assert.ok(!(s.intakeLift>1e-8 && s.exhaustLift>1e-8));
    if(a>=180 && a<=540){near(s.intakeLift,0);near(s.exhaustLift,0);}
  }
  assert.ok(sampleEngine(90).intakeLift>0);
  assert.ok(sampleEngine(630).exhaustLift>0);
  assert.ok(sampleEngine(360).spark>0);
  assert.equal(sampleEngine(0).spark,0);
});
test('authored cam profile stays in contact with its flat follower', () => {
  for(const port of ['intake','exhaust'] as const){
    const points=Array.from({length:1440},(_,i)=>camPoint(i/1440*Math.PI*2,port));
    for(let angle=0;angle<=720;angle+=10){
      const phi=angle*Math.PI/360;
      const bottom=Math.min(...points.map(p=>p.x*Math.sin(phi)+p.y*Math.cos(phi)));
      near(bottom,-CAM_RADIUS-valveLift(angle,port),.00003);
    }
  }
});
test('rewinding and exploded UI do not accumulate engine transforms', () => {
  const first=sampleEngine(227);sampleEngine(720);sampleEngine(1);
  assert.deepEqual(sampleEngine(227),first);
  assert.equal(sampleEngine(NaN).angle,0);assert.equal(sampleEngine(-30).angle,0);assert.equal(sampleEngine(800).angle,720);
});
test('clock is bounded, pauses and wraps without losing overshoot', () => {
  assert.equal(advanceAngle(90,.1,1,false,true),90);
  assert.equal(advanceAngle(90,.1,1,true,false),90);
  near(advanceAngle(719,.1,1,true,true),3.5);
  near(advanceAngle(0,100,1,true,true),4.5);
  assert.equal(advanceAngle(90,NaN,1,true,true),90);
});
