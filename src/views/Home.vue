<template>
  <div class="main" style="height: 100vh; width: 100vw">
    <div
      @click="router.push('/')"
      style="
        color: rgb(179, 76, 76);
        position: absolute;
        cursor: pointer;
        padding: 20px;
        right: 0;
        bottom: 20px;
      "
    >
      <BirdButton></BirdButton>
    </div>
    <div id="three" ref="canvasRef" style="height: 100vh; width: 100vw"></div>
  </div>
</template>

<script lang="ts" setup name="SystemHome">
/* eslint-disable */
import { ref, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import BirdButton from '@/components/BirdButton/index.vue'
import Floors from '@/modules/Floors'
// import ModelLoader from '@/modules/ModelLoder';
import * as THREE from 'three'
import gsap from 'gsap'
import Event from '@/modules/Viewer/Events'

const router = useRouter()

let office: any = null
let oldOffice: any = null
let dataCenter: any = null
let oldDataCenter: any = null
let modelSelect = ['zuo0', 'zuo1', 'zuo2', 'zuo3', 'zuo4', 'zuo5']
let modelSelectName = ''
let modelMoveName = ''
let isModelSelectName = false

let container
let camera, scene, renderer
let uniforms, material, mesh
let mouseX = 0,
  mouseY = 0,
  lat = 0,
  lon = 0,
  phy = 0,
  theta = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2
let startTime = Date.now()
let clock = new THREE.Clock()

//1.顶点着色器源码
const VERTEX_SHADER_SOURCE = `
uniform float iGlobalTime;
  uniform vec2 iResolution;
  uniform vec4 iMouse;
  uniform float audio1;
  uniform sampler2D iChannel0;
  uniform sampler2D iChannel1;

  varying vec2 vUv; 
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
  }
    `
//2.片元着色器源码
const FRAGMENT_SHADER_SOURCE = `
    uniform float iGlobalTime;
uniform vec2 iResolution;
uniform vec4 iMouse;
uniform float audio1;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

#define R(p, a) p = p * cos(a) + vec2(-p.y, p.x) * sin(a)
#define time iGlobalTime*0.1
#define tau 6.2831853

mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}
float noise( in vec2 x ){return texture2D(iChannel0, x*.01).x;}
mat2 m2 = mat2( .80,  0.60, -0.80,  0.80 );

float grid(vec2 p)
{
  float s = sin(p.x)*cos(p.y);
  return s;
}

float flow(in vec2 p)
{
  float z=4.;
  float rz = 0.;
  vec2 bp = p;
  for (float i= 1.;i < 7.;i++ )
  {
    bp += time*1.5;
    vec2 gr = vec2(grid(p*3.-time*2.),grid(p*3.+4.-time*2.))*0.4;
    gr = normalize(gr)*0.4;
    gr *= makem2((p.x+p.y)*.3+time*10.);
    p += gr*0.5;

    rz+= (sin(noise(p)*2.)*0.5+0.5) /z;

    p = mix(bp,p,.5);
    z *= 1.7;
    p *= 2.5;
    p*=m2;
    bp *= 2.5;
    bp*=m2;
  }
  return rz;
}

float spiral(vec2 p,float scl)
{
  float r = length(p);
  r = log(r);
  float a = atan(p.y, p.y);
  return abs(mod(scl*(r-2./scl*a),tau)-1.)*1.;
}


float Sin01(float t, vec2 p) {
    return .5 + cos(t)*p.y*4.5 * sin(6.28319 * t) * p.x * p.y;
}

float SineEggCarton(vec3 p) {
    return .1 + abs(sin(p.x) - cos(p.y) + sin(p.z)) * 1.2;
}


float Map(vec3 p, float scale) {
    float dSphere = length(p) - 1.0;
    return max(dSphere, (.85 - SineEggCarton(scale * p)) / scale);
}

vec3 GetColor(vec3 p) {
    float amount = clamp((1.5 - length(p)) / 2.0, 0.0, 1.0);
    vec3 col = 0.5 + 0.5 * cos(6.28319 * (vec3(0.2, 0.0, 0.0) + amount * (audio1*.6) * vec3(1.0, 1.0, 0.5)));
    return col * amount;
}

void main() {


  vec2 p = gl_FragCoord.xy / iResolution.xy-0.5;
  p.x *= iResolution.x/iResolution.y;
  p*= 1.;
  p.y-=.15;
  float rz = flow(p);
  p /= exp(mod(2.1,2.1));
  rz *= (3.8-spiral(p,.5))*5.5 * audio1; // intensity / thickness of ring
  vec3 col = vec3(.02,0.04,0.09)/rz; // colors
  col=pow(abs(col),vec3(1.01));
  //gl_FragColor = vec4(col,1.0);


  p = gl_FragCoord.xy / iResolution.xy-0.5;
  p.x *= iResolution.x/iResolution.y;
  p*= 1.;
  p.y+=.8;
  rz = flow(p);
  p /= exp(mod(2.1,2.1));
  rz *= (3.0-spiral(p,.5))*.9 * audio1; // intensity / thickness of ring
  col = vec3(.02,0.04,0.09)/rz; // colors
  col=pow(abs(col),vec3(1.01));
  gl_FragColor+= vec4(col,1.0);




  vec3 rd = normalize(vec3(2.0 * gl_FragCoord.xy - iResolution.xy, -iResolution.y));
    vec3 ro = vec3(0.0, 0.0, mix(2.5, 2.0, Sin01(0.05 * iGlobalTime,p)));
    R(rd.xz, 0.2 * iGlobalTime);
    R(ro.xz, 0.2 * iGlobalTime);
    R(rd.yz, 0.1 * iGlobalTime);
    R(ro.yz, 0.1 * iGlobalTime);
    float t = 0.0;
   // gl_FragColor.rgb = vec3(0.0);
    float scale = mix(3.5, 40.0, Sin01(0.068 * iGlobalTime*.02,p/iGlobalTime));
    for (int i = 0; i < 64; i++) {
        vec3 p = ro + t * rd;
        float d = Map(p, scale);
        if (t > 5.0 || d < 0.001) {
            //break;
            gl_FragColor.rgb -= 0.05 * GetColor(p) * (audio1*.6);
            break;
        }
        t += 0.8 * d;
        gl_FragColor.rgb += 0.05 * GetColor(p) * (audio1*.6);
    }
}`

const init = () => {
  container = document.getElementById('three')
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000)
  camera.position.z = 1
  scene = new THREE.Scene()

  uniforms = {
    iGlobalTime: { type: 'f', value: 10000.0 },
    audio1: { type: 'f', value: 0.0 },
    iResolution: { type: 'v2', value: new THREE.Vector2() }
  }

  material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: VERTEX_SHADER_SOURCE,
    fragmentShader: FRAGMENT_SHADER_SOURCE
  })

  let geometry = new THREE.PlaneGeometry(1, 1)
  let mesh = new THREE.Mesh(geometry, material)
  mesh.scale.x = window.innerWidth
  mesh.scale.y = window.innerHeight

  scene.add(mesh)

  renderer = new THREE.WebGLRenderer()
  container.appendChild(renderer.domElement)
  uniforms.iResolution.value.x = window.innerWidth
  uniforms.iResolution.value.y = window.innerHeight
  renderer.setSize(window.innerWidth, window.innerHeight)
}
const animate = () => {
  requestAnimationFrame(animate)
  render()
}

