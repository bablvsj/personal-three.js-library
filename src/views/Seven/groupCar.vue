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
// import { Group } from '@tweenjs/tween.js'
// import { Theme } from 'ant-design-vue'
  
  //场景
  const scene = new THREE.Scene()
  
  
  const renderer = new THREE.WebGLRenderer({ antialias: true }) //setAlpha让其可设置透明度
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true; 
  
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(20, 100, 300) //镜头视角点设置
  camera.lookAt(0, 20, 100)
  const controls = new OrbitControls(camera, renderer.domElement)

  const geometry = new THREE.BoxGeometry(15,30,5);
  const materialBody = new THREE.MeshNormalMaterial()


  const carBody = new THREE.Mesh(geometry,materialBody)

  // 轮胎
  const carTireGroup1 = new THREE.Group()
  const geometryHub = new THREE.BoxGeometry(2,5,5);
  const materialHub = new THREE.MeshBasicMaterial({
    color:0xff0000
  })
  const carHub = new THREE.Mesh(geometryHub,materialHub)
  carTireGroup1.add(carHub)
  carTireGroup1.position.set(-9,8,0)

  const carTireGroup2 = carTireGroup1.clone()
  const carTireGroup3 = carTireGroup1.clone()
  const carTireGroup4 = carTireGroup1.clone()
  carTireGroup2.position.set(-9,-8,0)
  carTireGroup3.position.set(9,8,0)
  carTireGroup4.position.set(9,-8,0)


  // 轮胎花纹

  const circle = new THREE.Group()
  let n = 15;
  for(let i=0;i< n ;i++){
    let r = 4
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,2),new THREE.MeshBasicMaterial({
    color:0xeef900
  }))
    mesh.position.x = r * Math.cos(Math.PI * 2 / n * i) 
    mesh.position.y = r * Math.sin(Math.PI * 2 / n * i) 
    circle.add(mesh)
  }
  // circle.position.set(30,10,10)
  circle.rotateY(0.5 * Math.PI)

  // scene.add(circle)
  const circle1 = circle.clone()
  const circle2 = circle.clone()
  const circle3 = circle.clone()

  carTireGroup1.add(circle)
  carTireGroup2.add(circle1)
  carTireGroup3.add(circle2)
  carTireGroup4.add(circle3)

  // carTireGroup1.add(circle)
  

  const carGroup = new THREE.Group()
  carGroup.add(carBody)
  carGroup.add(carTireGroup1,carTireGroup2,carTireGroup3,carTireGroup4)
  scene.add(carGroup)


  // 渲染函数
  const clock = new THREE.Clock();
  const render = () => {
    const time = clock.getElapsedTime();
    let time2 = time * 5
    carTireGroup1.rotation.x = time2
    carTireGroup2.rotation.x = time2
    carTireGroup3.rotation.x = time2
    carTireGroup4.rotation.x = time2
    carGroup.position.y = (time * 60) % 250  - 150
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
  }
  
  onMounted(() => {
    document.getElementById('sevenD')?.appendChild(renderer.domElement)
    // 设置背景颜色并启用透明度
    renderer.setClearColor(0xeeeeee, 1);
    render()
  })
  

  </script>
  
  <style scoped>
  #three {
    height: 100%;
    width: 100%;
  }
  </style>
  