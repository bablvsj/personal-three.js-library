<template>
    <div style="position: relative;">
        <div ref="canvasDom" id="sevenC" style="height: 800px;z-index:1 ;position: relative;"></div>
        <!-- <div style="position: absolute;z-index:999;top:0;right: 0;cursor: pointer;" @click="exportCanvas">导出</div> -->
    </div>
</template>
  
<script lang="ts" setup name="SevenC">
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
camera.position.set(0, 600, 600)    //镜头视角点设置
camera.lookAt(0, 0, 0)


//生成圆弧顶点
const createArcVertex = () => {
    const geometry = new THREE.BufferGeometry(); //创建一个几何体对象    
    const R = 100;                               //圆弧半径
    const N = 32;                                //分段数量（ N控制圆弧精度：就是创建多少个顶点 ）
    const sp = 2 * Math.PI / N;                  //两个相邻点间隔弧度

    // 批量生成圆弧上的顶点数据
    const arr = [];
    // N控制圆弧精度：就是创建多少个顶点
    // for (let i = 0; i < N; i++) {
    //     const angle =  sp * i;//当前点弧度
    //     // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
    //     const x = R * Math.cos(angle);
    //     const y = R * Math.sin(angle);
    //     arr.push(x, y, 0);//xyz坐标
    // }

    // 设置圆心坐标
    const cx = 0;
    const cy = 50;
    for (let i = 0; i < N + 1; i++) {
        const angle = sp * i;//当前点弧度
        const x = cx + R * Math.cos(angle);
        const y = cy + R * Math.sin(angle);
        arr.push(x, y, 0);
    }

    //类型数组创建顶点数据
    const vertices = new Float32Array(arr);
    // 创建属性缓冲区对象
    //3个为一组，表示一个顶点的xyz坐标
    const attribue = new THREE.BufferAttribute(vertices, 3);
    // 设置几何体attributes属性的位置属性
    geometry.attributes.position = attribue;

    // 线材质
    const material = new THREE.LineBasicMaterial({
        color: 0xff0000 //线条颜色
    });
    // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
    // const line = new THREE.Line(geometry, material); 
    const line = new THREE.LineLoop(geometry, material);//线条模型对象

    line.position.set(-500, 50, -500)

    scene.add(line)
}

const createGeometry = () => {
    const group = new THREE.Group()
    const geometry = new THREE.BufferGeometry(); //创建一个几何体对象

    const pointsArr = [
        // 三维向量Vector3表示的坐标值
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 100, 0),
        new THREE.Vector3(0, 100, 100),
        new THREE.Vector3(0, 0, 100),
    ];

    const pointsArrt = [
        // 三维向量Vector2表示的坐标值
        new THREE.Vector2(0, 0),
        new THREE.Vector2(100, 0),
        new THREE.Vector2(100, 100),
        new THREE.Vector2(0, 100),
    ];

    // 三维向量Vector3创建一组顶点坐标
    const arr = [
        new THREE.Vector3(-50, 20, 90),
        new THREE.Vector3(-10, 40, 40),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(60, -60, 0),
        new THREE.Vector3(70, 0, 80)
    ]
    // 三维样条曲线
    const curve = new THREE.CatmullRomCurve3(arr);
    const arrT = [
        new THREE.Vector2(-100, 0),
        new THREE.Vector2(0, 30),
        new THREE.Vector2(100, 0),
    ]
    // 三维样条曲线
    const curveT = new THREE.SplineCurve(arrT);
    const pointsCurve = curve.getPoints(100);
    const pointsCurveT = curveT.getPoints(100);
    geometry.setFromPoints(pointsArr)


    // 线材质
    const material = new THREE.LineBasicMaterial({
        color: 0x0000ff //线条颜色
    });
    // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
    // const line = new THREE.Line(geometry, material); 
    const geo = new THREE.LineLoop(geometry, material);//线条模型对象

    const geo2 = geo.clone()
    geo2.geometry = geo.geometry.clone()
    geo2.material = geo.material.clone()
    geo2.material.color.set(0x00ffff)
    geo2.geometry.setFromPoints(pointsArrt)

    const geoCurve = geo.clone()
    geoCurve.geometry = geo.geometry.clone()
    geoCurve.material = geo.material.clone()
    geoCurve.material.color.set(0x00ffff)
    geoCurve.geometry.setFromPoints(pointsCurve)
    geoCurve.position.z = 50

    // 用点模型可视化样条曲线经过的顶点位置
    const geometry2 = new THREE.BufferGeometry();
    geometry2.setFromPoints(pointsCurve);
    const material2 = new THREE.PointsMaterial({
        color: 0xff00ff,
        size: 10,
    });
    //点模型对象
    const points = new THREE.Points(geometry2, material2);
    const pointsTwo = points.clone()
    pointsTwo.geometry = points.geometry.clone()
    pointsTwo.geometry.setFromPoints(pointsCurveT);
    group.add(geo, geo2, geoCurve, points, pointsTwo)
    group.position.set(0, 50, -300)
    scene.add(group)
}

