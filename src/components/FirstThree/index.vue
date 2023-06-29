<template>
    <div id="FirstThree" style="height: 100%;width:100%;"></div>
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
import { DRACOLoader, } from "three/examples/jsm/loaders/DRACOLoader"
import Stats from 'three/examples/jsm/libs/stats.module.js';


let container, clock, gui: any, mixer: any, actions: any, activeAction: any, previousAction;
let model, face;

const api = { state: 'Walking' };


let scene = new THREE.Scene();
// scene.position.z = 40
//创建一个摄像机对象（摄像机决定了能够在场景里看到什么）
// let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
//设置摄像机的位置，并让其指向场景的中心（0,0,0）
// camera.position.set(0, 0, 20)
const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);
// 创建一个摄像机
/**
 * 相机设置
 */
let width = window.innerWidth; //窗口宽度
let height = window.innerHeight; //窗口高度
let k = width / height; //窗口宽高比
let s = 500; //三维场景显示范围控制系数，系数越大，显示的范围越大
//创建相机对象

let camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera.position.set(100, 100, 100); //设置相机位置
// camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
camera.lookAt(200, 200, 200);


/**
 * 光源设置
 */
//点光源
let point = new THREE.PointLight(0xffffff, 3);
point.position.set(100, 200, 300); //点光源位置
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



const load = () => {
    const scene = new THREE.Scene()
    const width = document.getElementById('FirstThree')!.clientWidth, height = document.getElementById("FirstThree")!.clientHeight,
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const controls = new OrbitControls(camera, renderer.domElement)
    const threeDimensionalModelParent = ref<any>({})

    const init = () => {
        scene.background = new THREE.Color(0xf5f5f5) // 场景背景色
        scene.fog = new THREE.FogExp2(0xf5f5f5, 0.002) // 线性雾
        renderer.setPixelRatio(window.devicePixelRatio) // 设备像素比  Window.devicePixelRatio 可返回当前显示设备的物理像素分辨率与CSS像素分辨率之比
        renderer.setSize(width, height) //画布大小
        document.getElementById("FirstThree")?.appendChild(renderer.domElement) // 添加事件监听的HTML元素

        camera.position.set(200, 200, 200) //相机位置

        controls.listenToKeyEvents(window) //为指定的DOM元素添加按键监听 官方推荐将window作为指定的DOM元素。
        controls.enableDamping = true //将其设置为true以启用阻尼（惯性），这将给控制器带来重量感。默认值为false。请注意，如果该值被启用，你将必须在你的动画循环里调用.update()。
        controls.dampingFactor = 0.05 //当enableDamping设置为true的时候，阻尼惯性有多大。 Default is 0.05. 请注意，要使得这一值生效，你必须在你的动画循环里调用.update()。
        controls.screenSpacePanning = false  //定义当平移的时候摄像机的位置将如何移动。如果为true，摄像机将在屏幕空间内平移。 否则，摄像机将在与摄像机向上方向垂直的平面中平移
        controls.minDistance = 100 //相机最小移动速度 默认为0
        controls.maxDistance = 500 //相机最大移动速度 默认为Infinity

        loadGLTF()//加载模型

        const dirLight1 = new THREE.DirectionalLight(0xffffff) //平行光
        dirLight1.position.set(1, 1, 1) //设置光的角度
        scene.add(dirLight1)

        const dirLight2 = new THREE.DirectionalLight(0x002288) //同上
        dirLight2.position.set(- 1, - 1, - 1) //为了背面也有光效
        scene.add(dirLight2)

        const ambientLight = new THREE.AmbientLight(0x222222) //环境光
        scene.add(ambientLight)

        window.addEventListener('resize', onWindowResize)  //监听窗口缩放
    }

    const loadGLTF = () => {
        try {
            const loader = new GLTFLoader().setPath("/models/porsche_911_930_turbo.glb") //加载模型 可以为空 

            loader.load('', (gltf) => { //.load ( url : String, onLoad : Function, onProgress : Function, onError : Function )
                let theModel = gltf.scene
                theModel.traverse((o: any) => {
                    if (o.isMesh) {
                        o.castShadow = true //投射阴影
                        o.receiveShadow = true //接受阴影
                    }
                })

                theModel.rotation.y = Math.PI //旋转模型 0 ~ Math.PI

                theModel.position.y = -1 //模型放置位置 

                theModel.scale.set(50, 50, 50) //比例 长宽高 看模型调试
                threeDimensionalModelParent.value = theModel //存放一下原始模型 备用
                scene.add(theModel) //把模型加入场景
            })
        } catch (err) {
            console.log(err)
            //   message.error('模型加载失败')
        }
    }

    const onWindowResize = () => {
        let newWidth = document.getElementById("FirstThree")!.clientWidth, newHeight = document.getElementById("FirstThree")!.clientHeight
        camera.aspect = newWidth / newHeight // 摄像机视锥体长宽比
        camera.updateProjectionMatrix() //更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
        renderer.setSize(newWidth, newHeight)
    }

    const animate = () => {
        requestAnimationFrame(animate) //重绘
        controls.update() //更新控制器
        render()
    }

    const render = () => {
        renderer.render(scene, camera)
    }

    init()
    animate()
}



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// renderer.setClearColor("#222222");
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
const geometry = new THREE.BoxGeometry(10, 10, 10);
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
    color: "#dadada",
    wireframe: true,
    transparent: true,
});
const wireframeCube = new THREE.Mesh(geometry2, material2);
scene.add(wireframeCube);

