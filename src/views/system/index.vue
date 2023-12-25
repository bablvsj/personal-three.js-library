<template>
  <div style="position: relative">
    <div
      ref="canvasDom"
      class="canvas-container"
      style="height: 800px; z-index: 1; position: relative"
    ></div>
    <!-- <div style="position: absolute;z-index:999;top:0;right: 0;cursor: pointer;font-size: 20px;margin:0 20px;"
            @click="exportCanvas">导出</div> -->
  </div>
</template>

<script lang="ts" setup name="SystemIndex">
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
import { startProgress, closeProgress } from '@/utils/nprogress'
import { TextureLoader } from 'three'

const canvasDom = ref(null)

let circle1, circle2, circleend, circleend1, circleend2,car;
const wheels = [],
  endWheels = []

//场景
const scene = new THREE.Scene()

//镜头
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.set(0, 200, 200) //镜头视角点设置
camera.lookAt(0, 0, 0)

const wlRed = new URL('@/assets/images/textTure/hardwood2.jpg', import.meta.url).href
const wlImg1 = new URL('@/assets/images/textTure/wenli_gray.jpg', import.meta.url).href
const wlImg2 = new URL('@/assets/images/textTure/wenli2.jpg', import.meta.url).href
const wlImg3 = new URL('@/assets/images/textTure/wenli3.jpg', import.meta.url).href

let textLoader = new THREE.TextureLoader()

let texture = textLoader.load(wlRed)


texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(6,1);

const geometry = new THREE.PlaneGeometry(1000, 10000, 500)
const material = new THREE.MeshLambertMaterial({
  color: 0xeeeeee,
  side: THREE.DoubleSide,
  map: texture
  
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
scene.rotateY(-Math.PI / 2)
mesh.rotateX(-Math.PI / 2)

//渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: false, //想把canvas画布上内容下载到本地，需要设置为true
  // preserveDrawingBuffer: true,
  logarithmicDepthBuffer: true // 设置对数深度缓冲区，优化深度冲突问题   当两个面间隙过小或重合时，对数深度缓冲区无效
})

renderer.setClearColor(0xcccccc, 1)
renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, renderer.domElement)

const arrowKeys = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right'
}

let rotationX = 0.1

const handleKeydown = (event) => {
  if (arrowKeys[event.key]) {
    let keys = arrowKeys[event.key]

    if (keys == 'up') {
      rotationX = -1
    } else if (keys == 'down') {
      rotationX = 1
    } else {
      let isLeft = keys == 'left' ? -0.5 : 0.5
      rotationX = 0

      // wheels.rotation.y = isLeft
      // wheels.rotation.y = isLeft

      for (let i = 0; i < wheels.length; i++) {
      wheels[i].rotation.y += isLeft
    }
    }

    const time = -performance.now() / 1000

    for (let i = 0; i < wheels.length; i++) {
      wheels[i].rotation.x += rotationX
    }
    for (let i = 0; i < endWheels.length; i++) {
      endWheels[i].rotation.x -= rotationX
    }

    car.position.z -= rotationX
  }
}

// 渲染函数
const render = () => {
  // textureCube.colorSpace = THREE.SRGBColorSpace
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(render)
}

const addLight = () => {
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(0, 0, 100)
  const light2 = new THREE.DirectionalLight(0xffffff, 1)
  light2.position.set(0, 0, -100)
  const light3 = new THREE.DirectionalLight(0xffffff, 1)
  light3.position.set(100, 0, 0)
  const light4 = new THREE.DirectionalLight(0xffffff, 1)
  light4.position.set(-100, 0, 0)
  const light5 = new THREE.DirectionalLight(0xffffff, 1)
  light5.position.set(0, 100, 0)
  const light10 = new THREE.DirectionalLight(0xffffff, 1)
  light5.position.set(0, -100, 0)
  const light6 = new THREE.DirectionalLight(0xffffff, 0.3)
  light6.position.set(50, 100, 0)
  const light7 = new THREE.DirectionalLight(0xffffff, 0.3)
  light7.position.set(0, 100, 50)
  const light8 = new THREE.DirectionalLight(0xffffff, 0.3)
  light8.position.set(0, 100, -50)
  const light9 = new THREE.DirectionalLight(0xffffff, 0.3)
  light9.position.set(-50, 100, 0)
  scene.add(light, light2, light3, light4, light5, light6, light7, light8, light9, light10)
  // scene.add(light,light2)
}

const exportCanvas = () => {
  const link = document.createElement('a')
  const canvas = renderer.domElement //获取canvas对象
  link.href = canvas.toDataURL('image/png')
  // 通过超链接herf属性，设置要保存到文件中的数据
  link.download = 'threejs.png' //下载文件名
  link.click() //js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
}

const initModel = () => {
  //加载gltf模型
  const loader = new GLTFLoader()

  // ../../../public/models/porsche_911_930_turbo.glb
  loader.load(
    `src/assets/models/glb/mazdarx7.glb`,
    (gltf) => {
      const bmw = gltf.scene
      bmw.scale.set(20, 20, 20) //模型缩放
      scene.add(bmw) //将整个模型组添加到场景中
      car = scene.getObjectByName("Sketchfab_model")
      wheels.push(scene.getObjectByName('wheelFR001'), scene.getObjectByName('wheelFR'))

      endWheels.push(
        scene.getObjectByName('wheelRR001_bl004_0'),
        scene.getObjectByName('wheelRR001_chrome005_0'),
        scene.getObjectByName('wheelRR001_tire004_0')
      )
    },
    (xhr) => {
      const percent = xhr.loaded / xhr.total

      if (percent == 1) closeProgress()
      // console.log('加载进度' + percent);
    }
  )
}

window.onresize = function () {
  const width = window.innerWidth //canvas画布高度
  const height = window.innerHeight //canvas画布宽度
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

onMounted(() => {
  startProgress()
  initModel()
  addLight()
  canvasDom?.value.appendChild(renderer.domElement)
  render()

  window.addEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
#three {
  height: 100%;
  width: 100%;
}
</style>
