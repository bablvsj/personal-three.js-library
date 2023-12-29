<template>
  <div ref="canvasDom" id="basicD" style="height: 800px"></div>
</template>

<script lang="ts" setup name="GroupCar">
/* eslint-disable */
import { ref, onMounted, onBeforeUnmount } from 'vue'
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

const sizes = {
    width: 800,
    height: 300
}

// 正交相机和透视相机不同的地方在于，正交相机(OrthographicCamera)没有透视效果。无论距离多远，物体在正交相机中总会呈现相同的大小

const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.1, 1000)
camera.position.set(20, 100, 300) //镜头视角点设置
camera.lookAt(0, 20, 100)
const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry(15, 30, 5)
const materialBody = new THREE.MeshNormalMaterial()

const carGroup = new THREE.Group()
const carBody = new THREE.Mesh(geometry, materialBody)

carGroup.add(carBody)
scene.add(carGroup)

//   gsap.to(carGroup.position, { duration: 2, delay: 1, x: 210 })

const cursor = { x: 0, y: 0 }

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = -(event.clientY / sizes.height - 0.5)
})
// 渲染函数
const clock = new THREE.Clock()
const render = () => {
  const time = clock.getElapsedTime() // 返回已经过去的时间, 以秒为单位
  let time2 = time * 5

  // carGroup.position.y = ((time * 60) % 250) - 150

  // carGroup.rotation.y = time * Math.PI * 2 // 一秒自传一圈
  // carGroup.position.y = Math.sin(time2) * 10 // 立方体以sin函数上下移动
  // carGroup.position.x = Math.cos(time2) * 10 // 立方体以cos函数左右移动, x,y组合起来呈圆形环绕

  // camera.position.y = Math.sin(time) * 5
  // camera.position.x = Math.cos(time)  * 5
  // camera.lookAt(carGroup.position)

//   camera.position.x = cursor.x * 10
//   camera.position.y = cursor.y * 10
//   camera.lookAt(new THREE.Vector3()) // mesh.position is also ok.

  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(render)
}


onMounted(() => {
  document.getElementById('basicD')?.appendChild(renderer.domElement)
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
