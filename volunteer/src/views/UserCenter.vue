<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { showToast, showSuccessToast, showFailToast } from 'vant'

// 响应式数据定义
// 姓名
const name = ref('')
// 编号
const code = ref(null)
// 性别：0-男，1-女
const gender = ref(0)
// 手机号
const phoneNum = ref('')
// 学校名称
const school = ref('')
// 专业名称
const profession = ref('')
// 人员属性：0-群众，1-团员，2-党员
const userType = ref(0)

// 切换人员属性类型
const changeUserType = (value) => {
  userType.value = value
}

// 获取用户信息
const fetchUsrInfo = async () => {
  try {
    const response = await axios.get('/api/userInfo')
    const { error, data = {} } = response.data
    
    if (error === 0) {
      name.value = data.name
      code.value = data.code
      gender.value = data.gender
      phoneNum.value = data.phoneNum
      school.value = data.school
      profession.value = data.profession
      userType.value = data.userType
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 表单验证
const check = () => {
  if (name.value === '') {
    showToast("姓名不可为空")
    return null
  }
  
  if (code.value === null || code.value === '') {
    showToast("编号不可为空")
    return null
  }
  
  if (phoneNum.value === '') {
    showToast("手机号不可为空")
    return null
  }
  
  if (school.value === '') {
    showToast("学校不可为空")
    return null
  }
  
  if (profession.value === '') {
    showToast("专业不可为空")
    return null
  }
  
  return {
    name: name.value,
    code: code.value,
    gender: gender.value,
    phoneNum: phoneNum.value,
    school: school.value,
    profession: profession.value,
    userType: userType.value
  }
}

// 提交表单数据
const submitClick = async () => {
  // 1. 检查是否有输入为空
  const payload = check()
  if (!payload) {
    return
  }
  
  // 2. 提交修改后的数据
  try {
    const response = await axios.post('/api/userInfo/submit', payload)
    const { error, msg } = response.data
    
    if (error === 0) {
      showSuccessToast("操作成功")
    } else {
      showFailToast(msg || '网络错误，请稍后重试')
    }
  } catch (error) {
    console.error('提交失败:', error)
    showFailToast('网络错误，请稍后重试')
  }
}

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUsrInfo()
})
</script>

<template>
    <div class="container"> 
    <div class="inner"> 
      <h1>个人信息</h1> 
      <ul> 
        <li> 
          <p class="label"><span>*</span>姓名</p> 
          <input placeholder="请输入姓名" v-model.trim="name" /> 
        </li> 
        <li> 
          <p class="label"><span>*</span>编号</p> 
          <input placeholder="请输入编号" v-model.trim="code" /> 
        </li> 
        <li> 
          <p class="label"><span>*</span>性别</p> 
          <input type="radio" value="0" v-model="gender" />男 
          <input type="radio" value="1" v-model="gender" />女 
        </li> 
        <li> 
          <p class="label"><span>*</span>手机号</p> 
          <input placeholder="请输入手机号" v-model.trim="phoneNum" /> 
        </li> 
        <li> 
          <p class="label"><span>*</span>学校</p> 
          <input placeholder="请输入学校名称" v-model.trim="school" /> 
        </li> 
        <li> 
          <p class="label"><span>*</span>专业</p> 
          <input placeholder="请输入专业名称" v-model.trim="profession" /> 
        </li> 
        <li> 
          <p class="label"><span>*</span>人员属性</p> 
          <div class="userTypeList"> 
            <span :class="{ active: userType === 0 }" @click="changeUserType(0)">群众</span> 
            <span :class="{ active: userType === 1 }" @click="changeUserType(1)">团员</span> 
            <span :class="{ active: userType === 2 }" @click="changeUserType(2)">党员</span> 
          </div> 
        </li> 
      </ul> 
      <button class="subBtn" @click="submitClick">提交</button> 
    </div> 
  </div>

</template>

<style scope>
.container {
  background-color: #f6f6f6;
  padding: 20px 10px;
  height: 100%;
}

.inner {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
}

h1 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  padding-bottom: 10px;
  color: #000;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;

}

ul li {
  padding: 14px 0;
  border-bottom: 1px solid #f3f3f3;
  display: flex;         /* 一行两列 */
  align-items: center;   /* 垂直居中 */
}

.label {
  display: inline-block;
  width: 80px;
}

.label span {
  color: red;
  margin-right: 2px;
}

input {
  border: none;
  outline: none;
}

.userTypeList {
  display: inline-flex;
}

.userTypeList span {
  display: inline-block;
  padding: 3px 12px;
  background-color: #f6f6f6;
  color: #333;
  border-radius: 10px;
  font-size: 12px;
  margin-right: 4px;
}

.subBtn {
  width: 100%;
  font-size: 14px;
  color: #fff;
  background-color: #ff5d23;
  border: none;
  line-height: 32px;
  border-radius: 16px;
  margin-top: 40px;
}

.userTypeList .active {
  background: #ffe9d5;
  color: #ff7d23;
}

.txt {
  color: #999;
}

</style>