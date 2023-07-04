import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";

// eslint-disable-next-line eol-last
export function createCube(){
  const geometry = new BoxGeometry(5, 5, 5);
  const material = new MeshBasicMaterial();
  const cube = new Mesh(geometry, material);
  return cube;
// eslint-disable-next-line eol-last
};