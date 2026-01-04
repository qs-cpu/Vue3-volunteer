<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import User from '../components/Home/User.vue'
import Navs from '../components/Home/Navs.vue'
import ActItem from '../components/Home/ActItem.vue'

// 响应式数据
const userInfo = ref({
  avatar: "",
  name: ""
})

const list  = ref([])

// 路由实例
const router = useRouter()

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

const fetchActList = async () => {
  try {
    const response = await axios.get("/api/actList")
    const { error, data = {} } = response.data
    if (error === 0) {
      list.value = data.list
    }
  } catch (error) {
    console.error('获取活动列表失败:', error)
  }
}

// 查看活动详情
const goDetails = (id) => {
  router.push('/actDetails?id=' + id)
}

// 查看更多
const goMoreActs = () => {
  router.push("/loveActs")
}

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo()
  fetchActList()
})
</script>

<template>
  <div class="home">
    <div class="header">
      <h1>大学生志愿者活动</h1>
      <!-- 用户信息 -->
      <User :user="userInfo" />
    </div>
    
    <Navs />
    
    <div class="list">
      <div class="list-header">
        <span>志愿活动</span>
        <div class="list-more" @click="goMoreActs">
          查看更多
          <img src="../assets/rArrow.png" />
        </div>
      </div>
      
      <div class="actList">
        <!-- 推荐列表组件 -->
        <ActItem 
          v-for="item in list" 
          :key="item.id" 
          :data="item"
          @goDetails="goDetails"
        />
      </div>
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