// Offline geometry preparation: visitors download meshes/slices, never calculate them.
// These are illustrative parts, not production-ready engineering CAD.
import * as THREE from 'three';
import { mkdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

function hole(shape, x, y, radius) {
  const path = new THREE.Path();
  path.absarc(x, y, radius, 0, Math.PI * 2, true);
  shape.holes.push(path);
}
function extrude(shape, depth, segments = 32) {
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: segments });
}
function disk(radius, bore, depth) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
  if (bore) hole(shape, 0, 0, bore);
  return extrude(shape, depth, 48).rotateX(-Math.PI / 2);
}
function combine(items) {
  const positions = [], normals = [];
  for (const original of items) {
    const g = original.index ? original.toNonIndexed() : original;
    positions.push(...g.attributes.position.array);
    normals.push(...g.attributes.normal.array);
    g.dispose();
    if (g !== original) original.dispose();
  }
  const result = new THREE.BufferGeometry();
  result.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  result.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  return result.center();
}
function bracket() {
  const foot = new THREE.Shape();
  foot.moveTo(-1.9, -.95); foot.lineTo(1.9, -.95); foot.lineTo(1.9, .95); foot.lineTo(-1.9, .95); foot.closePath();
  for (const x of [-1.35, 1.35]) for (const y of [-.5, .5]) hole(foot, x, y, .18);
  const upright = new THREE.Shape();
  upright.moveTo(-1.05, .22); upright.lineTo(-.9, 2.65); upright.bezierCurveTo(-.9, 3.85, .9, 3.85, .9, 2.65); upright.lineTo(1.05, .22); upright.closePath();
  hole(upright, 0, 2.72, .49);
  const rib = new THREE.Shape();
  rib.moveTo(0, .22); rib.lineTo(.84, .22); rib.lineTo(0, 2.1); rib.closePath();
  return combine([
    extrude(foot, .28, 24).rotateX(-Math.PI / 2),
    extrude(upright, .48).translate(0, 0, -.24),
    ...[-1, 1].map(side => extrude(rib, .14).rotateY(side * Math.PI / 2).translate(side * .65, 0, 0)),
  ]);
}
function flange() {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 1.9, 0, Math.PI * 2, false); hole(shape, 0, 0, .61);
  for (let i = 0; i < 6; i++) hole(shape, 1.43 * Math.cos(i * Math.PI / 3), 1.43 * Math.sin(i * Math.PI / 3), .2);
  const neck = new THREE.LatheGeometry([[.61,.35],[1.14,.35],[1.08,.57],[.9,.86],[.85,2.7],[.97,2.74],[.97,2.95],[.61,2.95],[.61,.35]].map(([x,y]) => new THREE.Vector2(x,y)), 64);
  return combine([extrude(shape, .36, 40).rotateX(-Math.PI / 2), neck]);
}
function impeller() {
  const hub = new THREE.LatheGeometry([[.3,.17],[.88,.17],[.8,.45],[.55,1.25],[.48,1.65],[.3,1.65],[.3,.17]].map(([x,y]) => new THREE.Vector2(x,y)), 48);
  const blades = [];
  for (let i = 0; i < 8; i++) {
    const blade = new THREE.Shape();
    blade.moveTo(.47,-.03); blade.bezierCurveTo(.94,-.28,1.63,-.16,1.9,.66); blade.lineTo(1.8,.72); blade.bezierCurveTo(1.5,.02,.94,-.12,.5,.1); blade.closePath();
    blades.push(extrude(blade,.95,24).rotateX(-Math.PI/2).rotateY(i*Math.PI/4).translate(0,.17,0));
  }
  // The annular disc is part of the impeller itself, not a display pedestal.
  return combine([disk(1.95,.3,.18), hub, ...blades]);
}
function gear() {
  const shape = new THREE.Shape();
  for (let i = 0; i < 18; i++) for (const [offset,r] of [[0,1.68],[.22,1.98],[.65,1.98],[.87,1.68]]) {
    const angle = (i+offset)*Math.PI*2/18, x = r*Math.cos(angle), y = r*Math.sin(angle);
    if (i === 0 && offset === 0) shape.moveTo(x,y); else shape.lineTo(x,y);
  }
  shape.closePath(); hole(shape,0,0,.36);
  for (let i = 0; i < 6; i++) hole(shape,1.14*Math.cos(i*Math.PI/3),1.14*Math.sin(i*Math.PI/3),.27);
  return combine([extrude(shape,.64,28).rotateX(-Math.PI/2), disk(.66,.36,1.25)]);
}

const directory = new URL('../public/manufacturing/', import.meta.url);
await mkdir(directory, { recursive: true });
for (const [name, create] of Object.entries({ bracket, flange, impeller, gear })) {
  const geometry = create();
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  const positions = geometry.attributes.position.array;
  const triangles = [];
  for (let i = 0; i < positions.length; i += 9) {
    const vertices = [0,3,6].map(j => new THREE.Vector3().fromArray(positions,i+j));
    triangles.push({ vertices, min: Math.min(...vertices.map(v=>v.y)), max: Math.max(...vertices.map(v=>v.y)) });
  }
  const contours = [], offsets = [0], heights = [];
  for (let layer = 0; layer < 160; layer++) {
    const height = min.y-.001+(layer+1)/160*(max.y-min.y+.002);
    const y = Math.min(height, max.y-.00001);
    heights.push(height);
    for (const triangle of triangles) {
      if (y < triangle.min || y > triangle.max) continue;
      const hits = [];
      for (let j = 0; j < 3; j++) {
        const a = triangle.vertices[j], b = triangle.vertices[(j+1)%3];
        if ((a.y<=y && b.y>y) || (b.y<=y && a.y>y)) hits.push(a.clone().lerp(b,(y-a.y)/(b.y-a.y)));
      }
      if (hits.length === 2 && hits[0].distanceToSquared(hits[1]) > 1e-12) {
        // Height is already stored once per layer; only encode x/z per vertex.
        for (const point of hits) contours.push(point.x,point.z);
      }
    }
    offsets.push(contours.length);
  }
  // v2: uint32 header, quantized mesh/normals, float32 heights, uint32 offsets,
  // quantized contours. 1/8191-unit precision is ample for a decorative background.
  const bytes = array => Buffer.from(array.buffer, array.byteOffset, array.byteLength);
  const quantize = (array, scale) => Int16Array.from(array, value => Math.round(value*scale));
  const data = Buffer.concat([
    bytes(new Uint32Array([2, positions.length, heights.length, contours.length])),
    bytes(quantize(positions,8191)), bytes(quantize(geometry.attributes.normal.array,32767)),
    bytes(new Float32Array(heights)), bytes(new Uint32Array(offsets)), bytes(quantize(contours,8191)),
  ]);
  const compressed = gzipSync(data, { level: 9 });
  await writeFile(new URL(`${name}.bin.gz`, directory), compressed);
  console.log(`${name}: ${compressed.byteLength} download bytes, ${positions.length/9} triangles, ${heights.length} layers`);
  geometry.dispose();
}
