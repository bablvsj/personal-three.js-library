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


//圆形
const geometryCircle = new THREE.SphereGeometry(30, 0, 100)
const materialCircle = new THREE.MeshStandardMaterial({
    color: 0x016AB7,
    side: THREE.FrontSide,
    // transparent: true,//开启透明
    // opacity: 0.9,//设置透明度
})
const circleMesh = new THREE.Mesh(geometryCircle, materialCircle)
circleMesh.position.set(-150, 20, -20)

const axis = new THREE.Vector3(0, 0, 0);
axis.normalize(); //向量归一化
circleMesh.rotateOnAxis(axis, Math.PI / 100);//绕axis轴旋转π/8


//创建两个网格模型mesh1、mesh2
const geometry = new THREE.BoxGeometry(20, 20, 10);
const material = new THREE.MeshStandardMaterial({ color: 0x8DD815 });
const group = new THREE.Group();
const mesh1 = new THREE.Mesh(geometry, material);
// const mesh2 = new THREE.Mesh(geometry, material);

mesh1.name = "mesh1"
const mesh2 = mesh1.clone()
mesh2.material = mesh1.material.clone()
mesh2.name = "mesh2"
mesh2.translateX(25);

geometry.translate(50, 10, -10);;

// group.position.set(60,10,-100)
group.add(circleMesh, mesh1, mesh2)

scene.add(group);

group.name = "整体模型"
circleMesh.name = "圆模型"

// console.log(group.children)

const group1 = new THREE.Group(); //所有高层楼的父对象
group1.name = "高层";
for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 90, 10);
    const material = new THREE.MeshStandardMaterial({
        color: 0x0160B7
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 30; // 网格模型mesh沿着x轴方向阵列
    group1.add(mesh); //添加到组对象group1
    mesh.name = i + 1 + '号楼';
    // // console.log('mesh.name',mesh.name);
}
group1.position.set(-30, 45, -100);


const group2 = new THREE.Group();
group2.name = "洋房";
// 批量创建多个长方体表示洋房
for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 60, 10);
    const material = new THREE.MeshStandardMaterial({
        color: 0x0180DB
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 30;
    group2.add(mesh); //添加到组对象group2
    mesh.name = i + 6 + '号楼';
}
group2.position.set(-30, 30, -50);

const model = new THREE.Group();
model.name = '小区房子';
model.add(group1, group2);
model.position.set(-50, 0, -25);


scene.add(group1, group2)
group2.traverse(function (obj) {

    // // console.log(group2.getWorldPosition(obj))
    // console.log('obj',obj);
    // console.log('所有模型节点的名称',obj.name);
    // obj.isMesh：if判断模型对象obj是不是网格模型'Mesh'
    if (obj.type === 'Mesh') {//判断条件也可以是obj.type === 'Mesh'
        // console.log('所有模型节点的名称',obj.type);
        // obj.material.color.set(0xffff00);
    }
});

const nameNode = scene.getObjectByName("4号楼");
const mesh1Name = scene.getObjectByName("mesh1");
const mesh2Name = scene.getObjectByName("mesh2");
nameNode.material.color.set(0xff0000);
mesh1Name.material.color.set(0x419010);
mesh2Name.material.color.set(0xFFC5AE);


// 声明一个三维向量用来表示某个坐标
const worldPosition = new THREE.Vector3();
// 获取mesh的世界坐标，你会发现mesh的世界坐标受到父对象group的.position影响
mesh1.getWorldPosition(worldPosition);
// console.log('世界坐标',worldPosition);
// console.log('本地坐标',mesh1.position);




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

const lightGroup = new THREE.Group()
//洒满灯光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 100)
scene.add(light)
const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(0, 0, -100);
scene.add(light2);
const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(100, 0, 0);
scene.add(light3);
const light4 = new THREE.DirectionalLight(0xffffff, 1);
light4.position.set(-100, 0, 0);
scene.add(light4);
const light5 = new THREE.DirectionalLight(0xffffff, 1);
light5.position.set(0, 100, 0);
scene.add(light5);

const light10 = new THREE.DirectionalLight(0xffffff, 1);
light5.position.set(0, -100, 0);
scene.add(light10);
const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
light6.position.set(50, 100, 0);
scene.add(light6);
const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
light7.position.set(0, 100, 50);
scene.add(light7);
const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
light8.position.set(0, 100, -50);
scene.add(light8);
const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
light9.position.set(-50, 100, 0);
scene.add(light9);


lightGroup.add(light, light2, light3, light4, light5, light6, light7, light8, light9)

scene.add(lightGroup)

const lightHelper = new THREE.DirectionalLightHelper(light3, 5, 0xffffff)


// lightHelper.add(light,light2,light3,light4,light5,light6,light7,light8,light9,light10)

scene.add(lightHelper)

scene.remove(light, light2, light3, light4, light5, light6, light7, light8, light9, light10)


// grou.visible = false

mesh1.material.visible = false


// 渲染函数
const render = () => {

    // //绕y轴的角度设置为60度
    // circleMesh.rotation.y += Math.PI / 1000;
    // //绕y轴的角度增加60度
    // circleMesh.rotation.x += Math.PI / 100;
    // //绕y轴的角度减去60度
    // circleMesh.rotation.z -= Math.PI / 500;

    // group.rotateX(0.01)
    circleMesh.rotateY(0.01)
    // circleMesh.rotateZ(0.01)

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
  