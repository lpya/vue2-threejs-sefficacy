<template>
  <div class="index">
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      composer: null, // 效果合成器
      stats: null,
      lamp1: null,
      lamp2: null
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
      this.initPlane()
      this.initAmbientLight()
      this.loaderModel()
      // this.initBloomPass()
      this.render()
      window.addEventListener('resize', this.onWindowResize);
    },
    // 场景
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xcccccc);
    },
    // 相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.set(50, 50, 50);
    },
    // 渲染器
    initRenderer(el) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setClearColor(0xeeeeee, 1.0);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
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
    // 地板
    initPlane() {
      let geometry = new THREE.PlaneGeometry(50, 50);
      let material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        dithering: true
      })
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      // 沿着X轴旋转
      mesh.rotation.x = -Math.PI * 0.5;
      // 接受阴影
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    },
    initAmbientLight() {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0x999999);
      this.scene.add(ambientLight);
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
      if (this.composer) {
        this.composer.render();
      }
      requestAnimationFrame(this.render);
    },
    async loaderModel() {
      const model = await new Promise(resolve => {
        new GLTFLoader().load(
          '/model/scene.glb',
          (gltf) => {
            resolve(gltf.scene);
          }
        );
      });
      model.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
      });
      this.lamp1 = model.getObjectByName('Mesh_1')// 灯1
      this.lamp2 = model.getObjectByName('Mesh_2')// 灯2
      model.castShadow = true
      model.receiveShadow = true;
      // console.log(model);
      this.lamp1.material.emissive = 0xff0000
      this.lamp1.material.emissiveIntensity = 0.5
      console.log(this.lamp1);
      this.scene.add(model)
      // 灯1
      let target1 = new THREE.Object3D();
      target1.position.set(5, 0, 0);
      this.scene.add(target1);
      let light1 = this.getSpotLight()
      light1.position.set(5, 16.382, 0)
      light1.target = target1;
      this.scene.add(light1)
    },
    getSpotLight() {
      const light = new THREE.SpotLight(0xffff00, 1)
      // 投射阴影
      light.castShadow = true
      // 光照最大范围
      light.angle = 0.6
      // 半影衰减百分比
      light.penumbra = 0.2
      // 沿着光照距离的衰减量
      light.decay = 2
      // 光照最大距离
      light.distance = 30
      return light
    },
    initBloomPass() {
      let renderScene = new RenderPass(this.scene, this.camera);
      let bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      bloomPass.renderToScreen = true;
      bloomPass.threshold = 0;
      bloomPass.strength = 1;
      bloomPass.radius = 0;
      this.composer = new EffectComposer(this.renderer);
      this.composer.setSize(window.innerWidth, window.innerHeight);
      this.composer.addPass(renderScene);
      this.composer.addPass(bloomPass);
    }
  }
};
</script>
