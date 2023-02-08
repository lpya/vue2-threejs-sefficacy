<template>
  <div class="coordinates">
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
      stats: null,
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
      this.initStats(el);
      this.animation()
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
      this.camera.position.set(1000, 1500, 2000);
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
    // 动画帧
    animation () {
      this.render()
      this.stats.update();
      requestAnimationFrame(this.animation);
    },
    // 渲染
    render() {
      this.renderer.render(this.scene, this.camera);
    }
  }
};
</script>
