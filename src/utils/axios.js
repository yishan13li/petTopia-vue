import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// 创建 axios 实例
const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
    withCredentials: true
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        const authStore = useAuthStore();
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
    },
    error => {
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => response,
    error => {
        const authStore = useAuthStore();
        
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 未授权，清除 token 并跳转到登录页
                    authStore.clearToken();
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('没有权限访问该资源');
                    break;
                case 404:
                    console.error('请求的资源不存在');
                    break;
                case 500:
                    console.error('服务器错误');
                    break;
                default:
                    console.error('请求失败:', error.response.data);
            }
        } else if (error.request) {
            console.error('网络错误，请检查网络连接');
        } else {
            console.error('请求配置错误:', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default instance; 