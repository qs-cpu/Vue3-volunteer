<script setup>
import moment from "moment";
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['goDetails']);

const getTagStyle = (data) => {
  return { 
    backgroundColor: data.canApply ? "#07c160" : "#ff976a" 
  };
};

const formatDate = (value) => {
  return value ? moment(value).format("YYYY-MM-DD hh:mm") : "";
};

const detailsClick = (id) => {
  emit("goDetails", id);
};

const getTagTxt = (data) => {
  return data.canApply ? "进行中" : "已结束";
};
</script>

<template>
  <div class="actItem" @click="detailsClick(data.id)">
    <div class="actItem-pic">
      <!-- 活动图片 -->
      <img :src="data.actPic" alt="活动图片" />
      <!-- 根据状态决定样式 -->
      <span class="actItem-status" :style="getTagStyle(data)">
        <!-- 根据状态展示标签 -->
        {{ getTagTxt(data) }}
      </span>
    </div>

    <div class="actItem-body">
      <p class="actItem-title">
        {{ data.title }} <!-- 标题 -->
      </p>
      <p>
        <!-- 开始时间至结束时间 -->
        {{ formatDate(data.startTime) }}
        至
        {{ formatDate(data.endTime) }}
      </p>
      <p class="actItem-tag">
        <!-- 活动地点 -->
        {{ data.isYourSchool ? "本人所在学校活动" : data.place }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.actItem {
    padding: 10px 0;
    display: flex;
    justify-content: flex-start;
}

.actItem-pic {
    width: 108px;
    height: 69px;
    position: relative;
}

.actItem-status {
    font-size: 12px;
    color: #fff;
    padding: 0 5px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #ff976a;
    border-top-right-radius: 4px;
}

.actItem img {
    width: 100%;
    height: 100%;
    margin-right: 10px;
}

.actItem-body {
    font-size: 12px;
    text-align: left;
    color: #666;
}

.actItem-title {
    font-size: 14px;
    color: black;
    margin-bottom: 6px;
}

.actItem-tag {
    display: inline-block;
    background: #ffe9d5;
    border-radius: 10px;
    font-size: 12px;
    color: #ff7d23;
    line-height: 20px;
    padding: 0 5px;
    margin-top: 6px;
}

</style>