<template>
  <div id="container"></div>
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
      stats: null,
      pointsCloud: null,
      bufferGeometry: null,
      positions: [],
      colors: [],
      num: 0,
      timer: null
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
      this.initCube();
      this.initStats(el);
      this.animation();
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
        45,
        window.innerWidth / window.innerHeight,
        1,
        5000
      );
      this.camera.position.set(1000, 0, -2000);
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
    // 渲染
    render() {
      if (this.renderer) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    // 自适应
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    // 动画帧
    animation() {
      if (this.stats) {
        this.stats.update();
      }
      requestAnimationFrame(this.animation);
    },
    // 正方体
    initCube() {
      const material = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true
      });
      this.bufferGeometry = new THREE.BufferGeometry();
      this.pointsCloud = new THREE.Points();
      this.pointsCloud.material = material;
      this.scene.add(this.pointsCloud);
      this.timer = setInterval(() => {
        this.initCubeData();
      }, 1);
    },
    // 点云数据
    initCubeData() {
      if (this.num > 1000000) {
        clearInterval(this.timer);
        return;
      }
      this.num = this.num + 1;
      const n = 1000;
      const n2 = n / 2;
      let x = Math.random() * n - n2;
      let y = Math.random() * n - n2;
      let z = Math.random() * n - n2;
      let vx = x / n + 0.5;
      let vy = y / n + 0.5;
      let vz = z / n + 0.5;
      this.colors.push(vx, vy, vz);
      this.positions.push(x, y, z);
      this.bufferGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(this.positions, 3)
      );
      this.bufferGeometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(this.colors, 3)
      );
      this.pointsCloud.geometry = this.bufferGeometry;
      this.render()
    }
  }
};
</script>
<style>
* {
  padding: 0px;
  margin: 0px;
}
</style>
