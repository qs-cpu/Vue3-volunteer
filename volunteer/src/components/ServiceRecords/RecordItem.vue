<script setup>
import moment from 'moment'

// 定义props
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// 定义emits
const emit = defineEmits(['goDetails'])

// 状态和颜色映射
const statusMap = ['审核中', '审核通过', '审核驳回']
const bgColorMap = ['#1989fa', '#07c160', '#f6352c']

// 格式化日期
const formatDate = (value) => {
  return value ? moment(value).format('YYYY-MM-DD hh:mm') : '--'
}

// 点击详情事件
const detailsClick = () => {
  emit('goDetails', props.data.id)
}
</script>

<template>
  <div class="container">
    <div class="details" @click="detailsClick">
      <div class="imgBox">
        <img :src="data.pic" />
        <p class="status" :style="{ backgroundColor: bgColorMap[data.status] }">
          {{ statusMap[data.status] }}
        </p>
      </div>
      <div class="main">
        <p class="content">{{ data.content }}</p>
        <p class="bottomTxt">
          <span style="margin-right: 10px">{{ data.publisher }}</span>
          <span>{{ formatDate(data.time) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
    padding: 10px 16px;
    background-color: #fff;
}

.details {
    display: flex;
    align-items: flex-start;
}

.imgBox {
    width: 60px;
    height: 60px;
    margin-right: 6px;
    position: relative;
}

.imgBox img {
    width: 100%;
    height: 100%;
}

.status {
    font-size: 12px;
    color: #fff;
    padding: 0 5px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #ff976a;
    border-top-right-radius: 4px;
}

.main {
    flex: 1;
    position: relative;
    height: 60px;
}
.content {
    margin-top: 2px;
    height: 40px;
    font-size: 14px;
    color: #000;
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: initial;
    /* -webkit-line-clamp: 2; */
    -webkit-box-orient: vertical;
    word-break: break-word;
}

.bottomTxt {
    text-align: left;
    margin-top:-10px;
    font-size: 12px;
    color: #9499A0;
}
</style>