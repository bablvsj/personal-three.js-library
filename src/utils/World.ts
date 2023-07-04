/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createCamera
} from "./camera";
import { 
  createCube
} from "./cube";
import {
  createScene
} from "./scene";
import {
  createRenderer
} from "./renderer";
import {
  Resizer
} from "./Resizer";

let camera, renderer, scene;


class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    container.append(renderer.domElement);
    const cube = createCube();
    scene.add(cube);

    const resizer = new Resizer(container, camera, renderer);

  }
  render() {
    renderer.render(scene, camera);
  }
}

export {
  World
// eslint-disable-next-line eol-last
};