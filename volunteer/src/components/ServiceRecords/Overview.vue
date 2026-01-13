<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  year: {
    type: [Object, String, Number],
    default: null
  }
});

const data = ref({});

const fetchYearScore = async () => {
  // The original code passed the 'year' prop directly to the API.
  // This handles cases where 'year' might be a primitive or an object with a 'value' property.
  const yearParam = props.year?.value || props.year;
  if (!yearParam) {
    data.value = {};
    return;
  }

  try {
    const response = await axios.get('/api/service/yearScore', {
      params: { year: yearParam }
    });
    const { error, data: responseData = {} } = response.data;
    if (error === 0) {
      data.value = responseData || {};
    } else {
      data.value = {};
    }
  } catch (e) {
    console.error("Failed to fetch year score:", e);
    data.value = {};
  }
};

// Watch for changes in the 'year' prop and fetch data accordingly.
// 'immediate: true' ensures it runs on component mount.
// 'deep: true' is for cases where 'year' is an object.
watch(() => props.year, () => {
  fetchYearScore();
}, {
  immediate: true,
  deep: true
});
</script>

<template>
  <ul class="overview">
    <li>
      <p class="num">
        <span class="highColor">{{ data.times || 0 }}</span>次
      </p>
      <span class="label">服务次数</span>
    </li>
    <li>
      <p class="num">
        <span class="highColor">{{ data.duration || 0 }}</span>小时
      </p>
      <span class="label">服务时长</span>
    </li>
    <li>
      <p class="num">
        <span class="highColor">{{ data.score || 0 }}</span>分
      </p>
      <span class="label">服务积分</span>
    </li>
  </ul>
</template>

<style scoped>
.overview {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 10px 0;
    border-radius: 10px;
    list-style: none;
    margin: 0;
}

.overview li {
    width: 33.3%;
    text-align: center;
}

.num {
    color: #000;
    font-size: 16px;
}

.highColor {
    color: #ff5d23;
}

.label {
    font-size: 12px;
    color: #9499A0;
}

</style>