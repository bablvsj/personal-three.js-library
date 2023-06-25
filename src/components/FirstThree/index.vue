<template>
    <div id="FirstThree"></div>
</template>
  
<script lang="ts" setup name="FirstThree">
/* eslint-disable */
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

// const controls = new OrbitControls( camera, renderer.domElement );

let container, stats, clock, gui: any, mixer: any, actions: any, activeAction: any, previousAction;
let model, face;

const api = { state: 'Walking' };


let scene = new THREE.Scene();
// scene.position.z = 40
//创建一个摄像机对象（摄像机决定了能够在场景里看到什么）
// let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
//设置摄像机的位置，并让其指向场景的中心（0,0,0）
// camera.position.set(0, 0, 20)
// camera.lookAt(0, 0, 5);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 创建一个摄像机
/**
 * 相机设置
 */
let width = window.innerWidth; //窗口宽度
let height = window.innerHeight; //窗口高度
let k = width / height; //窗口宽高比
let s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
//创建相机对象
let camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(100, 200, 200); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)

/**
 * 光源设置
 */
//点光源
let point = new THREE.PointLight(0xffffff, 10);
point.position.set(600, 800, 1000); //点光源位置
scene.add(point); //点光源添加到场景中
//环境光
// let ambient = new THREE.AmbientLight(0x444444, 3);
// scene.add(ambient);

// let cubeGeomerty = new THREE.BoxGeometry(1, 1, 1)
// let cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
// let cube = new THREE.Mesh(cubeGeomerty, cubeMaterial)
// //设置立方体的位置
// cube.position.x = 0;
// cube.position.y = 0;
// cube.position.z = 0;
//将立方体添加到场景中
// scene.add(cube);


// let lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff })
// const points = []
// for (let i = 0; i < 40; i++) {
//     points.push(new THREE.Vector3(i, i * Math.floor(Math.random() * 2), i - Math.floor(Math.random() * 10)))
// }
// const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
// const line = new THREE.Line(lineGeometry, lineMaterial)
// scene.add(line)


// let textGeo = new THREE.TextGeometry(text,parameters)


//创建一个WebGL渲染器并设置其大小
let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xe6e6e6))
renderer.setSize(window.innerWidth, window.innerHeight)


onMounted(() => {
    initModel();
    init();

});

// const animate = () => {
//     requestAnimationFrame(animate);
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//     renderer.render(scene, camera);
// }

const init = () => {
    //将渲染的结果输出到指定页面元素中
    document.getElementById("FirstThree")?.appendChild(renderer.domElement);
    //渲染场景
    renderer.render(scene, camera);
    // animate();
};

const initModel = () => {


    const loader = new GLTFLoader();
    loader.load('/models/porsche_911_930_turbo.glb', (gltf) => {
        let model = gltf.scene
        model.scale.set(50, 50, 50)
        scene.add(model);
        renderer.render(scene, camera);
    }, undefined, function (error) {
        console.error(error);
    });


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
        renderer.render(scene, camera);
    });//监听鼠标、键盘事件


    loader.load('/models/datacenter.glb', (gltf) => {
        let model = gltf.scene
        model.scale.set(1, 1, 1)
        scene.add(model);


        // baseModel.setScalc(0.2);
        // baseModel.object.rotation.y = Math.PI / 2;
        // const model = baseModel.gltf.scene;
        model.position.set(0, 0, 0);
        model.name = '机房';
        // baseModel.openCastShadow();

        // dataCenter = baseModel;
        // oldDataCenter = model.clone();

        const rackList: any[] = [];
        model.traverse(item => {
            if (checkIsRack(item)) {
                rackList.push(item);
            }
        });
        console.log(rackList, 'rackList------');

        let ray = new THREE.Raycaster()

        // viewer.setRaycasterObjects(rackList);

    }, undefined, function (error) {
        console.error(error);
    });


};

const checkIsRack = (obj: any): boolean => {
    return checkNameIncludes(obj, 'rack');
}


const checkNameIncludes = (obj: any, str: string): boolean => {
    if (obj.name.includes(str)) {
        return true;
    } else {
        return false;
    }
}








// const createGUI = (model: any, animations: any) => {

//     const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
//     const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

//     gui = new GUI();

//     mixer = new THREE.AnimationMixer(model);

//     actions = {};

//     for (let i = 0; i < animations.length; i++) {

//         const clip = animations[i];
//         const action = mixer.clipAction(clip);
//         actions[clip.name] = action;

//         if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {

//             action.clampWhenFinished = true;
//             action.loop = THREE.LoopOnce;

//         }

//     }

//     // states

//     const statesFolder = gui.addFolder('States');

//     const clipCtrl = statesFolder.add(api, 'state').options(states);

//     clipCtrl.onChange(function () {

//         fadeToAction(api.state, 0.5);

//     });

//     statesFolder.open();

//     // emotes

//     const emoteFolder = gui.addFolder('Emotes');

//     for (let i = 0; i < emotes.length; i++) {

//         createEmoteCallback(emotes[i]);

//     }

//     emoteFolder.open();

//     // expressions

//     face = model.getObjectByName('Head_4');

//     const expressions = Object.keys(face.morphTargetDictionary);
//     const expressionFolder = gui.addFolder('Expressions');

//     for (let i = 0; i < expressions.length; i++) {

//         expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i]);

//     }

//     activeAction = actions['Walking'];
//     activeAction.play();

//     expressionFolder.open();

// }

// const emoteFolder = gui.addFolder('Emotes');



// const createEmoteCallback = (name: any) => {

//     api[name] = function () {

//         fadeToAction(name, 0.2);

//         mixer.addEventListener('finished', restoreState);

//     };

//     emoteFolder.add(api, name);

// }

// const restoreState = () => {

//     mixer.removeEventListener('finished', restoreState);

//     fadeToAction(api.state, 0.2);

// }


// const fadeToAction = (name, duration) => {

//     previousAction = activeAction;
//     activeAction = actions[name];

//     if (previousAction !== activeAction) {

//         previousAction.fadeOut(duration);

//     }

//     activeAction
//         .reset()
//         .setEffectiveTimeScale(1)
//         .setEffectiveWeight(1)
//         .fadeIn(duration)
//         .play();

// }



</script>
  
<style scoped>
#FirstThree {
    height: 100%;
    width: 100%;
}
</style>
  