<script setup>
import avatarImg from '../../assets/avatar.png'
// 定义props
defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="header-inner">
    <div class="userInfo">
      <span class="avatar">
        <!-- 用户头像 -->
        <img :src="avatarImg" />
      </span>
      <span>
        <!-- 用户姓名 -->
        {{ user.name }}
      </span>
    </div>
    <!-- 跳转用户信息页面，先用/占位 -->
    <router-link to="/">
      <button class="rArrow"></button>
    </router-link>
  </div>
</template>

<style scoped>
.header-inner {
    position: absolute;
    padding: 10px;
    left: 10px;
    right: 10px;
    bottom: -20px;
    border-radius: 10px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.userInfo {
    display: flex;
    align-items: center;
}

.avatar {
    display: inline-block;
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background-color: red;
    margin-right: 10px;
}

.rArrow {
    border: none;
    width: 20px;
    height: 20px;
    background-color: transparent;
    background-image: url("../../assets/rArrow.png");
    background-size: 100% 100%;
}
</style>

