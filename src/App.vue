<!-- src/App.vue -->
<template>
  <div>
    <component :is="currentHeader"></component>
    <main>
      <component :is="vendorAdminSidebar"></component>
      <router-view></router-view>
      <ChatRoom @open-image="openImage"></ChatRoom>
    </main>

    <!-- 全局圖片預覽 -->
    <div v-if="showPreview" class="image-modal" @click="closeImage">
      <img :src="'data:image/jpeg;base64,' + selectedImage" class="modal-img" />
    </div>

  </div>
</template>

<script setup>

import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import HeaderIndex from "./components/HeaderIndex.vue";
import HeaderShop from "./components/HeaderShop.vue";
import HeaderVendor from "./components/HeaderVendor.vue";
import HeaderVendorAdmin from "./components/HeaderVendorAdmin.vue";
import VendorAdminSidebar from "./components/VendorAdminSidebar.vue";
import HeaderActivity from "./components/HeaderActivity.vue";

import { useAuthStore } from './stores/auth';

// import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import ChatRoom from './components/shop/ChatRoom.vue';

const route = useRoute();

// 根據path 決定顯示哪一個 header
const vendorAdminSidebar = computed(() => {
  if (route.path.startsWith("/vendor/admin")) {
    return VendorAdminSidebar; // 顯示 HeaderShop
  }
});

const currentHeader = computed(() => {
  if (route.path.startsWith("/shop")) {
    return HeaderShop; // 顯示 HeaderShop
  } else if (route.path.startsWith("/vendor/admin")) {
    return HeaderVendorAdmin; // 顯示 HeaderVendorAdmin
  } else if (route.path.startsWith("/activity")) {
    return HeaderActivity;
  } else if (route.path.startsWith("/vendor")) {
    return HeaderVendor; // 顯示 HeaderVendorAdmin
  }
  return HeaderIndex; // 顯示 HeaderIndex
});

const authStore = useAuthStore();

// 處理新登入的用戶資料，確保使用資料庫中的最新名稱
const newLoginData = localStorage.getItem('user_new_login');
if (newLoginData) {
  try {
    const userData = JSON.parse(newLoginData);
    console.log('檢測到新登入資料，處理中...', userData);

    // 確保使用資料庫名稱（如果有）
    if (userData._dbName && userData._dbName !== userData.email) {
      console.log('使用資料庫名稱替換：', userData._dbName);
      userData.name = userData._dbName;
      userData.memberName = userData._dbName;
    }

    // 移除臨時欄位
    delete userData._forceRefresh;
    delete userData._dbName;

    // 保存到正式的用戶資料中
    localStorage.setItem('user', JSON.stringify(userData));

    // 如果有 token，確保更新 authStore
    if (userData.userId && authStore.token) {
      authStore.setUser(userData);
    }

    // 清除臨時資料
    localStorage.removeItem('user_new_login');

    console.log('新登入資料處理完成，名稱已更新：', userData.name);
  } catch (error) {
    console.error('處理新登入資料失敗：', error);
    localStorage.removeItem('user_new_login');
  }
}

// ============= 預覽圖片 =============
const showPreview = ref(false);
const selectedImage = ref(null);

// 接收子元件的圖片並顯示
const openImage = (image) => {
  selectedImage.value = image;
  showPreview.value = true;
};

// 關閉圖片預覽
const closeImage = () => {
  showPreview.value = false;
  selectedImage.value = null;
};

</script>

<style>
@import '/user_static/css/previewImage.css';
</style>
