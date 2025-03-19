// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';  // 引入 router
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.css';

import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

axios.defaults.withCredentials = true; // 設定攜帶 cookie

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

createApp(App)
    .use(router)  // 使用 Vue Router
    .use(pinia)
    .mount('#app');
