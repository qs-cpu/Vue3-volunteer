<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ActItem from '../components/Home/ActItem.vue';

const router = useRouter();

// --- State for Client-Side Search ---

// Stores the search term from the input box
const keyword = ref(''); 
// Stores the complete list of activities fetched from the server
const allActivities = ref([]); 
// Controls the loading indicator for the initial data fetch
const isLoading = ref(false); 

// --- Data Fetching ---

// Fetches the entire list of activities once when the component is mounted
const fetchAllActivities = async () => {
  isLoading.value = true;
  try {
    // The mock API returns all data, so no need for pagination or keyword params
    const response = await axios.get('/api/actList');
    const { error, data = {} } = response.data;
    
    if (error === 0 && data.list) {
      allActivities.value = data.list;
    }
  } catch (err) {
    console.error("Failed to fetch activity list:", err);
    // In case of an error, ensure the list is empty
    allActivities.value = [];
  } finally {
    isLoading.value = false;
  }
};

// --- Computed Property for Filtering ---

// This computed property automatically filters the list whenever 'keyword' changes
const filteredActList = computed(() => {
  // If there's no keyword, return the full list
  if (!keyword.value.trim()) {
    return allActivities.value;
  }
  
  const lowerCaseKeyword = keyword.value.trim().toLowerCase();
  
  // Filter the activities based on title or place
  return allActivities.value.filter(activity => {
    const titleMatch = activity.title.toLowerCase().includes(lowerCaseKeyword);
    const placeMatch = activity.place.toLowerCase().includes(lowerCaseKeyword);
    return titleMatch || placeMatch;
  });
});

// --- Lifecycle Hook ---

onMounted(() => {
  fetchAllActivities();
});

// --- Navigation ---

const goMyApply = () => {
  router.push("/myApply");
};

const goDetails = (id) => {
  router.push('/actDetails?id=' + id);
};
</script>

<template>
  <div class="container">
    <!-- 搜索框 -->
    <div class="searchBox">
      <div class="search">
        <span class="search-icon"></span>
        <input placeholder="请输入地点、活动名称等关键字" v-model="keyword" />
      </div>
    </div>

    <!-- 活动列表 -->
    <div class="body">
      <!-- The van-list now simply displays the filtered data. -->
      <!-- 'loading' is used for the initial fetch, and 'finished' is always true as there's no pagination. -->
      <van-list 
        :loading="isLoading" 
        :finished="true"
        finished-text="已展示所有活动" 
      >
        <ActItem 
          v-for="item in filteredActList" 
          :key="item.id" 
          :data="item"
          @goDetails="goDetails"
        />
        <!-- Optional: Show a message if no results are found -->
        <div v-if="!isLoading && filteredActList.length === 0" class="no-results">
          没有找到相关活动
        </div>
      </van-list>
    </div>

    <!-- 我的报名按钮 -->
    <button class="fBtn" @click="goMyApply">我的报名</button>
  </div>
</template>
<style scoped>
.container {
    background-color: #fff;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 70px;
    padding-bottom: 50px;
}

.no-results {
  text-align: center;
  color: #969799;
  padding: 32px 0;
}

.searchBox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 20px 10px;
    background-color: #fff;
    z-index: 2;
}

.search {
    background-color: #f6f6f6;
    height: 30px;
    border-radius: 18px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
}

.search input {
    font-size: 14px;
}

.search-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url(../assets/search.png);
    background-size: 100% 100%;
}

.search input {
    flex: 1;
    border: none;
    outline: none;
    background-color: transparent;
}

.fBtn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 40px;
    font-size: 18px;
    border: none;
    background-color: #ff5d23;
    color: #fff;
}
</style>