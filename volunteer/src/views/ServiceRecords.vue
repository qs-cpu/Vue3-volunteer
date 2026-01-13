<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import User from '../components/ServiceRecords/User.vue'
import Overview from '../components/ServiceRecords/Overview.vue'
import RecordItem from '../components/ServiceRecords/RecordItem.vue'
import { useRouter } from 'vue-router'; // 引入 useRouter

const router = useRouter(); // 初始化 router

const year = ref({});
const dateList = ref([]);

// 新增的列表相关响应式数据
const dataList = ref([]);
const loading = ref(false);
const finished = ref(false);
const currentPage = ref(1); // 修正拼写为 currentPage

const fetchYearList = async () => {
  try {
    const response = await axios.get('/api/service/yearList');
    const { error, data = {} } = response.data;
    if (error === 0) {
      const list = data.list || [];
      dateList.value = list;
      if (list.length > 0) {
        year.value = list[list.length - 1];
      }
    }
  } catch (e) {
    console.error("Failed to fetch year list:", e);
  }
};

// 整合服务记录获取方法
const fetchServiceRecords = async (page = 1) => {
  // 如果正在加载或已全部加载完毕，则不执行
  if (loading.value || finished.value) {
    return;
  }
  
  const payload = {
    currentPage: page,
    pageSize: 10,
    // 从 year 对象中安全获取年份值
    year: year.value?.value 
  };

  loading.value = true;
  try {
    const response = await axios.get('/api/service/list', { params: payload });
    const { error, data = {} } = response.data;

    if (error === 0) {
      const fetchedList = data.list || [];
      const fetchedPage = data.current;

      // 如果请求的是第一页，则直接覆盖列表；否则追加
      if (page === 1) {
        dataList.value = fetchedList;
      } else {
        dataList.value.push(...fetchedList);
      }

      currentPage.value = fetchedPage;
      // 判断是否已加载所有数据
      finished.value = data.pageCount === fetchedPage;
    } else {
      // 错误时停止加载
      finished.value = true;
    }
  } catch (err) {
    console.error("Failed to fetch service records:", err);
    finished.value = true; // 异常时停止加载
  } finally {
    loading.value = false; // 无论成功失败，都解除加载状态
  }
};

onMounted(() => {
  fetchYearList();
});

// 监听 year 变化，当年份数据可用或改变时，重新加载服务记录
// 监听 year 变化，当年份数据可用或改变时，重新加载服务记录
watch(year, (newYear) => {
    // 简化条件，只要 year 对象存在就触发加载
    if (newYear) { 
        currentPage.value = 1; // 重置页码
        finished.value = false; // 允许重新加载
        dataList.value = []; // 清空旧数据
        fetchServiceRecords(1); // 从第一页开始加载
    }
}, { deep: true, immediate: true }); 

// van-list 的加载事件处理函数
const onLoad = () => {
  fetchServiceRecords(currentPage.value + 1); // 加载下一页
};

// 导航到详情页的函数
const goDetails = (id) => {
  console.log('Navigating to details for ID:', id);
  // 假设使用 vue-router 导航到名为 'ActDetails' 的路由
  router.push({ name: 'serviceDetail', params: { id: id } }); 
};

// 更新年份的函数，由子组件 User 触发
const updateYear = (yearValue) => {
  year.value = yearValue;
};
</script>

<template>
  <div>
    <div class="header">
      <User @updateYear="updateYear" :date="year" :dateList="dateList">
      </User>
    </div>
    <div class="overview">
        <Overview :year="year"></Overview>
    </div>
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了"
    @load="onLoad">
    <RecordItem v-for="item in dataList" :key="item.id" :data="item"
    @goDetails="goDetails">
    </RecordItem>
    </van-list>
  </div>
</template>
<style scoped>
.header {
  padding: 10px 10px 44px 10px;
  background-color: #c82519;
}

.overview {
  padding: 14px;
  margin-top: -24px;
}
</style>