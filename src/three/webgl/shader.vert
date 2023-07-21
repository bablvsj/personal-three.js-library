  uniform float iGlobalTime;
  uniform vec2 iResolution;
  uniform vec4 iMouse;
  uniform float audio1;
  uniform sampler2D iChannel0;
  uniform sampler2D iChannel1;

  letying vec2 vUv; 
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
  }