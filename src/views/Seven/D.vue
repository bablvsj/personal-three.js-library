<template>
    <div ref="canvasDom" id="sevenD" style="height: 800px;"></div>
</template>
  
<script lang="ts" setup name="SevenD">
/* eslint-disable */
import { ref, onMounted } from 'vue';

import Floors from '@/modules/Floors';

import * as THREE from 'three';
import gsap from 'gsap';
import Event from '@/modules/Viewer/Events';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';


//场景
const scene = new THREE.Scene()

// 矩形平面网格模型设置背景透明的png贴图
const geometry = new THREE.BoxGeometry(50, 50,50); //默认在XOY平面上
const textureLoader = new THREE.TextureLoader();
const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe:true,
    transparent: true, //使用背景透明的png贴图，注意开启透明计算
});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh)
// mesh.rotateX(-Math.PI / 2);

//渲染器
// , setAlpha: true
const renderer = new THREE.WebGLRenderer({ antialias: true })  //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
//镜头
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(100, 400, 100)    //镜头视角点设置
camera.lookAt(100, 200, 100)
const controls = new OrbitControls(camera, renderer.domElement)

//网格地面
const gridHelper = new THREE.GridHelper(200, 20)
scene.add(gridHelper)

//加载gltf模型
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('../../../public/models/')
loader.setDRACOLoader(dracoLoader)

loader.load(`../../../public/models/porsche_911_930_turbo.glb`, (gltf) => {  //传id让其点击不同商品展示不同模型 id对应商品的id
    // console.log(gltf.scene);
    const bmw = gltf.scene
    bmw.scale.set(20, 20, 20); //模型缩放
    scene.add(bmw) //将整个模型组添加到场景中
})
// 洒满灯光



const ambient = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambient);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(directionalLight);

const gui = new GUI();
gui.domElement.style.right = '0px'
gui.domElement.style.width = '300px'

const obj = {
    color:0x00ffff
}

gui.add(ambient,'intensity',0,2.0).name("环境光强度").step(0.1).onChange((value)=>{
    console.log(value)
});
gui.add(directionalLight, 'intensity', 0, 2.0).name('平行光强度').step(0.1);;
gui.add(mesh.position,'x',0,100).name("Mesh-x轴").step(10);
gui.add(mesh.position,'y',0,100).name("Mesh-y轴").step(10);
gui.add(mesh.position,'z',0,100).name("Mesh-z轴").step(10);
gui.addColor(obj,'color').onChange((value)=>{
    mesh.material.color.set(value)
})

// 渲染函数
const render = () => {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
}

onMounted(() => {
    //渲染
    document.getElementById("sevenD")?.appendChild(renderer.domElement);
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
  