import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import { Icon } from '@iconify/vue'
import axios from 'axios'

import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

// 導入全局樣式
// import './assets/main.css'

// 配置 axios
axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.withCredentials = true; // 設定攜帶 cookie
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

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

createApp(App)
  .use(router)  // 使用 Vue Router
  .use(pinia)
  .component('Icon', Icon)  // 全局注册Icon组件
  .mount('#app');