const createBezierCurve = () => {
    const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
    const geometryT = new THREE.BufferGeometry(); //创建一个几何体对象

    // 贝塞尔曲线 p1、p2、p3表示三个点坐标
    // p1、p3是曲线起始点，p2是曲线的控制点
    // const p1 = new THREE.Vector2(-80, 0);
    // const p2 = new THREE.Vector2(20, 100);
    // const p3 = new THREE.Vector2(80, 0);

    // // 二维二次贝赛尔曲线
    // const p1 = new THREE.Vector3(-80, 0, 0);
    // const p2 = new THREE.Vector3(20, 100, 0);
    // const p3 = new THREE.Vector3(80, 0, 100);
    // const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);


    // 三维三次贝赛尔曲线
    // const p1 = new THREE.Vector3(-80, 0, 0);
    // const p2 = new THREE.Vector3(-40, 50, 0);
    // const p3 = new THREE.Vector3(50, 50, 0);
    // const p4 = new THREE.Vector3(80, 0, 100);
    // const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);

    // p1、p3轨迹线起始点坐标
    const p1 = new THREE.Vector3(-100, 0, -100);
    const p3 = new THREE.Vector3(100, 0, 100);
    // 计算p1和p3的中点坐标
    const x2 = (p1.x + p3.x) / 2;
    const z2 = (p1.z + p3.z) / 2;
    const h = 50;
    const p2 = new THREE.Vector3(x2, h, z2);
    const arr = [p1, p2, p3];
    // 三维样条曲线
    const curve = new THREE.CatmullRomCurve3(arr);
    // p1、p3轨迹线起始点坐标
    const p1T = new THREE.Vector3(-100, 0, -100);
    const p3T = new THREE.Vector3(100, 0, 100);
    // 计算p1和p3的中点坐标
    const x2T = (p1T.x + p3T.x) / 2;
    const z2T = (p1T.z + p3T.z) / 2;
    const hT = 100;
    const p2T = new THREE.Vector3(x2T, hT, z2T);
    // 三维二次贝赛尔曲线
    const curveT = new THREE.QuadraticBezierCurve3(p1T, p2T, p3T);
    const pointsCurve = curve.getPoints(100);
    const pointsCurveT = curveT.getPoints(100);

    geometry.setFromPoints(pointsCurve)
    geometryT.setFromPoints(pointsCurveT)


    // 线材质
    const material = new THREE.LineBasicMaterial({
        color: 0x0000ff //线条颜色
    });
    // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
    // const line = new THREE.Line(geometry, material); 
    const geo = new THREE.Line(geometry, material);//线条模型对象
    geo.position.set(-300, 50, 300)
    const geometry2 = new THREE.BufferGeometry();
    geometry2.setFromPoints([p1, p2, p3]);
    const material2 = new THREE.LineBasicMaterial({
        color: 0xff00ff,

    });
    //点模型对象
    const points = new THREE.Points(geometry2, material2);
    // 三个点构成的线条
    const line2 = new THREE.Line(geometryT, material2);
    line2.position.set(-300, 50, 300)

    // 扫描轮廓：Shape表示一个平面多边形轮廓
    const shape = new THREE.Shape([
        // 按照特定顺序，依次书写多边形顶点坐标
        new THREE.Vector2(0, 0), //多边形起点
        new THREE.Vector2(0, 10),
        new THREE.Vector2(10, 10),
        new THREE.Vector2(10, 0),
    ]);

    // 扫描轨迹：创建轮廓的扫描轨迹(3D样条曲线)
    const curveS = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, -50, -50),
        new THREE.Vector3(10, 0, 0),
        new THREE.Vector3(8, 50, 50),
        new THREE.Vector3(-5, 0, 100)
    ]);

    //扫描造型：扫描默认没有倒角
    const geometryS = new THREE.ExtrudeGeometry(
        shape, //扫描轮廓
        {
            extrudePath: curveS,//扫描轨迹
            steps: 50//沿着路径细分精度，越大越光滑
        }
    );

    const materialS = new THREE.MeshBasicMaterial({
        color: 0x8800ff,
    });

    const line3 = new THREE.Line(geometryS, materialS);
    line3.position.set(100, 50, 100)

    scene.add(geo, line2, line3)
}

