<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { showToast, showSuccessToast, showFailToast } from 'vant'

// 响应式数据
const publisher = reactive({ value: '', text: '' })
const date = ref('')
const duration = reactive({ value: '', text: '' })
const content = ref('')
const fileList = ref([])
const uploadTxt = ref('上传照片')

// 弹窗控制
const showPicker = ref(false)
const showDatePicker = ref(false)
const columns = ref([])
const currentDate = ref([])
const minDate = ref(new Date())
const maxDate = ref(new Date())

// 当前选择的picker类型
const curPickerId = ref(-1)

// 数据列表
const publisherList = ref([])
const durationList = ref([])

// 字段点击事件
const fieldClick = (pickerId) => {
  curPickerId.value = pickerId
  
  if (pickerId === 0) {
    // 活动来源选择器
    columns.value = publisherList.value.map(item => ({
      text: item.text,
      value: item.value
    }))
    showPicker.value = true
  } else if (pickerId === 1) {
    // 日期选择器
    showDatePicker.value = true
  } else if (pickerId === 2) {
    // 服务时长选择器
    columns.value = durationList.value.map(item => ({
      text: item.text,
      value: item.value
    }))
    showPicker.value = true
  }
}

// 选择器取消
const pickerCancel = () => {
  showPicker.value = false
  showDatePicker.value = false
}

// 选择器确认 (已修正)
const pickerConfirm = ({ selectedOptions, selectedValues }) => {
  // 通过 curPickerId 判断是哪个选择器触发了事件
  if (curPickerId.value === 1) { // 日期选择器
    if (selectedValues) {
      date.value = selectedValues.join('/'); // 将 [yyyy, mm, dd] 格式化为 yyyy/mm/dd
    }
    showDatePicker.value = false;
  } else { // 普通选择器 (活动来源 或 服务时长)
    const selectedItem = selectedOptions[0]; // 获取选中的完整对象 {text, value}
    if (selectedItem) {
      if (curPickerId.value === 0) { // 活动来源
        Object.assign(publisher, selectedItem);
      } else if (curPickerId.value === 2) { // 服务时长
        Object.assign(duration, selectedItem);
      }
    }
    showPicker.value = false;
  }
}

// 获取活动来源列表
const fetchPublisherlist = () => {
  axios.get('/api/act/publisherList')
    .then(response => {
      const { error, data = {} } = response.data
      if (error === 0) {
        publisherList.value = data.list || []
        console.log('活动来源列表:', publisherList.value)
      }
    })
    .catch(error => {
      console.error('获取活动来源列表失败:', error)
      showFailToast('获取活动来源失败')
    })
}

// 获取服务时长列表
const fetchDurations = () => {
  axios.get('/api/act/durationsList')
    .then(response => {
      const { error, data = {} } = response.data
      if (error === 0) {
        durationList.value = data.list || []
        console.log('服务时长列表:', durationList.value)
      }
    })
    .catch(error => {
      console.error('获取服务时长列表失败:', error)
      showFailToast('获取服务时长失败')
    })
}

// 日期范围函数
const dateRange = () => {
  const today = new Date()
  const minDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
  const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
  const currentDate = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
  
  return { currentDate, minDate, maxDate }
}

// 提交表单
const submit = () => {
  // 表单验证
  if (!publisher.text) {
    showToast('未选择活动来源')
    return
  }
  
  if (!date.value) {
    showToast('未选择服务时间')
    return
  }
  
  if (!duration.text) {
    showToast('未选择服务时长')
    return
  }
  
  if (!content.value) {
    showToast('未填写服务内容')
    return
  }
  
  if (!fileList.value.length) {
    showToast('未上传服务照片')
    return
  }
  
  // 构造提交数据
  const payload = {
    publisher: publisher, // 修正：发送完整的 publisher 对象
    date: +new Date(date.value),
    duration: duration.value,
    content: content.value,
    fileList: fileList.value,
  }
  
  // 提交数据
  axios.post('/api/act/uploadService', payload)
    .then(response => {
      const { error, msg } = response.data
      if (error === 0) {
        showSuccessToast('操作成功')
      } else {
        showFailToast(msg || '网络错误，请稍后重试')
      }
    })
    .catch(error => {
      console.error('提交失败:', error)
      showFailToast('提交失败，请稍后重试')
    })
}

// 组件挂载时初始化数据
onMounted(() => {
  const { currentDate: initDate, minDate: initMinDate, maxDate: initMaxDate } = dateRange()
  currentDate.value = initDate
  minDate.value = initMinDate
  maxDate.value = initMaxDate
  
  fetchDurations()
  fetchPublisherlist()
})
</script>
<template>
  <div>
    <!-- 表单区域 -->
    <div class="frm">
      <!-- 活动来源选择 -->
      <van-field
        v-model="publisher.text"
        is-link
        readonly
        label="活动来源"
        placeholder="请选择活动来源"
        @click="fieldClick(0)"
      />
      
      <!-- 服务时间选择 -->
      <van-field
        v-model="date"
        is-link
        readonly
        label="服务时间"
        placeholder="请选择日期"
        @click="fieldClick(1)"
      />
      
      <!-- 服务时长选择 -->
      <van-field
        v-model="duration.text"
        is-link
        readonly
        label="服务时长"
        placeholder="请选择时长"
        @click="fieldClick(2)"
      />
      
      <!-- 服务内容输入 -->
      <van-field
        v-model="content"
        label="服务内容"
        placeholder="请对服务内容进行简要描述"
        label-align="top"
        type="textarea"
        maxlength="100"
        show-word-limit
      />
      
      <!-- 文件上传 -->
      <van-uploader
        v-model="fileList"
        multiple
        max-count="2"
        :upload-text="uploadTxt"
        image-fit="cover"
        style="padding: 10px"
      />
    </div>
    
    <!-- 底部提交按钮 -->
    <div class="footer">
      <van-button
        type="primary"
        color="#ff5d23"
        block
        @click="submit"
      >
        提交
      </van-button>
    </div>
    
    <!-- 选择器弹窗 -->
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        :columns="columns"
        @cancel="pickerCancel"
        @confirm="pickerConfirm"
      />
    </van-popup>
    
    <!-- 日期选择器弹窗 -->
    <van-popup v-model:show="showDatePicker" round position="bottom">
      <van-date-picker
        v-model="currentDate"
        title="选择日期"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="pickerCancel"
        @confirm="pickerConfirm"
      />
    </van-popup>
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
    padding: 10px 16px 56px; 
}

.frm {
  background-color: #fff;
}

.footer {
  padding: 20px;
}

.fBtn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 40px;
    font-size: 16px;
    border: none;
    background-color: #ff5d23;
    color: #fff;
}
</style>