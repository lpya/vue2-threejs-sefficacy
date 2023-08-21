<template>
  <div>
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js'
export default {
  data() {
    return {
      scene: null, // 场景
      camera: null, // 相机
      renderer: null, // 渲染器
      composer: null, // 效果合成器
      light: null,
      lightHelper: null,
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
      this.initStats(el);
      this.initCube();
      this.initPlane()
      this.initOrbitControls();
      this.initSpotLight()
      this.render();
      this.animate()
      window.addEventListener('resize', this.onWindowResize);
    },
    // 场景
    initScene() {
      this.scene = new THREE.Scene();
      // this.scene.background = new THREE.Color('#ccc');
    },
    // 相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        2000
      );
      this.camera.position.set(0, 30, 80);
    },
    // 渲染器
    initRenderer(el) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      el.appendChild(this.renderer.domElement);
    },
    // 缩放
    initOrbitControls() {
      let controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.target.set(0, 7, 0);
      controls.maxPolarAngle = Math.PI / 2;
      controls.update();
    },
    // 性能
    initStats(el) {
      this.stats = new Stats();
      el.appendChild(this.stats.dom);
    },
    // 渲染
    render() {
      TWEEN.update();
      this.renderer.render(this.scene, this.camera);
      if (this.lightHelper) {
        this.lightHelper.update()
      }
      if (this.stats) {
        this.stats.update();
      }
      requestAnimationFrame(this.render);
    },
    // 自适应
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    // 立方体
    initCube() {
      const geometry = new THREE.BoxGeometry(3, 3, 3);
      const material = new THREE.MeshPhongMaterial();
      let cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
      cube.receiveShadow = true;
      this.scene.add(cube);
    },
    // 地板
    initPlane() {
      let geometry = new THREE.PlaneGeometry(50, 50);
      let material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        dithering: true
      })
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, -3, 0);
      // 沿着X轴旋转
      mesh.rotation.x = -Math.PI * 0.5;
      // 接受阴影
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    },
    // 聚光灯
    initSpotLight() {
      const light = new THREE.SpotLight(0xffffff, 1)
      // 投射阴影
      light.castShadow = true
      // 光照最大范围
      light.angle = 0.4
      // 半影衰减百分比
      light.penumbra = 0.2
      // 沿着光照距离的衰减量
      light.decay = 2
      // 光照最大距离
      light.distance = 50
      // 位置
      light.position.set(0, 20, 13)
      this.light = light
      this.scene.add(light)
      // 光照锥形辅助
      this.lightHelper = new THREE.SpotLightHelper(light);
      this.scene.add(this.lightHelper)
      // 环境光
      const ambientLight = new THREE.AmbientLight(0x404040);
      this.scene.add(ambientLight);
    },
    // 动画
    lightTween(light) {
      new TWEEN.Tween(light).to({
        angle: (Math.random() * 0.7) + 0.1,
        penumbra: Math.random() + 1
      }, Math.random() * 3000 + 2000)
        .easing(TWEEN.Easing.Quadratic.Out).start();

      new TWEEN.Tween(light.position).to({
        x: (Math.random() * 30) - 15,
        y: (Math.random() * 10) + 15,
        z: (Math.random() * 30) - 15
      }, Math.random() * 3000 + 2000)
        .easing(TWEEN.Easing.Quadratic.Out).start();
    },
    animate() {
      this.lightTween(this.light)
      setTimeout(this.animate, 5000);
    }
  }
};
</script>
