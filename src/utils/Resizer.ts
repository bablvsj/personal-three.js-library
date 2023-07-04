import type { WebGLRenderer } from 'three';
class Resizer {
  constructor(container, camera, renderer: WebGLRenderer) {
    camera.aspect = container?.clientWidth / container?.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container?.clientWidth, container?.clientHeight);
    // renderer.setPiexlRatio(window.devicePixelRatio);
  }
}

export { Resizer };
