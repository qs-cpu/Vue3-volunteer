<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import User from '../components/Home/User.vue'

// 响应式数据
const userInfo = ref({
  avatar: "",
  name: ""
})

// 获取用户信息的方法
const fetchUserInfo = async () => {
  try {
    const response = await axios.get("/api/userInfo")
    const { error, data = {} } = response.data
    
    if (error === 0) {
      userInfo.value = {
        avatar: data.avatar,
        name: data.name
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
    <div class="home">
        <div class="header">
        <h1>大学生志愿者活动</h1>
        <!-- 用户信息 -->
        <User :user="userInfo" />
        </div>
    </div>
</template>

<style scoped>
.header {
    height: 80px;
    padding-top: 20px;
    background-color: #c82519;
    position: relative;
}

.header h1 {
    margin: 0;
    font-size: 20px;
    color: #fff;
    letter-spacing: 2px;
    font-weight: normal;
    text-align: center;
}

.list {
    padding: 10px 20px;
    background-color: #fff;
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

}

.list-more {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #999;
}

.list-more img {
    width: 16px;
    height: 16px;
}
</style>

    
