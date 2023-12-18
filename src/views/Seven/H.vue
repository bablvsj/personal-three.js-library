<!-- eslint-disable indent -->

<template>
    <div ref="canvasDom" class="canvas-container"></div>
</template>
  
<script setup name="SevenH" >
/* eslint-disable */
let stats;
let grid;

const wheels = [];
import { ref, onMounted } from 'vue';
import Floors from '@/modules/Floors';
import * as THREE from 'three';
import gsap from 'gsap';
import Event from '@/modules/Viewer/Events';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const canvasDom = ref(null)

//场景
const scene = new THREE.Scene()
//渲染器
const renderer = new THREE.WebGLRenderer({ antialias: false })  //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
//镜头
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 50, 3000)
camera.position.set(0, 600, 1300)    //镜头视角点设置
camera.lookAt(0, 0, 0)

// 正投影相机
// const width = window.innerWidth; //canvas画布宽度
// const height = window.innerHeight; //canvas画布高度
// const k = width / height; //canvas画布宽高比
// const s = 600;//控制left, right, top, bottom范围大小
// const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 2000);
// camera.position.set(800, 800, 800);//相机放在了y轴上
// camera.lookAt(0, 0, 0);//指向坐标原点



const controls = new OrbitControls(camera, renderer.domElement)

// controls.enableZoom = false;//禁止缩放
// controls.enablePan = false; //禁止右键拖拽
// controls.enableRotate = false; //禁止旋转

// controls.maxZoom = 1;
// controls.minZoom = 1;
// controls.min

// 三维样条曲线
const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(90, -40, 60),
    new THREE.Vector3(120, 30, 30),
]);


//网格地面
const gridHelper = new THREE.GridHelper(1000, 20)
scene.add(gridHelper)

let textLoader = new THREE.TextureLoader()

const rain = new URL('@/assets/images/textTure/rain.png', import.meta.url).href
const snow = new URL('@/assets/images/textTure/snow.png', import.meta.url).href

// 样条曲线path作为TubeGeometry参数生成管道
const geometry1 = new THREE.TubeGeometry(path, 20, 10, 10);
const texLoader = new THREE.TextureLoader();
//纹理贴图
const texture = textLoader.load(snow)

const spriteMaterial = new THREE.SpriteMaterial({
    color: 0x00ffff,
    map: texture, //设置精灵纹理贴图
    // transparent: true,//SpriteMaterial默认是true

})
// const sprite = new THREE.Sprite(spriteMaterial)

// sprite.scale.set(50, 50, 10);
// sprite.position.set(0, 100 + 10 / 2, 0);



const group = new THREE.Group();
for (let i = 0; i < 5000; i++) {
    // 精灵模型共享材质
    const sprite = new THREE.Sprite(spriteMaterial);
    
    sprite.scale.set(15, 15, 15);
    // 设置精灵模型位置，在长方体空间上上随机分布
    const x = 1000 * (Math.random() - 0.5);
    const y = 600 * Math.random();
    const z = 1000 * (Math.random() - 0.5);
    sprite.position.set(x, y, z)
    group.add(sprite);
}

console.log(group)
// console.log(sprite)



scene.add(group)


const init = () => {

    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial({
        color: 0x091A7A,
        wireframe: true,
        wireframeLinewidth: 5,

    })
    const box = new THREE.Mesh(geometry, material)
    box.position.set(-300, 110, -300)



    let textLoader = new THREE.TextureLoader()

    const wlRed = new URL('@/assets/images/textTure/wenli_red.jpg', import.meta.url).href
    const wlImg1 = new URL('@/assets/images/textTure/wenli_gray.jpg', import.meta.url).href
    const wlImg2 = new URL('@/assets/images/textTure/wenli2.jpg', import.meta.url).href
    const wlImg3 = new URL('@/assets/images/textTure/wenli3.jpg', import.meta.url).href
    // const ttRed = textLoader.load(wlRed)
    // const texture1 = textLoader.load(wlImg1)
    // const texture2 = textLoader.load(wlImg2)
    // const texture3 = textLoader.load(wlImg3)
    // texture2.wrapS = THREE.RepeatWrapping;
    // texture2.wrapT = THREE.RepeatWrapping;
    // texture2.repeat.set(1, 1);  // uv两个方向纹理重复数量
    // 样条曲线path作为TubeGeometry参数生成管道
    const geometry1 = new THREE.TubeGeometry(path, 20, 10, 10);
    const texLoader = new THREE.TextureLoader();
    //纹理贴图
    const texture = textLoader.load(wlImg1)
    //UV坐标U方向阵列模式
    texture.wrapS = THREE.RepeatWrapping;
    //纹理沿着管道方向阵列(UV坐标U方向)
    // texture.repeat.x = 10;
    const material1 = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide, //双面显示看到管道内壁
    });
    const mesh = new THREE.Mesh(geometry1, material1);

    mesh.position.set(0, 200, 0)
    // geometry1.scale(2,2,2)

    // 创建多段线条的顶点数据
    const p1 = new THREE.Vector3(0, 0, 100)
    const p2 = new THREE.Vector3(0, 0, 30);
    const p3 = new THREE.Vector3(0, 0, 0);
    const p4 = new THREE.Vector3(30, 0, 0);
    const p5 = new THREE.Vector3(100, 0, 0);
    // 1. 3D直线线段
    const line1 = new THREE.LineCurve3(p1, p2);
    // 2. 三维二次贝塞尔曲线
    const curve = new THREE.QuadraticBezierCurve3(p2, p3, p4);
    // 3. 3D直线线段
    const line2 = new THREE.LineCurve3(p4, p5);

    const CurvePath = new THREE.CurvePath();
    // 三条线拼接为一条曲线
    CurvePath.curves.push(line1, curve, line2);

    // CurvePath:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
    const geometry3 = new THREE.TubeGeometry(CurvePath, 50, 2, 25);

    scene.add(box, mesh)

}

const onWindowResize = () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

const render = () => {

    controls.update()
    requestAnimationFrame(render)
    renderer.render(scene, camera);
}


onMounted(() => {
    canvasDom.value?.appendChild(renderer.domElement);
    renderer.setClearColor(0xffc0cb, 0.5);
    render()
    addLight()
    // init()
    initSprite()
    rainLoop()
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

const initSprite = () => {





    // // mesh顶部中心添加标注，顶部中心坐标是(0,100,0)
    // const mesh = new THREE.Mesh(geometry, material);




    // const box = new THREE.Mesh(geometry, material)
    // box.position.set(-300, 110, -300)

    // scene.add(sprite, mesh)
    // const mesh = new THREE.Mesh(geometry,material)
}
const clock = new THREE.Clock();

const rainLoop = () => {
    group.children.forEach(sprite => {
        // 雨滴的y坐标每次减1
        sprite.position.y -= 1;
        if (sprite.position.y < 0) {
            // 如果雨滴落到地面，重置y，从新下落
            sprite.position.y = 600;
        }
    });
    requestAnimationFrame(rainLoop);
}
</script>
  
<style scoped>
#three {
    height: 100%;
    width: 100%;
}
</style>
