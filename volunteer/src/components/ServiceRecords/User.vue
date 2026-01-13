<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 定义props
const props = defineProps({
  dateList: {
    type: Array,
    default: () => []
  },
  date: {
    type: Object,
    default: () => ({})
  }
})

// 定义emits
const emit = defineEmits(['updateYear'])

// 响应式数据
const showPicker = ref(false)
const userData = ref({})

// 方法
const fetchUserData = () => {
  axios.get('/api/service/userScore')
    .then(response => {
      const { error, data = {} } = response.data
      if (error === 0) {
        userData.value = data || {}
      }
    })
    .catch(error => {
      console.error('获取用户数据失败:', error)
    })
}

const cancel = () => {
  showPicker.value = false
}

const confirm = ({ selectedOptions }) => {
  const data = selectedOptions[0]
  showPicker.value = false
  emit('updateYear', data)
}

// 生命周期
onMounted(() => {
  fetchUserData()
})
</script>

<template>
  <div class="container">
    <div class="user">
      <img class="user-avatar" :src="userData.avatar" />
      <div>
        <p class="user-name">{{ userData.name }}</p>
        <span class="user-score">{{ userData.totalScore }}积分</span>
      </div>
    </div>
    <van-button 
      round 
      hairline 
      size="mini" 
      icon="arrow-down" 
      color="#ff5d23"
      @click="showPicker = true"
    >
      {{ date.text }}
    </van-button>
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker 
        :columns="dateList" 
        @cancel="cancel" 
        @confirm="confirm" 
      />
    </van-popup>
  </div>
</template>
<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent; /* 设置背景为透明 */
}

.user {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #fff;
    font-size: 16px;
}

.user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: #fff;
    margin-right: 6px;
}

.user-name {
    margin-bottom: 4px;
}

.user-score {
    font-size: 14px;
    color: #f3f3f3;
}
</style>