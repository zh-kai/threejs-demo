<template>
  <canvas id="stage" class="w-screen h-screen bg-rose-200"></canvas>
</template>

<script setup lang="ts">
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshToonMaterial,
  Mesh,
  DataTexture,
  Color,
} from "three";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect";
import { onMounted, ref } from "vue";

let scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  controls: OrbitControls,
  effect: OutlineEffect;

const init = () => {
  const canvas = document.querySelector("#stage") as HTMLCanvasElement;
  scene = new Scene();
  scene.background = new Color(0xaaaaaa);

  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new OrbitControls(camera, canvas);
  controls.minDistance = 3;
  controls.maxDistance = 12;

  effect = new OutlineEffect(renderer);
};

const addLights = () => {
  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(2, 2, 2);
  scene.add(directionalLight);
};
const addGeometry = () => {
  // @note: material
  const colors = new Uint8Array(6);
  for (let c = 0, len = colors.length; c < len; c++) {
    colors[c] = (c / len) * 256;
  }
  const gradientMap = new DataTexture(
    colors,
    colors.length,
    1,
    THREE.RedFormat
  );
  gradientMap.needsUpdate = true;
  const material = new MeshToonMaterial({ color: 0xffff00, gradientMap });

  const geometry = new SphereGeometry(1, 24, 24);

  const cube = new Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;
};

const animate = () => {
  requestAnimationFrame(animate);
  render();
};
const render = () => {
  effect.render(scene, camera);
};

onMounted(() => {
  init();
  addLights();
  addGeometry();
  animate();
});
</script>
