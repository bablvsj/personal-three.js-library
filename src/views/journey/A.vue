<template>
  <div ref="canvasDom" class="canvas-container"></div>
</template>

<script lang="ts" setup name="JourneyA">
/* eslint-disable */
import { ref, onMounted } from 'vue'
import Floors from '@/modules/Floors'
import * as THREE from 'three'
import gsap from 'gsap'
import Event from '@/modules/Viewer/Events'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

const canvasDom = ref(null)
//场景
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh1 = new THREE.Mesh(geometry, material)
mesh1.position.x = -50.5
const mesh2 = new THREE.Mesh(geometry, material)
const mesh3 = new THREE.Mesh(geometry, material)
mesh3.position.x = 50.5

const group = new THREE.Group()
group.add(mesh1)
group.add(mesh2)
group.add(mesh3)
scene.add(group)
group.scale.y = 2

/**
 * Camera
 */
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// camera.position.z = 3;
// scene.add(camera);
const axesHelper = new THREE.AxesHelper(20)
scene.add(axesHelper)

//渲染器
const renderer = new THREE.WebGLRenderer({ antialias: false }) //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
//镜头
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(0, 100, 200) //镜头视角点设置
camera.lookAt(0, 0, 0)
const controls = new OrbitControls(camera, renderer.domElement)

// const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true
controls.enableKeys = true
controls.keys = {
	LEFT: 'ArrowLeft', //left arrow
	UP: 'ArrowUp', // up arrow
	RIGHT: 'ArrowRight', // right arrow
	BOTTOM: 'ArrowDown' // down arrow
}

// controls.mouseButtons = {
//   LEFT: THREE.MOUSE.ROTATE,
//   MIDDLE: THREE.MOUSE.DOLLY,
//   RIGHT: THREE.MOUSE.PAN
// }

//网格地面
const gridHelper = new THREE.GridHelper(200, 20)
scene.add(gridHelper)
let x = 1

// 渲染函数
const render = () => {
  x++
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(render)

  group.rotation.y += 0.01

  gsap.to(group.position, { x: x % 100, duration: 1 })
}

const handleKeydown = (event) => {
  console.log(event.key + ": " + event.keyCode)
//   console.log(event.keyCode)
}

onMounted(() => {
  //渲染
  canvasDom.value?.appendChild(renderer.domElement)
  render()

//   window.addEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
#three {
  height: 100%;
  width: 100%;
}
</style>
