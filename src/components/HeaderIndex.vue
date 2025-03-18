<template>
  <header class="header-index">

    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <defs>
        <symbol xmlns="http://www.w3.org/2000/svg" id="link" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M12 19a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm0-4a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm-5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm7-12h-1V2a1 1 0 0 0-2 0v1H8V2a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3Zm1 17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9h16Zm0-11H4V6a1 1 0 0 1 1-1h1v1a1 1 0 0 0 2 0V5h8v1a1 1 0 0 0 2 0V5h1a1 1 0 0 1 1 1ZM7 15a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm0 4a1 1 0 1 0-1-1a1 1 0 0 0 1 1Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="arrow-right" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M17.92 11.62a1 1 0 0 0-.21-.33l-5-5a1 1 0 0 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 .21-.33a1 1 0 0 0 0-.76Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="category" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M19 5.5h-6.28l-.32-1a3 3 0 0 0-2.84-2H5a3 3 0 0 0-3 3v13a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-10a3 3 0 0 0-3-3Zm1 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1h4.56a1 1 0 0 1 .95.68l.54 1.64a1 1 0 0 0 .95.68h7a1 1 0 0 1 1 1Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="calendar" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M19 4h-2V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7h16Zm0-9H4V7a1 1 0 0 1 1-1h2v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h2a1 1 0 0 1 1 1Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="heart" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M20.16 4.61A6.27 6.27 0 0 0 12 4a6.27 6.27 0 0 0-8.16 9.48l7.45 7.45a1 1 0 0 0 1.42 0l7.45-7.45a6.27 6.27 0 0 0 0-8.87Zm-1.41 7.46L12 18.81l-6.75-6.74a4.28 4.28 0 0 1 3-7.3a4.25 4.25 0 0 1 3 1.25a1 1 0 0 0 1.42 0a4.27 4.27 0 0 1 6 6.05Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="plus" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="minus" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 11H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="cart" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M8.5 19a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 8.5 19ZM19 16H7a1 1 0 0 1 0-2h8.491a3.013 3.013 0 0 0 2.885-2.176l1.585-5.55A1 1 0 0 0 19 5H6.74a3.007 3.007 0 0 0-2.82-2H3a1 1 0 0 0 0 2h.921a1.005 1.005 0 0 1 .962.725l.155.545v.005l1.641 5.742A3 3 0 0 0 7 18h12a1 1 0 0 0 0-2Zm-1.326-9l-1.22 4.274a1.005 1.005 0 0 1-.963.726H8.754l-.255-.892L7.326 7ZM16.5 19a1.5 1.5 0 1 0 1.5 1.5a1.5 1.5 0 0 0-1.5-1.5Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="check" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46l-3.13-3.14A1 1 0 1 0 5.29 13l3.84 3.84a1 1 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="trash" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M10 18a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1ZM20 6h-4V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2ZM10 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm7 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8h10Zm-3-1a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="star-outline" viewBox="0 0 15 15">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
            d="M7.5 9.804L5.337 11l.413-2.533L4 6.674l2.418-.37L7.5 4l1.082 2.304l2.418.37l-1.75 1.793L9.663 11L7.5 9.804Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="star-solid" viewBox="0 0 15 15">
          <path fill="currentColor"
            d="M7.953 3.788a.5.5 0 0 0-.906 0L6.08 5.85l-2.154.33a.5.5 0 0 0-.283.843l1.574 1.613l-.373 2.284a.5.5 0 0 0 .736.518l1.92-1.063l1.921 1.063a.5.5 0 0 0 .736-.519l-.373-2.283l1.574-1.613a.5.5 0 0 0-.283-.844L8.921 5.85l-.968-2.062Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="search" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="user" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M15.71 12.71a6 6 0 1 0-7.42 0a10 10 0 0 0-6.22 8.18a1 1 0 0 0 2 .22a8 8 0 0 1 15.9 0a1 1 0 0 0 1 .89h.11a1 1 0 0 0 .88-1.1a10 10 0 0 0-6.25-8.19ZM12 12a4 4 0 1 1 4-4a4 4 0 0 1-4 4Z" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="close" viewBox="0 0 15 15">
          <path fill="currentColor"
            d="M7.953 3.788a.5.5 0 0 0-.906 0L6.08 5.85l-2.154.33a.5.5 0 0 0-.283.843l1.574 1.613l-.373 2.284a.5.5 0 0 0 .736.518l1.92-1.063l1.921 1.063a.5.5 0 0 0 .736-.519l-.373-2.283l1.574-1.613a.5.5 0 0 0-.283-.844L8.921 5.85l-.968-2.062Z" />
        </symbol>

      </defs>
    </svg>

    <div class="preloader-wrapper">
      <div class="preloader">
      </div>
    </div>

    <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasCart"
      aria-labelledby="My Cart">
      <div class="offcanvas-header justify-content-center">
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div class="order-md-last">
          <h4 class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-primary">Your cart</span>
            <span class="badge bg-primary rounded-circle pt-2">3</span>
          </h4>
          <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Grey Hoodie</h6>
                <small class="text-body-secondary">Brief description</small>
              </div>
              <span class="text-body-secondary">$12</span>
            </li>
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Dog Food</h6>
                <small class="text-body-secondary">Brief description</small>
              </div>
              <span class="text-body-secondary">$8</span>
            </li>
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Soft Toy</h6>
                <small class="text-body-secondary">Brief description</small>
              </div>
              <span class="text-body-secondary">$5</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="fw-bold">Total (USD)</span>
              <strong>$20</strong>
            </li>
          </ul>

          <button class="w-100 btn btn-primary btn-lg" type="submit">Continue to checkout</button>
        </div>
      </div>
    </div>

    <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasSearch"
      aria-labelledby="Search">
      <div class="offcanvas-header justify-content-center">
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">

        <div class="order-md-last">
          <h4 class="text-primary text-uppercase mb-3">
            Search
          </h4>
          <div class="search-bar border rounded-2 border-dark-subtle">
            <form id="search-form" class="text-center d-flex align-items-center" action="" method="">
              <input type="text" class="form-control border-0 bg-transparent" placeholder="Search Here" />
              <Icon icon="tabler:search" class="fs-4 me-3"></Icon>
            </form>
          </div>
        </div>
      </div>
    </div>


    <div class="container py-2">
      <div class="row py-4 pb-0 pb-sm-4 align-items-center ">

        <div class="col-sm-4 col-lg-3 text-center text-sm-start">
          <div class="main-logo">
