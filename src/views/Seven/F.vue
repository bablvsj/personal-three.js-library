<template>
    <div ref="canvasDom" id="sevenF" style="height: 800px;"></div>
</template>
  
<script lang="ts" setup name="SevenF">
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

//盒子模型 
const geometryBox = new THREE.BoxGeometry(50, 50, 50); //默认在XOY平面上
const textureLoader = new THREE.TextureLoader();
const materialBox = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.FrontSide,
});
const mesh = new THREE.Mesh(geometryBox, materialBox);
// scene.add(mesh)

//线模型
const geometryLine = new THREE.BoxGeometry(200, 100, 100); //默认在XOY平面上
const materialLine = new THREE.LineBasicMaterial({ color: 0xffff00 })
const lineMesh = new THREE.Line(geometryLine, materialLine) // 闭合线条 LineLoop   非连续线条 LineSegments
// scene.add(lineMesh)

//圆形
const geometryCircle = new THREE.SphereGeometry(50, 0, 100)
const materialCircle = new THREE.MeshLambertMaterial({
    color: 0x004B93,
    side: THREE.FrontSide,
    // transparent: true,//开启透明
    // opacity: 0.9,//设置透明度
})
const circleMesh = new THREE.Mesh(geometryCircle, materialCircle)
scene.add(circleMesh)

const v3 = new THREE.Vector3(0, 0, 0);
v3.set(10, 0, 0)
v3.x = 100;

circleMesh.position.set(10,10,10)

const axis = new THREE.Vector3(0, 1, 0);
axis.normalize(); //向量归一化
//沿着axis轴表示方向平移100
circleMesh.translateOnAxis(axis, 10);
circleMesh.scale.x = 2.0
circleMesh.scale.set(1.5, 1.5, 2)


//欧拉对象
//表示绕着xyz轴分别旋转45度，0度，90度
const Euler = new THREE.Euler(Math.PI / 4, 0, Math.PI / 2);
Euler.x = Math.PI / 4;
Euler.y = Math.PI / 2;
Euler.z = Math.PI / 4;
circleMesh.rotateOnAxis(axis, Math.PI / 100);//绕axis轴旋转π/8

const v1 = new THREE.Vector3(4,5,6)
v3.copy(v1)

const circle2 = circleMesh.clone();

circle2.position.x=150
circle2.material.color.set(0x316704)    //两个模型 颜色都会变


circle2.material = circleMesh.material.clone() 

circle2.material.color.set(0x7A0717)    // 材质clone后 颜色不会跟着改变
scene.add(circle2)

console.log(v3)






//渲染器
const renderer = new THREE.WebGLRenderer({ antialias: false })  //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
//镜头
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(100, 400, 100)    //镜头视角点设置
camera.lookAt(100, 200, 100)
const controls = new OrbitControls(camera, renderer.domElement)

//网格地面
const gridHelper = new THREE.GridHelper(200, 20)
scene.add(gridHelper)


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


// 渲染函数
const render = () => {

    // //绕y轴的角度设置为60度
    // circleMesh.rotation.y += Math.PI / 1000;
    // //绕y轴的角度增加60度
    // circleMesh.rotation.x += Math.PI / 100;
    // //绕y轴的角度减去60度
    // circleMesh.rotation.z -= Math.PI / 500;

    circleMesh.rotateX(0.01)
    circleMesh.rotateY(0.01)
    circleMesh.rotateZ(0.01)


    circle2.rotation.copy(circleMesh.rotation) // 同步mesh2和mesh的姿态角度一样，不管mesh姿态角度怎么变化，mesh2始终保持同步


    circle2.position.copy(circleMesh.position);//1. 第1步位置重合
    circle2.position.y += 100;//1. 第2步mesh在原来y的基础上增加100



    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
}

onMounted(() => {
    //渲染
    document.getElementById("sevenF")?.appendChild(renderer.domElement);
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
  