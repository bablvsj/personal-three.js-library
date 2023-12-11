<template>
  <div ref="canvasDom" id="sevenD" style="height: 800px"></div>
</template>

<script lang="ts" setup name="LightShadow">
/* eslint-disable */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

import Event from '@/modules/Viewer/Events'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

//场景
const scene = new THREE.Scene()


const renderer = new THREE.WebGLRenderer({ antialias: true }) //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true; 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(20, 100, 300) //镜头视角点设置
camera.lookAt(0, 20, 100)
const controls = new OrbitControls(camera, renderer.domElement)


//点模型
const geometryPoint = new THREE.BufferGeometry() //默认在XOY平面上
const vertices = new Float32Array([
  0,
  0,
  0, //顶点1坐标
  50,
  0,
  0, //顶点2坐标
  0,
  100,
  0, //顶点3坐标
  0,
  0,
  10, //顶点4坐标
  0,
  0,
  100, //顶点5坐标
  50,
  0,
  10 //顶点6坐标
])
const attribue = new THREE.BufferAttribute(vertices, 3)
geometryPoint.attributes.position = attribue
const materialA = new THREE.PointsMaterial({
  color: 0xff0000,
  size: 5.0 //点对象像素尺寸
})
const points = new THREE.Points(geometryPoint, materialA)

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 })

const line = new THREE.LineSegments(geometryPoint, lineMaterial)

scene.add(points, line)

//盒子模型
const geometryBox = new THREE.SphereGeometry(10,50, 10) //默认在XOY平面上
const textureLoader = new THREE.TextureLoader()
// MeshLambertMaterial  MeshStandardMaterial  MeshPhysicalMaterial MeshPhongMaterial
const material = new THREE.MeshLambertMaterial({
  color:"yellow"
})
const mesh = new THREE.Mesh(geometryBox, material)
mesh.position.set(0,30,0)
mesh.castShadow = true;
scene.add(mesh)


const spotLight = new THREE.SpotLight(0xffffff,0.355)
scene.add(spotLight)
spotLight.castShadow  = true
spotLight.position.set(-50, 100, 0)
// spotLight.intensity = 100.0;//光照强度
spotLight.angle = 0.4;//光照角度
spotLight.decay = 5;//光照强度


// spotLight.target是一个模型对象Object3D，默认在坐标原点
// spotLight.target.position.set(0,0,0);
// //spotLight.target添加到场景中.target.position才会起作用
// scene.add(spotLight.target);


// 设置三维场景计算阴影的范围
// spotLight.shadow.camera.left = -50;
// spotLight.shadow.camera.right = 100;
// spotLight.shadow.camera.top = 100;
// spotLight.shadow.camera.bottom = 1;
// spotLight.shadow.camera.near = 0.5;
// spotLight.shadow.camera.far = 100;

// 可视化平行光阴影对应的正投影相机对象
const cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(cameraHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight,0xffffff)
scene.add(spotLightHelper)

const planeGeo = new THREE.PlaneGeometry(500,500);
const planeMaterial = new THREE.MeshLambertMaterial({
    color:0xffffff
})
const plane = new THREE.Mesh(planeGeo,planeMaterial)
scene.add(plane)
plane.rotateX(-Math.PI/2);
plane.position.y = 1
plane.receiveShadow = true

const gui = new GUI()
gui.domElement.style.right = '0px'
gui.domElement.style.width = '300px'

const obj = {
  color: 0x00ffff,
  scale: 0,
  bool: false
}

gui.add(spotLight, 'intensity', 0, 2).name('强度').step(0.001)
gui.add(spotLight, 'angle', 0,  Math.PI / 2);
gui.add(spotLight, 'decay', 0,  2).name('光源衰减').step(0.01);
gui.add(spotLight.position,'x',-300,300)
gui.add(spotLight.position,'y',0,500)
gui.add(spotLight.position,'z',-300,300)
gui.addColor(spotLight,'color')

// 渲染函数
const render = () => {
  if (obj.bool) mesh.rotateY(0.11)
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(render)
}

onMounted(() => {
  document.getElementById('sevenD')?.appendChild(renderer.domElement)
  // 设置背景颜色并启用透明度
  renderer.setClearColor(0x000000, 1);
  render()
})

onBeforeUnmount(() => {
  gui.hide()
})
</script>

<style scoped>
#three {
  height: 100%;
  width: 100%;
}
</style>
