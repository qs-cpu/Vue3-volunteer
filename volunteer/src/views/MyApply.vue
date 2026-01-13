<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ActItem from '../components/Home/ActItem.vue'

const router = useRouter()

// 响应式数据
const curTab = ref(0) // 0: 全部、1：审核中、2：审核通过、3：审核拒绝
const actList = ref([])
const loading = ref(false)
const finished = ref(false)
const currentPage = ref(1)

// 标签页点击事件
const tabClick = (value) => {
  curTab.value = value
  currentPage.value = 1
  fetchApplyList(1)
}

// 获取报名列表数据
const fetchApplyList = async (page = 1) => {
  loading.value = true
  
  try {
    const payload = {
      currentPage: page,
      pageSize: 10,
      type: curTab.value
    }
    
    const response = await axios.get('/api/myApplyList', { params: payload })
    const { error, data = {} } = response.data
    
    if (error === 0) {
      const currentPageNum = data.current
      const list = data.list
      
      // 当前为第一页，则覆盖已有的活动列表
      if (currentPageNum === 1) {
        actList.value = list
      } else {
        // 在已有的活动列表后添加新的数据
        actList.value.push(...list)
      }
      
      currentPage.value = currentPageNum
      // 当前数据的页数等于总页数，则说明没有更多数据了
      finished.value = data.pageCount === currentPageNum
    }
  } finally {
    loading.value = false
  }
}

// 加载更多数据
const onLoad = () => {
  fetchApplyList(currentPage.value + 1)
}

// 跳转到活动详情页面
const goDetails = (id) => {
  router.push('/actDetails?id=' + id)
}

// 组件挂载时获取初始数据
onMounted(() => {
  fetchApplyList(1)
})
</script>

<template>
  <div class="container">
    <!-- 标签页 -->
    <ul class="tabList">
      <li @click="tabClick(0)">
        <span :class="curTab === 0 ? 'active' : ''">全部</span>
      </li>
      <li @click="tabClick(1)">
        <span :class="curTab === 1 ? 'active' : ''">审核中</span>
      </li>
      
      <!-- 10.4 项目功能开发 - 7. 我的报名 -->
      <li @click="tabClick(2)">
        <span :class="curTab === 2 ? 'active' : ''">审核通过</span>
      </li>
      <li @click="tabClick(3)">
        <span :class="curTab === 3 ? 'active' : ''">审核拒绝</span>
      </li>
    </ul>

    <!-- 10.4 项目功能开发 - 7. 我的报名 -->
    <!-- 活动列表 -->
    <div class="list">
      <van-list 
        v-model:loading="loading" 
        :finished="finished" 
        finished-text="没有更多了" 
        @load="onLoad"
      >
        <ActItem 
          v-for="item in actList" 
          :key="item.id" 
          :data="item"
          @goDetails="goDetails" 
          from="applyStatus"
        />
      </van-list>
    </div>
  </div>
</template>

<style scoped>
.container {
    height: 100%;
}

.tabList {
    list-style: none;
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    z-index: 100;
}

.tabList li {
    width: 25%;
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
}

span.active {
    border-bottom: 2px solid #ff976a;
    color: #ff976a;
}

.list {
    margin-top: 52px;
    background: #fff;
}
</style>