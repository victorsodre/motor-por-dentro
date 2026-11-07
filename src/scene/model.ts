import * as T from 'three';
import {box,mesh,mergeStatic,disposeTree} from './geometry.ts';
import {catalog} from '../content/catalog.ts';
import {camPoint,CRANK_RADIUS,ROD_LENGTH} from '../simulation/engine.ts';
import type {Port} from '../simulation/engine.ts';
export const CAM_Y=6.05;
const material=(color:string,metalness=.45,roughness=.35)=>new T.MeshStandardMaterial({color,metalness,roughness});
function ring(inner:number,outer:number,depth:number){
 const shape=new T.Shape();shape.absarc(0,0,outer,0,Math.PI*2,false);
 const hole=new T.Path();hole.absarc(0,0,inner,0,Math.PI*2,true);shape.holes.push(hole);
 return new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:48}).translate(0,0,-depth/2);
}
function cylinderZ(parent:T.Object3D,radius:number,length:number,mat:T.Material,x=0,y=0,z=0){
 const item=mesh(parent,new T.CylinderGeometry(radius,radius,length,32),mat,x,y,z);item.rotation.x=Math.PI/2;return item;
}
function camGeometry(port:Port){
 const shape=new T.Shape();for(let i=0;i<=360;i++){const p=camPoint(i/360*Math.PI*2,port);if(i===0)shape.moveTo(p.x,p.y);else shape.lineTo(p.x,p.y);}
 shape.closePath();return new T.ExtrudeGeometry(shape,{depth:.2,bevelEnabled:false}).translate(0,0,-.1);
}
function springGeometry(){
 const points=Array.from({length:121},(_,i)=>new T.Vector3(.13*Math.cos(i/120*Math.PI*12),i/120,.13*Math.sin(i/120*Math.PI*12)));
 return new T.TubeGeometry(new T.CatmullRomCurve3(points),120,.022,6,false);
}
// Exact open-chain tangent path between two sprockets with a 2:1 pitch radius.
export function chainPath(){
 const small=.32,large=.64,alpha=Math.asin((large-small)/CAM_Y),normal=new T.Vector2(Math.cos(alpha),-Math.sin(alpha));
 const low=new T.Vector2().copy(normal).multiplyScalar(small),high=new T.Vector2().copy(normal).multiplyScalar(large).add(new T.Vector2(0,CAM_Y));
 const straight=low.distanceTo(high),top=(Math.PI+2*alpha)*large,bottom=(Math.PI-2*alpha)*small,length=2*straight+top+bottom;
 return {length,point(fraction:number){
  let d=((fraction%1)+1)%1*length;let p:T.Vector2,t:T.Vector2;
  if(d<straight){p=low.clone().lerp(high,d/straight);t=high.clone().sub(low).normalize();}
  else if((d-=straight)<top){const a=-alpha+d/large;p=new T.Vector2(Math.cos(a)*large,CAM_Y+Math.sin(a)*large);t=new T.Vector2(-Math.sin(a),Math.cos(a));}
  else if((d-=top)<straight){p=new T.Vector2(-high.x,high.y).lerp(new T.Vector2(-low.x,low.y),d/straight);t=new T.Vector2(high.x-low.x,low.y-high.y).normalize();}
  else {d-=straight;const a=Math.PI+alpha+d/small;p=new T.Vector2(Math.cos(a)*small,Math.sin(a)*small);t=new T.Vector2(-Math.sin(a),Math.cos(a));}
  return {position:new T.Vector3(p.x,p.y,-1.5),rotation:Math.atan2(-t.x,t.y)};
 }};
}
export function createModel(){
 const root=new T.Group();const parts=catalog.map(item=>{const group=new T.Group();group.name=item.id;group.userData.partId=item.id;root.add(group);return {...item,group};});
 const group=(id:string)=>parts.find(p=>p.id===id)!.group;
 const silver=material('#aeb8bf',.75,.3),steel=material('#55677a',.75,.32),dark=material('#172331',.5,.4),gold=material('#e5bb38',.55,.32),copper=material('#ce7946',.55,.38);
 const blockMat=material('#637685',.68,.4),pistonMat=material('#b6bec4',.8,.28),ringsMat=material('#35404d',.7,.3);
 const sectionMaterials=[blockMat,pistonMat,ringsMat];const plane=new T.Plane(new T.Vector3(0,0,-1),0);
 const block=group('block');
 const liner=mesh(block,ring(.98,1.16,2.9),blockMat,0,2.9,0);liner.rotation.x=Math.PI/2;
 for(let i=0;i<7;i++){const fin=mesh(block,ring(1.1,1.29,.09),blockMat,0,1.62+i*.38,0);fin.rotation.x=Math.PI/2;}
 const headShape=new T.Shape();headShape.moveTo(-1.25,-1.1);headShape.lineTo(1.25,-1.1);headShape.lineTo(1.25,1.1);headShape.lineTo(-1.25,1.1);headShape.closePath();
 for(const [x,z,r] of [[0,.48,.28],[0,-.48,.28],[.5,0,.15]]){const hole=new T.Path();hole.absarc(x!,z!,r!,0,Math.PI*2,true);headShape.holes.push(hole);}
 const head=mesh(block,new T.ExtrudeGeometry(headShape,{depth:.28,bevelEnabled:false,curveSegments:32}),blockMat,0,4.63,0);head.rotation.x=Math.PI/2;
 for(const x of [-1.05,1.05])for(const z of [-.9,.9]){mesh(block,new T.CylinderGeometry(.075,.075,3.6,12),steel,x,2.75,z);mesh(block,new T.CylinderGeometry(.13,.13,.13,6),gold,x,4.72,z);}
 for(const z of [-.68,.68]){
  const bearing=mesh(block,ring(.25,.45,.18),blockMat,0,0,z);
  bearing.userData.bearing=true;box(block,[1.35,.16,.28],[0,-.48,z],blockMat,.05);
 }
 box(block,[2.5,.16,1.9],[0,-1.27,0],blockMat,.08);
 for(const x of [-1.03,1.03])box(block,[.22,1.6,1.9],[x,-.4,0],blockMat,.05);
 mergeStatic(block);

 const piston=group('piston');
 const skirt=mesh(piston,ring(.76,.94,.73),pistonMat,0,.015,0);skirt.rotation.x=Math.PI/2;
 mesh(piston,new T.CylinderGeometry(.94,.94,.17,64),pistonMat,0,.465,0);
 for(const y of [.2,.3,.39]){const r=mesh(piston,ring(.91,.95,.035),ringsMat,0,y,0);r.rotation.x=Math.PI/2;}
 cylinderZ(piston,.12,1.84,silver);
 mergeStatic(piston);

 const connectingRod=group('rod');
 mesh(connectingRod,ring(.13,.24,.2),copper,0,ROD_LENGTH,0);
 mesh(connectingRod,ring(.18,.32,.24),copper);
 box(connectingRod,[.27,ROD_LENGTH-.48,.18],[0,ROD_LENGTH/2,0],copper,.07);
 box(connectingRod,[.11,ROD_LENGTH-.68,.2],[0,ROD_LENGTH/2,0],steel,.025);
 for(const x of [-.28,.28])cylinderZ(connectingRod,.06,.29,silver,x,-.1);
 mergeStatic(connectingRod);

 const crank=group('crank');
 for(const z of [-.31,.31]){
  cylinderZ(crank,.36,.18,steel,0,0,z);cylinderZ(crank,.27,.18,steel,0,CRANK_RADIUS,z);
  box(crank,[.5,CRANK_RADIUS,.18],[0,CRANK_RADIUS/2,z],steel,.12);
  const counter=new T.Shape();counter.absarc(0,0,.72,Math.PI,Math.PI*2,false);counter.lineTo(-.72,0);
  mesh(crank,new T.ExtrudeGeometry(counter,{depth:.2,bevelEnabled:false,curveSegments:32}).translate(0,0,-.1),steel,0,0,z);
 }
 cylinderZ(crank,.18,.68,silver,0,CRANK_RADIUS,0);
 cylinderZ(crank,.23,3.15,silver);
 const flywheel=new T.Shape();flywheel.absarc(0,0,1.05,0,Math.PI*2,false);
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2,hole=new T.Path();hole.absarc(Math.cos(a)*.7,Math.sin(a)*.7,.15,0,Math.PI*2,true);flywheel.holes.push(hole);}
 mesh(crank,new T.ExtrudeGeometry(flywheel,{depth:.16,bevelEnabled:false,curveSegments:32}),dark,0,0,-1.15);
 box(crank,[.08,.18,.18],[0,.94,-1.07],gold,.015);mergeStatic(crank);

 const timing=group('timing'),cam=new T.Group();timing.add(cam);cam.position.y=CAM_Y;
 cylinderZ(cam,.13,2.95,silver);
 mesh(cam,camGeometry('intake'),steel,0,0,.48);mesh(cam,camGeometry('exhaust'),steel,0,0,-.48);
 const upper=new T.Group();cam.add(upper);cylinderZ(upper,.6,.15,gold,0,0,-1.5);
 for(let i=0;i<32;i++){const a=i/32*Math.PI*2;const tooth=box(upper,[.09,.08,.18],[Math.sin(a)*.63,Math.cos(a)*.63,-1.5],gold,.012);tooth.rotation.z=-a;}
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2;cylinderZ(upper,.08,.17,dark,Math.sin(a)*.36,Math.cos(a)*.36,-1.5);}
 mergeStatic(upper);
 const lower=new T.Group();timing.add(lower);cylinderZ(lower,.29,.15,gold,0,0,-1.5);
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const tooth=box(lower,[.08,.07,.18],[Math.sin(a)*.31,Math.cos(a)*.31,-1.5],gold,.01);tooth.rotation.z=-a;}mergeStatic(lower);
 const chain=new T.InstancedMesh(new T.BoxGeometry(.075,.105,.12),material('#647489',.7,.4),128);chain.castShadow=true;chain.receiveShadow=true;timing.add(chain);chain.instanceMatrix.setUsage(T.DynamicDrawUsage);
 const path=chainPath();
 for(const z of [-.95,.95]){const mount=mesh(block,ring(.14,.29,.14),blockMat,0,CAM_Y,z);mount.name='cam-bearing';box(block,[.18,1.4,.18],[.3,5.33,z],blockMat,.03);}

 const ports=Object.fromEntries((['intake','exhaust'] as const).map((id)=>{
  const p=group(id),z=id==='intake'?.48:-.48,side=id==='intake'?-1:1;
  const valve=new T.Group();p.add(valve);valve.position.z=z;
  mesh(valve,new T.CylinderGeometry(.26,.22,.06,32),silver,0,4.32,0);
  mesh(valve,new T.CylinderGeometry(.045,.045,1,16),silver,0,4.85,0);
  box(valve,[.48,.12,.36],[0,5.34,0],steel,.025);
  const spring=mesh(p,springGeometry(),silver,0,4.8,z);
  const seat=mesh(p,ring(.23,.3,.035),copper,0,4.36,z);seat.rotation.x=Math.PI/2;
  const curve=new T.CubicBezierCurve3(new T.Vector3(0,4.43,z),new T.Vector3(0,4.9,z),new T.Vector3(side*1.2,4.95,z),new T.Vector3(side*2.1,4.95,z));
  const pipeMat=material(id==='intake'?'#6caec5':'#ce7946',.35,.4);pipeMat.transparent=true;pipeMat.opacity=.48;pipeMat.depthWrite=false;pipeMat.side=T.DoubleSide;
  const pipe=mesh(p,new T.TubeGeometry(curve,32,.24,16,false),pipeMat);pipe.castShadow=false;
  for(const t of [0,1]){const ringMesh=mesh(p,new T.TorusGeometry(.24,.035,8,32),silver);ringMesh.position.copy(curve.getPoint(t));ringMesh.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),curve.getTangent(t));}
  return [id,{group:p,valve,spring,curve}];
 })) as Record<Port,{group:T.Group;valve:T.Group;spring:T.Mesh;curve:T.CubicBezierCurve3}>;

 const ignition=group('spark');
 mesh(ignition,new T.CylinderGeometry(.11,.11,.6,20),material('#ece9dd',.1,.38),.5,4.93,0);
 mesh(ignition,new T.CylinderGeometry(.16,.16,.16,6),silver,.5,4.65,0);
 mesh(ignition,new T.CylinderGeometry(.065,.065,.27,16),silver,.5,4.38,0);
 box(ignition,[.035,.12,.035],[.58,4.23,0],silver,.005);box(ignition,[.1,.025,.035],[.54,4.18,0],silver,.005);
 mergeStatic(ignition);

 const helpers=new T.Group();root.add(helpers);
 const gasMaterial=new T.MeshBasicMaterial({color:'#72b3d6',transparent:true,opacity:.14,depthWrite:false,side:T.DoubleSide});
 const gas=mesh(helpers,new T.CylinderGeometry(.965,.965,1,48,1,false,0,Math.PI),gasMaterial);gas.castShadow=false;gas.receiveShadow=false;gas.raycast=()=>{};
 const gasSlice=mesh(helpers,new T.PlaneGeometry(1.93,1),gasMaterial,0,0,.002);gasSlice.castShadow=false;gasSlice.receiveShadow=false;gasSlice.raycast=()=>{};
 const flash=mesh(helpers,new T.IcosahedronGeometry(.12,1),new T.MeshBasicMaterial({color:'#ffe4a1'}),.51,4.21,0);flash.raycast=()=>{};flash.castShadow=false;
 const dots=Array.from({length:14},()=>{const dot=mesh(helpers,new T.SphereGeometry(.042,8,6),new T.MeshBasicMaterial({color:'#75bcdb'}));dot.raycast=()=>{};dot.castShadow=false;return dot;});
 const floor=mesh(root,new T.CylinderGeometry(2.6,2.6,.08,64),material('#0b0d18',0,1),0,-1.42,0);floor.castShadow=false;floor.raycast=()=>{};
 const applyCut=(cut:boolean)=>{for(const mat of sectionMaterials){mat.clippingPlanes=cut?[plane]:[];mat.clipShadows=true;}};
 return {root,parts,block,piston,rod:connectingRod,crank,cam,lower,chain,path,ports,gas,gasSlice,gasMaterial,flash,dots,helpers,floor,applyCut,dispose:()=>disposeTree(root)};
}
export type EngineModel=ReturnType<typeof createModel>;
