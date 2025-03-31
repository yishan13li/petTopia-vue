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

    // 檢查是否為子目錄跳轉
    const isSubRoute = from.path.split('/').length > 2 && to.path.split('/').length > 2;
    const isSameParent = from.path.split('/')[1] === to.path.split('/')[1];

    // 只在非子目錄跳轉時顯示預加載器
    // if (!isSubRoute || !isSameParent) {
    //     setTimeout(() => {
    //         if (window.$) {
    //             window.$('.preloader-wrapper').fadeIn();
    //             window.$('body').addClass('preloader-site');
    //         }
    //     }, 0);
    // }

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

// 路由後置鉤子
router.afterEach((to, from) => {
    // 檢查是否為子目錄跳轉
    const isSubRoute = from.path.split('/').length > 2 && to.path.split('/').length > 2;
    const isSameParent = from.path.split('/')[1] === to.path.split('/')[1];

    // 只在非子目錄跳轉時隱藏預加載器
    if (!isSubRoute || !isSameParent) {
        setTimeout(() => {
            if (window.$) {
                window.$('.preloader-wrapper').fadeOut();
                window.$('body').removeClass('preloader-site');
            }
        }, 100);
    }
});

export default router;
