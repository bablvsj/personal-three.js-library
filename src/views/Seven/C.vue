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
camera.position.set(200, 200, 200)
camera.lookAt(0, 0, 0)
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0);

//网格地面
const gridHelper = new THREE.GridHelper(500, 20)  // 网格边框长度|分成多少份|中心线颜色|其他网格线颜色0
scene.add(gridHelper)

//加载gltf模型
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('../../../public/models/')
loader.setDRACOLoader(dracoLoader)


//纹理内容块
const textLoader = new THREE.TextureLoader();  // 文件加载器
const wlRed = new URL('@/assets/images/textTure/wenli_red.jpg', import.meta.url).href
// const wlImg1 = new URL('@/assets/images/textTure/wenli_gray.jpg', import.meta.url).href
// const wlImg2 = new URL('@/assets/images/textTure/wenli2.jpg', import.meta.url).href
// const wlImg3 = new URL('@/assets/images/textTure/wenli3.jpg', import.meta.url).href
const ttRed = textLoader.load(wlRed)
ttRed.colorSpace = THREE.SRGBColorSpace;

loader.load(`../../../public/models/porsche_911_930_turbo.glb`, (gltf) => {  //传id让其点击不同商品展示不同模型 id对应商品的id
    console.log(gltf);
    const bmw = gltf.scene
    const mesh = gltf.scene.children[0]; //获取Mesh
    console.log(mesh)
    // mesh.material.map = ttRed; //更换不同风格的颜色贴图
    // gltf.scene.traverse(function (obj) {
    //     if (obj.isMesh) {
    //         obj.material = new THREE.MeshLambertMaterial({
    //             color: 0x00ffff,
    //         });
    //     }
    // });

    bmw.scale.set(20, 20, 20); //模型缩放
    scene.add(bmw) //将整个模型组添加到场景中
})


// 渲染函数
const render = () => {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
    renderer.outputColorSpace = THREE.SRGBColorSpace;
}

onMounted(() => {
    document.getElementById("sevenC")?.appendChild(renderer.domElement);
    addLight()
    renderer.setClearColor(0xffc0cb, 0.5);
    render()

})


const addLight = () => {
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
    const light10 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, -10, 0);
    scene.add(light10);
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
}
</script>
  
<style scoped>
#three {
    height: 100%;
    width: 100%;
}
</style>
  