<template>
  <canvas id="stage" class="w-screen h-screen bg-rose-200"></canvas>
</template>

<script setup lang="ts">
import {
  Scene,
  OrthographicCamera,
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
import {
  loadMTL,
  loadOBJ,
  loadFBX,
  loadTexture,
  getToonMaterial,
} from "../utils";
import { onMounted, ref } from "vue";

let scene: Scene,
  camera: OrthographicCamera,
  renderer: WebGLRenderer,
  controls: OrbitControls,
  effect: OutlineEffect;

const init = () => {
  const canvas = document.querySelector("#stage") as HTMLCanvasElement;
  scene = new Scene();
  scene.background = new Color(0xaaaaaa);

  // camera = new PerspectiveCamera(
  //   75,
  //   window.innerWidth / window.innerHeight,
  //   0.1,
  //   1000
  // );
  camera = new OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2
  );
  camera.position.set(200, 100, 200);
  scene.add(camera);

  renderer = new WebGLRenderer({
    canvas,
    // antialias: true,
    logarithmicDepthBuffer: true,
  });
  // renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new OrbitControls(camera, canvas);
  // controls.minDistance = 3;
  // controls.maxDistance = 12;

  effect = new OutlineEffect(renderer);
};

const addLights = () => {
  const light = new THREE.AmbientLight(0xaaaaaa);
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  directionalLight.position.set(-2, 2, 2);
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
const addModel = async () => {
  // @note: obj + mtl
  // const texture = await loadTexture("/maps/avatar.png");
  // console.log("texture", texture);
  // const material = await loadMTL("/materials/bainv.mtl");
  // console.log("avatar.mtl", material);
  // material.preload();
  // material.materials.default.map = texture;
  // const mesh = await loadOBJ("/models/bainv.obj", material);
  // console.log("avatar.obj", mesh);
  // mesh.scale.set(0.01, 0.01, 0.01);
  // mesh.rotateY(Math.PI);
  // scene.add(mesh);

  // @note: fbx
  // const mesh = await loadFBX("/models/avatar.fbx");
  // console.log("mesh", mesh);
  // mesh.scale.set(0.01, 0.01, 0.01);
  // scene.add(mesh);

  // @note: obj + custom material
  const mesh = await loadOBJ("/models/billie3.obj");
  mesh.scale.set(3, 3, 3);
  mesh.rotateY(Math.PI);
  mesh.traverse(async (item) => {
    if (item instanceof Mesh) {
      console.log(item.name, item);

      let material;
      switch (item.name) {
        case "Retopo_hair":
          material = getToonMaterial(0xc8c8c8);
          break;
        case "eye":
          material = getToonMaterial(
            0xffffff,
            await loadTexture("/maps/eyes.png")
          );
          break;
        case "face":
          material = getToonMaterial(
            0xffffff,
            await loadTexture("/maps/avatar.png")
          );
          break;
        case "Cube.1":
          material = getToonMaterial(
            0xffffff,
            await loadTexture("/maps/headphone.jpg")
          );
          break;
        case "neck":
          material = getToonMaterial(0xebbab8);
          break;
        case "rings":
          material = getToonMaterial(0x333333);
          break;
        case "lash":
          material = getToonMaterial(0x333333);
          break;
        default:
          material = getToonMaterial();
      }

      if (material) {
        item.material.dispose();
        item.material = material;
      }
    }
  });
  scene.add(mesh);
};

const animate = () => {
  requestAnimationFrame(animate);
  render();
};
const render = () => {
  controls.update();
  effect.render(scene, camera);
  // renderer.render(scene, camera);
};

onMounted(() => {
  init();
  addLights();
  // addGeometry();
  addModel();
  animate();
});
</script>
