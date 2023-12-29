<template>
  <div ref="canvasDom"  class="canvas-container"></div>
  <div style="position:absolute;top:60px;right:20px;display:flex;width:40px;justify-content:space-between;">
    <FullscreenOutlined class="cursor-point" />
    <FullscreenExitOutlined class="cursor-point" />
  </div>
</template>

<script lang="ts" setup name="GroupCar">
/* eslint-disable */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import gsap from 'gsap'

//场景
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true }) //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)

const aspectRatios = {
  large: 9 / 21,
  middle: 9 / 16,
  normal: 1 / 1,
  small: 16 / 9
}

// 正交相机和透视相机不同的地方在于，正交相机(OrthographicCamera)没有透视效果。无论距离多远，物体在正交相机中总会呈现相同的大小

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(20, 100, 300) //镜头视角点设置
camera.lookAt(0, 20, 100)
const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry(15, 30, 5)
const materialBody = new THREE.MeshNormalMaterial()

const carGroup = new THREE.Group()
const carBody = new THREE.Mesh(geometry, materialBody)

// 轮胎
const carTireGroup1 = new THREE.Group()
const geometryHub = new THREE.BoxGeometry(2, 5, 5)
const materialHub = new THREE.MeshBasicMaterial({
  color: 0xff0000
})
const carHub = new THREE.Mesh(geometryHub, materialHub)
carTireGroup1.add(carHub)
carTireGroup1.position.set(-9, 8, 0)

const carTireGroup2 = carTireGroup1.clone()
const carTireGroup3 = carTireGroup1.clone()
const carTireGroup4 = carTireGroup1.clone()
carTireGroup2.position.set(-9, -8, 0)
carTireGroup3.position.set(9, 8, 0)
carTireGroup4.position.set(9, -8, 0)

// 轮胎花纹
const circle = new THREE.Group()
let n = 15
for (let i = 0; i < n; i++) {
  let r = 4
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 2),
    new THREE.MeshBasicMaterial({
      color: 0xeef900
    })
  )
  mesh.position.x = r * Math.cos(((Math.PI * 2) / n) * i)
  mesh.position.y = r * Math.sin(((Math.PI * 2) / n) * i)
  circle.add(mesh)
}
circle.rotateY(0.5 * Math.PI)

const circle1 = circle.clone()
const circle2 = circle.clone()
const circle3 = circle.clone()

carTireGroup1.add(circle)
carTireGroup2.add(circle1)
carTireGroup3.add(circle2)
carTireGroup4.add(circle3)

carGroup.add(carBody, carTireGroup1, carTireGroup2, carTireGroup3, carTireGroup4)
scene.add(carGroup)

// gsap.to(carGroup.position, { duration: 2, delay: 1, x: 210 })

// 渲染函数
const clock = new THREE.Clock()
const render = () => {
  const time = clock.getElapsedTime() // 返回已经过去的时间, 以秒为单位
  let time2 = time * 5
  carTireGroup1.rotation.x = time2
  carTireGroup2.rotation.x = time2
  carTireGroup3.rotation.x = time2
  carTireGroup4.rotation.x = time2
  carGroup.position.y = ((time * 60) % 250) - 150

  // carGroup.rotation.y = time * Math.PI * 2 // 一秒自传一圈
  // carGroup.position.y = Math.sin(time2) * 10 // 立方体以sin函数上下移动
  // carGroup.position.x = Math.cos(time2) * 10 // 立方体以cos函数左右移动, x,y组合起来呈圆形环绕

  // camera.position.y = Math.sin(time) * 5
  // camera.position.x = Math.cos(time)  * 5
  // camera.lookAt(carGroup.position)

  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(render)
}

onMounted(() => {
  canvasDom.value?.appendChild(renderer.domElement)
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
