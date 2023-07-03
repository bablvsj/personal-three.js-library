<template>
    <div id="SevenA" style="height: 400px;width:400px;"></div>
</template>
  
<script lang="ts"  setup name="SevenA">
/* eslint-disable */
// import { ref, onMounted, type Ref } from 'vue';
// import * as THREE from 'three';

// let width = window.innerWidth; //窗口宽度
// let height = window.innerHeight; //窗口高度


// const container = document.getElementById("#sevenA")

// const scene = new THREE.Scene();
// const axesHelper = new THREE.AxesHelper(200);
// scene.background = new THREE.Color('skyblue')
// scene.add(axesHelper);


// const fov = 35;
// const aspect = width / height

// const camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100)
// camera.position.set(0, 0, 10)
// camera.lookAt(200, 200, 200);

// const geometry = new THREE.BoxGeometry(20, 20, 20)

// const material = new THREE.MeshStandardMaterial({
//     color: 0xff0051,
//     flatShading: true,
//     metalness: 0,
//     roughness: 1,
// });
// const cube = new THREE.Mesh(geometry, material)

// scene.add(cube)

// const renderer = new THREE.WebGLRenderer({ antialias: true })
// renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.setPixelRatio(window.devicePixelRatio)

// onMounted(() => {
//     container?.append(renderer.domElement)
//     render()
// })

// const render = () => {
//     //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
//     renderer.render(scene, camera); //执行渲染操作
//     requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
// }


import { ref, onMounted, type Ref } from 'vue';
import * as THREE from 'three';
import type { BufferGeometryLoader } from 'three';
import type { PositionalAudio } from 'three';
import type { Camera } from 'three';
import { RGBA_ASTC_10x10_Format } from 'three';
import { PerspectiveCamera } from 'three';

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { DRACOLoader, } from "three/examples/jsm/loaders/DRACOLoader"
import Stats from 'three/examples/jsm/libs/stats.module.js';


let container, clock, gui: any, mixer: any, actions: any, activeAction: any, previousAction;
let model, face;

const api = { state: 'Walking' };

let scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);
scene.background = new THREE.Color('skyblue')

let width = window.innerWidth; //窗口宽度
let height = window.innerHeight; //窗口高度
let k = width / height; //窗口宽高比
let s = 500; //三维场景显示范围控制系数，系数越大，显示的范围越大

//创建相机对象
let camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera.position.set(100, 100, 100); //设置相机位置
// camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
camera.lookAt(200, 200, 200);

//点光源
let point = new THREE.PointLight(0xffffff, 3);
point.position.set(100, 200, 300); //点光源位置
scene.add(point); //点光源添加到场景中

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

// resize 事件
window.addEventListener("resize", () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// 立体方
const geometry = new THREE.BoxGeometry(5, 5, 5);
const material = new THREE.MeshStandardMaterial({
    color: 0xff0051,
    flatShading: true,
    metalness: 0,
    roughness: 1,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 维数据集
const geometry2 = new THREE.BoxGeometry(30, 30, 30);
const material2 = new THREE.MeshBasicMaterial({
    // color: "#000",
    wireframe: true,//是否透明
    // transparent: false,
});
const wireframeCube = new THREE.Mesh(geometry2, material2);
scene.add(wireframeCube);

renderer.setClearColor(new THREE.Color(0xe6e6e6))
renderer.setSize(window.innerWidth, window.innerHeight)

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(25, 50, 25);
scene.add(pointLight);

onMounted(() => {
    init();
});


const init = () => {
    //将渲染的结果输出到指定页面元素中
    document.getElementById("SevenA")?.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
        renderer.render(scene, camera);
    });//监听鼠标、键盘事件
    //渲染场景
    render()
};

const render = () => {
    renderer.render(scene, camera); //执行渲染操作
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}
</script>
  
