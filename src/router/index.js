import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/Index.vue')
  },
  {
    path: '/pointCloudCube',
    name: 'PointCloudCube',
    component: () => import('@/views/PointCloudCube.vue')
  },
  {
    path: '/glowCube',
    name: 'GlowCube',
    component: () => import('@/views/GlowCube.vue')
  }, {
    path: '/breathingLamp',
    name: 'BreathingLamp',
    component: () => import('@/views/BreathingLamp.vue')
  }, {
    path: '/CSS2DRenderer',
    name: 'CSS2DRenderer',
    component: () => import('@/views/CSS2DRenderer.vue')
  }, {
    path: '/TextureLoader',
    name: 'TextureLoader',
    component: () => import('@/views/TextureLoader.vue')
  }, {
    path: '/PlaneGeometry',
    name: 'PlaneGeometry',
    component: () => import('@/views/PlaneGeometry.vue')
  },
  {
    path: '/coordinates',
    name: 'Coordinates',
    component: () => import('@/views/Coordinates.vue')
  }, {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Test.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
