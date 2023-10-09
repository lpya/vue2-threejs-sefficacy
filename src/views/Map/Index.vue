<template>
  <div class="map">
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      stats: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      const el = document.getElementById('container');
      this.initScene();
      this.initCamera();
      this.initRenderer(el);
      this.initOrbitControls();
      this.initAxesHelper();
      this.initStats(el);
      this.render();
      this.animation()
      this.initMap()
      window.addEventListener('resize', this.onWindowResize);
    },
    // 场景
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);
    },
    // 相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        75, // 视野角度
        window.innerWidth / window.innerHeight, // 宽高比
        0.1, // 近平面
        1000 // 远平面
      );
      // this.camera.position.set(1000, 1500, 2000);
      this.camera.position.z = 5;
    },
    // 渲染器
    initRenderer(el) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setClearColor(0xeeeeee, 1.0);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      el.appendChild(this.renderer.domElement);
    },
    // 缩放
    initOrbitControls() {
      let controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.addEventListener('change', this.render);
    },
    // 坐标轴
    initAxesHelper() {
      const axes = new THREE.AxesHelper(2000);
      this.scene.add(axes);
    },
    // 性能
    initStats(el) {
      this.stats = new Stats();
      el.appendChild(this.stats.dom);
    },
    // 自适应
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    // 渲染
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    animation() {
      if (this.stats) {
        this.stats.update();
      }
      requestAnimationFrame(this.animation.bind(this));
    },
    // 渲染地图
    initMap() {
      const loader = new THREE.FileLoader();
      loader.load(
        'https://geo.datav.aliyun.com/areas_v3/bound/440000_full.json',
        (data) => {
          const json = JSON.parse(data);
          let province = THREE.Group()
          // json.features.forEach((item) => {
          //   item.geometry.coordinates[0][0].forEach((itemTwo) => { })
          // })
          // 创建一个几何体
          let pointDatas = [];
          const geometry = new THREE.BufferGeometry();
          // 在这里使用 json 数据设置 geometry 的顶点等信息
          // 创建一个 Float32Array 以存储顶点坐标
          json.features.forEach((item) => {
            item.geometry.coordinates[0][0].forEach((itemTwo) => {
              // console.log(itemTwo);
              pointDatas.push(itemTwo[0])
              pointDatas.push(itemTwo[1])
              pointDatas.push(0)
            })
          })

          pointDatas.push(0, 0, 0)
          console.log(pointDatas);
          // pointDatas.push(1, 1, 1)
          // pointDatas.push(4, 1, 1)
          // pointDatas.push(125, 23, 1)

          const vertices = new Float32Array(pointDatas.length * 3);
          const colors = []
          // 将坐标信息转换为顶点坐标
          for (let i = 0; i < pointDatas.length; i++) {
            vertices[i] = pointDatas[i];
            // if (i % 3 === 0) {
            colors.push(Math.random() + 0.5)
            // }
          }
          // // 添加顶点属性到几何体
          geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
          geometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(this.colors, 3)
          );
          // 创建一个材质
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

          // 创建一个网格对象并添加到场景中
          const mesh = new THREE.Mesh(geometry, material);
          this.scene.add(mesh);
        }
      );
    }

  }
};
</script>
