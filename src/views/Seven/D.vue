<template>
    <div ref="canvasDom" id="sevenD" style="height: 800px;"></div>
</template>
  
<script lang="ts" setup name="SevenD">
/* eslint-disable */
import { ref, onMounted,onBeforeUnmount } from 'vue';

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


//点模型
const geometryPoint = new THREE.BufferGeometry(); //默认在XOY平面上
const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    50, 0, 0, //顶点2坐标
    0, 100, 0, //顶点3坐标
    0, 0, 10, //顶点4坐标
    0, 0, 100, //顶点5坐标
    50, 0, 10, //顶点6坐标
]);
const attribue = new THREE.BufferAttribute(vertices, 3); 
geometryPoint.attributes.position = attribue;
const materialA = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 5.0 //点对象像素尺寸
}); 
const points = new THREE.Points(geometryPoint, materialA);

const lineMaterial = new THREE.LineBasicMaterial({color:0xff0000})

const line = new THREE.LineSegments(geometryPoint,lineMaterial)

scene.add(points,line)



//盒子模型 
 const geometryBox = new THREE.BoxGeometry(50,50,50); //默认在XOY平面上
const textureLoader = new THREE.TextureLoader();
const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe:true,
    transparent: true, //使用背景透明的png贴图，注意开启透明计算
});
const mesh = new THREE.Mesh(geometryBox, material);
scene.add(mesh)

const renderer = new THREE.WebGLRenderer({ antialias: true })  //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
//镜头
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(100, 400, 100)    //镜头视角点设置
camera.lookAt(100, 200, 100)
const controls = new OrbitControls(camera, renderer.domElement)

//网格地面
const gridHelper = new THREE.GridHelper(200, 20)
gridHelper.position.x = -1
scene.add(gridHelper)



const ambient = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambient);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(directionalLight);

// const gui = new GUI();
// gui.domElement.style.right = '0px'
// // gui.domElement.style.bottom = '0px'
// gui.domElement.style.width = '300px'

const obj = {
    color:0x00ffff,
    scale:0,
    bool:false
}

// const commonPara = gui.addFolder('公共参数')
// commonPara.close()

// commonPara.add(ambient,'intensity',0,2.0).name("环境光强度").step(0.1).onChange((value)=>{
//     console.log(value)
// });
// commonPara.add(directionalLight, 'intensity', 0, 2.0).name('平行光强度').step(0.1);;



//创建材质子菜单
// const matFolder = gui.addFolder('材质')
// matFolder.close()

// matFolder.addColor(obj,'color').onChange(value=>{
//     material.color.set(value)
// })

// matFolder.addColor(obj,'color').name("盒子颜色").onChange((value)=>{
//     mesh.material.color.set(value)
// })

// matFolder.add(obj,'scale',[-100,-50,0,50,100]).name("y坐标").onChange((value)=>{
//     mesh.position.y = value
// })

// matFolder.add(mesh.position,'x',0,100).name("Mesh-x轴").step(10);
// matFolder.add(mesh.position,'y',0,100).name("Mesh-y轴").step(10);
// matFolder.add(mesh.position,'z',0,100).name("Mesh-z轴").step(10);
// matFolder.add(obj,'bool')

// matFolder.add(obj,'scale',{
//     left: -100,
//     center: 0,
//     right: 100,
//     左: -100,//可以用中文
//     中: 0,
//     右: 100
// }).name("x坐标").onChange((value)=>{
//     mesh.position.x = value
// })

// const ambientFolder = gui.addFolder('环境光')
// ambientFolder.close()
// ambientFolder.add(ambient,'intensity',0,2).step(0.1)

// // 平行光子菜单
// const dirFolder = gui.addFolder('平行光')
// dirFolder.close()
// dirFolder.add(directionalLight,'intensity',0,2).step(0.1)
// dirFolder.add(directionalLight.position, 'x',-400,400);
// dirFolder.add(directionalLight.position, 'y',-400,400);
// dirFolder.add(directionalLight.position, 'z',-400,400);

// 平行光强度
// const dirFolder2 = dirFolder.addFolder('平行光-位置');//子菜单的子菜单
// dirFolder2.close();//关闭菜单
// // 平行光位置
// dirFolder2.add(directionalLight.position, 'x',-400,400);
// dirFolder2.add(directionalLight.position, 'y',-400,400);
// dirFolder2.add(directionalLight.position, 'z',-400,400);





// 渲染函数
const render = () => {
    if (obj.bool) mesh.rotateY(0.11);
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

onBeforeUnmount(() => {
    // gui.close()
})

</script>
  
<style scoped>
#three {
    height: 100%;
    width: 100%;
}
</style>
  