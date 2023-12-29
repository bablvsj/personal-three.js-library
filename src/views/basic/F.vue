<template>
    <div ref="canvasDom" class="canvas-container"></div>
</template>
  
<script lang="ts" setup name="BasicF">
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

const canvasDom = ref(null)

//场景
const scene = new THREE.Scene()


//圆形
const geometryCircle = new THREE.SphereGeometry(100, 32, 16)
const materialCircle = new THREE.MeshPhysicalMaterial({
    color: 0x102693,
    // metalness: 1.0,//金属度属性
    // side: THREE.FrontSide,
    metalness: 0,   //金属度属性
    roughness: 0,
    wireframe:true,
    // transparent: true,//开启透明
    // opacity: 0.9,//设置透明度
})
const circleMesh = new THREE.Mesh(geometryCircle, materialCircle)
scene.add(circleMesh)

circleMesh.position.set(0, 100, 0)

const axis = new THREE.Vector3(0, 1, 0);
axis.normalize(); //向量归一化
//沿着axis轴表示方向平移100
circleMesh.translateOnAxis(axis, 10);
// circleMesh.scale.set(1.5, 1.5, 2)

const wlRed = new URL('@/assets/images/textTure/wenli_red.jpg', import.meta.url).href
const wlImg1 = new URL('@/assets/images/textTure/wenli_gray.jpg', import.meta.url).href
const wlImg2 = new URL('@/assets/images/textTure/wenli2.jpg', import.meta.url).href
const wlImg3 = new URL('@/assets/images/textTure/wenli3.jpg', import.meta.url).href

const textureCube = new THREE.CubeTextureLoader().load([wlRed, wlRed, wlImg1, wlImg1, wlImg2, wlImg2]);


const Euler = new THREE.Euler(Math.PI / 4, 0, Math.PI / 2);
Euler.x = Math.PI / 4;
Euler.y = Math.PI / 2;
Euler.z = Math.PI / 4;
circleMesh.rotateOnAxis(axis, Math.PI / 100);//绕axis轴旋转π/8

circleMesh.material = new THREE.MeshPhysicalMaterial({
    color: circleMesh.material.color, //默认颜色
    metalness: 0,//车外壳金属度
    roughness: 0,//车外壳粗糙度
    // envMap: textureCube, //环境贴图
    transmission: 1,
    envMapIntensity: 2.5, //环境贴图对Mesh表面影响程度
    ior: 1.5,//折射率
    wireframe:true,
})


// circleMesh.material.envMap = textureCube


// const gui = new GUI()
// const matFolder = gui.addFolder('公共参数')
// let obj ={
//     color:circleMesh.material.color
// }

// // 范围可以参考文档
// matFolder.add(circleMesh.material,'metalness',0,1).name("车外壳金属度");
// matFolder.add(circleMesh.material,'roughness',0,1).name("车外壳粗糙度");
// matFolder.add(circleMesh.material,'transmission',0,1).name("玻璃材质透光率");
// matFolder.add(circleMesh.material,'clearcoat',0,1);
// matFolder.add(circleMesh.material,'ior',0,5).name("折射率");
// matFolder.add(circleMesh.material,'envMapIntensity',0,10).name("环境贴图对Mesh表面影响程度");

// matFolder.addColor(obj, 'color').onChange( (value)=> {
//     circleMesh.material.color.set(value);
// });




//渲染器
const renderer = new THREE.WebGLRenderer({ antialias: false })  //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
//镜头
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(100, 1000, 100)    //镜头视角点设置
camera.lookAt(0, 0, 0)
const controls = new OrbitControls(camera, renderer.domElement)

//网格地面
const gridHelper = new THREE.GridHelper(1000, 20)
scene.add(gridHelper)

// 渲染函数
const render = () => {
    // circleMesh.rotation.y += Math.PI / 1000;
    // circleMesh.rotateZ(0.001)
    textureCube.colorSpace = THREE.SRGBColorSpace;
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
}

onMounted(() => {
    canvasDom.value?.appendChild(renderer.domElement);
    renderer.setClearColor(0xffc0cb, 0.5);
    render()
    addLight()
})

const addLight = () => {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 0, 10)
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(0, 0, -10);
    const light3 = new THREE.DirectionalLight(0xffffff, 1);
    light3.position.set(10, 0, 0);
    const light4 = new THREE.DirectionalLight(0xffffff, 1);
    light4.position.set(-10, 0, 0);
    const light5 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, 10, 0);
    const light10 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, -10, 0);
    const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
    light6.position.set(5, 10, 0);
    const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
    light7.position.set(0, 10, 5);
    const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
    light8.position.set(0, 10, -5);
    const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
    light9.position.set(-5, 10, 0);
    scene.add(light,
        light2,
        light3,
        light4,
        light5,
        light6,
        light7,
        light8,
        light9,
        light10,
    );
}
</script>
  
<style scoped>
#three {
    height: 100%;
    width: 100%;
}
</style>
  