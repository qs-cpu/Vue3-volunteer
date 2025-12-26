<script setup>
import { onMounted } from 'vue'
import axios from 'axios'

onMounted(() => {
  console.log('组件已挂载，开始发送请求...')
  
  // 请求学生列表API
  axios.get('/api/studentList')
    .then((res) => {
      console.log('请求成功:', res.data.data)
    })
    .catch((error) => {
      console.error('请求失败:', error)
    })
})
</script>

<template>
  <router-view/>
</template>

<style scoped>

</style>
