<template>
    <div ref="canvasDom" id="sevenC" style="height: 800px;"></div>
</template>
  
<script lang="ts" setup name="SevenC">
/* eslint-disable */
import { ref, onMounted } from 'vue';

import Floors from '@/modules/Floors';

import * as THREE from 'three';
import gsap from 'gsap';
import Event from '@/modules/Viewer/Events';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const popoverTop = ref(0);
const popoverLeft = ref(0);
const popoverData = ref<any>({});

let office: any = null;
let oldOffice: any = null;
let dataCenter: any = null;
let oldDataCenter: any = null;
let modelSelect = ['zuo0', 'zuo1', 'zuo2', 'zuo3', 'zuo4', 'zuo5'];
let modelSelectName = '';
let modelMoveName = '';
let isModelSelectName = false;


//场景
const scene = new THREE.Scene()
//渲染器
// , setAlpha: true
const renderer = new THREE.WebGLRenderer({ antialias: true })  //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
//镜头
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000)
camera.position.set(10, 10, 10)
camera.lookAt(500, 500, 500)
const controls = new OrbitControls(camera, renderer.domElement)

//网格地面
const gridHelper = new THREE.GridHelper(80)
//   gridHelper.material.transparent = true
//   gridHelper.material.opacity = 0
scene.add(gridHelper)

//加载gltf模型
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
//   dracoLoader.setDecoderPath('../../../public/models/')
loader.setDRACOLoader(dracoLoader)

loader.load(`../../../public/models/porsche_911_930_turbo.glb`, (gltf) => {  //传id让其点击不同商品展示不同模型 id对应商品的id
    // console.log(gltf.scene);
    const bmw = gltf.scene
    bmw.scale.set(2, 2, 2); //模型缩放
    scene.add(bmw) //将整个模型组添加到场景中
})
//洒满灯光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 10)
scene.add(light)
const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(0, 0, -10);
scene.add(light2);
const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(10, 0, 0);
scene.add(light3);
const light4 = new THREE.DirectionalLight(0xffffff, 1);
light4.position.set(-10, 0, 0);
scene.add(light4);
const light5 = new THREE.DirectionalLight(0xffffff, 1);
light5.position.set(0, 10, 0);
scene.add(light5);
const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
light6.position.set(5, 10, 0);
scene.add(light6);
const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
light7.position.set(0, 10, 5);
scene.add(light7);
const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
light8.position.set(0, 10, -5);
scene.add(light8);
const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
light9.position.set(-5, 10, 0);
scene.add(light9);

// 渲染函数
const render = () => {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
}

onMounted(() => {
    //渲染
    document.getElementById("sevenC")?.appendChild(renderer.domElement);
    //   canvasDom.value.appendChild(renderer.domElement)

    // 设置背景颜色并启用透明度
    renderer.setClearColor(0xffc0cb, 0.5);
    render()

})
</script>
  
<style scoped>
#three {
    height: 100%;
    width: 100%;
}
</style>
  