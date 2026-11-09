import test from 'node:test';
import assert from 'node:assert/strict';
import { boostFlow, chargeOpacity, turboSpin } from './turbo.ts';
const near = (a: number, b: number, tolerance = 1e-9) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
const turn = (value: number) => ((value % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

test('turbo rotor and boost particles stay continuous across the 720° wrap', () => {
  near(turn(turboSpin(720)), turn(turboSpin(0)), 1e-9);
  for (let i = 0; i < 18; i++) {
    near(boostFlow(720, i, 18), boostFlow(0, i, 18));
    for (let angle = 0; angle <= 720; angle += 7.5) {
      const t = boostFlow(angle, i, 18);
      assert.ok(t >= 0 && t < 1);
    }
  }
  assert.ok(turboSpin(90) > turboSpin(45), 'rotor turns with the crank');
  assert.equal(turboSpin(NaN), 0);
});

test('turbo charge reads denser until the exhaust stroke only', () => {
  for (const phase of ['intake', 'compression', 'power'] as const) assert.ok(chargeOpacity(phase, true) > chargeOpacity(phase, false));
  assert.equal(chargeOpacity('exhaust', true), chargeOpacity('exhaust', false));
  for (const phase of ['intake', 'compression', 'power', 'exhaust'] as const) assert.ok(chargeOpacity(phase, true) <= 1);
});
