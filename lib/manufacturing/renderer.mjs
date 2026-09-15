import * as THREE from 'three';

const BUILD_SECONDS = 12;
const HOLD_SECONDS = 2;
const FADE_SECONDS = 1;
const CYCLE_SECONDS = BUILD_SECONDS + HOLD_SECONDS + FADE_SECONDS;

// One WebGL context for the whole page. Small section canvases receive its output.
// All triangle slicing happened offline; no CAD processing runs on visitors' devices.
export function startManufacturing(onReady) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch { return null; }
  renderer.localClippingEnabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(1);
  renderer.setClearColor(0, 0);
  const abort = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  let paused = false, disposed = false, lost = false, frame = 0, previous = 0, dirty = true;
  const slots = [...document.querySelectorAll('[data-manufacturing-part]')].map(canvas => ({
    canvas, context: canvas.getContext('2d'), visible: false, loading: false, model: null,
    elapsed: 0, cycle: 0, layer: -1, width: 0, height: 0,
  }));

  function makeModel(buffer) {
    const [version, count, layers, contours] = new Uint32Array(buffer,0,4);
    if (version !== 2 || layers !== 160 || count % 9 || buffer.byteLength !== 20 + 4*count + 8*layers + 2*contours) throw new Error('Invalid part asset');
    let offset = 16;
    const decode = (length, scale) => {
      const result = Float32Array.from(new Int16Array(buffer,offset,length),value=>value/scale);
      offset += length*2;
      return result;
    };
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(decode(count,8191),3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(decode(count,32767),3));
    const heights = new Float32Array(buffer,offset,layers); offset += layers*4;
    const offsets = new Uint32Array(buffer,offset,layers+1); offset += (layers+1)*4;
    const flatLines = decode(contours,8191);
    const lines = new Float32Array(contours/2*3);
    for (let layer = 0; layer < layers; layer++) {
      for (let i = offsets[layer]; i < offsets[layer+1]; i += 2) {
        lines[i/2*3] = flatLines[i];
        lines[i/2*3+1] = heights[layer];
        lines[i/2*3+2] = flatLines[i+1];
      }
    }
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const envelopeRadius = geometry.boundingSphere.radius;
    const bounds = geometry.boundingBox;
    const radius = Math.hypot(Math.max(Math.abs(bounds.min.x),Math.abs(bounds.max.x)),Math.max(Math.abs(bounds.min.z),Math.abs(bounds.max.z)));
    const clip = new THREE.Plane(new THREE.Vector3(0,-1,0), bounds.max.y+.001);
    // Feature edges only: no solid faces and no triangulation diagonals.
    const wireGeometry = new THREE.EdgesGeometry(geometry, 8);
    const wireMaterial = new THREE.LineBasicMaterial({ color: '#20abe2', clippingPlanes: [clip], toneMapped: false });
    const contourGeometry = new THREE.BufferGeometry();
    // Upload all contours once; each frame only changes a draw range.
    contourGeometry.setAttribute('position', new THREE.BufferAttribute(lines,3));
    contourGeometry.setDrawRange(0,0);
    const contourMaterial = new THREE.LineBasicMaterial({ color: '#c8f450', toneMapped: false });
    const contour = new THREE.LineSegments(contourGeometry,contourMaterial);
    const group = new THREE.Group();
    group.add(new THREE.LineSegments(wireGeometry,wireMaterial), contour);
    const scene = new THREE.Scene();
    scene.add(group);
    const camera = new THREE.OrthographicCamera(-4,4,4,-4,.1,100);
    camera.position.set(10,8.5,13); camera.lookAt(0,0,0); camera.updateMatrixWorld();
    // Fit all possible rotations, not just the initial pose, so tops never crop.
    const corners = [];
    for (const x of [-radius,radius]) for (const y of [bounds.min.y,bounds.max.y]) for (const z of [-radius,radius]) corners.push(new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse));
    const minX = Math.min(...corners.map(p=>p.x)), maxX = Math.max(...corners.map(p=>p.x));
    const minY = Math.min(...corners.map(p=>p.y)), maxY = Math.max(...corners.map(p=>p.y));
    return {
      scene, camera, group, clip, contour, contourGeometry, contourMaterial, wireMaterial, heights, offsets, envelopeRadius,
      fit(aspect) {
        // Fit the rotation-invariant sphere more tightly, keeping room for both ripples.
        const halfH = Math.max(envelopeRadius,envelopeRadius/aspect)*1.06;
        camera.left = (minX+maxX)/2-halfH*aspect; camera.right = (minX+maxX)/2+halfH*aspect;
        camera.top = (minY+maxY)/2+halfH; camera.bottom = (minY+maxY)/2-halfH;
        camera.updateProjectionMatrix();
      },
      dispose() { [geometry,wireGeometry,contourGeometry,wireMaterial,contourMaterial].forEach(resource=>resource.dispose()); },
    };
  }

  async function load(slot) {
    if (slot.loading || !slot.context) return;
    slot.loading = true;
    try {
      const name = slot.canvas.dataset.manufacturingPart;
      if (!['impeller','bracket','flange','gear'].includes(name)) return;
      if (!('DecompressionStream' in globalThis)) return;
      const response = await fetch(`/manufacturing/${name}.bin.gz`, { signal: abort.signal });
      if (!response.ok) throw new Error('Part unavailable');
      const buffer = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
      if (disposed) return;
      slot.model = makeModel(buffer);
      dirty = true; schedule(); onReady();
    } catch {
      // Decorative assets fail silently, leaving the established page intact.
    }
  }

  function schedule() {
    if (!frame && !disposed && !lost && !document.hidden && slots.some(slot=>slot.visible && slot.model)) frame = requestAnimationFrame(draw);
  }
  function draw(now) {
    frame = 0;
    if (disposed || lost || document.hidden) return;
    const moving = !paused && !reduced.matches;
    if (!dirty && now-previous < 1000/30) { if (moving) schedule(); return; }
    const delta = previous ? Math.min((now-previous)/1000,.1) : 0;
    previous = now;
    for (const slot of slots) {
      if (!slot.visible || !slot.model || !slot.width || !slot.height) continue;
      const model = slot.model;
      if (moving) { slot.elapsed += delta; slot.cycle += delta; }
      const progress = reduced.matches ? 1 : Math.min(1,slot.cycle/BUILD_SECONDS);
      const fade = reduced.matches ? 0 : Math.max(0,Math.min(1,(slot.cycle-BUILD_SECONDS-HOLD_SECONDS)/FADE_SECONDS));
      // Smoothly fade the finished part after its hold; pausing freezes this phase too.
      const opacity = 1-fade*fade*(3-2*fade);
      const layer = Math.min(159,Math.floor(progress*160));
      model.clip.constant = model.heights[layer];
      model.group.rotation.y = -slot.elapsed*Math.PI*2/24;
      model.contour.visible = !reduced.matches && progress < 1;
      model.contourMaterial.color.set('#c8f450');
      model.wireMaterial.color.set('#20abe2');
      if (layer !== slot.layer) {
        model.contourGeometry.setDrawRange(model.offsets[layer]/2,(model.offsets[layer+1]-model.offsets[layer])/2);
        slot.layer = layer;
      }
      // Bound GPU fill work independently of large desktop or high-DPI screens.
      const scale = Math.min(innerWidth < 700 ? 1 : 1.25, 640/Math.max(slot.width,slot.height));
      const width = Math.max(1,Math.round(slot.width*scale)), height = Math.max(1,Math.round(slot.height*scale));
      if (slot.canvas.width !== width || slot.canvas.height !== height) { slot.canvas.width = width; slot.canvas.height = height; }
      if (renderer.domElement.width !== width || renderer.domElement.height !== height) renderer.setSize(width,height,false);
      model.fit(width/height);
      renderer.render(model.scene,model.camera);
      slot.context.clearRect(0,0,width,height);
      slot.context.globalAlpha = opacity;
      slot.context.drawImage(renderer.domElement,0,0);
      slot.context.globalAlpha = 1;
      // Two successive circular waves surround the part during its completion hold.
      // Use the same active-time clock so pausing/off-screen time freezes it too.
      const wavePhase = (slot.cycle-BUILD_SECONDS)/(HOLD_SECONDS/2);
      if (!reduced.matches && wavePhase >= 0 && wavePhase < 2) {
        const waveTime = wavePhase % 1;
        const startRadius = model.envelopeRadius*height/(model.camera.top-model.camera.bottom)+2*scale;
        const endRadius = Math.min(width,height)*.49;
        const expansion = 1-Math.pow(1-waveTime,3);
        const radius = startRadius+(endRadius-startRadius)*expansion;
        slot.context.save();
        slot.context.globalAlpha = .8*Math.pow(1-waveTime,2);
        slot.context.strokeStyle = '#c8f450';
        slot.context.lineWidth = 1.5*scale;
        slot.context.shadowColor = '#c8f450';
        slot.context.shadowBlur = 5*scale;
        slot.context.beginPath();
        slot.context.arc(width/2,height/2,radius,0,Math.PI*2);
        slot.context.stroke();
        slot.context.restore();
      }
      // Render a fully faded frame before restarting, without resetting rotation.
      if (slot.cycle >= CYCLE_SECONDS && moving) slot.cycle = 0;
    }
    dirty = false;
    if (moving) schedule();
  }

  const intersection = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const slot = slots.find(item=>item.canvas === entry.target);
      slot.visible = entry.isIntersecting;
      if (slot.visible) void load(slot);
    }
    previous = 0; dirty = true; schedule();
    if (!slots.some(slot=>slot.visible)) { cancelAnimationFrame(frame); frame = 0; }
  });
  const resize = new ResizeObserver(entries => {
    for (const entry of entries) {
      const slot = slots.find(item=>item.canvas === entry.target);
      slot.width = entry.contentRect.width; slot.height = entry.contentRect.height;
    }
    dirty = true; schedule();
  });
  const invalidate = () => { dirty = true; previous = 0; schedule(); };
  const theme = new MutationObserver(invalidate);
  const visibility = () => {
    cancelAnimationFrame(frame); frame = 0; previous = 0;
    if (!document.hidden) invalidate();
  };
  const contextLost = event => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; };
  const contextRestored = () => { lost = false; invalidate(); };
  renderer.domElement.addEventListener('webglcontextlost',contextLost);
  renderer.domElement.addEventListener('webglcontextrestored',contextRestored);
  slots.forEach(slot => { intersection.observe(slot.canvas); resize.observe(slot.canvas); });
  theme.observe(root,{ attributes: true, attributeFilter: ['class'] });
  reduced.addEventListener('change',invalidate);
  document.addEventListener('visibilitychange',visibility);
  return {
    pause(value) { paused = value; invalidate(); },
    dispose() {
      disposed = true; abort.abort(); cancelAnimationFrame(frame);
      intersection.disconnect(); resize.disconnect(); theme.disconnect();
      reduced.removeEventListener('change',invalidate); document.removeEventListener('visibilitychange',visibility);
      renderer.domElement.removeEventListener('webglcontextlost',contextLost);
      renderer.domElement.removeEventListener('webglcontextrestored',contextRestored);
      slots.forEach(slot => { slot.model?.dispose(); slot.context?.clearRect(0,0,slot.canvas.width,slot.canvas.height); });
      renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
