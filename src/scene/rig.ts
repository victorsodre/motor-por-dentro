import * as T from 'three';
import type {EngineState,Port} from '../simulation/engine.ts';
import type {EngineModel} from './model.ts';
const matrix=new T.Matrix4(),quaternion=new T.Quaternion(),scale=new T.Vector3(1,1,1);
export function applyEngine(model:EngineModel,state:EngineState,cut:boolean,explode:number){
 const amount=Math.min(1,Math.max(0,explode));
 for(const part of model.parts){part.group.position.set(part.offset[0],part.offset[1],part.offset[2]).multiplyScalar(amount);part.group.rotation.set(0,0,0);}
 model.piston.position.y+=state.pistonY;
 model.rod.position.x+=state.crankX;model.rod.position.y+=state.crankY;model.rod.rotation.z=state.rodAngle;
 model.crank.rotation.z=state.theta;model.cam.rotation.z=state.camAngle;model.lower.rotation.z=state.theta;
 for(const port of ['intake','exhaust'] as Port[]){
  const lift=port==='intake'?state.intakeLift:state.exhaustLift;
  model.ports[port].valve.position.y=-lift;model.ports[port].spring.scale.y=.48-lift;
 }
 for(let i=0;i<model.chain.count;i++){
  const p=model.path.point(i/model.chain.count+state.theta*.32/model.path.length);
  quaternion.setFromAxisAngle(new T.Vector3(0,0,1),p.rotation);matrix.compose(p.position,quaternion,scale);model.chain.setMatrixAt(i,matrix);
 }
 model.chain.instanceMatrix.needsUpdate=true;model.chain.computeBoundingSphere();
 model.applyCut(cut);model.helpers.visible=cut&&amount===0;
 model.gas.scale.y=state.gasHeight;model.gas.position.y=4.35-state.gasHeight/2;
 model.gasSlice.scale.y=state.gasHeight;model.gasSlice.position.y=model.gas.position.y;
 model.gas.rotation.y=Math.PI/2;model.gasMaterial.color.set(state.phase==='power'?'#ef7d42':state.phase==='exhaust'?'#a8a8a2':'#72b3d6');
 model.gasMaterial.opacity=state.phase==='power'?.28:state.phase==='compression'?.22:.15;
 model.flash.visible=state.spark>0;model.flash.scale.setScalar(Math.max(.01,state.spark));
 for(let i=0;i<model.dots.length;i++){
  const dot=model.dots[i]!;dot.visible=state.intakeLift>.002||state.exhaustLift>.002;
  const port=state.phase==='exhaust'?'exhaust':'intake';const t=(state.angle/180*2+i/model.dots.length)%1;
  dot.position.copy(model.ports[port].curve.getPoint(port==='intake'?1-t:t));
  (dot.material as T.MeshBasicMaterial).color.set(port==='intake'?'#75bcdb':'#ef9b63');
 }
 model.root.updateMatrixWorld(true);
}
