<template>
  <div ref="canvasDom" id="sevenD" style="height: 800px"></div>
</template>

<script lang="ts" setup name="GroupCar">
/* eslint-disable */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

import Event from '@/modules/Viewer/Events'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { Group } from '@tweenjs/tween.js'
// import { Group } from '@tweenjs/tween.js'
// import { Theme } from 'ant-design-vue'

const textLoader = new THREE.TextureLoader() // 文件加载器
//场景
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({ antialias: true }) //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(20, 100, 800) //镜头视角点设置
camera.lookAt(0, 20, 100)
const controls = new OrbitControls(camera, renderer.domElement)

const planeGeometry = new THREE.PlaneGeometry(500, 500)
const wlImg1 = new URL('@/assets/images/textTure/road.webp', import.meta.url).href
const texture1 = textLoader.load(wlImg1)


const plane = new THREE.Mesh(planeGeometry,new THREE.MeshBasicMaterial())

plane.material.map = texture1


const material = new THREE.MeshNormalMaterial()


const carGroup = new THREE.Group()

const frontTire = new THREE.Group()
const tireGeometry = new THREE.TorusGeometry(5, 0.6)
const tireGroup = new THREE.Group()
const tire1 = new THREE.Mesh(tireGeometry, material)
const frontCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 20), material)

let num = 5
for (let i = 0; i < num; i++) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 10), material)
  mesh.rotation.z = ((Math.PI * 2) / num) * i
  tireGroup.add(mesh)
}
tireGroup.add(tire1)
tireGroup.rotation.y = Math.PI / 2

const tireGroup2 = tireGroup.clone()
frontCylinder.rotation.z = Math.PI / 2
frontCylinder.position.x = 10
tireGroup2.position.x = 20
frontTire.add(tireGroup, frontCylinder, tireGroup2)
// frontTire.position.set(20, 10, 10)

const backTire = frontTire.clone()
backTire.position.y = 20

// 车身
const carBody = new THREE.Group()
const geometryBody = new THREE.BoxGeometry(15, 30, 4)
const carBodyMesh = new THREE.Mesh(geometryBody, material)
carBody.add(carBodyMesh)
carBody.position.set(10,10,0)

// 车顶
const carRoofG = new THREE.CylinderGeometry(12,12,15,3,1,false,-Math.PI/2,Math.PI)
const carRoof = new THREE.Mesh(carRoofG,material)
carRoof.rotation.z = -Math.PI / 2

carBody.add(carRoof)

carGroup.add(frontTire, backTire, carBody)

carGroup.position.z = 30
carGroup.position.y = 30
// carGroup.scale(2, 2, 2);
scene.add(carGroup,plane)

carGroup.rotateX(-Math.PI / 3)
// carGroup.rotate(-Math.PI / 3)


// 渲染函数
const clock = new THREE.Clock()
const render = () => {
  const time = clock.getElapsedTime()
  let time2 = time * 5
  backTire.rotation.x = time2
  frontTire.rotation.x = time2
  // carTireGroup3.rotation.x = time2
  // carTireGroup4.rotation.x = time2
  carGroup.position.y = (time * 30) % 250  - 200
  carGroup.position.z =  - (time * 30) % 100  + 110
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(render)
}

onMounted(() => {
  document.getElementById('sevenD')?.appendChild(renderer.domElement)
  // 设置背景颜色并启用透明度
  renderer.setClearColor(0xeeeeee, 1)
  render()
})
</script>

<style scoped>
#three {
  height: 100%;
  width: 100%;
}
</style>
