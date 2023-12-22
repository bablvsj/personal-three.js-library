<!-- eslint-disable indent -->

<template>
  <div ref="canvasDom" class="canvas-container"></div>
</template>

<script setup name="Mechine">
/* eslint-disable */

import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { startProgress, closeProgress } from '@/utils/nprogress'

const canvasDom = ref(null)

let scene, renderer, camera, stats
let model, skeleton, mixer, clock

const crossFadeControls = []

let controls = ''

let idleAction, walkAction, runAction
let idleWeight, walkWeight, runWeight
let actions, settings
let hull_turbine, hull_turbine_line, blades_turbine_003, blades_turbine_003_line

let singleStepMode = false
let sizeOfNextStep = 0

let panel = ''

const lineGroup = new THREE.Group()

const init = () => {
  const axesHelper = new THREE.AxesHelper(100)
  const width = window.innerWidth,
    height = window.innerHeight
  const offset = 200

  camera = new THREE.OrthographicCamera(
    width / -offset,
    width / offset,
    height / offset,
    height / -offset,
    0.001,
    100000
  )
  camera.position.copy(new THREE.Vector3(0, 0, -3))

  camera.lookAt(0, 1, 0)

  clock = new THREE.Clock()
  scene = new THREE.Scene()
  const AmbientLight = new THREE.AmbientLight(0xffffff, 20)
  scene.add(AmbientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 40)
  directionalLight.position.copy(camera.position)
  scene.add(directionalLight)

  const loader = new GLTFLoader()

  loader.load(
    '/src/assets/models/gltf/mechine/turbine-01/scene.gltf',
    (gltf) => {
      let modelScene = gltf.scene
      console.log(modelScene)
      let sketchfabModel = modelScene.getObjectByName('Sketchfab_model')

      // gltf.scene.traverse((mesh) => {
      //   console.log(mesh)
      //   // changeModelMaterial(mesh, lineGroup)
      // })

      // sketchfabModel.traverse((mesh) => {
      //   console.log(mesh)
      //   changeModelMaterial(mesh, lineGroup)
      // })

      sketchfabModel.traverse(function (obj) {
        if (obj.isMesh) {
          // 模型边线设置
          const edges = new THREE.EdgesGeometry(obj.geometry);
          const edgesMaterial = new THREE.LineBasicMaterial({
              color: 0x00ffff,
          })
          const line = new THREE.LineSegments(edges, edgesMaterial);
          obj.add(line);
        }
      })

      // scene.add(sketchfabModel)


      // console.log('加载进度' + 1)
      scene.add(lineGroup)

      // closeProgress()

      scene.add(sketchfabModel)

      hull_turbine = scene.getObjectByName('hull_turbine')

      hull_turbine_line = lineGroup.getObjectByName('hull_turbine_line')

      // 涡轮的线
      blades_turbine_003 = scene.getObjectByName('blades_turbine_003')
      console.log(blades_turbine_003)
      blades_turbine_003_line = scene.getObjectByName('blades_turbine_003_line')

      console.log(hull_turbine)
      console.log(hull_turbine_line)

      // //创建控制面板
      // createPanel()
    },
    (xhr) => {
      const percent = xhr.loaded / xhr.total

      if (percent == 1) closeProgress()
      console.log('加载进度' + percent)
    }
  )

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  // renderer.shadowMap.enabled = true
  canvasDom.value.appendChild(renderer.domElement)

  // controls = new OrbitControls(camera, renderer.domElement)

  controls = new TrackballControls(camera, renderer.domElement)
  // controls.zoom = 100
  controls.rotateSpeed = 4.0
  controls.zoomSpeed = 1.2
  controls.panSpeed = 0.8

  controls.addEventListener('change', () => {
    // console.log(camera.position)
    // 灯光位置跟随镜头改变
    directionalLight.position.copy(camera.position)
  })

  controls.enableDamping = true //移动惯性
  // stats = new Stats()
  // canvasDom.value.appendChild(stats.dom)
  window.addEventListener('resize', onWindowResize)

  animate()
}

let color = new THREE.Color('#0fb1fb')

const meshMaterial = new THREE.MeshBasicMaterial({
  color: color,
  transparent: true,
  opacity: 0.3
})

const lineMaterial = new THREE.LineBasicMaterial({
  color: new THREE.Color(color),
  depthTest: true,
  transparent: true
})

