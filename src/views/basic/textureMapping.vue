<template>
    <div ref="canvasDom" class="canvas-container" ></div>
</template>
  
<script lang="ts" setup name="TextureMapping">
/* eslint-disable */
import { ref, onMounted } from 'vue';
import Floors from '@/modules/Floors';
import * as THREE from 'three';
import gsap from 'gsap';
import Event from '@/modules/Viewer/Events';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { TextureLoader } from 'three/examples/jsm/loaders/TextureLoader';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';


const canvasDom = ref(null)
const scene = new THREE.Scene()  //场景


//纹理内容块
const textLoader = new THREE.TextureLoader();  // 文件加载器

const wlRed = new URL('@/assets/images/textTure/wenli_red.jpg', import.meta.url).href
const wlImg1 = new URL('@/assets/images/textTure/wenli_gray.jpg', import.meta.url).href
const wlImg2 = new URL('@/assets/images/textTure/wenli2.jpg', import.meta.url).href
const wlImg3 = new URL('@/assets/images/textTure/wenli3.jpg', import.meta.url).href
const ttRed = textLoader.load(wlRed)
const texture1 = textLoader.load(wlImg1)
const texture2 = textLoader.load(wlImg2)
const texture3 = textLoader.load(wlImg3)
texture2.wrapS = THREE.RepeatWrapping;
texture2.wrapT = THREE.RepeatWrapping;
texture2.repeat.set(1, 1);  // uv两个方向纹理重复数量


const geometryCircle = new THREE.SphereGeometry(20, 32, 16)   //圆形
const materialCircle = new THREE.MeshBasicMaterial({
    // color: 0x016AB7,
    // side: THREE.FrontSide,
    // side:THREE.DoubleSide,
    // map:texture
    // transparent: true,//开启透明
    // opacity: 0.9,//设置透明度
})

const circleMesh = new THREE.Mesh(geometryCircle, materialCircle)
circleMesh.name = "圆模型"
circleMesh.position.set(-150, 20, -20)


const geometryPlane = new THREE.PlaneGeometry(1000, 1000);
//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture

const materialPlane = new THREE.MeshBasicMaterial({
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    side:THREE.DoubleSide,
    // transparent: true
});
const meshPlane = new THREE.Mesh(geometryPlane, materialPlane);


const geometry = new THREE.BoxGeometry(20, 120, 20);
const material = new THREE.MeshLambertMaterial();

const group = new THREE.Group();
group.name = "整体模型"

const mesh1 = new THREE.Mesh(geometry, material);
mesh1.name = "mesh1"
const mesh2 = mesh1.clone()
mesh2.material = mesh1.material.clone()
mesh2.name = "mesh2"
mesh2.translateX(50);
group.add(mesh1, mesh2, circleMesh)
group.position.set(0, 60, -80)
scene.add(group,meshPlane)

circleMesh.material.map = texture1
mesh1.material.map = texture2
mesh2.material.map = ttRed
meshPlane.material.map = ttRed


ttRed.wrapS = THREE.RepeatWrapping;
ttRed.wrapT = THREE.RepeatWrapping;
ttRed.repeat.x=50
ttRed.repeat.y=50
// uv两个方向纹理重复数量
ttRed.repeat.set(1,1);

// x y z 参考坐标轴
const axis = new THREE.AxesHelper(1000)
scene.add(axis)

/**纹理坐标0~1之间随意定义*/
const uvs = new Float32Array([
    0, 0, 
    0.5, 0, 
    0.5, 0.5, 
    0, 0.5, 
]);
// 设置几何体attributes属性的位置normal属性
// geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标


meshPlane.rotateX(-Math.PI/2);

const gridHelper = new THREE.GridHelper(1000, 25, 0x004444, 0x004444);
gridHelper.position.y = 10

scene.add(gridHelper)


const group1 = new THREE.Group(); //所有高层楼的父对象
group1.name = "高层";
for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 40, 10);
    const material = new THREE.MeshStandardMaterial({
        color: 0x0160B7
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 30; // 网格模型mesh沿着x轴方向阵列
    group1.add(mesh); //添加到组对象group1
    mesh.name = i + 1 + '号楼';
    // console.log('mesh.name',mesh.name);
}
group1.position.set(-30, 20, 0);


const group2 = new THREE.Group();
group2.name = "洋房";
// 批量创建多个长方体表示洋房
for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 20, 10);
    const material = new THREE.MeshStandardMaterial({
        color: 0x0180DB
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 30;
    group2.add(mesh); //添加到组对象group2
    mesh.name = i + 6 + '号楼';
}
group2.position.set(-30, 10, 50);

const model = new THREE.Group();
model.name = '小区房子';
model.add(group1, group2);
model.position.set(-50, 0, -25);


scene.add(group1, group2)
group2.traverse(function (obj) {
    if (obj.type === 'Mesh') {//判断条件也可以是obj.type === 'Mesh'
        // obj.material.color.set(0xffff00);
    }
});

const nameNode = scene.getObjectByName ("4号楼");
const mesh1Name = scene.getObjectByName ("mesh1");
const mesh2Name = scene.getObjectByName ("mesh2");
nameNode.material.color.set(0xff0000);
mesh1Name.material.color.set(0x419010);
mesh2Name.material.color.set(0xFFC5AE);



//渲染器
const renderer = new THREE.WebGLRenderer({ antialias: false })  //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
//镜头
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000)
camera.position.set(100, 1400, 100)    //镜头视角点设置
camera.lookAt(0, 0, 0)
const controls = new OrbitControls(camera, renderer.domElement)

//网格地面
// const gridHelper = new THREE.GridHelper(200, 20)
// scene.add(gridHelper)

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
const light10 = new THREE.DirectionalLight(0xffffff, 1);
light5.position.set(0, -100, 0);
scene.add(light10);

// const lightHelper = new THREE.DirectionalLightHelper(light3, 5, 0xffffff)


// 渲染函数
const render = () => {
    ttRed.offset.x -=0.0005
    // ttRed.offset.y -=0.0005
    circleMesh.rotateY(0.01)
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
}

onMounted(() => {
    //渲染
    canvasDom.value?.appendChild(renderer.domElement);

    // 设置背景颜色并启用透明度
    renderer.setClearColor(0xffc0cb, 0.5);
    render()

})
</script>

  