<<<<<<< HEAD
            <a href="index.html">
=======
            <a href="/">
>>>>>>> 2218635 (上傳本地專案到 f1/lai 分支)
              <img src="/user_static/images/logo.png" alt="logo" class="img-fluid">
            </a>
          </div>
        </div>

        <div class="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
          <div class="search-bar border rounded-2 px-3 border-dark-subtle">
            <form id="search-form" class="text-center d-flex align-items-center" action="" method="">
              <input type="text" class="form-control border-0 bg-transparent"
                placeholder="Search for more than 10,000 products" />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" />
              </svg>
            </form>
          </div>
        </div>

        <div
          class="col-sm-8 col-lg-4 d-flex justify-content-end align-items-center gap-3 mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
          <div class="d-none d-xl-block">
            <ul class="d-flex list-unstyled m-0 gap-3">
<<<<<<< HEAD
              <li>
                <router-link to="/login" class="mx-3">
                  <Icon icon="mdi:login" class="fs-5"></Icon> <span class="fs-5">登入</span>
                </router-link>
              </li>
              <li>
                <a href="account.html" class="mx-3">
                  <Icon icon="mdi:user-plus" class="fs-5"></Icon> <span class="fs-5">註冊</span>
                </a>
              </li>
=======
              <template v-if="!isAuthenticated">
                <li>
                  <router-link to="/login" class="mx-3">
                    <Icon icon="mdi:login" class="fs-5"></Icon> <span class="fs-5">登入</span>
                  </router-link>
                </li>
                <li>
                  <a href="/register" class="mx-3">
                    <Icon icon="mdi:user-plus" class="fs-5"></Icon> <span class="fs-5">註冊</span>
                  </a>
                </li>
              </template>
              <template v-else>
                <li class="user-dropdown-container">
                  <div class="user-profile-btn" @click="toggleUserMenu">
                    <div class="d-flex align-items-center">
                      <div class="avatar-container me-2">
                        <img 
                          :src="userAvatar" 
                          :alt="userName" 
                          class="avatar" 
                          @error="handleAvatarError"
                        >
                      </div>
                      <div class="user-info">
                        <span class="user-name">{{ userName }}</span>
                        <Icon icon="mdi:chevron-down" class="ms-1 dropdown-icon"></Icon>
                      </div>
                    </div>
                  </div>
                  <div class="user-dropdown-menu" v-show="showUserMenu">
                    <div class="user-dropdown-header">
                      <img 
                        :src="userAvatar" 
                        :alt="userName" 
                        class="dropdown-avatar" 
                        @error="handleAvatarError"
                      >
                      <div class="dropdown-user-info">
                        <span class="dropdown-user-name">{{ userName }}</span>
                        <span class="dropdown-user-email">{{ userEmail }}</span>
                      </div>
                    </div>
                    <div class="user-dropdown-items">
                      <router-link to="/profile" class="dropdown-item">
                        <Icon icon="mdi:account" class="me-2"></Icon>會員中心
                      </router-link>
                      <router-link to="/profile/orders" class="dropdown-item">
                        <Icon icon="mdi:package" class="me-2"></Icon>我的訂單
                      </router-link>
                      <router-link to="/profile/favorites" class="dropdown-item">
                        <Icon icon="mdi:heart" class="me-2"></Icon>我的收藏
                      </router-link>
                      <router-link to="/profile/settings" class="dropdown-item">
                        <Icon icon="mdi:cog" class="me-2"></Icon>帳號設置
                      </router-link>
                      <div class="dropdown-divider"></div>
                      <a href="#" 
                         v-if="showBecomeVendorButton"
                         class="dropdown-item vendor-item" 
                         @click.prevent="handleBecomeVendor">
                        <Icon icon="mdi:store" class="me-2"></Icon>商家專區
                      </a>
                      <div class="dropdown-divider" v-if="showBecomeVendorButton"></div>
                      <a href="#" class="dropdown-item logout-item" @click.prevent="handleLogout">
                        <Icon icon="mdi:logout" class="me-2"></Icon>登出
                      </a>
                    </div>
                  </div>
                </li>
              </template>
