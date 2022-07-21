import { Group, TextureLoader, Texture } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export function loadTexture(path: string) {
  const loader = new TextureLoader();
  return new Promise<Texture>((resolve, reject) => {
    loader.load(path, (texture) => resolve(texture));
  });
}

export function loadOBJ(path: string, material?: MTLLoader.MaterialCreator) {
  const objLoader = new OBJLoader();
  if (material) {
    objLoader.setMaterials(material);
  }
  return new Promise<Group>((resolve, reject) => {
    objLoader.load(path, (mesh) => resolve(mesh));
  });
}

export function loadMTL(path: string) {
  const mtlLoader = new MTLLoader();
  return new Promise<MTLLoader.MaterialCreator>((resolve, reject) => {
    mtlLoader.load(path, (material) => resolve(material));
  });
}

export function loadFBX(path: string) {
  const fbxLoader = new FBXLoader();
  return new Promise<Group>((resolve, reject) => {
    fbxLoader.load(path, (mesh) => resolve(mesh));
  });
}
