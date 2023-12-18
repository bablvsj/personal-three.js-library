<!-- eslint-disable indent -->

<template>
    <div ref="canvasDom" class="canvas-container"></div>
    <div class="pos" style="position: absolute;top:100px;right:0;font-size: 16px;display: flex;z-index:999;padding: 20px;">
        <div @click="controlClipAction('play')" class="cursor-point">播放</div>
        <div @click="controlClipAction('wait')" class="cursor-point" style="margin-left: 10px;">{{ waitText }}</div>
        <div @click="controlClipAction" class="cursor-point" style="margin-left: 10px;">停止</div>
        <div @click="nextStep" class="cursor-point" style="margin-left: 10px;">下一步</div>

    </div>
</template>
  
<script setup name="SevenG" >
/* eslint-disable */
let stats;
let grid;

const wheels = [];
import { ref, onMounted, onBeforeUnmount, } from 'vue';
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
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// 引入OutlinePass通道
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';   // FXAA抗锯齿Shader
// SMAA相比较FXAA抗锯齿效果更好一些
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';   // SMAA抗锯齿Shader   

// 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

const canvasDom = ref(null)


let scene, camera, renderer, composer;
let object;
const widthI = window.innerWidth, heightI = window.innerHeight

let outlinePass;

const params = {
    edgeStrength: 3.0,
    edgeGlow: 0.0,
    edgeThickness: 1.0,
    pulsePeriod: 0,
    usePatternTexture: false
};

const waitText = ref("暂停")



//场景
scene = new THREE.Scene()

renderer = new THREE.WebGLRenderer({ antialias: false })  //setAlpha让其可设置透明度
renderer.setSize(widthI, heightI)
renderer.setClearColor('#cccccc');

camera = new THREE.PerspectiveCamera(45, widthI / heightI, 0.1, 3000)
camera.position.set(0, 500, 1000);
camera.lookAt(100, 0, 100);

const controls = new OrbitControls(camera, renderer.domElement)

const gridHelper = new THREE.GridHelper(1000, 20, 0xDB2A2D, 0xdddddd)
scene.add(gridHelper)

const group1 = new THREE.Group()

const geometry = new THREE.BoxGeometry(40, 40, 100);
const material = new THREE.MeshPhongMaterial({ color: '#254EDB', flatShading: true });
const material3 = new THREE.MeshPhongMaterial({ color: '#3366FF' });
const material4 = new THREE.MeshPhongMaterial({ color: '#3366FF' });
const mesh3 = new THREE.Mesh(geometry, material);
const mesh4 = new THREE.Mesh(geometry, material3);
const mesh5 = new THREE.Mesh(geometry, material4);
mesh4.position.set(100, 0, 0)
mesh5.position.set(200, 0, 0)
group1.position.set(100, 100, -150)
group1.add(mesh3, mesh4, mesh5)

scene.add(group1)


// 给需要设置关键帧动画的模型命名
mesh3.name = "Box";
const times = [0, 3, 6]; //时间轴上，设置三个时刻0、3、6秒
// times中三个不同时间点，物体分别对应values中的三个xyz坐标
const values = [0, 0, 0, -500, 0, 0, 0, 0, 500];
// 0~3秒，物体从(0,0,0)逐渐移动到(100,0,0),3~6秒逐渐从(100,0,0)移动到(0,0,100)
const posKF = new THREE.KeyframeTrack('Box.position', times, values);
// 从2秒到5秒，物体从红色逐渐变化为蓝色
const colorKF = new THREE.KeyframeTrack('Box.material.color', [2, 5], [1, 0, 0, 0, 0, 1]);
// 1.3 基于关键帧数据，创建一个clip关键帧动画对象，命名"test"，持续时

// 1.3 AnimationClip表示一个关键帧动画，可以基于关键帧数据产生动画效果
// 创建一个clip关键帧动画对象，命名"test"，动画持续时间6s
// AnimationClip包含的所有关键帧数据都放到参数3数组中即可
const clip = new THREE.AnimationClip("test", 6, [posKF, colorKF]);

//包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
const mixer = new THREE.AnimationMixer(mesh3);

const clipAction = mixer.clipAction(clip)