>>>>>>> 2218635 (上傳本地專案到 f1/lai 分支)
            </ul>
          </div>
        </div>

      </div>
    </div>

    <div class="container-fluid">
      <hr class="m-0">
    </div>

    <div class="container">
      <nav class="main-menu d-flex navbar navbar-expand-lg ">

        <div class="d-flex d-lg-none align-items-end mt-3">
          <ul class="d-flex justify-content-end list-unstyled m-0">
            <li>
              <router-link to="/login" class="mx-3">
                <Icon icon="mdi:login" class="fs-4"></Icon>登入
              </router-link>
            </li>

            <li>
              <a href="account.html" class="mx-3">
                <Icon icon="mdi:user-plus" class="fs-4"></Icon>註冊
              </a>
            </li>

            <li>
              <a href="#" class="mx-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSearch"
                aria-controls="offcanvasSearch">
                <Icon icon="tabler:search" class="fs-4"></Icon>搜尋

              </a>
            </li>

          </ul>

        </div>

      </nav>

    </div>
  </header>
</template>
<script setup>
import { Icon } from '@iconify/vue';
<<<<<<< HEAD


</script>
<style></style>
=======
import { useAuthStore } from '../stores/auth';
import { computed, onMounted, ref, watch } from 'vue';
import axiosInstance from '@/utils/axios';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated());