const render = () => {
  uniforms.iGlobalTime.value += clock.getDelta()
  if (dataArray) {
    analyser.getByteTimeDomainData(dataArray)
    let v = dataArray[0] / 48.0
    uniforms.audio1.value = v
  } else {
    uniforms.audio1.value = 1.0
    uniforms.audio1.value = 128.0 / 48.0 + Math.random() * 0.1
  }
  renderer.render(scene, camera)
}

onMounted(() => {
  init()
  animate()
})

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  ;(windowHalfX = window.innerWidth / 2),
    (windowHalfY = window.innerHeight / 2),
    (camera.aspect = window.innerWidth / window.innerHeight)
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

  uniforms.iResolution.value.x = window.innerWidth
  uniforms.iResolution.value.y = window.innerHeight
}

// AUDIO ////

// create am audio context, move this seperate file later

let audioCtx, analyser, bufferLength, dataArray

// window.addEventListener('load', initAudio, false);
// function initAudio() {
//   try {
//     // Fix up for prefixing
//     window.audioCtx = window.AudioContext||window.webkitAudioContext;
//     audioCtx = new AudioContext();
//     analyser = audioCtx.createAnalyser();
//   }
//   catch(e) {
//     alert('Web Audio API is not supported in this browser');
//   }
//
//
//   // load the audio file
//
//   // source = audioCtx.createBufferSource();
//   // let request = new XMLHttpRequest();
//   //
//   // request.open('GET', 'assets/beat.mp3', true);
//   //
//   // request.responseType = 'arraybuffer';
//   //
//   //
//   // request.onload = function() {
//   //   let audioData = request.response;
//   //   audioCtx.decodeAudioData(audioData, function(buffer) {
//   //       source.buffer = buffer;
//   //       source.connect(analyser);
//   //       analyser.connect(audioCtx.destination);
//   //       source.loop = true;
//   //       analyser.fftSize = 256;
//   //       bufferLength = analyser.frequencyBinCount;
//   //       dataArray = new Uint8Array(bufferLength);
//   //       analyser.getByteTimeDomainData(dataArray);
//   //       console.log(dataArray);
//   //     },
//   //     function(e){"Error with decoding audio data" + e.err});
//   // }
// }
</script>

<style scoped>
#three {
  height: 100%;
  width: 100%;
}
</style>
