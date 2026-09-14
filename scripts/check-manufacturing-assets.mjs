import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';

for (const name of ['bracket','flange','impeller','gear']) {
  const file = await readFile(new URL(`../public/manufacturing/${name}.bin.gz`,import.meta.url));
  const bytes = gunzipSync(file);
  const buffer = bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
  const [version,count,layers,contours] = new Uint32Array(buffer,0,4);
  assert.equal(version,2); assert.equal(layers,160); assert.equal(count%9,0);
  assert.equal(buffer.byteLength,20+4*count+8*layers+2*contours);
  const positions = Float32Array.from(new Int16Array(buffer,16,count),value=>value/8191);
  const heights = new Float32Array(buffer,16+4*count,layers);
  const offsets = new Uint32Array(buffer,16+4*count+4*layers,layers+1);
  assert.equal(offsets[0],0); assert.equal(offsets[layers],contours);
  for (let i=0;i<layers;i++) {
    assert.ok(Number.isFinite(heights[i]));
    assert.ok(!i || heights[i] > heights[i-1]);
    assert.ok(offsets[i+1] >= offsets[i]);
    assert.equal((offsets[i+1]-offsets[i])%4,0);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3)); geometry.computeBoundingBox();
  const { min,max } = geometry.boundingBox;
  assert.ok(heights[159] > max.y,'Final slice must expose the complete top');
  const radius = Math.hypot(Math.max(Math.abs(min.x),Math.abs(max.x)),Math.max(Math.abs(min.z),Math.abs(max.z)));
  const camera = new THREE.OrthographicCamera(-4,4,4,-4,.1,100);
  camera.position.set(10,8.5,13); camera.lookAt(0,0,0); camera.updateMatrixWorld();
  const points=[];
  for (const x of [-radius,radius]) for (const y of [min.y,max.y]) for (const z of [-radius,radius]) points.push(new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse));
  const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x));
  const minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));
  for (const aspect of [.6,1,1.8]) {
    const halfH=Math.max((maxY-minY)/2,(maxX-minX)/2/aspect)*1.08;
    camera.left=(minX+maxX)/2-halfH*aspect;camera.right=(minX+maxX)/2+halfH*aspect;
    camera.top=(minY+maxY)/2+halfH;camera.bottom=(minY+maxY)/2-halfH;camera.updateProjectionMatrix();
    for (let turn=0;turn<24;turn++) for (let i=0;i<positions.length;i+=3) {
      const point=new THREE.Vector3().fromArray(positions,i).applyAxisAngle(new THREE.Vector3(0,1,0),-turn*Math.PI/12).project(camera);
      assert.ok(Math.abs(point.x)<1 && Math.abs(point.y)<1,`${name} cropped at aspect ${aspect}`);
    }
  }
  geometry.dispose();
  console.log(`${name}: 160 valid layers; complete top; full-rotation framing passes at mobile, square and desktop aspects`);
}