// 修改 userName 計算屬性
const userName = computed(() => {
  // 檢查字符串是否為郵箱格式
  const isEmailFormat = (text, email) => {
    if (!text || !email) return false;
    if (text.toLowerCase() === email.toLowerCase()) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };
  
  // 如果有用戶ID，首先嘗試使用數據庫緩存的名稱（這是最優先的）
  if (authStore.userId) {
    const cachedName = localStorage.getItem(`db_name_${authStore.userId}`);
    if (cachedName && cachedName !== 'null' && cachedName !== 'undefined') {
      console.log('使用資料庫緩存的名稱:', cachedName);
      return cachedName;
    }
  }
  
  // 從localStorage和authStore獲取用戶信息
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const user = authStore.user || userData;
  
  // 如果沒有用戶信息，返回默認名稱
  if (!user) {
    console.log('未找到用戶資訊，使用默認名稱');
    return '用戶';
  }
  
  // 獲取用戶郵箱
  const userEmail = user.email || '';
  
  // 如果是第三方登入用戶，需特別處理
  if (user.provider && authStore.token && authStore.userId) {
    // 檢查當前名稱
    const currentName = user.name || '';
    
    // 如果當前名稱是郵箱格式或為空，嘗試立即從資料庫獲取
    if (isEmailFormat(currentName, userEmail) || !currentName) {
      console.log('檢測到第三方登入用戶名稱問題，立即從資料庫獲取名稱');
      
      // 立即從資料庫獲取名稱 (不需要等待結果，在下一次渲染時更新)
      setTimeout(() => {
        fetchNameFromDatabase(true).then(name => {
          if (name && name !== currentName) {
            console.log('成功從資料庫獲取到名稱:', name);
            shouldForceRefreshUserData.value = true;
          }
        });
      }, 0);
      
      // 嘗試直接獲取資料庫名稱 (在本次渲染中檢查)
      // 這裡我們立即調用一次，但不阻塞渲染
      const cachedDbName = localStorage.getItem(`db_name_${authStore.userId}_temp`);
      if (cachedDbName && cachedDbName !== 'null' && cachedDbName !== 'undefined') {
        console.log('使用臨時緩存的資料庫名稱:', cachedDbName);
        // 移除臨時緩存
        localStorage.removeItem(`db_name_${authStore.userId}_temp`);
        // 設置正式緩存
        localStorage.setItem(`db_name_${authStore.userId}`, cachedDbName);
        return cachedDbName;
      }
    }
  }
  
  // 檢查用戶名稱來源
  console.log('檢查用戶名稱來源:', {
    name: user.name,
    email: user.email,
    given_name: user.given_name,
    provider: user.provider
  });
  
  // 嘗試使用name - 這是資料庫中存儲的欄位
  if (user.name && 
      user.name !== 'null' && 
      user.name !== 'undefined' && 
      !isEmailFormat(user.name, userEmail)) {
    console.log('使用 name:', user.name);
    return user.name;
  }
  
  // 嘗試使用given_name (Google提供)
  if (user.given_name && 
      user.given_name !== 'null' && 
      user.given_name !== 'undefined') {
    console.log('使用 given_name:', user.given_name);
    return user.given_name;
  }
  
  // 作為最後的選項，從郵箱中提取用戶名部分
  if (userEmail) {
    const emailName = userEmail.split('@')[0];
    console.log('從郵箱中提取用戶名:', emailName);
    return emailName;
  }
  
  // 如果什麼都沒有，返回默認名稱
  return '用戶';
});

