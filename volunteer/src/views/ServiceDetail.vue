<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import moment from 'moment'

// 使用 useRoute 获取路由信息
const route = useRoute()
const id = route.params.id // 获取路由参数
console.log('Service ID:', id) // 调试信息

// 响应式数据
const data = ref({})
const statusMap = ['审核中', '审核通过', '审核驳回']
const bgColorMap = ['#1989fa', '#07c160', '#f6352c']
const titleMap = ['正在审核中，请耐心等待', '感谢您的服务，请收下服务积分', '审核被驳回了哟']

// 格式化日期方法
const formatDate = (value) => {
  return value ? moment(value).format('YYYY-MM-DD hh:mm') : '--'
}

const formatDay = (value) => {
  return value ? moment(value).format('YYYY-MM-DD') : '--'
}

// 获取详情数据
const fetchDetails = async () => {
  try {
    const payload = { id: route.params.id }
    const response = await axios.get('/api/service/details', { params: payload })
    const { error, data: responseData = {} } = response.data
    
    if (error === 0) {
      data.value = responseData.details || {}
    }
  } catch (error) {
    console.error('获取详情失败:', error)
  }
}

// 生命周期
onMounted(() => {
  fetchDetails()
})
</script>

<template>
  <div class="container">
    <div class="dataItem">
      <span class="label">服务时间</span>
      <span>
        {{ formatDay(data.actTime) }}
      </span>
    </div>
    <div class="dataItem">
      <span class="label">服务地点</span>
      <span>
        {{ data.place }}
      </span>
    </div>
    <div class="dataItem">
      <span class="label">服务内容</span>
      <span>{{ data.content }}</span>
    </div>
    <div class="dataItem">
      <span class="label">服务照片</span>
      <div>
        <img class="serviceImg" v-for="(url) in data.imgList" :src="url" :key="url"/>
      </div>
    </div>
    <div class="dataItem">
      <span class="label">服务时长</span>
      <span>
        {{ data.hour }}小时
      </span>
    </div>
    <div class="dataItem">
      <span class="label">纪实时间</span>
      <span> {{ formatDate(data.uploadTime) }}</span>
    </div>
    <div class="dataItem">
      <span class="label">审核状态</span>
      <span>
        <span class="status" :style="{ backgroundColor: bgColorMap[data.status] }">
          {{ statusMap[data.status] }}
        </span>
      </span>
    </div>
    <div class="footer">
      <p class="title">{{ titleMap[data.status] }}</p>
      <p class="score" v-if="data.status === 1">4分</p>
    </div>
  </div>
</template>
<style scoped>
.container {
    min-height: 100vh;          /* 让内容至少占满一屏 */
    display: flex;              /* 用列方向排布 */
    flex-direction: column;     /* 上到下 */
    justify-content: flex-start;/* 顶部对齐（不要 center） */
    align-items: stretch;       /* 拉伸子项宽度 */
    background-color: #fff;
    padding: 20px 16px;
}

.dataItem {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 14px;
    padding: 10px 0;
}

.label {
    width: 70px;
    flex: 0 0 70px;      /* 固定 70px */
    margin-right: 10px;
    color: #000;
}

.dataItem p {
    flex: 1;
}

.status {
    font-size: 12px;
    color: #fff;
    padding: 3px 5px;
    border-radius: 10px;
}

.serviceImg {
    width: 80px;
    height: 80px;
    margin-right: 5px;
}

.footer {
    text-align: center;
    margin-top: 10px;
    color: #ff5d23;
}
.title {
    font-weight: bold;
    padding-bottom: 6px;
}

span {
    text-align: left;
}
</style>