import { video } from './content/video.ts';
import { VideoSection } from './kit/VideoSection.tsx';
import { CollectionNav } from './kit/CollectionNav.tsx';
import { labNumber } from './kit/collection.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Box, ChevronRight, Download, Focus, Layers3, Maximize, Minus, Plus, Search, X } from 'lucide-react';
import { Brand } from './kit/Brand.tsx';
import { Sources } from './ui/Sources.tsx';
import { CycleControls } from './ui/CycleControls.tsx';
import { createScene } from './scene/runtime.ts';
import { advanceAngle, sampleEngine } from './simulation/engine.ts';
import { project } from './content/project.ts';
import { catalog } from './content/catalog.ts';
import type { Part, SceneHandle } from './scene/types.ts';

const LAB_NUMBER = labNumber('motor-por-dentro');

export function App() {
  const host = useRef<HTMLDivElement>(null), scene = useRef<SceneHandle | null>(null), inspector = useRef<HTMLElement>(null), dialog = useRef<HTMLDialogElement>(null);
  const [parts, setParts] = useState<Part[]>([]), [angle, setAngle] = useState(90), [explode, setExplode] = useState(0), [speed, setSpeed] = useState(1), [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<string | null>(null), [isolated, setIsolated] = useState(false), [cut, setCut] = useState(true), [wireframe, setWireframe] = useState(false), [turbo, setTurbo] = useState(false);
  const [sources, setSources] = useState(false), [drawer, setDrawer] = useState(false), [search, setSearch] = useState(''), [tour, setTour] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null), [notice, setNotice] = useState('');
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const selectedRef = useRef<string | null>(null);
  useEffect(() => {selectedRef.current = selected;}, [selected]);
  // Selecting never pauses the cycle; picking the part already selected keeps its isolation and tour step.
  const select = useCallback((id: string | null) => {if (id === selectedRef.current) return;selectedRef.current = id;setSelected(id);setIsolated(false);setTour(null);}, []);
  const current = catalog.find(p => p.id === selected), cycle = sampleEngine(angle);
  const normalize = (value: string) => value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/\p{Diacritic}/gu, '');
  useEffect(() => {
    if (!host.current) return;
    try {scene.current = createScene(host.current, select, text => {setError(text);setPlaying(false);});setParts(scene.current.parts);}
    catch {setError('Seu navegador não conseguiu abrir a cena 3D. As explicações e fontes continuam disponíveis.');}
    return () => {scene.current?.dispose();scene.current = null;};
  }, [select]);
  useEffect(() => {scene.current?.update({angle, explode, cut, selected, isolated, wireframe, turbo});}, [angle, explode, cut, selected, isolated, wireframe, turbo]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {setReduced(media.matches);if (media.matches) setPlaying(false);};
    media.addEventListener('change', change);return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (!playing) return;let id = 0, last = performance.now();
    const tick = (now: number) => {if (now - last >= 32) {const dt = (now - last) / 1000;last = now;setAngle(a => advanceAngle(a, dt, speed, true, !document.hidden));}id = requestAnimationFrame(tick);};
    id = requestAnimationFrame(tick);return () => cancelAnimationFrame(id);
  }, [playing, speed]);
  useEffect(() => {if (drawer) dialog.current?.showModal();else dialog.current?.close();}, [drawer]);
  useEffect(() => {if (selected && innerWidth <= 900) {const id = requestAnimationFrame(() => inspector.current?.scrollIntoView({block: 'nearest', behavior: reduced ? 'instant' : 'smooth'}));return () => cancelAnimationFrame(id);}}, [selected, reduced]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const field = e.target instanceof Element && e.target.closest('input, select, textarea, button, a, [contenteditable]');
      if (document.querySelector('dialog[open]') || e.ctrlKey || e.metaKey || e.altKey || sources || drawer) return;
      if (e.key.toLowerCase() === 'r' && !field) scene.current?.home();
      if (e.key === 'Escape') select(null);
    };
    document.addEventListener('keydown', key);return () => document.removeEventListener('keydown', key);
  }, [select, sources, drawer]);
  function reset() {setAngle(90);setExplode(0);setSpeed(1);setPlaying(false);setSelected(null);setIsolated(false);setWireframe(false);setCut(true);setTurbo(false);setTour(null);setSearch('');requestAnimationFrame(() => scene.current?.home());setNotice('Experiência reiniciada.');}
  function guide(index: number) {const p = parts[index];if (!p) return;setTour(index);setSelected(p.id);setIsolated(false);setPlaying(false);requestAnimationFrame(() => scene.current?.focus(p.id));}
  // The spark happens inside the chamber, so it is only visible in the cut view of the assembled engine.
  function showSpark() {setPlaying(false);setExplode(0);setIsolated(false);setCut(true);setAngle(360);}
  function chooseTurbo(value: boolean) {setTurbo(value);setExplode(0);setIsolated(false);}
  async function fullscreen() {try {if (document.fullscreenElement) await document.exitFullscreen();else await document.documentElement.requestFullscreen();} catch {setNotice('Tela cheia não disponível neste navegador.');}}
  const list = () => <><label className="search"><Search size={16}/><input aria-label="Encontrar conjunto" placeholder="Encontrar conjunto" value={search} onChange={e => setSearch(e.target.value)}/><span>08</span></label><div className="parts-list">{catalog.filter(p => normalize(p.label).includes(normalize(search))).map((p) => <button className={'part-row' + (p.id === selected ? ' selected' : '')} key={p.id} aria-pressed={p.id === selected} onClick={() => {select(p.id);setDrawer(false);}}><span>{String(catalog.indexOf(p) + 1).padStart(2, '0')}</span><strong>{p.label}</strong><ChevronRight size={14}/></button>)}{!catalog.some(p => normalize(p.label).includes(normalize(search))) && <small className="search-hint">Nenhum conjunto encontrado.</small>}</div></>;
  return <div className="app"><header className="header"><Brand/><div className="collection-label">MECÂNICA DO MOVIMENTO <span>/</span> LAB {LAB_NUMBER}</div><a className="video-link" href="#video">Ver o vídeo <ArrowUpRight size={16}/></a></header>
    <main className={'workspace engine-workspace' + (turbo ? ' has-turbo' : '')}><div className="heading"><p className="eyebrow"><span/> EXPERIMENTO {LAB_NUMBER} <i>—</i> DO PISTÃO AO EIXO</p><h1>MOTOR<br/>POR DENTRO<span>.</span></h1><p className="intro">{project.intro}</p></div>
      <div className="canvas-region"><div className="scene-host" ref={host}/>{error && <div className="scene-error" role="alert"><Box size={28}/><h2>Cena indisponível</h2><p>{error}</p><button className="primary" onClick={() => location.reload()}>Tentar novamente</button></div>}<div className="scene-mode"><span className={'status-dot' + (playing ? ' active' : '')}/>{isolated ? 'CONJUNTO ISOLADO' : explode > 0 ? 'CONJUNTOS SEPARADOS' : cut ? 'CORTE DO MOTOR' : 'MOTOR MONTADO'}<span className="mode-divider"/>{turbo && !isolated && explode === 0 ? '4 TEMPOS · TURBO' : '4 TEMPOS'}</div>{!error && <div className="orbit-hint"><span className="hint-mouse">Arraste para girar <i>·</i> Ctrl + rolagem aproxima <i>·</i> </span><span className="hint-touch">Deslize para o lado para girar <i>·</i> </span>Modelo educativo</div>}</div>
      <aside className="sidebar"><div className="sidebar-label">DO PISTÃO AO VIRABREQUIM.</div>{list()}<div className="sidebar-foot"><span className="mini-line"/><p>Uma queima a cada duas voltas.<br/>Acompanhe o caminho do movimento.</p><button className="text-button" disabled={!parts.length || Boolean(error)} onClick={() => guide(0)}>Conhecer o motor <ArrowRight size={15}/></button></div></aside>
      <nav className="view-switch" aria-label="Vista do motor"><button aria-pressed={!cut} className={!cut ? 'active' : ''} onClick={() => setCut(false)}>Motor</button><button aria-pressed={cut} className={cut ? 'active' : ''} onClick={() => setCut(true)}>Por dentro</button></nav>
      <div className="camera-tools"><button aria-label="Aproximar" disabled={!parts.length} onClick={() => scene.current?.zoom(.85)}><Plus size={18}/></button><button aria-label="Afastar" disabled={!parts.length} onClick={() => scene.current?.zoom(1.15)}><Minus size={18}/></button><span/><button aria-label="Reenquadrar" onClick={() => scene.current?.home()}><Focus size={18}/></button><button aria-label="Mostrar malha" aria-pressed={wireframe} onClick={() => setWireframe(v => !v)}><Box size={18}/></button><span/><button aria-label="Salvar imagem PNG" disabled={!parts.length || Boolean(error)} onClick={() => scene.current?.capture()}><Download size={18}/></button><button className="format-button" aria-label="Salvar imagem vertical 9 por 16" disabled={!parts.length || Boolean(error)} onClick={() => scene.current?.capture(true)}>9:16</button>{Boolean(document.documentElement.requestFullscreen) && <button aria-label="Tela cheia" onClick={fullscreen}><Maximize size={17}/></button>}</div>
      {current && <section className="inspector" ref={inspector} aria-label="Conjunto selecionado"><div className="inspector-top"><span className="eyebrow">{tour === null ? 'EM DETALHE' : `CONHEÇA O MOTOR · ${tour + 1}/8`}</span><button className="icon-button" aria-label="Fechar detalhe" onClick={() => select(null)}><X size={16}/></button></div><h2>{current.label}</h2><p>{current.detail}</p><small>{current.note}</small><a className="part-source" href={current.source} target="_blank" rel="noreferrer">Consultar a fonte <ArrowUpRight size={12}/></a><div className="inspector-actions"><button disabled={!parts.length || Boolean(error)} aria-pressed={isolated} onClick={() => {setIsolated(v => !v);setPlaying(false);}}><Layers3 size={14}/>{isolated ? 'Ver motor inteiro' : 'Isolar'}</button><button disabled={!parts.length || Boolean(error)} onClick={() => scene.current?.focus(current.id)}><Focus size={14}/>Aproximar</button></div>{tour !== null && <div className="inspector-actions"><button disabled={tour === 0} onClick={() => guide(tour - 1)}><ArrowLeft size={14}/>Anterior</button><button onClick={() => tour < 7 ? guide(tour + 1) : setTour(null)}>{tour < 7 ? 'Próximo conjunto' : 'Concluir'}<ArrowRight size={14}/></button></div>}</section>}
      <div className="mobile-actions"><button onClick={() => setDrawer(true)}><Layers3 size={16}/>Conjuntos <span>8</span></button><button disabled={!parts.length || Boolean(error)} onClick={() => guide(0)}>Conhecer o motor <ArrowRight size={16}/></button></div>
      <CycleControls angle={angle} playing={playing} speed={speed} explode={explode} turbo={turbo} disabled={!parts.length || Boolean(error)} setAngle={setAngle} setSpeed={setSpeed} setPlaying={setPlaying} setExplode={value => {setExplode(value);setPlaying(false);setIsolated(false);}} setTurbo={chooseTurbo} showSpark={showSpark} reset={reset}/>
      <p className="mechanism-note">{explode > 0 ? 'POSE CONGELADA · REMONTE PARA GIRAR O EIXO' : `ADMISSÃO ${cycle.intakeLift > .001 ? 'ABERTA' : 'FECHADA'} · ESCAPE ${cycle.exhaustLift > .001 ? 'ABERTO' : 'FECHADO'} · CENTELHA EM 360°${turbo ? ' · TURBO ILUSTRATIVO' : ''}`}</p>
    </main><VideoSection video={video}/><footer><span>UM EXPERIMENTO DO OVICTORLAB <i>© 2026</i></span><button onClick={() => setSources(true)}>Como funciona · Fontes e créditos <ArrowUpRight size={13}/></button><CollectionNav current="motor-por-dentro"/></footer>
    <Sources open={sources} onClose={() => setSources(false)}/><dialog ref={dialog} className="parts-dialog" aria-label="Conjuntos do motor" onClose={() => setDrawer(false)}><div className="dialog-top"><span className="eyebrow">CONHEÇA O MOTOR</span><button className="icon-button" aria-label="Fechar conjuntos" onClick={() => setDrawer(false)}><X size={18}/></button></div>{list()}</dialog><span className="sr-only" role="status" aria-live="polite">{notice}</span>
  </div>;
}
