<!-- eslint-disable indent -->

<template>
  <div ref="canvasDom" id="EightC" style="height: 800px"></div>
  <div style="position: absolute;left:100px;top:100px;" id="ar-button">{{ btnText }}</div>
</template>

<script setup name="EightC">
/* eslint-disable */

import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {colors } from "@/utils/color.ts"

let scene, renderer, camera, stats
let model, skeleton, mixer, clock

const crossFadeControls = []

let idleAction, walkAction, runAction
let idleWeight, walkWeight, runWeight
let actions, settings

let singleStepMode = false
let sizeOfNextStep = 0
const btnText = ref("开始")

const init = () => {
  const container = document.getElementById('EightC')


}

const initialize = async () => {
      const arButton = document.querySelector('#ar-button')

      // 确保浏览器支持 WebXR
      const supported = navigator.xr && await navigator.xr.isSessionSupported('immersive-ar')

      console.log(supported)
      if (!supported) {
          btnText.value = 'Not Supported WebXR'
        arButton.disabled = true
        return;
      }

      const palette = colors[Math.floor(Math.random() * colors.length)]
      // console.log(palette)

      const w = window.innerWidth
      const h = window.innerHeight

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera()
      // camera.position.set(2, 2, -2);

      const renderer = new THREE.WebGLRenderer({ alpha: true })
      renderer.setSize(w, h)
      renderer.setPixelRatio(window.devicePixelRatio)
      document.body.appendChild(renderer.domElement)

      const vertex = /* GLSL */ `
        uniform float uTime;

        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vInstanceColor;

        attribute float aRandom;


        float PI = 3.141592653589793238;
        // const float PI = 3.141592653589793238;

        void main() {
          vUv = uv;
          vPosition = position;
          vInstanceColor = instanceColor;

          // vec3 newPos = position * aRandom;
          vec3 newPos = position * abs(sin(position.x * 10.0 + position.y * 10.0 + position * 10.0 + uTime / 4.0));

          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(newPos, 1.0);
        }
      `

      const fragment = /* GLSL */ `
        uniform float uTime;

        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vInstanceColor;

        float PI = 3.141592653589793238;
        // const float PI = 3.141592653589793238;

        void main() {
          // gl_FragColor = vec4(1., 0., 0.0, 1.0);
          // gl_FragColor = vec4(vUv, 0.0, 1.0);
          gl_FragColor = vec4(vInstanceColor, 1.0);
        }
      `

      // WebXR 里 1 unit length = 现实中 1 米
      const size = 0.05 // 0.06
      const geometry = new THREE.BoxGeometry(size, size, size)
      // // const geometry = new THREE.SphereGeometry(0.06)
      // const material = new THREE.MeshBasicMaterial({ color: 0xff00ff})
      // const mesh = new THREE.Mesh(geometry, material)
      // mesh.rotation.set(-Math.PI / 2, 0, 0)
      // // mesh.position.set(0, 0, -0.3)
      // mesh.position.set(0, 0, -1)
      // scene.add(mesh)

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
      });

      const meshes = []
      const count = 10
      const mesh = new THREE.InstancedMesh(geometry, material, count ** 3)

      const random = new Float32Array(count ** 3);

      const matrix = new THREE.Matrix4()
      // const color = new THREE.Color()

      let i = 0
      for (let x = 0; x < count; x++) {
        for (let y = 0; y < count; y++) {
          for (let z = 0; z < count; z++) {
            matrix.setPosition((x - count / 2) * size, (y - count / 2) * size, (z - count / 2) * size)
            mesh.setMatrixAt(i, matrix)

            random[i] = Math.random();
            const color = new THREE.Color(palette[Math.floor(Math.random() * palette.length)])
            mesh.setColorAt(i, color)
            mesh.instanceColor.needsUpdate = true
            i++;
          }
        }
      }

      geometry.setAttribute(
        "aRandom",
        new THREE.InstancedBufferAttribute(random, 1)
      );

      scene.add(mesh);

      // for (let i = 0; i < count; i++) {
      //   for (let j = 0; j < count; j++) {
      //     const mesh = new THREE.Mesh(geometry, material);
      //     // mesh.position.x = i * 1.2 - count / 2;
      //     // mesh.position.z = j * 1.2 - count / 2;
      //     mesh.position.x = (i - count / 2) * (size * 1.2)
      //     mesh.position.z = (j - count / 2) * (size * 1.2)
      //     // 也可以先从 0.1 开始，通过 gsap stagger 渐次变成 1
      //     // mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1;
      //     scene.add(mesh);
      //     // meshes.push(mesh);
      //     meshes.push(mesh.scale);
      //   }
      // }

      // const tl = gsap.timeline({ repeat: -1, repeatDelay: 0, yoyo: true });
      // tl.to(meshes, {
      //   duration: 1,
      //   x: 0.5,
      //   y: 0.5,
      //   z: 0.5,
      //   stagger: {
      //     grid: [count, count],
      //     from: "center",
      //     amount: 1.5,
      //   },
      // });

      // const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
      // scene.add(light)

      // WebXR 需要用户交互才能开启，通过 button click 触发 start
      let currentSession = null
      const start = async () => {
        // currentSession = await navigator.xr.requestSession('immersive-ar')
        // 默认开始 webxr 时所有 html 元素都会消失，想现实在 ar 里需要设置下
        currentSession = await navigator.xr.requestSession('immersive-ar', {
          optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body }
        })

        // three.js 现在有内置 support webxr，需要通过 renderer.xr => Web XR manager 来工作
        renderer.xr.enabled = true

        // XR manager 会帮忙持续不断更新场景、相机的位置，然后渲染的物体能出现在锚定的物理世界里，作为开发人员只需要关注自己的 scene 就行
        // 当前物理世界的位置作为 AR 里虚拟世界的中心位置，还可以是 local floor 当前地面作为虚拟世界中心，不过可能这俩在 VR 里都有意义，在 AR 里只需 local 即可
        renderer.xr.setReferenceSpaceType('local')
        // three.js 没有 tracking 能力 需要 xr
        await renderer.xr.setSession(currentSession)

        arButton.textContent = 'End'

        let time = 0
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera)
          time += 0.05
          material.uniforms.uTime.value = time
        })
      }

      const end = async () => {
        currentSession.end()
        renderer.clear()
        renderer.setAnimationLoop(null)

        arButton.style.display = 'none'
      }

      arButton.addEventListener('click', () => {
        if (currentSession) {
          end()
        } else {
          start()
        }
      })
    }





onMounted(() => {
    console.log(colors)
  //   addLight()
  initialize()
})
</script>

<style scoped>
#three {
  height: 100%;
  width: 100%;
}
</style>
