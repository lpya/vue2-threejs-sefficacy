<template>
  <div class="roadStreamingLight">
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { geoJSON } from './subway.js'
export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      stats: null,
      texture: [],
      circleYs: []
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
      this.initStats(el);
      this.initRoadLight();
      this.animate();
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
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      // 设置相机位置（在上方）
      this.camera.position.set(0, 100, 0);
      // 设置相机朝向场景中心
      this.camera.up.set(1, 0, 0);
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
      if (this.stats) {
        this.stats.update();
      }
      if (this.texture.length !== 0) {
        this.texture.forEach((item) => {
          item.offset.x -= Math.random() / 200;
        })
      }
    },
    // 动画
    animate() {
      this.render();
      requestAnimationFrame(this.animate.bind(this));
    },
    // 流光效果
    initRoadLight() {
      geoJSON.features.forEach((item) => {
        let imgUrl = ''
        if (item.subway) {
          imgUrl = item.subway
        } else {
          imgUrl = 'line1'
        }
        // 纹理
        const texture = new THREE.TextureLoader().load(`image/line/${imgUrl}.png`, function(tex) {
          tex.needsUpdate = true
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(1, 1)
        });
        // 材质
        let material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide,
          transparent: true
        });
        let points = []
        item.geometry.coordinates.forEach((itemTwo, key) => {
          points.push(new THREE.Vector3((itemTwo[1] - 23) * 300, 0, (itemTwo[0] - 113) * 300))
        })
        // 曲线
        let curve = new THREE.CatmullRomCurve3(points);
        // 创建管道
        let tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.2, 20);
        console.log(tubeGeometry.binormals.push(new THREE.Vector3(0, 0, 0)));
        let mesh = new THREE.Mesh(tubeGeometry, material);
        this.scene.add(mesh);
        this.texture.push(texture)
      })
    }
  }
};
</script>
