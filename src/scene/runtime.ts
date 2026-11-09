import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createModel } from './model.ts';
import { applyEngine } from './rig.ts';
import { sampleEngine } from '../simulation/engine.ts';
import { aspectRescale, fit } from './camera.ts';
import { TURBO_BOUNDS } from './turbo.ts';
import { saveSceneImage } from './capture.ts';
import type { SceneHandle, ViewState } from './types.ts';

export function createScene(host: HTMLElement, onSelect: (id: string | null) => void, onError: (text: string) => void): SceneHandle {
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));renderer.localClippingEnabled = true;
  renderer.toneMapping = T.ACESFilmicToneMapping;renderer.toneMappingExposure = 1;renderer.shadowMap.enabled = true;renderer.shadowMap.type = T.PCFShadowMap;
  renderer.domElement.setAttribute('role', 'img');renderer.domElement.setAttribute('aria-label', 'Motor de quatro tempos em 3D. Arraste para girar ou selecione um conjunto na lista.');
  host.append(renderer.domElement);
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(38, 1, .01, 200);
  const controls = new OrbitControls(camera, renderer.domElement);controls.enableDamping = false;controls.minDistance = 2;controls.maxDistance = 75;
  // Vertical swipes scroll the page on touch screens; sideways drags still orbit (OrbitControls sets 'none').
  renderer.domElement.style.touchAction = 'pan-y';
  const room = new RoomEnvironment(), pmrem = new T.PMREMGenerator(renderer), env = pmrem.fromScene(room, .04);scene.environment = env.texture;scene.environmentIntensity = .5;room.dispose();pmrem.dispose();
  scene.add(new T.HemisphereLight('#dbe8ff', '#483d30', 1.15));
  const key = new T.DirectionalLight('#fff1d2', 2.5);key.position.set(4, 10, 8);key.castShadow = true;key.shadow.mapSize.set(1024, 1024);key.shadow.camera.left = -15;key.shadow.camera.right = 15;key.shadow.camera.top = 10;key.shadow.camera.bottom = -10;key.shadow.camera.far = 45;key.shadow.bias = -.0005;scene.add(key);
  const rim = new T.DirectionalLight('#b4d3ff', 1.9);rim.position.set(-6, 5, -5);scene.add(rim);
  const model = createModel();scene.add(model.root);
  const highlight = new T.BoxHelper(new T.Object3D(), '#ffd21f');highlight.visible = false;scene.add(highlight);
  let state: ViewState = { angle: 90, explode: 0, cut: true, selected: null, isolated: false, wireframe: false, turbo: false };
  let disposed = false, active = false, contextLost = false, framed = false;
  let previousPose: {position: T.Vector3; target: T.Vector3} | null = null;
  const homeDirection = new T.Vector3(7, 3.5, 13), engineBounds = new T.Box3(new T.Vector3(-2.5, -1.4, -1.8), new T.Vector3(2.5, 6.8, 1.5));
  const viewDirection = () => camera.position.clone().sub(controls.target);
  const selectedPart = () => model.parts.find(p => p.id === state.selected);
  const bounds = () => {
    if (state.isolated && selectedPart()) return new T.Box3().setFromObject(selectedPart()!.group);
    if (state.explode === 0) return (state.turbo ? TURBO_BOUNDS : engineBounds).clone();
    const b = new T.Box3();for (const part of model.parts) b.expandByObject(part.group);return b;
  };
  const invalidate = () => {if (disposed || active || document.hidden || contextLost) return;active = true;renderer.setAnimationLoop(frame);};
  function frame() {
    renderer.render(scene, camera);
    const data = renderer.domElement.dataset;data.renderCount = String(Number(data.renderCount ?? 0) + 1);
    data.drawCalls = String(renderer.info.render.calls);data.triangles = String(renderer.info.render.triangles);
    data.cameraPose = JSON.stringify([...camera.position.toArray(), ...controls.target.toArray()]);
    renderer.setAnimationLoop(null);active = false;
  }
  // Explicit reframing (button, R, reset) returns to the default view; mode changes keep the user's orbit direction.
  const frameAlong = (direction: T.Vector3, box = bounds()) => {controls.target.copy(fit(camera, box, direction));controls.update();framed = true;invalidate();};
  const home = () => frameAlong(homeDirection);
  const refit = () => frameAlong(viewDirection());
  const scalePose = (position: T.Vector3, target: T.Vector3, factor: number) => position.sub(target).multiplyScalar(factor).add(target);
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();if (width < 1 || height < 1) return;
    const current = renderer.getSize(new T.Vector2()), before = camera.aspect, after = width / height;
    if (current.x !== width || current.y !== height) renderer.setSize(width, height);
    camera.aspect = after;camera.updateProjectionMatrix();
    // Keep direction, target and zoom; only compensate the distance the new aspect needs.
    if (framed && Math.abs(before - after) > .0001) {
      const factor = aspectRescale(bounds(), viewDirection(), before, after, camera.fov);
      scalePose(camera.position, controls.target, factor);controls.update();
      if (previousPose) scalePose(previousPose.position, previousPose.target, factor);
    }
    invalidate();
  };
  const observer = new ResizeObserver(resize);observer.observe(host);controls.addEventListener('change', invalidate);
  // A pick is a short, still, single-pointer press. Drags, pinches and scroll gestures never select.
  const pointers = new Map<number, {x: number; y: number; time: number}>();let multiTouch = false;
  const pointerDown = (e: PointerEvent) => {pointers.set(e.pointerId, {x: e.clientX, y: e.clientY, time: e.timeStamp});if (pointers.size > 1) multiTouch = true;};
  const pointerCancel = (e: PointerEvent) => {pointers.delete(e.pointerId);if (!pointers.size) multiTouch = false;};
  const pointerUp = (e: PointerEvent) => {
    const start = pointers.get(e.pointerId), wasMulti = multiTouch;pointerCancel(e);
    if (!start || wasMulti || e.button !== 0 || e.timeStamp - start.time > 500 || Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6) return;
    const rect = renderer.domElement.getBoundingClientRect(), ray = new T.Raycaster(), candidates: T.Mesh[] = [];
    ray.setFromCamera(new T.Vector2((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1), camera);
    for (const part of model.parts) part.group.traverseVisible(o => {if (o instanceof T.Mesh) candidates.push(o);});
    const hits = ray.intersectObjects(candidates, false).filter(hit => {
      const materials = Array.isArray((hit.object as T.Mesh).material) ? (hit.object as T.Mesh).material as T.Material[] : [(hit.object as T.Mesh).material as T.Material];
      return !materials.some(m => m.clippingPlanes?.some(p => p.distanceToPoint(hit.point) < 0));
    });
    let current: T.Object3D | undefined = hits[0]?.object;
    while (current && !current.userData.partId) current = current.parent ?? undefined;
    if (current) onSelect(current.userData.partId);
  };
  // Plain wheel scrolls the page; Ctrl/⌘ + wheel (or a trackpad pinch) zooms. Capture on the host runs before OrbitControls.
  const wheel = (e: WheelEvent) => {if (!e.ctrlKey && !e.metaKey) e.stopPropagation();};
  host.addEventListener('wheel', wheel, {capture: true});
  renderer.domElement.addEventListener('pointerdown', pointerDown);renderer.domElement.addEventListener('pointerup', pointerUp);renderer.domElement.addEventListener('pointercancel', pointerCancel);
  const visibility = () => {if (document.hidden) {renderer.setAnimationLoop(null);active = false;} else invalidate();};
  document.addEventListener('visibilitychange', visibility);
  const lost = (e: Event) => {e.preventDefault();contextLost = true;renderer.setAnimationLoop(null);active = false;onError('A cena 3D foi interrompida. Recarregue para restaurá-la. As explicações e fontes continuam disponíveis.');};
  renderer.domElement.addEventListener('webglcontextlost', lost);
  applyEngine(model, sampleEngine(90), true, 0);resize();home();
  return {
    parts: model.parts,
    update(next) {
      const previous = state;state = next;
      applyEngine(model, sampleEngine(state.angle), state.cut && !state.isolated && state.explode === 0, state.explode, state.turbo && !state.isolated);
      model.helpers.visible = state.cut && !state.isolated && state.explode === 0;model.floor.visible = !state.isolated && state.explode === 0;
      for (const part of model.parts) part.group.visible = !state.isolated || part.id === state.selected;
      if (previous.wireframe !== state.wireframe) model.root.traverse(o => {if (o instanceof T.Mesh) for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m instanceof T.MeshStandardMaterial) m.wireframe = state.wireframe;});
      const selected = selectedPart();highlight.visible = Boolean(selected) && !state.isolated;
      if (selected) highlight.setFromObject(selected.group);
      if (!previous.isolated && state.isolated) {previousPose = {position: camera.position.clone(), target: controls.target.clone()};refit();}
      if (previous.isolated && !state.isolated && previousPose) {camera.position.copy(previousPose.position);controls.target.copy(previousPose.target);controls.update();previousPose = null;}
      if ((previous.explode !== state.explode || previous.turbo !== state.turbo) && !state.isolated) refit();
      renderer.domElement.dataset.angle = state.angle.toFixed(2);renderer.domElement.dataset.explode = state.explode.toFixed(2);invalidate();
    },
    home,
    focus(id) {const part = model.parts.find(p => p.id === id);if (part) frameAlong(viewDirection(), new T.Box3().setFromObject(part.group));},
    zoom(factor) {scalePose(camera.position, controls.target, factor);controls.update();invalidate();},
    capture(portrait = false) {saveSceneImage(renderer, scene, camera, bounds(), portrait);invalidate();},
    dispose() {
      disposed = true;renderer.setAnimationLoop(null);observer.disconnect();controls.removeEventListener('change', invalidate);controls.dispose();
      host.removeEventListener('wheel', wheel, {capture: true});renderer.domElement.removeEventListener('pointerdown', pointerDown);renderer.domElement.removeEventListener('pointerup', pointerUp);renderer.domElement.removeEventListener('pointercancel', pointerCancel);renderer.domElement.removeEventListener('webglcontextlost', lost);document.removeEventListener('visibilitychange', visibility);
      model.dispose();env.dispose();highlight.geometry.dispose();(highlight.material as T.Material).dispose();renderer.dispose();renderer.domElement.remove();
    },
  };
}
