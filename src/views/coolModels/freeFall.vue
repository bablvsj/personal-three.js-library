<template>
  <div ref="canvasDom" class="canvas-container"></div>
  <div @click="drop" style="position:fixed;right:20px;top:60px;">button</div>
</template>

<script lang="ts" setup name="FreeFall">
/* eslint-disable */
import { ref, onMounted,onBeforeUnmount } from 'vue'
import Floors from '@/modules/Floors'
import * as THREE from 'three'
import gsap from 'gsap'
import Event from '@/modules/Viewer/Events'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import Stats from 'three/examples/jsm/libs/stats.module.js'

const canvasDom = ref(null)
let stat,
  ballMesh = null,
  ballRadius = 5,
  v = 0,
  a = -0.1,
  isMoving = false
const maxHeight = 100
//场景
const scene = new THREE.Scene()

//圆形
const geometryCircle = new THREE.SphereGeometry(5, 64, 32)
const materialCircle = new THREE.MeshStandardMaterial({
  color: 0x016ab7,
  side: THREE.FrontSide
})
ballMesh = new THREE.Mesh(
  new THREE.SphereGeometry(ballRadius, 64, 32),
  new THREE.MeshLambertMaterial({
    color: 0xffff00
  })
)
ballMesh.position.set(20, 100, 20)

scene.add(ballMesh)

//渲染器
const renderer = new THREE.WebGLRenderer({ antialias: false }) //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
//镜头
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(100, 400, 100) //镜头视角点设置
camera.lookAt(100, 200, 100)
const controls = new OrbitControls(camera, renderer.domElement)

//网格地面
const gridHelper = new THREE.GridHelper(200, 20)
scene.add(gridHelper)

const lightGroup = new THREE.Group()
//洒满灯光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 100)
scene.add(light)
const light2 = new THREE.DirectionalLight(0xffffff, 1)
light2.position.set(0, 0, -100)
scene.add(light2)
const light3 = new THREE.DirectionalLight(0xffffff, 1)
light3.position.set(100, 0, 0)
scene.add(light3)
const light4 = new THREE.DirectionalLight(0xffffff, 1)
light4.position.set(-100, 0, 0)
scene.add(light4)
const light5 = new THREE.DirectionalLight(0xffffff, 1)
light5.position.set(0, 100, 0)
scene.add(light5)

const light10 = new THREE.DirectionalLight(0xffffff, 1)
light5.position.set(0, -100, 0)
scene.add(light10)
const light6 = new THREE.DirectionalLight(0xffffff, 0.3)
light6.position.set(50, 100, 0)
scene.add(light6)
const light7 = new THREE.DirectionalLight(0xffffff, 0.3)
light7.position.set(0, 100, 50)
scene.add(light7)
const light8 = new THREE.DirectionalLight(0xffffff, 0.3)
light8.position.set(0, 100, -50)
scene.add(light8)
const light9 = new THREE.DirectionalLight(0xffffff, 0.3)
light9.position.set(-50, 100, 0)
scene.add(light9)

lightGroup.add(light, light2, light3, light4, light5, light6, light7, light8, light9)

scene.add(lightGroup)

const lightHelper = new THREE.DirectionalLightHelper(light3, 5, 0xffffff)

// lightHelper.add(light,light2,light3,light4,light5,light6,light7,light8,light9,light10)

scene.add(lightHelper)

scene.remove(light, light2, light3, light4, light5, light6, light7, light8, light9, light10)

// grou.visible = false

// mesh1.material.visible = false

// 渲染函数
const render = () => {
  //   ballMesh.rotateY(0.01)
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(render)
  draw()
}

const initStats = () => {
  stat = new Stats()
  stat.domElement.style.position = 'absolute'
  stat.domElement.style.right = '0px'
  stat.domElement.style.top = '60px'
  document.body.appendChild(stat.domElement)
}

const draw = () => {
  stat.begin()

  if (isMoving) {
    ballMesh.position.y += v
    v += a

    if (ballMesh.position.y <= ballRadius) {
      // hit plane
      v = -v * 0.9
    }

    if (Math.abs(v) < 0.001) {
      // stop moving
      isMoving = false
      ballMesh.position.y = ballRadius
    }
    console.log(v)
  }

//   ballMesh.rotation.y = (ballMesh.rotation.y + 0.01) % (Math.PI * 2)
  renderer.render(scene, camera)

  stat.end()
}

const drop = () => {
  isMoving = true
  ballMesh.position.y = maxHeight
  v = 0
}

onMounted(() => {
    initStats()
  //渲染
  canvasDom.value?.appendChild(renderer.domElement)
  // 设置背景颜色并启用透明度
  renderer.setClearColor(0xffc0cb, 0.5)
  render()
})

// onBeforeUnmount(()=>{
//     // stat?.close()
// })

</script>

<style scoped>
#three {
  height: 100%;
  width: 100%;
}
</style>