// 添加一個新方法，強制從資料庫獲取最新名稱
const fetchNameFromDatabase = async (forceRefresh = false) => {
  if (!authStore.token || !authStore.userId) return null;
  
  console.log('直接從資料庫獲取最新用戶名稱');
  
  // 檢查是否是郵箱格式的函數
  const isEmailFormat = (text, email) => {
    if (!text || !email) return false;
    if (text === email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };
  
  try {
    // 同時嘗試多個 API 端點以確保能獲取到最新名稱
    const apis = [
      '/api/member/profile',  // 優先使用profile API，因為它返回Member表中的name
      '/api/auth/status',     // 狀態API也應該包含資料庫中的name
      `/api/member/${authStore.userId}`,
      '/api/member/userInfo'
    ];
    
    // 獲取用戶郵箱以檢查名稱是否是郵箱格式
    const userEmail = authStore.user?.email || '';
    
    // 使用 Promise.all 同時發起多個請求
    const responses = await Promise.all(
      apis.map(api => 
        fetch(api, {
          headers: { 'Authorization': `Bearer ${authStore.token}` },
          // 如果強制刷新，添加隨機參數防止緩存
          cache: forceRefresh ? 'no-cache' : 'default'
        })
        .then(res => {
          if (!res.ok) throw new Error(`API ${api} failed with status ${res.status}`);
          return res.json();
        })
        .catch(err => {
          console.warn(`API ${api} 請求失敗:`, err);
          return null;  // 返回null而不是拒絕Promise
        })
      )
    );
    
    console.log('獲取到的所有 API 響應:', responses);
    
    // 尋找第一個包含有效名稱的響應
    let validName = null;
    
    for (const data of responses) {
      if (!data) continue;  // 跳過失敗的請求
      
      console.log('檢查 API 響應:', data);
      
      // 專注獲取name欄位 - 資料庫中的欄位名稱就是name
      // 注意: 有些API可能將用戶資料包裝在另一個物件中
      const name = data.name || (data.member ? data.member.name : null);
      
      if (name && 
          name !== 'null' && 
          name !== 'undefined' &&
          !isEmailFormat(name, userEmail)) {
        
        console.log('找到有效的用戶名稱:', name);
        validName = name;
        break;
      }
    }
    
    // 如果找到有效名稱，立即更新 authStore 和 localStorage
    if (validName) {
      console.log('使用資料庫獲取的名稱更新用戶:', validName);
      
      // 緩存此用戶 ID 的名稱，確保未來可立即獲取
      if (authStore.userId) {
        // 正常緩存
        localStorage.setItem(`db_name_${authStore.userId}`, validName);
        // 同時設置臨時緩存供立即使用
        localStorage.setItem(`db_name_${authStore.userId}_temp`, validName);
        console.log(`已緩存用戶 ${authStore.userId} 的名稱:`, validName);
      }
      
      // 從 localStorage 獲取完整的用戶數據
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      // 更新用戶數據 - 只設置name欄位，確保與資料庫一致
      const updatedUserData = {
        ...userData,
        name: validName
      };
      
      // 保存回 localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // 更新 authStore - 只設置name欄位，確保與資料庫一致
      authStore.setUser({
        ...authStore.user,
        name: validName
      });
      
      // 發送事件通知名稱已更新
      window.dispatchEvent(new CustomEvent('user-info-updated', { 
        detail: { user: { ...authStore.user, name: validName } }
      }));
      
      return validName;
    } else {
      console.warn('未能從任何 API 獲取有效的用戶名稱');
    }
  } catch (error) {
    console.error('從資料庫獲取用戶名稱失敗:', error);
  }
  
  return null;
};

// 添加状态管理
const retryCount = ref(0);
const isLoading = ref(false);
const avatarUrl = ref(null);
const MAX_RETRIES = 2;

const userAvatar = computed(() => {
  if (!authStore.user) {
    console.log('未找到用戶信息，使用默認頭像');
    return '/user_static/images/default-avatar.png';
  }
  
  console.log('處理用戶頭像:', {
    provider: authStore.user.provider,
    avatar: authStore.user.avatar,
    picture: authStore.user.picture,
    currentAvatarUrl: avatarUrl.value
  });
  
  // 如果是第三方登錄用戶，優先使用第三方頭像
  if (authStore.user.provider) {
    const avatar = authStore.user.avatar || authStore.user.picture || '/user_static/images/default-avatar.png';
    console.log('使用第三方頭像:', avatar);
    return avatar;
  }
  
  // 本地用戶，從後端獲取頭像
  const avatar = avatarUrl.value || '/user_static/images/default-avatar.png';
  console.log('使用本地頭像:', avatar);
  return avatar;
});

// 獲取用戶頭像
const fetchAvatar = async () => {
  if (!authStore.user || authStore.user.provider) {
    console.log('跳過獲取頭像:', {
      hasUser: !!authStore.user,
      provider: authStore.user?.provider
    });
    return;
  }
  
  console.log('開始獲取用戶頭像');
  
  try {
    const response = await fetch('/api/member/profile-photo', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    
    console.log('頭像請求響應:', {
      status: response.status,
      ok: response.ok
    });
    
    if (response.ok) {
      const blob = await response.blob();
      console.log('獲取到的頭像數據:', {
        size: blob.size,
        type: blob.type
      });
      
      if (blob.size > 0) {
        avatarUrl.value = URL.createObjectURL(blob);
        console.log('成功創建頭像URL:', avatarUrl.value);
      } else {
        console.warn('獲取到的頭像數據為空');
        avatarUrl.value = '/user_static/images/default-avatar.png';
      }
    } else {
      console.warn('獲取頭像失敗:', response.status);
      avatarUrl.value = '/user_static/images/default-avatar.png';
    }
  } catch (error) {
    console.error('獲取頭像時發生錯誤:', error);
    avatarUrl.value = '/user_static/images/default-avatar.png';
  }
};

// 头像加载错误处理
const handleAvatarError = () => {
  if (!isLoading.value) {
    fetchAvatar();
  }
};

// 完全替換同步用戶信息的函數
const syncUserFromLocalStorage = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    
    // 如果本地存儲有用戶資訊但 authStore 沒有，則同步
    if (storedUser && (!authStore.user || !authStore.user.name)) {
      console.log('從本地存儲同步用戶資訊:', storedUser);
      authStore.setUser(storedUser);
    }
    
    // 檢查是否有緩存的資料庫名稱
    if (authStore.userId) {
      const cachedName = localStorage.getItem(`db_name_${authStore.userId}`);
      if (cachedName && cachedName !== 'null' && cachedName !== 'undefined') {
        console.log('從緩存中發現資料庫名稱:', cachedName);
        
        // 如果有緩存且用戶名稱不同，更新 authStore
        if (authStore.user && authStore.user.name !== cachedName) {
          console.log('使用緩存名稱更新 authStore:', cachedName);
          authStore.setUser({
            ...authStore.user,
            name: cachedName
          });
          
          // 觸發事件通知其他組件
          window.dispatchEvent(new CustomEvent('user-info-updated', { 
            detail: { user: { ...authStore.user, name: cachedName } }
          }));
        }
      }
    }
  } catch (error) {
    console.error('同步本地存儲用戶信息失敗:', error);
  }
};

