<template>
  <div class="index">
    <div class="header">
      <div class="action-left"> </div>
      <div class="action-right">
        <el-button type="primary" @click="jumpHome">主页</el-button>
        <el-button type="success" @click="jumpGithub">项目地址</el-button>
      </div>
    </div>
    <div class="content">
      <el-row class="list" :gutter="20">
        <el-col v-for="(item, key) in linkList" :key="key" :span="6">
          <router-link :to="item.path" class="card">
            <div class="cover" :style="{ background: `url(${item.coverUrl})`, backgroundSize: '100% 100%' }"></div>
            <div class="title">{{ key + 1 }}-{{ item.title }}</div>
          </router-link>
        </el-col>
      </el-row>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
import { linkList } from '@/router/link.js'
export default {
  data() {
    return {
      linkList: linkList
    };
  },
  methods: {
    jumpHome() {
      window.location.href = 'https://www.lpya.cn'
    },
    jumpGithub() {
      window.location.href = 'https://github.com/lpya/vue2-threejs-sefficacy'
    }
  }
};
</script>

<style lang="scss">
.index {
  height: 100vh;
  background: #202835;
  color: #919bb0;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 20px;
    background: #323e52;
    border-bottom: 1px solid #202835;
  }

  .content {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 70px);

    .list {
      padding: 20px;
      margin-top: 20px;

      .card {
        display: block;
        border-radius: 5px;
        padding: 15px;
        background: #323e52;
        margin-bottom: 20px;
        text-decoration: none;
        color: #919bb0;
        transition: all 0.3s;

        &:hover {
          transform: scale(1.01);

          .title {
            color: #c5cfe3;
          }
        }

        .cover {
          padding-bottom: 60%;
          border-radius: 5px;
        }

        .title {
          margin-top: 10px;
          text-align: center;
          font-size: 18px;
        }
      }

    }

  }

}
</style>
