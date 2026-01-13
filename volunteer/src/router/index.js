import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserCenter from '../views/UserCenter.vue'
import LoveReport from '../views/LoveReport.vue'
import LoveActs from '../views/LoveActs.vue'
import ActDetails from '../views/ActDetails.vue'
import MyApply from '../views/MyApply.vue'
import UploadService from '../views/UploadService.vue'
import ServiceRecords from '../views/ServiceRecords.vue'
import ServiceDetail from '../views/ServiceDetail.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/userCenter',
    name: 'userCenter',
    component: UserCenter
  },
  {
    path: '/loveReport',
    name: 'loveReport',
    component: LoveReport
  },
  {
    path: '/loveActs',
    name: 'loveActs',
    component: LoveActs
  },
  {
    path: '/actDetails',
    name: 'actDetails',
    component: ActDetails
  },
  {
    path: '/myApply',
    name: 'myApply',
    component: MyApply
  },
  {
    path: '/UploadService',
    name: 'UploadService',
    component: UploadService
  },
  {
    path: '/serviceRecords',
    name: 'serviceRecords',
    component: ServiceRecords
  },
  {
    path: '/serviceDetail/:id',
    name: 'serviceDetail',
    component: ServiceDetail
  },
]
const router = createRouter({
history: createWebHistory(),
routes
})
export default router