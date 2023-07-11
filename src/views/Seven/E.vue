<template>
    <div ref="canvasDom" id="sevenE" style="height: 800px;"></div>
</template>
  
<script lang="ts" setup name="SevenE">
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

//点模型
const geometryPoint = new THREE.BufferGeometry(); //默认在XOY平面上
// const vertices = new Float32Array([
//     0, 0, 0, //顶点1坐标
//     50, 0, 0, //顶点2坐标
//     0, 100, 0, //顶点3坐标
//     0, 0, 10, //顶点4坐标
//     0, 0, 100, //顶点5坐标
//     50, 0, 10, //顶点6坐标
// ]);

const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    80, 0, 0, //顶点2坐标
    80, 80, 0, //顶点3坐标

    0, 0, 0, //顶点4坐标   和顶点1位置相同
    80, 80, 0, //顶点5坐标  和顶点3位置相同
    0, 80, 0, //顶点6坐标
]);

const indexes = new Uint16Array([
    // 下面索引值对应顶点位置数据中的顶点坐标
    0, 1, 2, 0, 2, 3,
])

// const normals = new Float32Array([
//     0, 0, 1, //顶点1法线( 法向量 )
//     0, 0, 1, //顶点2法线
//     0, 0, 1, //顶点3法线
//     0, 0, 1, //顶点4法线
//     0, 0, 1, //顶点5法线
//     0, 0, 1, //顶点6法线
// ]);

// 矩形平面，有索引，两个三角形，有2个顶点重合，有4个顶点
// 每个顶点的法线数据和顶点位置数据一一对应
const normals = new Float32Array([
    0, 0, 1, //顶点1法线( 法向量 )
    0, 0, 1, //顶点2法线
    0, 0, 1, //顶点3法线
    0, 0, 1, //顶点4法线
    0, 0, 1, //顶点5法线
    0, 0, 1, //顶点6法线
]);
// 设置几何体的顶点法线属性.attributes.normal
geometryPoint.attributes.normal = new THREE.BufferAttribute(normals, 3);

const attribue = new THREE.BufferAttribute(vertices, 3);
geometryPoint.attributes.position = attribue;
const materialA = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 50.0 //点对象像素尺寸
});
const points = new THREE.Points(geometryPoint, materialA);

// geometryPoint.index = new THREE.BufferAttribute(indexes, 1);
scene.add(points)


//盒子模型 
const geometryBox = new THREE.BoxGeometry(50, 50, 50); //默认在XOY平面上
const textureLoader = new THREE.TextureLoader();
const materialBox = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    // wireframe: true,
    side:THREE.FrontSide,
    // transparent: true, //使用背景透明的png贴图，注意开启透明计算
});
const mesh = new THREE.Mesh(geometryBox, materialBox);
// scene.add(mesh)

//线模型
const geometryLine = new THREE.BoxGeometry(200, 100, 100); //默认在XOY平面上
const materialLine = new THREE.LineBasicMaterial({ color: 0xffff00 })
const lineMesh = new THREE.Line(geometryLine, materialLine) // 闭合线条 LineLoop   非连续线条 LineSegments
// scene.add(lineMesh)

//圆形
const geometryCircle = new THREE.SphereGeometry(50,0,100)
const materialCircle = new THREE.MeshLambertMaterial({
    color:0xff00ff,
    side:THREE.FrontSide
    // shininess: 20, //高光部分的亮度，默认30
    // specular: 0x444444, //高光部分的颜色
})
const circleMesh = new THREE.Mesh(geometryCircle,materialCircle)
scene.add(circleMesh)



// const material = new THREE.MeshBasicMaterial({
//     color:0x00ff00,
//     side:THREE.FrontSide
// })


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
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
}

onMounted(() => {
    //渲染
    document.getElementById("sevenE")?.appendChild(renderer.domElement);
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
  