const createCombineLine = () => {
    const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
    const R = 80;//圆弧半径
    const H = 100;//直线部分高度
    // 直线1
    const line1 = new THREE.LineCurve(new THREE.Vector2(R, H), new THREE.Vector2(R, 0));
    // 圆弧
    const arc = new THREE.ArcCurve(0, 0, R, 0, Math.PI, true);
    // 直线2
    const line2 = new THREE.LineCurve(new THREE.Vector2(-R, 0), new THREE.Vector2(-R, H));

    // CurvePath创建一个组合曲线对象
    const CurvePath = new THREE.CurvePath();
    //line1, arc, line2拼接出来一个U型轮廓曲线，注意顺序
    CurvePath.curves.push(line1, arc, line2);

    const pointsArr = CurvePath.getSpacedPoints(16);
    geometry.setFromPoints(pointsArr); //读取坐标数据赋值给几何体顶点
    // 可视化curve.getPoints从曲线上获取的点坐标
    const material2 = new THREE.PointsMaterial({
        color: 0xff00ff,
        size: 10,
    });
    //点模型对象
    const points = new THREE.Points(geometry, material2);

    // 线材质
    const material = new THREE.LineBasicMaterial({
        color: 0x0000ff //线条颜色
    });
    const geo = new THREE.Line(geometry, material);//线条模型对象
    points.position.set(-500, 50, -100)
    scene.add(points)
}

const createTubeGeo = () => {

    // 三维样条曲线
    const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-50, 20, 90),
        new THREE.Vector3(-10, 40, 40),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(60, -60, 0),
        new THREE.Vector3(70, 0, 80)
    ]);

    // path:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
    // const geometry = new THREE.TubeGeometry(path, 40, 2, 25);

    const material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,//双面显示看到管道内壁,
        color: 0xe88eff,
    });

    // 创建多段线条的顶点数据
    const p1 = new THREE.Vector3(0, 0, 200)
    const p2 = new THREE.Vector3(0, 0, 30);
    const p3 = new THREE.Vector3(0, 0, 0);
    const p4 = new THREE.Vector3(30, 0, 0);
    const p5 = new THREE.Vector3(300, 0, 0);
    // 1. 3D直线线段
    const line1 = new THREE.LineCurve3(p1, p2);
    // 2. 三维二次贝塞尔曲线
    const curve = new THREE.QuadraticBezierCurve3(p2, p3, p4);
    // 3. 3D直线线段
    const line2 = new THREE.LineCurve3(p4, p5);

    const CurvePath = new THREE.CurvePath();
    // 三条线拼接为一条曲线
    CurvePath.curves.push(line1, curve, line2);

    // CurvePath:路径   /沿着轨迹细分数  /管道半径  /管道截面圆细分数
    const geometry = new THREE.TubeGeometry(CurvePath, 50, 30, 50);
    const points = new THREE.Mesh(geometry, material);
    points.position.set(-500, 50, -100)
    scene.add(points)
}

