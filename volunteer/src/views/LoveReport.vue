<script setup>  
    import axios from 'axios'
import { ref, onMounted } from 'vue'

// 10.4 项目功能开发 - 4. 积分排名
// 当前选中的积分类型：0-总积分, 1-年度积分
const curTab = ref(0)

// 排名列表数据
const dataList = ref([])

// 积分排名概览数据
const provinceRank = ref('') // 全省排名
const totalScore = ref('') // 服务总积分
const grandeRank = ref('') // 本校本年级排名

// 10.4 项目功能开发 - 4. 积分排名
// 切换积分类型标签
const tabClick = (value) => {
  curTab.value = Number(value)
  fetchOverview(curTab.value) // 重新获取概览数据
  fetchRankList(curTab.value) // 重新获取排名列表
}

// 10.4 项目功能开发 - 4. 积分排名
// 获取积分排名概览数据
const fetchOverview = (type) => {
  axios.get('/api/report/myOverview', { 
    params: { type } 
  }).then(function (response) {
    const { error, data = {} } = response.data
    if (error === 0) {
      provinceRank.value = data.provinceRank
      totalScore.value = data.totalScore
      grandeRank.value = data.grandeRank
    }
  })
}

// 10.4 项目功能开发 - 4. 积分排名
// 获取排名列表数据
const fetchRankList = (type) => {
  const payload = {
    currentPage: 1,
    pageSize: 10,
    type,
  }
  axios.get('/api/report/rankList', { params: payload })
    .then(function (response) {
      const { error, data = {} } = response.data
      if (error === 0) {
        dataList.value = data.list || []
      }
    })
}

// 10.4 项目功能开发 - 4. 积分排名
// 组件挂载时初始化数据
onMounted(() => {
  fetchOverview(curTab.value)
  fetchRankList(curTab.value)
})
</script>

<template>
  <div class="container">
    <!-- 积分类型切换 -->
    <div class="tabs">
      <div :class="{ tabItem: true, active: curTab === 0 }" @click="tabClick(0)"></div>
      <div :class="{ tabItem: true, active: curTab === 1 }" @click="tabClick(1)"></div>
    </div>

    <!-- 积分、排名总览 -->
    <div class="dataList">
      <div class="dataItem">
        <p class="dataItem-score">{{ provinceRank }}</p>
        <p class="dataItem-label">全省的排名</p>
      </div>
      <div class="dataItem">
        <p class="dataItem-score">{{ totalScore }}</p>
        <p class="dataItem-label">服务总积分</p>
      </div>
      <div class="dataItem">
        <p class="dataItem-score">{{ grandeRank }}</p>
        <p class="dataItem-label">本校本年级排名</p>
      </div>
    </div>

    <!-- 排名列表 -->
    <div class="rank">
      <div class="rank-hd">
        <p class="rank-title">本校本年级服务标兵</p>
        <p class="rank-range">1200人参与排名</p>
      </div>

      <ul class="rank-list">
        <li v-for="(item, idx) in dataList" :key="item.id">
          <div class="rank-student">
            <span class="rank-idx">{{ idx + 1 }}</span>
            <span class="rank-avatar">
              <img :src="item.avatar" />
            </span>
            <span class="rank-name">{{ item.name }}</span>
          </div>
          <div class="rank-score">{{ item.score }}分</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
    padding: 20px 10px;
}

.tabs {
    border-radius: 10px;
    /* background-color: #fff; */
    display: flex;
    border-radius: 10px;
    overflow: hidden;
}

.tabItem {
    padding: 8px 0;
    box-sizing: border-box;
    width: 50%;
    text-align: center;
    background-color: #fff;
    color: #000;
}

.active {
    background-color: #ff5d23;
    color: #fff;
}

.dataList {
    background-color: #fff;
    padding: 20px 0;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0;
}

.dataItem {
    width: 33%;
    border-right: 1px dashed #ccc;
    text-align: center;
}

.dataItem:last-child {
    border-right: none;
}

.dataItem-score {
    font-size: 16px;
    color: #000;
    margin-bottom: 10px;
}

.dataItem-label {
    font-size: 12px;
    color: #666;
}

.rank {
    padding: 20px 16px;
    border-radius: 10px;
    background-color: #fff;
}

.rank-hd {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.rank-title {
    font-size: 16px;
    color: #000;
}

.rank-range {
    font-size: 14px;
    color: #666;
}

.rank-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.rank-list li {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;
}

.rank-student {
    display: flex;
    align-items: center;
}

.rank-idx {
    font-size: 16px;
    margin-right: 10px;
}

.rank-avatar {
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 20px;
    margin-right: 10px;
}

.rank-avatar img {
    width: 32px;
    height: 32px;
}

.rank-name {
    font-size: 14px;
    color: #333;
}

.rank-score {
    color: #ff5d23;
    font-weight: bold;
}
</style>