// 在組件掛載時
onMounted(async () => {
  console.log('HeaderIndex 組件已掛載');
  
  // 檢查是否有新的登入標誌
  const params = new URLSearchParams(window.location.search);
  const newLogin = params.get('user_new_login') === 'true';
  const oauthSuccess = params.get('oauth_success') === 'true';
  
  // 獲取用戶信息
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const user = authStore.user || userData;
  
  console.log('檢測到用戶信息:', {
    isAuthenticated: authStore.isAuthenticated(),
    hasAvatar: !!avatarUrl.value,
    newLogin,
    oauthSuccess,
    user: user ? {
      provider: user.provider,
      name: user.name,
      email: user.email
    } : null
  });
  
  // 添加判斷郵箱函數
  const isEmailFormat = (text, email) => {
    if (!text || !email) return false;
    if (text.toLowerCase() === email.toLowerCase()) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };
  
  // 如果用戶已登入
  if (authStore.isAuthenticated()) {
    // 如果沒有頭像，嘗試獲取頭像
    if (!avatarUrl.value) {
      await fetchAvatar();
    }
    
    // 第三方登入特別處理
    if (user && user.provider) {
      const userEmail = user.email || '';
      const currentName = user.name || '';
      
      // 判斷是否需要從資料庫獲取名稱
      const needsFetch = isEmailFormat(currentName, userEmail) || 
                        newLogin || 
                        oauthSuccess || 
                        !localStorage.getItem(`db_name_${authStore.userId}`);
      
      if (needsFetch) {
        console.log('檢測到第三方登入可能需要更新名稱，立即從資料庫獲取');
        
        try {
          // 立即獲取資料庫名稱
          const dbName = await fetchNameFromDatabase(true);
          
          if (dbName && dbName !== currentName) {
            console.log('成功從資料庫獲取到名稱:', dbName);
            shouldForceRefreshUserData.value = true;
            
            // 立即更新UI (不等待下一次渲染)
            authStore.setUser({
              ...authStore.user,
              name: dbName
            });
            
            // 更新localStorage中的用戶數據
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            localStorage.setItem('userData', JSON.stringify({
              ...userData,
              name: dbName
            }));
            
            // 發出全局事件通知其他組件用戶信息已更新
            window.dispatchEvent(new CustomEvent('user-info-updated', { 
              detail: { user: { ...user, name: dbName } }
            }));
          }
        } catch (error) {
          console.error('獲取資料庫名稱失敗:', error);
        }
      }
    }
    
    // 移除URL參數以避免重複處理
    if (newLogin || oauthSuccess) {
      const url = new URL(window.location.href);
      url.searchParams.delete('user_new_login');
      url.searchParams.delete('oauth_success');
      window.history.replaceState({}, document.title, url.toString());
    }
  }
  
  // 監聽用戶菜單點擊外部關閉事件
  window.addEventListener('click', handleClickOutside);
  
  // 監聽用戶登入事件
  window.addEventListener('user-login', handleUserLogin);
  
  // 監聽用戶資訊更新事件
  window.addEventListener('user-info-updated', handleUserInfoUpdated);
  
  // 同步本地存儲的用戶信息
  syncUserFromLocalStorage();
});

