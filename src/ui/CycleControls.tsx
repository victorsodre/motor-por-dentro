import type {CSSProperties} from 'react';
import {Pause,Play,RotateCcw} from 'lucide-react';
import {sampleEngine} from '../simulation/engine.ts';
import {stages,turboNote} from '../content/cycle.ts';
type Props={angle:number;playing:boolean;speed:number;explode:number;turbo:boolean;disabled:boolean;setAngle:(n:number)=>void;setSpeed:(n:number)=>void;setPlaying:(v:boolean)=>void;setExplode:(n:number)=>void;setTurbo:(v:boolean)=>void;showSpark:()=>void;reset:()=>void};
export function CycleControls({angle,playing,speed,explode,turbo,disabled,setAngle,setSpeed,setPlaying,setExplode,setTurbo,showSpark,reset}:Props){
 const state=sampleEngine(angle),stage=stages.find(s=>s.id===state.phase)!,degrees=Math.round(angle)%720;
 const jump=(value:number)=>{setPlaying(false);setExplode(0);setAngle(value);};
 return <section className="control-dock engine-dock" aria-label="Controlar o motor">
  <div className="dock-top"><button className="primary" disabled={disabled} onClick={()=>{if(explode>0)setExplode(0);setPlaying(!playing);}}>{playing?<Pause size={15}/>:<Play size={15}/>} {playing?'Pausar':'Girar o eixo'}</button><div className="phase-copy"><strong>{stage.label}{state.spark>0?' · centelha':''}</strong><span>{stage.detail}</span></div><label className="speed-control"><span>VELOCIDADE</span><select aria-label="Velocidade didática" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={.5}>0,5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label><button className="icon-button" aria-label="Reiniciar experiência" onClick={reset}><RotateCcw size={18}/></button></div>
  <div className="timeline"><label htmlFor="engine-angle">VIRABREQUIM · DUAS VOLTAS POR CICLO <span>{degrees}° / 720°</span></label><input style={{'--progress':`${degrees/719*100}%`} as CSSProperties} id="engine-angle" aria-label="Ângulo do virabrequim" aria-valuetext={`${degrees} graus, ${stage.label}${state.spark>0?', centelha':''}`} type="range" min="0" max="719" step="1" value={degrees} onChange={e=>jump(Number(e.target.value))}/></div>
  <div className="phase-markers">{stages.map((s,i)=><button key={s.id} className={s.id===state.phase?'current':''} aria-pressed={s.id===state.phase} onClick={()=>jump(s.angle)}><span>{String(i+1).padStart(2,'0')}</span> {s.label}</button>)}</div>
  <div className="assembly-control"><label htmlFor="engine-explode">Separar conjuntos</label><input id="engine-explode" aria-label="Separar conjuntos" type="range" min="0" max="100" step="1" value={Math.round(explode*100)} onChange={e=>setExplode(Number(e.target.value)/100)}/><output>{Math.round(explode*100)}%</output><button onClick={()=>setExplode(explode>0?0:1)}>{explode>0?'Montar':'Separar'}</button><button onClick={showSpark}>Ver centelha</button>
   <div className="air-control" role="group" aria-labelledby="air-label"><span id="air-label">AR NA ADMISSÃO</span><button aria-pressed={!turbo} onClick={()=>setTurbo(false)}>Aspirado</button><button aria-pressed={turbo} onClick={()=>setTurbo(true)}>Com turbo</button></div>
  </div>
  {turbo&&<p className="turbo-note">{turboNote}</p>}
 </section>;
}
