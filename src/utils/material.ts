import {
  DataTexture,
  Texture,
  Color,
  Vector3,
  MeshToonMaterial,
  ShaderMaterial,
} from "three";
import * as THREE from "three";
import { toon_fragment, toon_vertex } from "../shaders/toon";

// @note: toon material
export function getToonMaterial(
  color = 0xffff00,
  map: Texture | null = null,
  deep = 2
) {
  const gradientColors = new Uint8Array(deep);
  for (let c = 0; c < deep; c++) {
    gradientColors[c] = (c / deep) * 256;
  }
  const gradientMap = new DataTexture(gradientColors, deep, 1, THREE.RedFormat);
  gradientMap.needsUpdate = true;
  return new MeshToonMaterial({ color, map, gradientMap });
  // return new ShaderMaterial({
  //   uniforms: {
  //     lightPosition: { value: new Vector3(200, 100, 200) },
  //   },
  //   vertexShader: toon_vertex,
  //   fragmentShader: toon_fragment,
  // });
}