// 修改監聽認證狀態變化
watch(() => authStore.isAuthenticated(), (newValue) => {
  console.log('認證狀態變化:', newValue);
  if (newValue) {
    console.log('當前用戶信息:', authStore.user);
    // 確保從本地存儲同步最新資訊
    syncUserFromLocalStorage();
  }
}, { immediate: true });

// 監聽 localStorage 變化 (可以檢測到其他標籤頁的更改)
window.addEventListener('storage', (event) => {
  if (event.key === 'user' && event.newValue) {
    console.log('檢測到 localStorage 用戶信息變化');
    syncUserFromLocalStorage();
  }
});

const router = useRouter();

const handleLogout = () => {
  authStore.clearToken();
  
  // 發送登出事件通知其他組件
  window.dispatchEvent(new CustomEvent('user-logout'));
  
  router.push('/');
};

const userEmail = computed(() => {
  if (!authStore.user) return '';
  return authStore.user.email || '';
});

const showUserMenu = ref(false);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const shouldForceRefreshUserData = ref(false);

// 處理點擊外部關閉用戶菜單
const handleClickOutside = (event) => {
  const userDropdown = document.querySelector('.user-dropdown-container');
  const userProfileBtn = document.querySelector('.user-profile-btn');
  
  if (userDropdown && !userDropdown.contains(event.target) || 
      (userProfileBtn && userProfileBtn.contains(event.target) && event.target.closest('.dropdown-item'))) {
    showUserMenu.value = false;
  }
};

// 處理用戶登入事件
const handleUserLogin = (event) => {
  console.log('收到用戶登入事件:', event.detail);
  
  if (event.detail && event.detail.user) {
    // 如果是第三方登入，需要檢查名稱
    if (event.detail.user.provider) {
      console.log('登入事件檢測到第三方用戶，立即獲取名稱');
      
      // 判斷名稱是否是郵箱格式
      const isEmailFormat = (text, email) => {
        if (!text || !email) return false;
        if (text.toLowerCase() === email.toLowerCase()) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(text);
      };
      
      const userEmail = event.detail.user.email || '';
      const userName = event.detail.user.name || '';
      
      // 如果當前名稱是郵箱格式，立即從資料庫獲取最新名稱
      if (isEmailFormat(userName, userEmail)) {
        console.log('檢測到第三方登入用戶名稱可能是郵箱格式，立即獲取資料庫名稱');
        
        // 立即獲取資料庫名稱
        fetchNameFromDatabase(true).then(dbName => {
          if (dbName && dbName !== userName) {
            console.log('登入事件中成功從資料庫獲取到名稱:', dbName);
            shouldForceRefreshUserData.value = true;
            
            // 立即更新 authStore
            if (authStore.user) {
              authStore.setUser({
                ...authStore.user,
                name: dbName
              });
            }
            
            // 更新 localStorage
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            localStorage.setItem('userData', JSON.stringify({
              ...userData,
              name: dbName
            }));
            
            // 發出全局事件通知其他組件重新獲取用戶信息
            window.dispatchEvent(new CustomEvent('user-info-updated', { 
              detail: { user: { ...event.detail.user, name: dbName } }
            }));
          }
        });
      }
    }
    
    // 重新獲取頭像
    fetchAvatar();
  }
};

// 處理用戶資訊更新事件
const handleUserInfoUpdated = (event) => {
  console.log('收到用戶資訊更新事件:', event.detail);
  
  if (event.detail && event.detail.user) {
    // 強制更新 UI
    if (event.detail.user.name && (!authStore.user || event.detail.user.name !== authStore.user.name)) {
      console.log('用戶名稱已更新，強制重新渲染');
      
      // 更新 authStore
      authStore.setUser({
        ...authStore.user,
        ...event.detail.user
      });
      
      // 設置強制更新標誌
      shouldForceRefreshUserData.value = true;
    }
    
    // 如果有頭像更新，也獲取最新頭像
    if (event.detail.updateAvatar) {
      fetchAvatar();
    }
  }
};

const showBecomeVendorButton = computed(() => {
  // 只有當用戶是會員（MEMBER）角色時才顯示
  if (!authStore.isAuthenticated()) return false;
  return authStore.user?.role === 'MEMBER' || !authStore.user?.role;
});