clipAction.play()
clipAction.loop = THREE.LoopOnce;  //只执行一次 
clipAction.clampWhenFinished = true;  // 物体状态停留在动画结束的时候
// clipAction.timeScale = 1;//默认
clipAction.timeScale = 2;//2倍速
// clipAction.stop();//动画停止结束，回到开始状态
clipAction.paused = true;
clipAction.time = 1;//物体状态为动画1秒对应状态
clipAction.time = 3;//物体状态为动画3秒对应状态
clip.duration = 4


const controlClipAction = (type) => {
    if (type === 'play') clipAction.play()
    else if (type === 'wait') {
        clipAction.paused = !clipAction.paused
        if (clipAction.paused) waitText.value = "继续"
        else waitText.value = "暂停"
    }
    else clipAction.stop()
}


const gui = new GUI(); //创建GUI对象
let duration = 10
gui.add(clipAction, 'time', 0, duration).step(0.1).name('拖动').onChange(function () {
    //如果动画处于播放状态会影响拖动条时间定位
    if (!clipAction.paused){
        clipAction.paused = true; //切换为暂停状态
        bu.innerHTML = '播放'; //修改按钮样式
    }
});
// gui.add(clipAction, 'time', 0, 6).step(0.5);


const nextStep = () => {
    clipAction.time += 0.5
}

// let mixer = null; //声明一个播放器变量
// let clipAction = null; //声明一个播放器变量
// const loader = new GLTFLoader();
// loader.load("../../../public/models/datacenter.glb", function (gltf) {
//     console.log('控制台查看gltf对象结构', gltf);

//     let tfw = gltf.scene
//     tfw.scale.set(20, 20, 20)
//     scene.add(tfw)
//     mixer = new THREE.AnimationMixer(gltf.scene);
//     //  获取gltf.animations[0]的第一个clip动画对象
//     clipAction = mixer.clipAction(gltf.animations[0]); //创建动画clipAction对象
//     clipAction.play(); //播放动画
// })




// scene.add(group1);




// const div = document.getElementById('tag')
// const tag = new CSS2DObject(div)
// tag.position.set(50, 0, 50);

// scene.add(tag)

const clock = new THREE.Clock();

const render = () => {
    controls.update()
    requestAnimationFrame(render)
    renderer.render(scene, camera)

    const frameT = clock.getDelta();
    // 更新播放器相关的时间
    mixer?.update(frameT);
}

onMounted(() => {
    canvasDom.value?.appendChild(renderer.domElement);
    addLight()
    render()
    // createGUI()
})

onBeforeUnmount(()=>{
    gui.hide()
})


const addLight = () => {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(20, 30, 40)
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(-20, -30, -40);
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

    scene.add(light, light2, light3, light4, light5, light6, light7, light8, light9, light10);

    // const lightHelper = new THREE.DirectionalLightHelper(light, 10, 0xff0000)
    // scene.add(lightHelper)
}




const createGUI = () => {

    const gui = new GUI({ name: 'Pixel setting' });
    gui.add(params, 'edgeStrength', 0.01, 50).step(5).onChange(function (value) {

        outlinePass.edgeStrength = Number(value);

    });

    gui.add(params, 'edgeGlow', 0.0, 10).step(2).onChange(function (value) {

        outlinePass.edgeGlow = Number(value);

    });

    gui.add(params, 'edgeThickness', 1, 10).step(2).onChange(function (value) {

        outlinePass.edgeThickness = Number(value);

    });

    gui.add(params, 'pulsePeriod', 0.0, 10).step(2).onChange(function (value) {

        outlinePass.pulsePeriod = Number(value);

    });


    gui.add(params, 'usePatternTexture').onChange(function (value) {

        outlinePass.usePatternTexture = value;

    });

    const conf = {
        visibleEdgeColor: '#ffffff',
        hiddenEdgeColor: '#190a05',
    }

    gui.addColor(conf, 'visibleEdgeColor').onChange(function (value) {

        outlinePass.visibleEdgeColor.set(value);

    });

    gui.addColor(conf, 'hiddenEdgeColor').onChange(function (value) {

        outlinePass.hiddenEdgeColor.set(value);

    });

}

</script>
  
<style scoped>
#three {
    height: 100%;
    width: 100%;
}
</style>
