import * as THREE from 'three';

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
    const bounds = geometry.boundingBox;
    const radius = Math.hypot(Math.max(Math.abs(bounds.min.x),Math.abs(bounds.max.x)),Math.max(Math.abs(bounds.min.z),Math.abs(bounds.max.z)));
    const clip = new THREE.Plane(new THREE.Vector3(0,-1,0), bounds.max.y+.001);
    const material = new THREE.MeshPhysicalMaterial({ color: '#20abe2', metalness: .88, roughness: .22, clearcoat: .35, clippingPlanes: [clip] });
    const wireGeometry = new THREE.WireframeGeometry(geometry);
    const wireMaterial = new THREE.LineBasicMaterial({ color: '#1559e8', transparent: true, opacity: .14, clippingPlanes: [clip] });
    const contourGeometry = new THREE.BufferGeometry();
    // Upload all contours once; each frame only changes a draw range.
    contourGeometry.setAttribute('position', new THREE.BufferAttribute(lines,3));
    contourGeometry.setDrawRange(0,0);
    const contourMaterial = new THREE.LineBasicMaterial({ color: '#c8f450' });
    const contour = new THREE.LineSegments(contourGeometry,contourMaterial);
    const group = new THREE.Group();
    group.add(new THREE.Mesh(geometry,material), new THREE.LineSegments(wireGeometry,wireMaterial), contour);
    const scene = new THREE.Scene();
    scene.add(group,new THREE.HemisphereLight('#ffffff','#041127',2.2));
    const light = new THREE.DirectionalLight('#20abe2',4); light.position.set(4,8,6); scene.add(light);
    const rim = new THREE.PointLight('#1559e8',22,20); rim.position.set(-5,4,-3); scene.add(rim);
    const camera = new THREE.OrthographicCamera(-4,4,4,-4,.1,100);
    camera.position.set(10,8.5,13); camera.lookAt(0,0,0); camera.updateMatrixWorld();
    // Fit all possible rotations, not just the initial pose, so tops never crop.
    const corners = [];
    for (const x of [-radius,radius]) for (const y of [bounds.min.y,bounds.max.y]) for (const z of [-radius,radius]) corners.push(new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse));
    const minX = Math.min(...corners.map(p=>p.x)), maxX = Math.max(...corners.map(p=>p.x));
    const minY = Math.min(...corners.map(p=>p.y)), maxY = Math.max(...corners.map(p=>p.y));
    return {
      scene, camera, group, clip, contour, contourGeometry, contourMaterial, heights, offsets,
      fit(aspect) {
        const halfH = Math.max((maxY-minY)/2,(maxX-minX)/2/aspect)*1.08;
        camera.left = (minX+maxX)/2-halfH*aspect; camera.right = (minX+maxX)/2+halfH*aspect;
        camera.top = (minY+maxY)/2+halfH; camera.bottom = (minY+maxY)/2-halfH;
        camera.updateProjectionMatrix();
      },
      dispose() { [geometry,wireGeometry,contourGeometry,material,wireMaterial,contourMaterial].forEach(resource=>resource.dispose()); },
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
    const dark = root.classList.contains('dark');
    for (const slot of slots) {
      if (!slot.visible || !slot.model || !slot.width || !slot.height) continue;
      const model = slot.model;
      if (moving) { slot.elapsed += delta; slot.cycle += delta; }
      const progress = reduced.matches ? 1 : Math.min(1,slot.cycle/12);
      const layer = Math.min(159,Math.floor(progress*160));
      model.clip.constant = model.heights[layer];
      model.group.rotation.y = -slot.elapsed*Math.PI*2/24;
      model.contour.visible = !reduced.matches && progress < 1;
      model.contourMaterial.color.set(dark ? '#c8f450' : '#1559e8');
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
      slot.context.drawImage(renderer.domElement,0,0);
      // The completed top is rendered once; rebuilding starts on the next frame.
      if (progress === 1 && moving) slot.cycle = 0;
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