// 處理成為商家點擊事件
const handleBecomeVendor = async () => {
  try {
    console.log('處理成為商家請求');
    
    // 首先檢查用戶是否有資格成為商家
    const checkResponse = await fetch('/api/vendor/convert/check', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    
    if (!checkResponse.ok) {
      const errorData = await checkResponse.json();
      alert(`無法檢查商家資格: ${errorData.error || '未知錯誤'}`);
      return;
    }
    
    const checkResult = await checkResponse.json();
    console.log('商家資格檢查結果:', checkResult);
    
    if (!checkResult.eligible) {
      alert(checkResult.message || '您目前無法成為商家');
      return;
    }
    
    // 根據檢查結果決定下一步操作
    if (checkResult.hasExistingAccount) {
      // 如果已有商家帳號，詢問是否切換
      if (confirm('您已有商家帳號，是否切換到商家模式？')) {
        await switchToVendor();
      }
    } else {
      // 如果沒有商家帳號，詢問是否創建
      if (confirm('轉換為商家將創建一個新的商家帳號，請確認是否繼續？')) {
        await convertToVendor();
      }
    }
  } catch (error) {
    console.error('處理成為商家請求失敗:', error);
    alert('處理請求時發生錯誤，請稍後再試');
  }
};

// 切換到已有商家帳號
const switchToVendor = async () => {
  try {
    const response = await fetch('/api/vendor/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ confirm: true })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      alert(`切換到商家帳號失敗: ${errorData.error || '未知錯誤'}`);
      return;
    }
    
    const result = await response.json();
    console.log('切換到商家帳號成功:', result);
    
    // 更新認證狀態
    authStore.setToken(result.token);
    authStore.setUser({
      id: result.vendorId,
      email: result.email,
      role: result.role,
      provider: 'LOCAL'
    });
    
    // 顯示成功訊息
    alert('已成功切換到商家帳號');
    
    // 跳轉到商家後台
    router.push('/vendor_admin/profile');
  } catch (error) {
    console.error('切換到商家帳號失敗:', error);
    alert('切換商家帳號時發生錯誤，請稍後再試');
  }
};

// 創建並轉換為新的商家帳號
const convertToVendor = async () => {
  try {
    const response = await fetch('/api/vendor/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ confirm: true })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      alert(`成為商家失敗: ${errorData.error || '未知錯誤'}`);
      return;
    }
    
    const result = await response.json();
    console.log('成為商家成功:', result);
    
    // 更新認證狀態
    authStore.setToken(result.token);
    authStore.setUser({
      id: result.vendorId,
      email: result.email,
      role: result.role,
      provider: 'LOCAL'
    });
    
    // 顯示成功訊息
    alert('您已成功成為商家，請完成後續資料填寫');
    
    // 跳轉到商家後台完善資料
    router.push('/vendor_admin/profile');
  } catch (error) {
    console.error('成為商家失敗:', error);
    alert('轉換商家時發生錯誤，請稍後再試');
  }
};
</script>
<style scoped>
.user-profile {
  position: relative;
  margin-right: 1rem;
}

.avatar-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #2B4F76;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  margin-left: 0.5rem;
}

.user-name {
  font-size: 0.9rem;
  color: #2B4F76;
  font-weight: 500;
}

.user-dropdown-container {
  position: relative;
}

.user-profile-btn {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.user-profile-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dropdown-icon {
  transition: transform 0.3s;
}

.user-dropdown-container:hover .dropdown-icon {
  transform: rotate(180deg);
}

.user-dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  width: 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.user-dropdown-header {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2B4F76;
}

.dropdown-user-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.dropdown-user-name {
  font-weight: 600;
  color: #2B4F76;
}

.dropdown-user-email {
  font-size: 0.8rem;
  color: #666;
}

.user-dropdown-items {
  padding: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-divider {
  height: 1px;
  background-color: #eee;
  margin: 8px 0;
}

.logout-item {
  color: #dc3545;
}

.logout-item:hover {
  background-color: #fff8f8;
}

.vendor-item {
  color: #2B6D53;
  font-weight: 500;
  border-radius: 4px;
  margin: 0 8px;
  transition: all 0.3s;
}

.vendor-item:hover {
  background-color: rgba(43, 109, 83, 0.1);
  color: #1A503C;
}
</style>
>>>>>>> 2218635 (上傳本地專案到 f1/lai 分支)