const createLatheGeo = () => {
    const curve = new THREE.SplineCurve([
        new THREE.Vector2(50, 60),
        new THREE.Vector2(25, 0),
        new THREE.Vector2(50, -60)
    ]);
    //曲线上获取点,作为旋转几何体的旋转轮廓
    const pointsArr = curve.getPoints(50);
    // LatheGeometry：pointsArr轮廓绕y轴旋转生成几何体曲面
    const geometry = new THREE.LatheGeometry(pointsArr, 30);
    const material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,//双面显示看到管道内壁,
        color: 0xe33eff,
    });
    const points = new THREE.Mesh(geometry, material);
    points.position.set(-200, 50, -100)
    scene.add(points)
}

const createShapeGeo = () => {
    // 一组二维向量表示一个多边形轮廓坐标
    const pointsArr = [
        new THREE.Vector2(-50, -50),
        new THREE.Vector2(-60, 0),
        new THREE.Vector2(0, 50),
        new THREE.Vector2(60, 0),
        new THREE.Vector2(50, -50),
    ]
    // Shape表示一个平面多边形轮廓,参数是二维向量构成的数组pointsArr
    // const shape = new THREE.Shape(pointsArr);


    // Shape表示一个平面多边形轮廓
    const shape = new THREE.Shape([
        // 按照特定顺序，依次书写多边形顶点坐标
        new THREE.Vector2(-50, -50), //多边形起点
        new THREE.Vector2(-50, 50),
        new THREE.Vector2(50, 50),
        new THREE.Vector2(50, -50),
    ]);


    //拉伸造型
    const geometryT = new THREE.ExtrudeGeometry(
        shape, //二维轮廓
        {
            depth: 50, //拉伸长度
            // bevelSegments: 1, //倒直角
            // bevelThickness: 5, //倒角尺寸:拉伸方向
            // bevelSize: 5, //倒角尺寸:垂直拉伸方向
            // bevelSegments: 20, //倒圆角：倒角细分精度，默认3
            // bevelEnabled: false, //禁止倒角,默认true
        }
    );


    // LatheGeometry：pointsArr轮廓绕y轴旋转生成几何体曲面
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,//双面显示看到管道内壁,
        color: 0xe33e44,
        wireframe: true
    });

    const materialT = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,//双面显示看到管道内壁,
        color: 0xe33e44,
    });
    const points = new THREE.Mesh(geometry, material);
    const pointsT = new THREE.Mesh(geometryT, materialT)
    points.position.set(0, 50, -100)
    pointsT.position.set(0, 50, 0)
    scene.add(points, pointsT)
}


// const wlRed = new URL('@/assets/images/textTure/wenli_red.jpg', import.meta.url).href
// const wlImg1 = new URL('@/assets/images/textTure/wenli_gray.jpg', import.meta.url).href
// const wlImg2 = new URL('@/assets/images/textTure/wenli2.jpg', import.meta.url).href
// const wlImg3 = new URL('@/assets/images/textTure/wenli3.jpg', import.meta.url).href

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
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
}


onMounted(() => {

    createArcVertex()    // 圆
    createGeometry()   //各种曲线
    createBezierCurve()  // 贝塞尔曲线 + 扫描成型
    createCombineLine()   // 组合曲线
    createTubeGeo()   // 曲线路径管道
    createLatheGeo()   // 旋转成型
    createShapeGeo()   // 轮廓填充 + 拉伸成型
    // initModel()
    addLight()
    document.getElementById("sevenC")?.appendChild(renderer.domElement);
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
    startProgress()
    //加载gltf模型
    const loader = new GLTFLoader()
    loader.load(`../../../public/models/porsche_911_930_turbo.glb`, (gltf) => {  //传id让其点击不同商品展示不同模型 id对应商品的id
        const bmw = gltf.scene
        const mesh = gltf.scene.children[0]; //获取Mesh

        bmw.scale.set(20, 20, 20); //模型缩放
        scene.add(bmw) //将整个模型组添加到场景中
    }, (xhr) => {
        const percent = xhr.loaded / xhr.total;
        percent == 1 && closeProgress()
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
  