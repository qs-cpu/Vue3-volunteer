<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import moment from 'moment';
import { showSuccessToast, showFailToast } from 'vant';

const route = useRoute();

// 响应式数据
const data = ref({});
const applyStatusMap = ['', '审核中', '审核通过', '审核拒绝'];

// 格式化日期
const formatDate = (value) => {
  return value ? moment(value).format('YYYY-MM-DD hh:mm') : '--';
};

// 获取活动状态颜色
const getActStatusColor = (data) => {
  return data.canApply ? '#07C160' : '#ff976a';
};

// 获取申请状态颜色
const getActApplyColor = (data) => {
  const list = ['', '#1989fa', '#07c160', '#f6352c'];
  return list[data.applyStatus];
};

// 获取活动详情 (已修正)
const fetchDetails = async () => {
  try {
    // 1. 从URL获取ID，并转换为数字
    const activityId = parseInt(route.query.id, 10);
    if (isNaN(activityId)) {
      console.error("Invalid Activity ID from URL");
      return;
    }

    // 2. 获取完整的活动列表
    const response = await axios.get('/api/actList');
    const { error, data: responseData = {} } = response.data;

    if (error === 0 && responseData.list) {
      // 3. 在列表中查找匹配的活动
      const foundActivity = responseData.list.find(item => item.id === activityId);
      
      if (foundActivity) {
        // 4. 将找到的活动数据赋值给data
        data.value = foundActivity;
      } else {
        console.error(`Activity with ID ${activityId} not found in actList.`);
        // 可以在这里处理未找到活动的情况，例如显示一个错误消息
      }
    }
  } catch (error) {
    console.error('获取活动详情失败:', error);
  }
};

// 报名/撤销申请
const applyClick = async () => {
  try {
    const payload = {
      isApplay: data.value.applyStatus !== 1,
      id: route.query.id
    };
    
    const response = await axios.post('/api/actDetails/apply', payload);
    const { error, msg } = response.data;
    
    if (error === 0) {
      showSuccessToast('操作成功');
      // 注意：由于我们现在是从 actList 获取数据，这里的状态更新可能不会立即生效
      // 一个简单的刷新方法是重新调用 fetchDetails
      await fetchDetails();
    } else {
      showFailToast(msg || '网络错误，请稍后重试');
    }
  } catch (error) {
    console.error('操作失败:', error);
    showFailToast('网络错误，请稍后重试');
  }
};

// 组件挂载时获取初始数据
onMounted(() => {
  fetchDetails();
});
</script>
<template>
  <div class="container">
    <!-- 活动头部信息 -->
    <div class="head">
      <p class="title">{{ data.title }}</p>
      <div class="status">
        <van-tag 
          :color="getActStatusColor(data)" 
          round 
          style="margin-right: 10px"
        >
          {{ data.canApply ? '进行中' : '已结束' }}
        </van-tag>
        
        <van-tag :color="getActApplyColor(data)" round>
          {{ applyStatusMap[data.applyStatus] }}
        </van-tag>
      </div>
    </div>

    <!-- 活动时间 -->
    <div class="dataItem">
      <span class="label">活动时间</span>
      <p>
        {{ formatDate(data.startTime) }} - {{ formatDate(data.endTime) }}
      </p>
    </div>

    <!-- 活动地点 -->
    <div class="dataItem">
      <span class="label">活动地点</span>
      <p>{{ data.place }}</p> <!-- 修正拼写错误 -->
    </div>

    <!-- 活动简介 -->
    <div class="dataItem">
      <span class="label">活动简介</span>
      <!-- 注意：actList.json 中没有 content 字段，这里可能需要调整 -->
      <p>{{ data.content || '暂无简介' }}</p> 
    </div>

    <!-- 活动来源 -->
    <div class="dataItem">
      <span class="label">活动来源</span>
       <!-- 注意：actList.json 中没有 publisher 字段，这里可能需要调整 -->
      <p>{{ data.publisher || '未知' }}</p>
    </div>

    <!-- 服务时长 -->
    <div class="dataItem">
      <span class="label">服务时长</span>
       <!-- 注意：actList.json 中没有 hour 字段，这里可能需要调整 -->
      <p>{{ data.hour || '待定' }} 小时</p>
    </div>

    <!-- 招募人数 -->
    <div class="dataItem">
      <span class="label">招募人数</span>
      <!-- 注意：actList.json 中没有 total 字段，这里可能需要调整 -->
      <p>{{ data.total || '不限' }} 人</p>
    </div>

    <!-- 报名按钮 -->
    <button 
      class="fBtn" 
      v-if="[2, 3].indexOf(data.applyStatus) === -1"
      @click="applyClick"
    >
      {{ data.applyStatus === 1 ? '撤销申请' : '立即报名' }}
    </button>
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

.head {
    padding-bottom: 12px;
    border-bottom: 1px dashed #ccc;
    margin-bottom: 18px;
}

.title {
    font-size: 16px;
    color: #000;
    font-weight: bold;
    margin: 0; 
}

.status {
    padding-top: 4px;
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
    margin-right: 16px;
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
  