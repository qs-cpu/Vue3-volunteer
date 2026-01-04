<script setup>

</script>

<template>
    <ul class="navs">
    <li>
      <router-link to="/loveActs">
        <img src="../../assets/p1.png" />
        <p>认事</p>
      </router-link>
    </li>
    <li>
      <router-link to="/loveReport">
        <img src="../../assets/p2.png" />
        <p>爱心报表</p>
      </router-link>
    </li>
    <li>
      <router-link to="/UploadService">
        <img src="../../assets/p3.png" />
        <p>服务纪实</p>
      </router-link>
    </li>
    <li>
      <router-link to="/serviceRecords">
        <img src="../../assets/p5.png" />
        <p>我的服务</p>
      </router-link>
    </li>
  </ul>
</template>

<style scope>
.navs {
padding: 0;
list-style: none;
margin: 30px 10px;
margin-bottom: 10px;
border-radius: 10px;
background: #fff;
}

.navs li {
width: 25%;
font-size: 14px;
height: 74px;
display: inline-flex;
flex-direction: column;
align-items: center;
justify-content: center;
text-align: center;
}

.navs li a {
color: #2c3e50;
text-decoration: none;
}

.navs img {
width: 26px;
height: 26px;
margin-bottom: 4px;
}

</style>