//创建一个WebGL渲染器并设置其大小
// let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xe6e6e6))
renderer.setSize(window.innerWidth, window.innerHeight)

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// 点光源
// const pointLight = new THREE.PointLight(0xffffff, 1);
// pointLight.position.set(25, 50, 25);
// scene.add(pointLight);


const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.04;
    cube.rotation.y += 0.04;
    wireframeCube.rotation.x -= 0.01;
    wireframeCube.rotation.y -= 0.01;
    renderer.render(scene, camera);
}

onMounted(() => {
    initModel();
    init();
    // animate();
    // load()

});

// const animate = () => {
//     requestAnimationFrame(animate);
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//     renderer.render(scene, camera);
// }

const stats = new Stats();
stats?.setMode(1);

const init = () => {
    //将渲染的结果输出到指定页面元素中

    document.getElementById("FirstThree")?.appendChild(stats.domElement);
    document.getElementById("FirstThree")?.appendChild(renderer.domElement);
    //渲染场景
    render()
    animate();
};

const render = () => {
    //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
    stats.update();
    renderer.render(scene, camera); //执行渲染操作
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}

const initModel = () => {

    // const num = 1000; //控制长方体模型数量
    // for (let i = 0; i < num; i++) {
    //     const geometry = new THREE.BoxGeometry(5, 5, 5);
    //     const material = new THREE.MeshLambertMaterial({
    //         color: 0x00ffff
    //     });
    //     const mesh = new THREE.Mesh(geometry, material);
    //     // 随机生成长方体xyz坐标
    //     const x = (Math.random() - 0.5) * 500
    //     const y = (Math.random() - 0.5) * 500
    //     const z = (Math.random() - 0.5) * 700
    //     mesh.position.set(x, y, z)
    //     scene.add(mesh); // 模型对象插入场景中
    // }

    const geometry = new THREE.BoxGeometry(50, 50, 50);
    //材质对象Material
    const material = new THREE.MeshLambertMaterial({
        color: 0x00ffff, //设置材质颜色
        transparent: true,//开启透明
        // opacity: 0.5,//设置透明度
    });
    for (let i = 0; i < 10; i++) {
        const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        // 沿着x轴分布
        mesh.position.set(i *20, i * 20, i * 20);
        scene.add(mesh); //网格模型添加到场景中
    }



    // const loader = new GLTFLoader();
    // loader.load('/models/porsche_911_930_turbo.glb', (gltf) => {
    //     let model = gltf.scene
    //     model.scale.set(50, 50, 50)
    //     scene.add(model);
    //     renderer.render(scene, camera);
    // }, undefined, function (error) {
    //     console.error(error);
    // });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
        renderer.render(scene, camera);
    });//监听鼠标、键盘事件


    // loader.load('/models/datacenter.glb', (gltf) => {
    //     let model = gltf.scene
    //     model.scale.set(1, 1, 1)
    //     scene.add(model);


    //     // baseModel.setScalc(0.2);
    //     // baseModel.object.rotation.y = Math.PI / 2;
    //     // const model = baseModel.gltf.scene;
    //     model.position.set(0, 0, 0);
    //     model.name = '机房';
    // baseModel.openCastShadow();


    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.addEventListener('change', () => {
    //     renderer.render(scene, camera);
    // });//监听鼠标、键盘事件


    // loader.load('/models/datacenter.glb', (gltf) => {
    //     let model = gltf.scene
    //     model.scale.set(60, 60, 60)
    //     scene.add(model);
    //     model.position.set(0, 0, 0);
    //     model.name = '机房';
    //     const rackList: any[] = [];
    //     model.traverse(item => {
    //         if (checkIsRack(item)) {
    //             rackList.push(item);
    //         }
    //     });
    //     console.log(rackList, 'rackList------');

    // }, undefined, function (error) {
    //     console.error(error);
    // });


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





// const createEmoteCallback = (name:any) => {

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
  