const getLine = (object, thresholdAngle = 1, color = new THREE.Color('#ff0ff0'), opacity = 1) => {
  // 创建线条，参数为 几何体模型，相邻面的法线之间的角度，
  var edges = new THREE.EdgesGeometry(object.geometry, thresholdAngle)
  var line = new THREE.LineSegments(edges)
  lineMaterial.opacity = opacity
  line.material = lineMaterial
  return line
}

const changeModelMaterial = (object, lineGroup) => {
  const group = object
  if (group.isObject3D) {
    const lg = new THREE.Group()
    lineGroup.add(lg)
    lg.name = group.name + '_line'
    group.traverse((mesh) => {
      if (mesh.isMesh) {
        const quaternion = new THREE.Quaternion()
        const worldPos = new THREE.Vector3()
        const worldScale = new THREE.Vector3()
        // 获取四元数
        mesh.getWorldQuaternion(quaternion)
        // 获取位置信息
        mesh.getWorldPosition(worldPos)
        // 获取缩放比例
        mesh.getWorldScale(worldScale)

        mesh.material = meshMaterial

        // 以模型顶点信息创建线条
        const line = getLine(mesh, Math.PI * 6.137, undefined, 1)
        const name = mesh.name + '_line'
        line.name = name

        // 给线段赋予模型相同的坐标信息
        line.quaternion.copy(quaternion)
        line.position.copy(worldPos)
        line.scale.copy(worldScale)

        lg.add(line)
      }
    })
  }
}

const createPanel = () => {
  panel = new GUI({ width: 210 })

  const folder1 = panel.addFolder('Visibility')
  const folder2 = panel.addFolder('Activation/Deactivation')
  const folder3 = panel.addFolder('Pausing/Stepping')
  const folder4 = panel.addFolder('Crossfading')
  const folder5 = panel.addFolder('Blend Weights')
  const folder6 = panel.addFolder('General Speed')

  settings = {
    'show model': true,
    'show skeleton': false,
    'deactivate all': deactivateAllActions,
    'activate all': activateAllActions,
    'pause/continue': pauseContinue,
    'make single step': toSingleStepMode
  }

  folder1.add(settings, 'show model').name('显示模型').onChange(showModel)
  folder1.add(settings, 'show skeleton').name('显示骨架').onChange(showSkeleton)
}

const showModel = (visibility) => {
  model.visible = visibility
}

const showSkeleton = (visibility) => {
  skeleton.visible = visibility
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}
let rotationX = 0.001
const animate = () => {
  // let time = clock.get
  // Render loop

  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  // 旋转涡轮
  // 旋转涡轮
  if (hull_turbine && hull_turbine_line) {
    hull_turbine.rotation.x += rotationX
    hull_turbine_line.rotation.x += rotationX
  }
  if (blades_turbine_003) {
    blades_turbine_003.rotation.x += rotationX
  }
  blades_turbine_003_line && (blades_turbine_003_line.rotation.x += rotationX)

  // stats.update()
  controls.update()
}

onMounted(() => {
  startProgress()
  // console.log('1')
  init()

  // animate()
})

onBeforeUnmount(() => {
  panel?.hide()
})

const addLight = () => {
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(20, 30, 40)
  const light2 = new THREE.DirectionalLight(0xffffff, 1)
  light2.position.set(-20, -30, -40)
  const light3 = new THREE.DirectionalLight(0xffffff, 1)
  light3.position.set(10, 0, 0)
  const light4 = new THREE.DirectionalLight(0xffffff, 1)
  light4.position.set(-10, 0, 0)
  const light5 = new THREE.DirectionalLight(0xffffff, 1)
  light5.position.set(0, 10, 0)
  const light10 = new THREE.DirectionalLight(0xffffff, 1)
  light5.position.set(0, -10, 0)
  const light6 = new THREE.DirectionalLight(0xffffff, 0.3)
  light6.position.set(5, 10, 0)
  const light7 = new THREE.DirectionalLight(0xffffff, 0.3)
  light7.position.set(0, 10, 5)
  const light8 = new THREE.DirectionalLight(0xffffff, 0.3)
  light8.position.set(0, 10, -5)
  const light9 = new THREE.DirectionalLight(0xffffff, 0.3)
  light9.position.set(-5, 10, 0)
  scene.add(light, light2, light3, light4, light5, light6, light7, light8, light9, light10)
}
</script>

<style scoped>
#three {
  height: 100%;
  width: 100%;
}
</style>
