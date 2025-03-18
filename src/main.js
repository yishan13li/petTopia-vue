<<<<<<< HEAD
// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';  // 引入 router
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.css';

axios.defaults.withCredentials = true; // 設定攜帶 cookie

createApp(App)
    .use(router)  // 使用 Vue Router
    .mount('#app');
=======
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import { Icon } from '@iconify/vue'
import axios from 'axios'

// 導入全局樣式
import './assets/main.css'

// 配置 axios
axios.defaults.baseURL = 'http://localhost:8080'
// 添加請求攔截器，自動添加認證頭
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || localStorage.getItem('jwtToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

const app = createApp(App)

// 使用Pinia
app.use(createPinia())
// 使用路由
app.use(router)

// 全局注册Icon组件
app.component('Icon', Icon)

// 掛載應用
app.mount('#app') 
>>>>>>> 2218635 (上傳本地專案到 f1/lai 分支)
