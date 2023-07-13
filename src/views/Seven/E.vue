<template>
    <div style="position: relative;">
        <div ref="canvasDom" id="sevenE" style="height: 800px;z-index:1 ;position: relative;"></div>
        <div style="position: absolute;z-index:999;top:0;right: 0;cursor: pointer;font-size: 20px;margin:0 20px;" @click="exportCanvas">导出</div>
    </div>
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
import { startProgress, closeProgress } from "@/utils/nprogress"


//场景
const scene = new THREE.Scene()

//镜头
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(100, 1000, 100)    //镜头视角点设置
camera.lookAt(0, 0, 0)

//圆形
const geometryCircle = new THREE.BoxGeometry(50, 50, 50)
const materialCircle = new THREE.MeshPhysicalMaterial({
    color: 0x102693,
    // metalness: 1.0,//金属度属性
    // side: THREE.FrontSide,
    metalness: 0,   //金属度属性
    roughness: 0,
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
circleMesh.scale.set(1.5, 1.5, 2)

const wlRed = new URL('@/assets/images/textTure/wenli_red.jpg', import.meta.url).href
const wlImg1 = new URL('@/assets/images/textTure/wenli_gray.jpg', import.meta.url).href
const wlImg2 = new URL('@/assets/images/textTure/wenli2.jpg', import.meta.url).href
const wlImg3 = new URL('@/assets/images/textTure/wenli3.jpg', import.meta.url).href

const textureCube = new THREE.CubeTextureLoader().load([wlRed, wlRed, wlImg1, wlImg1, wlImg2, wlImg2]);
circleMesh.material.envMap = textureCube


const Euler = new THREE.Euler(Math.PI / 4, 0, Math.PI / 2);
Euler.x = Math.PI / 4;
Euler.y = Math.PI / 2;
Euler.z = Math.PI / 4;
circleMesh.rotateOnAxis(axis, Math.PI / 100);//绕axis轴旋转π/8

circleMesh.material = new THREE.MeshPhysicalMaterial({
    color: circleMesh.material.color, //默认颜色
    metalness: 0,//车外壳金属度
    roughness: 0,//车外壳粗糙度
    envMap: textureCube, //环境贴图
    transmission: 1,
    envMapIntensity: 2.5, //环境贴图对Mesh表面影响程度
    ior: 1.5,//折射率
})




// 两个矩形平面Mesh重合，产生闪烁
// 闪烁原因：两个矩形面位置重合，GPU无法分清谁在前谁在后
const geometry = new THREE.PlaneGeometry(250, 250);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);


const geometry2 = new THREE.PlaneGeometry(300, 300);
const material2 = new THREE.MeshLambertMaterial({
    color: 0xff6666,
    side: THREE.DoubleSide,
});
const mesh2 = new THREE.Mesh(geometry2, material2);

scene.add(mesh, mesh2)
// mesh2.position.z = 0;
mesh2.position.z = 0.1;
// camera.position.set(292*5, 223*5, 185*5);

//渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: false,//想把canvas画布上内容下载到本地，需要设置为true
    preserveDrawingBuffer: true,
    logarithmicDepthBuffer: true // 设置对数深度缓冲区，优化深度冲突问题   当两个面间隙过小或重合时，对数深度缓冲区无效
})

renderer.setClearColor(0xffc0cb, 1);
renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, renderer.domElement)

//网格地面
const gridHelper = new THREE.GridHelper(1000, 20)
scene.add(gridHelper)

// 渲染函数
const render = () => {
    textureCube.colorSpace = THREE.SRGBColorSpace;
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
}


onMounted(() => {
    startProgress()
    initModel()
    addLight()
    document.getElementById("sevenE")?.appendChild(renderer.domElement);
    render()
    
    

})

const addLight = () => {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 0, 100)
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(0, 0, -100);
    const light3 = new THREE.DirectionalLight(0xffffff, 1);
    light3.position.set(100, 0, 0);
    const light4 = new THREE.DirectionalLight(0xffffff, 1);
    light4.position.set(-100, 0, 0);
    const light5 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, 100, 0);
    const light10 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, -100, 0);
    const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
    light6.position.set(50, 100, 0);
    const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
    light7.position.set(0, 100, 50);
    const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
    light8.position.set(0, 100, -50);
    const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
    light9.position.set(-50, 100, 0);
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

const exportCanvas = () => {

    const link = document.createElement('a');
    const canvas = renderer.domElement; //获取canvas对象
    link.href = canvas.toDataURL("image/png");
    // 通过超链接herf属性，设置要保存到文件中的数据
    link.download = 'threejs.png'; //下载文件名
    link.click(); //js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
}

const initModel = () => {
    //加载gltf模型
    const loader = new GLTFLoader()

    loader.load(`../../../public/models/porsche_911_930_turbo.glb`, (gltf) => {  //传id让其点击不同商品展示不同模型 id对应商品的id
        console.log(gltf);
        const bmw = gltf.scene
        const mesh = gltf.scene.children[0]; //获取Mesh
        console.log(mesh)
        bmw.scale.set(20, 20, 20); //模型缩放
        scene.add(bmw) //将整个模型组添加到场景中
    }, (xhr) => {
        const percent = xhr.loaded / xhr.total;

        if(percent==1) closeProgress()
        console.log('加载进度' + percent);
    })
}


window.onresize = function () {
    const width = window.innerWidth; //canvas画布高度
    const height = window.innerHeight; //canvas画布宽度
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

</script>
  
<style scoped>
#three {
    height: 100%;
    width: 100%;
}
</style>
  