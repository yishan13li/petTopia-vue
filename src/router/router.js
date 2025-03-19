// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';  // 引入 Home.vue
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';  // 添加 Register 組件的導入
import NotFound from '@/views/NotFound.vue';
import LocalPasswordSetup from '@/views/LocalPasswordSetup.vue'; // 引入本地密碼設置組件

import RouterUser from './RouterUser';
import RouterShop from './RouterShop';
import RouterVendor from './RouterVendor';
import RouterVendorAdmin from './RouterVendorAdmin';

const routes = [
    {
        path: '/',       // 當用戶訪問根路徑 (/) 時，顯示 Home 頁面
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { 
            title: '會員登入 - PetTopia',
            requiresGuest: true 
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            title: '會員註冊 - PetTopia',
            requiresGuest: true
        }
    },
    {
        path: '/local-password/setup',
        name: 'LocalPasswordSetup',
        component: LocalPasswordSetup,
        meta: {
            title: '設置本地密碼 - PetTopia',
            requiresGuest: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },
    ...RouterUser,
    ...RouterShop,
    ...RouterVendor,
    ...RouterVendorAdmin,
    // 可以根據需要添加更多路由
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

// 路由守衛
router.beforeEach((to, from, next) => {
    // 設置頁面標題
    document.title = to.meta.title || 'PetTopia';

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // 如果頁面需要訪客身份（如登入頁）且用戶已登入，重定向到首頁
    if (to.meta.requiresGuest && token) {
        next('/');
        return;
    }

    // 檢查是否需要認證
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
            return;
        }

        // 檢查角色權限
        if (to.meta.role && to.meta.role !== userRole) {
            next({ path: '/' });
            return;
        }
    }

    next();
});

export default router;
