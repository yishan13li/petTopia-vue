<template>
  <header class="header-index">
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
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
      <div class="preloader"></div>
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
          <h4 class="text-primary text-uppercase mb-3">Search</h4>
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
      <div class="row py-4 pb-0 pb-sm-4 align-items-center">
        <div class="col-sm-4 col-lg-3 text-center text-sm-start">
          <div class="main-logo">
            <a href="/">
              <img src="/user_static/images/logo.png" alt="logo" class="img-fluid" />
            </a>
          </div>
        </div>

        <div class="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
          <div class="search-bar border rounded-2 px-3 border-dark-subtle">
            <!-- 搜尋列 -->

            <form class="text-center d-flex align-items-center" @submit.prevent="searchVendor">
              <input v-model="keyword" type="text" class="form-control border-0 bg-transparent" placeholder="搜尋友善店家" />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                @click="searchVendor()">
                <path fill="currentColor"
                  d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" />
              </svg>
            </form>

            <!-- 搜尋列 -->
          </div>
        </div>

        <div
          class="col-sm-8 col-lg-4 d-flex justify-content-end align-items-center gap-3 mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
          <div class="notification-container position-relative">
            <!-- 鈴鐺通知按鈕 -->
            <button class="btn btn-outline-dark position-relative btn-notifivation" @click="toggleNotifications">
              <i class="bi bi-bell-fill"></i>
              <span v-if="unreadCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger btn-number">
                {{ unreadCount }}
              </span>
            </button>

            <!-- 通知列表 -->
            <div v-if="showNotifications" class="dropdown-menu show position-absolute end-0 mt-2 p-2 shadow">
              <h6 class="dropdown-header">通知中心</h6>
              <div v-if="notifications.length === 0" class="text-center p-2">沒有新通知</div>
              <div v-else>
                <a v-for="(notification, index) in notifications" :key="index" href="#"
                  class="dropdown-item d-flex align-items-center mb-2"
                  @click="handleNotificationClick(index, notification)" :class="{ read: notification.isRead }">
                  <i class="bi bi-circle-fill text-primary me-2" v-if="!notification.isRead"></i>
                  <i class="bi bi-check-circle-fill text-secondary me-2" v-else></i>
                  <div>
                    <strong class="notification-text">{{ notification.notificationTitle }}</strong>
                    <!-- 显示标题 -->
                    <div class="text-muted notification-text" style="font-size: 0.8em">
                      {{ notification.notificationContent }}
                    </div>

                    <div class="text-muted notification-text" style="font-size: 0.8em">
                      {{ notification.sentTime }}
                    </div>
                    <!-- 显示时间 -->
                  </div>

                  <!-- 通知内容 -->
                </a>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item text-center" @click="clearNotifications">
                清除所有通知
              </button>
            </div>

            <!-- 模态框（Bootstrap Modal） -->
            <div class="modal fade" id="notificationModal" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">通知內容</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <h5>{{ selectedNotificationTitle }}</h5>
                    <div>{{ selectedNotificationContent }}</div>
                    <div class="text-muted" style="font-size: 0.8em">
                      {{ selectedNotificationSedTime }}
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                      關閉
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 會員專區-->
          <div class="d-none d-xl-block">
            <ul class="d-flex list-unstyled m-0 gap-3">
              <template v-if="!authStore.isAuthenticated">
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
                <li>
                  <a href="http://localhost:5173/shop" class="mx-3 shop-link">
                    <Icon icon="mdi:shopping" class="fs-5"></Icon> <span class="fs-5">前往購物</span>
                  </a>
                </li>
                <li class="user-dropdown-container">
                  <div class="user-profile-btn" @click="toggleUserMenu">
                    <div class="d-flex align-items-center">
                      <div class="avatar-container me-2">
                        <img :src="userAvatar" :alt="userName" class="avatar" @error="handleAvatarError" />
                      </div>
                      <div class="user-info">
                        <span class="user-name">{{ userName }}</span>
                        <Icon icon="mdi:chevron-down" class="ms-1 dropdown-icon"></Icon>
                      </div>
                    </div>
                  </div>
                  <div class="user-dropdown-menu" v-show="showUserMenu">
                    <div class="user-dropdown-header">
                      <img :src="userAvatar" :alt="userName" class="dropdown-avatar" @error="handleAvatarError" />
                      <div class="dropdown-user-info">
                        <span class="dropdown-user-name">{{ userName }}</span>
                        <span class="dropdown-user-email">{{ userEmail }}</span>
                      </div>
                    </div>
                    <div class="user-dropdown-items">
                      <router-link to="/profile" class="dropdown-item">
                        <Icon icon="mdi:account" class="me-2"></Icon>會員中心
                      </router-link>
                      <router-link to="/shop/orderHistory" class="dropdown-item">
                        <Icon icon="mdi:package" class="me-2"></Icon>歷史訂單
                      </router-link>
                      <router-link to="/profile/management/activity" class="dropdown-item">
                        <Icon icon="mdi:heart" class="me-2"></Icon>我的收藏
                      </router-link>
                      <div class="dropdown-divider"></div>
                      <a href="#" v-if="showBecomeVendorButton" class="dropdown-item vendor-item"
                        @click.prevent="handleBecomeVendor">
                        <Icon icon="mdi:store" class="me-2"></Icon>店家專區
                      </a>
                      <div class="dropdown-divider" v-if="showBecomeVendorButton"></div>
                      <a href="#" class="dropdown-item logout-item" @click.prevent="handleLogout">
                        <Icon icon="mdi:logout" class="me-2"></Icon>登出
                      </a>
                    </div>
                  </div>
                </li>
              </template>
            </ul>
          </div>
          <!-- 會員專區-->
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <hr class="m-0" />
    </div>

    <div class="container">
      <nav class="main-menu d-flex navbar navbar-expand-lg">
        <div class="d-flex d-lg-none align-items-end mt-3"></div>
      </nav>
    </div>

    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #f9f3ec">
      <div class="container d-flex flex-column align-items-center">
        <a class="navbar-brand text-center" href="#">店家專區</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/vendor">首頁</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/vendor/index">店家</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/activity/index">活動</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/profile/management/vendor">個人</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import axios from 'axios'
import { Modal } from 'bootstrap'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
const userId = authStore.userId
const keyword = ref('')
const vendorList = ref([]) // 儲存結果傳至搜尋頁面
const router = useRouter()
const route = useRoute()

const searchVendor = async () => {
  if (!keyword.value) {
    alert('請輸入關鍵字!')
    return
  }

  const formData = new FormData()
  formData.append('keyword', keyword.value)

  try {
    const response = await fetch(`http://localhost:8080/api/vendor/find`, {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    vendorList.value = data

    router.replace({
      path: '/vendor/search',
      query: { keyword: keyword.value }, // 只會更新當前URL，不會新增歷史紀錄，即按上一頁不會回到上個搜尋結果
    })
  } catch (error) {
    console.error('提交失敗:', error)
    alert('提交失敗，請重試！')
  }
}

const showNotifications = ref(false)
const notifications = ref([])
const selectedNotificationContent = ref(null)
const selectedNotificationTitle = ref(null)
const selectedNotificationSedTime = ref(null)
const modalInstance = ref(null)
const memberId = 11 // 假设当前会员ID为1，实际应用中请从用户信息获取

// 获取通知列表
const getNotifications = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/vendor/notification/${userId}`)
    notifications.value = response.data.reverse()
  } catch (error) {
    console.error('获取通知失败:', error)
  }
}

// 计算未读通知数
const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.isRead).length
})

// 切换通知弹出层
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

// 标记通知为已读
const markAsRead = async (index, notificationId) => {
  try {
    await axios.put(`http://localhost:8080/api/vendor/notification/read/${notificationId}`)
    notifications.value[index].isRead = true
  } catch (error) {
    console.error('标记通知失败:', error)
  }
}

// 清除所有通知
const clearNotifications = async () => {
  try {
    await axios.delete(`http://localhost:8080/api/vendor/notification/delete/${userId}`)
    notifications.value = []
  } catch (error) {
    console.error('清除通知失败:', error)
  }
}

const handleNotificationClick = async (index, notification) => {
  await markAsRead(index, notification.id) // 标记为已读
  openNotification(notification) // 然后打开模态框
}

// 打开通知详情
const openNotification = (notification) => {
  console.log('打開')
  selectedNotificationContent.value = notification.notificationContent
  selectedNotificationTitle.value = notification.notificationTitle
  selectedNotificationSedTime.value = notification.sentTime
  nextTick(() => {
    console.log(modalInstance)
    modalInstance.value.show()
  })
}

// 页面加载时获取通知
onMounted(() => {
  // modalInstance.value = new Modal(document.getElementById("notificationModal"));
  getNotifications()
  nextTick(() => {
    modalInstance.value = new Modal(document.getElementById('notificationModal'))
  })
})


const isAuthenticated = computed(() => authStore.isAuthenticated)

// 修改 userName 計算屬性
const userName = computed(() => {
  // 檢查字符串是否為郵箱格式
  const isEmailFormat = (text, email) => {
    if (!text || !email) return false
    if (text.toLowerCase() === email.toLowerCase()) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(text)
  }

  // 從 authStore 和 localStorage 獲取最新資料
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const user = authStore.user || userData
  const userEmail = user?.email || ''

  // 優先使用資料庫緩存的名稱
  if (authStore.userId) {
    const cachedName = localStorage.getItem(`db_name_${authStore.userId}`)
    if (cachedName && cachedName !== 'null' && cachedName !== 'undefined') {
      return cachedName
    }
  }

  // 如果有用戶資料，按優先順序使用名稱
  if (user) {
    // 優先使用 name
    if (
      user.name &&
      user.name !== 'null' &&
      user.name !== 'undefined' &&
      !isEmailFormat(user.name, userEmail)
    ) {
      return user.name
    }

    // 其次使用 memberName
    if (
      user.memberName &&
      user.memberName !== 'null' &&
      user.memberName !== 'undefined' &&
      !isEmailFormat(user.memberName, userEmail)
    ) {
      return user.memberName
    }

    // 再次使用 given_name（針對第三方登入）
    if (user.given_name && user.given_name !== 'null' && user.given_name !== 'undefined') {
      return user.given_name
    }

    // 最後使用郵箱名稱部分
    if (userEmail) {
      return userEmail.split('@')[0]
    }
  }

  return '用戶'
})

// 添加一個新方法，強制從資料庫獲取最新名稱
const fetchNameFromDatabase = async (forceRefresh = false) => {
  if (!authStore.token || !authStore.userId) return null

  console.log('直接從資料庫獲取最新用戶名稱')

  // 檢查是否是郵箱格式的函數
  const isEmailFormat = (text, email) => {
    if (!text || !email) return false
    if (text === email) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(text)
  }

  try {
    // 同時嘗試多個 API 端點以確保能獲取到最新名稱
    const apis = [
      '/api/member/profile', // 優先使用profile API，因為它返回Member表中的name
      '/api/auth/status', // 狀態API也應該包含資料庫中的name
      `/api/member/${authStore.userId}`,
      '/api/member/userInfo',
    ]

    // 獲取用戶郵箱以檢查名稱是否是郵箱格式
    const userEmail = authStore.user?.email || ''

    // 使用 Promise.all 同時發起多個請求
    const responses = await Promise.all(
      apis.map((api) =>
        fetch(api, {
          headers: { Authorization: `Bearer ${authStore.token}` },
          // 如果強制刷新，添加隨機參數防止緩存
          cache: forceRefresh ? 'no-cache' : 'default',
        })
          .then((res) => {
            if (!res.ok) throw new Error(`API ${api} failed with status ${res.status}`)
            return res.json()
          })
          .catch((err) => {
            console.warn(`API ${api} 請求失敗:`, err)
            return null // 返回null而不是拒絕Promise
          })
      )
    )

    console.log('獲取到的所有 API 響應:', responses)

    // 尋找第一個包含有效名稱的響應
    let validName = null

    for (const data of responses) {
      if (!data) continue // 跳過失敗的請求

      console.log('檢查 API 響應:', data)

      // 專注獲取name欄位 - 資料庫中的欄位名稱就是name
      // 注意: 有些API可能將用戶資料包裝在另一個物件中
      const name = data.name || (data.member ? data.member.name : null)

      if (name && name !== 'null' && name !== 'undefined' && !isEmailFormat(name, userEmail)) {
        console.log('找到有效的用戶名稱:', name)
        validName = name
        break
      }
    }

    // 如果找到有效名稱，立即更新 authStore 和 localStorage
    if (validName) {
      console.log('使用資料庫獲取的名稱更新用戶:', validName)

      // 緩存此用戶 ID 的名稱，確保未來可立即獲取
      if (authStore.userId) {
        // 正常緩存
        localStorage.setItem(`db_name_${authStore.userId}`, validName)
        // 同時設置臨時緩存供立即使用
        localStorage.setItem(`db_name_${authStore.userId}_temp`, validName)
        console.log(`已緩存用戶 ${authStore.userId} 的名稱:`, validName)
      }

      // 從 localStorage 獲取完整的用戶數據
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')

      // 更新用戶數據 - 只設置name欄位，確保與資料庫一致
      const updatedUserData = {
        ...userData,
        name: validName,
      }

      // 保存回 localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUserData))

      // 更新 authStore - 只設置name欄位，確保與資料庫一致
      authStore.setUser({
        ...authStore.user,
        name: validName,
      })

      // 發送事件通知名稱已更新
      window.dispatchEvent(
        new CustomEvent('user-info-updated', {
          detail: { user: { ...authStore.user, name: validName } },
        })
      )

      return validName
    } else {
      console.warn('未能從任何 API 獲取有效的用戶名稱')
    }
  } catch (error) {
    console.error('從資料庫獲取用戶名稱失敗:', error)
  }

  return null
}

// 添加状态管理
const retryCount = ref(0)
const isLoading = ref(false)
const avatarUrl = ref(null)
const MAX_RETRIES = 2

const userAvatar = computed(() => {
  if (!authStore.user) {
    console.log('未找到用戶信息，使用默認頭像')
    return '/user_static/images/default-avatar.png'
  }

  console.log('處理用戶頭像:', {
    provider: authStore.user.provider,
    avatar: authStore.user.avatar,
    picture: authStore.user.picture,
    currentAvatarUrl: avatarUrl.value,
  })

  // 如果是第三方登錄用戶，優先使用第三方頭像
  if (authStore.user.provider) {
    const avatar =
      authStore.user.avatar || authStore.user.picture || '/user_static/images/default-avatar.png'
    console.log('使用第三方頭像:', avatar)
    return avatar
  }

  // 本地用戶，從後端獲取頭像
  if (avatarUrl.value) {
    return avatarUrl.value
  }

  // 如果沒有頭像URL，立即觸發獲取
  fetchAvatar()
  return '/user_static/images/default-avatar.png'
})

// 獲取用戶頭像
const fetchAvatar = async () => {
  if (!authStore.user || !authStore.token) {
    console.log('用戶未登入，無法獲取頭像')
    return
  }

  console.log('開始獲取用戶頭像')
  isLoading.value = true

  try {
    const timestamp = Date.now() // 添加時間戳防止快取
    const response = await fetch(`/api/member/profile-photo?t=${timestamp}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })

    console.log('頭像請求響應:', {
      status: response.status,
      ok: response.ok,
    })

    if (response.ok) {
      const blob = await response.blob()
      if (blob.size > 0) {
        // 釋放舊的 URL
        if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
          URL.revokeObjectURL(avatarUrl.value)
        }
        const newAvatarUrl = URL.createObjectURL(blob)
        avatarUrl.value = newAvatarUrl
        console.log('成功更新頭像 URL:', newAvatarUrl)

        // 觸發重新渲染
        shouldForceRefreshUserData.value = !shouldForceRefreshUserData.value
      }
    }
  } catch (error) {
    console.error('獲取頭像失敗:', error)
  } finally {
    isLoading.value = false
  }
}

// 头像加载错误处理
const handleAvatarError = () => {
  if (!isLoading.value) {
    fetchAvatar()
  }
}

// 完全替換同步用戶信息的函數
const syncUserFromLocalStorage = () => {
  try {
    console.log('開始同步本地存儲的用戶信息')

    // 從 localStorage 獲取用戶數據
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null')

    console.log('本地存儲中的用戶數據:', {
      userData,
      storedUser,
      currentAuthUser: authStore.user,
    })

    // 如果本地存儲有用戶資訊
    if (userData && Object.keys(userData).length > 0) {
      // 檢查用戶ID是否匹配
      if (userData.userId === authStore.userId) {
        console.log('找到匹配的用戶數據，進行同步')

        // 確保名稱不為空
        if (userData.name && userData.name !== 'null' && userData.name !== 'undefined') {
          console.log('使用本地存儲的用戶名稱:', userData.name)

          // 更新 authStore 中的用戶資訊
          authStore.setUser({
            ...authStore.user,
            name: userData.name,
            memberName: userData.memberName || userData.name,
          })

          // 同時更新緩存
          localStorage.setItem(`db_name_${userData.userId}`, userData.name)
        } else {
          // 如果本地存儲中沒有名稱，嘗試從緩存中獲取
          const cachedName = localStorage.getItem(`db_name_${userData.userId}`)
          if (cachedName && cachedName !== 'null' && cachedName !== 'undefined') {
            console.log('使用緩存的用戶名稱:', cachedName)

            // 更新 authStore
            authStore.setUser({
              ...authStore.user,
              name: cachedName,
              memberName: cachedName,
            })

            // 更新本地存儲
            userData.name = cachedName
            userData.memberName = cachedName
            localStorage.setItem('userData', JSON.stringify(userData))
          }
        }
      }
    }

    // 如果用戶已登入但沒有名稱，嘗試從資料庫獲取
    if (authStore.isAuthenticated && (!authStore.user?.name || authStore.user?.name === 'null')) {
      console.log('用戶已登入但沒有名稱，嘗試從資料庫獲取')
      fetchNameFromDatabase(true).then((dbName) => {
        if (dbName) {
          console.log('成功從資料庫獲取到名稱:', dbName)
          authStore.setUser({
            ...authStore.user,
            name: dbName,
            memberName: dbName,
          })

          // 更新本地存儲
          const updatedUserData = {
            ...userData,
            name: dbName,
            memberName: dbName,
          }
          localStorage.setItem('userData', JSON.stringify(updatedUserData))
          localStorage.setItem(`db_name_${authStore.userId}`, dbName)
        }
      })
    }
  } catch (error) {
    console.error('同步本地存儲用戶信息失敗:', error)
  }
}

// 在組件掛載時
onMounted(async () => {
  console.log('HeaderIndex 組件已掛載')

  // 檢查是否有新的登入標誌
  const params = new URLSearchParams(window.location.search)
  const newLogin = params.get('user_new_login') === 'true'
  const oauthSuccess = params.get('oauth_success') === 'true'

  // 獲取用戶信息
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const user = authStore.user || userData

  console.log('檢測到用戶信息:', {
    isAuthenticated: authStore.isAuthenticated,
    hasAvatar: !!avatarUrl.value,
    newLogin,
    oauthSuccess,
    user: user
      ? {
        provider: user.provider,
        name: user.name,
        email: user.email,
      }
      : null,
  })

  // 添加判斷郵箱函數
  const isEmailFormat = (text, email) => {
    if (!text || !email) return false
    if (text.toLowerCase() === email.toLowerCase()) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(text)
  }

  // 如果用戶已登入
  if (authStore.isAuthenticated) {
    // 如果沒有頭像，嘗試獲取頭像
    if (!avatarUrl.value) {
      await fetchAvatar()
    }

    // 第三方登入特別處理
    if (user && user.provider) {
      const userEmail = user.email || ''
      const currentName = user.name || ''

      // 判斷是否需要從資料庫獲取名稱
      const needsFetch =
        isEmailFormat(currentName, userEmail) ||
        newLogin ||
        oauthSuccess ||
        !localStorage.getItem(`db_name_${authStore.userId}`)

      if (needsFetch) {
        console.log('檢測到第三方登入可能需要更新名稱，立即從資料庫獲取')

        try {
          // 立即獲取資料庫名稱
          const dbName = await fetchNameFromDatabase(true)

          if (dbName && dbName !== currentName) {
            console.log('成功從資料庫獲取到名稱:', dbName)
            shouldForceRefreshUserData.value = true

            // 立即更新UI (不等待下一次渲染)
            authStore.setUser({
              ...authStore.user,
              name: dbName,
            })

            // 更新localStorage中的用戶數據
            const userData = JSON.parse(localStorage.getItem('userData') || '{}')
            localStorage.setItem(
              'userData',
              JSON.stringify({
                ...userData,
                name: dbName,
              })
            )

            // 發出全局事件通知其他組件用戶信息已更新
            window.dispatchEvent(
              new CustomEvent('user-info-updated', {
                detail: { user: { ...user, name: dbName } },
              })
            )
          }
        } catch (error) {
          console.error('獲取資料庫名稱失敗:', error)
        }
      }
    }

    // 移除URL參數以避免重複處理
    if (newLogin || oauthSuccess) {
      const url = new URL(window.location.href)
      url.searchParams.delete('user_new_login')
      url.searchParams.delete('oauth_success')
      window.history.replaceState({}, document.title, url.toString())
    }
  }

  // 監聽用戶菜單點擊外部關閉事件
  window.addEventListener('click', handleClickOutside)

  // 監聽用戶登入事件
  window.addEventListener('user-login', handleUserLogin)

  // 監聽用戶資訊更新事件
  window.addEventListener('user-info-updated', handleUserInfoUpdated)

  // 同步本地存儲的用戶信息
  syncUserFromLocalStorage()

  // 添加個人資料更新事件監聽
  window.addEventListener('profile-updated', handleProfileUpdate)

  // 定期檢查並更新頭像（每5分鐘）
  const avatarUpdateInterval = setInterval(() => {
    if (authStore.isAuthenticated) {
      fetchAvatar()
    }
  }, 5 * 60 * 1000)

  // 組件卸載時清理
  onUnmounted(() => {
    window.removeEventListener('profile-updated', handleProfileUpdate)
    clearInterval(avatarUpdateInterval)
    // 清理 blob URL
    if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(avatarUrl.value)
    }
  })
})

// 修改監聽認證狀態變化
watch(
  () => authStore.isAuthenticated,
  (newValue) => {
    console.log('認證狀態變化:', newValue)
    if (newValue) {
      console.log('當前用戶信息:', authStore.user)
      // 確保從本地存儲同步最新資訊
      syncUserFromLocalStorage()
    }
  },
  { immediate: true }
)

// 監聽 localStorage 變化 (可以檢測到其他標籤頁的更改)
window.addEventListener('storage', (event) => {
  if (event.key === 'user' && event.newValue) {
    console.log('檢測到 localStorage 用戶信息變化')
    syncUserFromLocalStorage()
  }
})

const handleLogout = () => {
  authStore.clearToken()

  // 發送登出事件通知其他組件
  window.dispatchEvent(new CustomEvent('user-logout'))

  router.push('/')
}

const userEmail = computed(() => {
  if (!authStore.user) return ''
  return authStore.user.email || ''
})

const showUserMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const shouldForceRefreshUserData = ref(false)

// 處理點擊外部關閉用戶菜單
const handleClickOutside = (event) => {
  const userDropdown = document.querySelector('.user-dropdown-container')
  const userProfileBtn = document.querySelector('.user-profile-btn')

  if (
    (userDropdown && !userDropdown.contains(event.target)) ||
    (userProfileBtn &&
      userProfileBtn.contains(event.target) &&
      event.target.closest('.dropdown-item'))
  ) {
    showUserMenu.value = false
  }
}

// 處理用戶登入事件
const handleUserLogin = (event) => {
  console.log('收到用戶登入事件:', event.detail)

  if (event.detail && event.detail.user) {
    // 如果是第三方登入，需要檢查名稱
    if (event.detail.user.provider) {
      console.log('登入事件檢測到第三方用戶，立即獲取名稱')

      // 判斷名稱是否是郵箱格式
      const isEmailFormat = (text, email) => {
        if (!text || !email) return false
        if (text.toLowerCase() === email.toLowerCase()) return true
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(text)
      }

      const userEmail = event.detail.user.email || ''
      const userName = event.detail.user.name || ''

      // 如果當前名稱是郵箱格式，立即從資料庫獲取最新名稱
      if (isEmailFormat(userName, userEmail)) {
        console.log('檢測到第三方登入用戶名稱可能是郵箱格式，立即獲取資料庫名稱')

        // 立即獲取資料庫名稱
        fetchNameFromDatabase(true).then((dbName) => {
          if (dbName && dbName !== userName) {
            console.log('登入事件中成功從資料庫獲取到名稱:', dbName)
            shouldForceRefreshUserData.value = true

            // 立即更新 authStore
            if (authStore.user) {
              authStore.setUser({
                ...authStore.user,
                name: dbName,
              })
            }

            // 更新 localStorage
            const userData = JSON.parse(localStorage.getItem('userData') || '{}')
            localStorage.setItem(
              'userData',
              JSON.stringify({
                ...userData,
                name: dbName,
              })
            )

            // 發出全局事件通知其他組件重新獲取用戶信息
            window.dispatchEvent(
              new CustomEvent('user-info-updated', {
                detail: { user: { ...event.detail.user, name: dbName } },
              })
            )
          }
        })
      }
    }

    // 重新獲取頭像
    fetchAvatar()
  }
}

// 處理用戶資訊更新事件
const handleUserInfoUpdated = (event) => {
  console.log('收到用戶資訊更新事件:', event.detail)

  if (event.detail && event.detail.user) {
    // 強制更新 UI
    if (
      event.detail.user.name &&
      (!authStore.user || event.detail.user.name !== authStore.user.name)
    ) {
      console.log('用戶名稱已更新，強制重新渲染')

      // 更新 authStore
      authStore.setUser({
        ...authStore.user,
        ...event.detail.user,
      })

      // 設置強制更新標誌
      shouldForceRefreshUserData.value = true
    }

    // 如果有頭像更新，也獲取最新頭像
    if (event.detail.updateAvatar) {
      fetchAvatar()
    }
  }
}

const showBecomeVendorButton = computed(() => {
  // 只有當用戶是會員（MEMBER）角色時才顯示
  if (!authStore.isAuthenticated) return false
  return authStore.user?.role === 'MEMBER' || !authStore.user?.role
})

// 處理成為商家點擊事件
const handleBecomeVendor = async () => {
  try {
    console.log('處理成為商家請求')

    // 首先檢查用戶是否有資格成為商家
    const checkResponse = await fetch('/api/vendor/convert/check', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })

    if (!checkResponse.ok) {
      const errorData = await checkResponse.json()
      alert(`無法檢查商家資格: ${errorData.error || '未知錯誤'}`)
      return
    }

    const checkResult = await checkResponse.json()
    console.log('商家資格檢查結果:', checkResult)

    if (!checkResult.eligible) {
      alert(checkResult.message || '您目前無法成為商家')
      return
    }

    // 根據檢查結果決定下一步操作
    if (checkResult.hasExistingAccount) {
      // 如果已有商家帳號，詢問是否切換
      if (confirm('您已有商家帳號，是否切換到商家模式？')) {
        await switchToVendor()
      }
    } else {
      // 如果沒有商家帳號，詢問是否創建
      if (confirm('轉換為商家將創建一個新的商家帳號，請確認是否繼續？')) {
        await convertToVendor()
      }
    }
  } catch (error) {
    console.error('處理成為商家請求失敗:', error)
    alert('處理請求時發生錯誤，請稍後再試')
  }
}

// 切換到已有商家帳號
const switchToVendor = async () => {
  try {
    // 檢查認證狀態
    if (!authStore.token) {
      console.error('未登入或 token 已過期')
      alert('請先登入系統')
      return
    }

    console.log('開始切換到商家帳號，當前認證狀態:', {
      token: authStore.token,
      userId: authStore.userId,
      userRole: authStore.userRole,
    })

    const response = await fetch('/api/vendor/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ confirm: true }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('切換到商家帳號失敗:', errorData)
      alert(`切換到商家帳號失敗: ${errorData.error || '未知錯誤'}`)
      return
    }

    const result = await response.json()
    console.log('切換到商家帳號成功，收到資料:', result)

    // 驗證返回的資料
    if (!result.token || !result.vendorId || !result.role) {
      console.error('API 返回資料不完整:', result)
      alert('系統返回資料不完整，請稍後再試')
      return
    }

    // 更新認證狀態
    authStore.setToken(result.token, result.vendorId, result.role, {
      id: result.vendorId,
      email: result.email,
      role: result.role,
      provider: 'LOCAL',
    })

    console.log('認證狀態已更新:', {
      token: result.token,
      vendorId: result.vendorId,
      role: result.role,
    })

    // 顯示成功訊息
    alert('已成功切換到商家帳號')

    // 跳轉到商家後台
    router.push('/vendor/admin/profile')
  } catch (error) {
    console.error('切換到商家帳號失敗:', error)
    alert('切換商家帳號時發生錯誤，請稍後再試')
  }
}

// 創建並轉換為新的商家帳號
const convertToVendor = async () => {
  try {
    const response = await fetch('/api/vendor/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ confirm: true }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      alert(`成為商家失敗: ${errorData.error || '未知錯誤'}`)
      return
    }

    const result = await response.json()
    console.log('成為商家成功:', result)

    // 更新認證狀態
    authStore.setToken(result.token, result.vendorId, result.role, {
      id: result.vendorId,
      email: result.email,
      role: result.role,
      provider: 'LOCAL',
    })

    // 顯示成功訊息
    alert('您已成功成為商家，請完成後續資料填寫')

    // 跳轉到商家後台完善資料
    router.push('/vendor/admin/profile')
  } catch (error) {
    console.error('成為商家失敗:', error)
    alert('轉換商家時發生錯誤，請稍後再試')
  }
}

const handleProfileUpdate = async (event) => {
  console.log('收到個人資料更新事件:', event.detail)

  try {
    // 強制從資料庫獲取最新資料
    const response = await fetch('/api/member/profile', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Cache-Control': 'no-cache', // 防止快取
      },
    })

    if (!response.ok) {
      throw new Error('獲取用戶資料失敗')
    }

    const userData = await response.json()
    console.log('從資料庫獲取的最新用戶資料:', userData)

    // 更新 authStore
    const updatedUser = {
      ...authStore.user,
      name: userData.name,
      memberName: userData.name,
      avatar: userData.avatar,
    }
    authStore.setUser(updatedUser)

    // 更新 localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}')
    const updatedUserData = {
      ...storedUserData,
      name: userData.name,
      memberName: userData.name,
      avatar: userData.avatar,
    }
    localStorage.setItem('userData', JSON.stringify(updatedUserData))

    // 更新名稱緩存
    if (authStore.userId) {
      localStorage.setItem(`db_name_${authStore.userId}`, userData.name)
    }

    // 強制重新獲取頭像
    avatarUrl.value = null // 清除現有頭像
    await fetchAvatar() // 立即獲取新頭像

    // 觸發重新渲染
    shouldForceRefreshUserData.value = !shouldForceRefreshUserData.value

    // 發送全局事件通知其他組件更新
    window.dispatchEvent(
      new CustomEvent('user-info-updated', {
        detail: {
          user: updatedUser,
          updateAvatar: true,
        },
      })
    )

    console.log('用戶資料同步完成')
  } catch (error) {
    console.error('同步用戶資料失敗:', error)
  }
}

// 添加監聽器來觀察頭像變化
watch(avatarUrl, (newUrl, oldUrl) => {
  if (newUrl !== oldUrl) {
    console.log('頭像 URL 已更新:', newUrl)
    // 觸發重新渲染
    shouldForceRefreshUserData.value = !shouldForceRefreshUserData.value
  }
})

// 添加監聽器來觀察 authStore.user 的變化
watch(
  () => authStore.user,
  (newUser, oldUser) => {
    if (newUser?.name !== oldUser?.name) {
      console.log('用戶名稱已更新:', newUser?.name)
      // 強制更新緩存
      if (authStore.userId && newUser?.name) {
        localStorage.setItem(`db_name_${authStore.userId}`, newUser.name)
      }
    }
  },
  { deep: true }
)
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}

.btn-notifivation {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
}

.dropdown-menu {
  z-index: 1000;
  position: absolute;
  top: 100%;
  /* 讓通知出現在鈴鐺的正下方 */
  left: auto;
  /* 讓它根據 transform 來調整 */
  right: 0;
  /* 讓它在鈴鐺左下方，並靠右對齊 */
  margin-top: 5px;
  width: 400px;
  transform: translateX(-10%);
  /* 讓通知中心向左偏移一半，確保它不會超出螢幕 */
  /* max-width: calc(100vw - 20px); */
  /* 確保不超過螢幕寬度 */

  max-height: 400px;
  overflow-y: auto;
}

@media (max-width: 400px) {
  .dropdown-menu {
    left: 0;
    right: auto;
    transform: none;
    /* 小螢幕時不再偏移 */
  }
}

.notification-container {
  position: relative;
  /* 保證通知列表相對於這個容器定位 */
}

.dropdown-item.read {
  background-color: #c7c5c5;
  /* 灰色背景 */
}

.btn-number {
  color: black;
}

.notification-text {
  display: block;
  max-width: 300px;
  /* 根据实际情况调整 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-profile {
  position: relative;
  margin-right: 1rem;
}

.avatar-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #2b4f76;
  background-color: #fff;
  padding: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-info .username {
  color: #fff;
  margin: 0;
  font-size: 1rem;
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
  padding: 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  gap: 12px;
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2b4f76;
  flex-shrink: 0;
}

.dropdown-user-info {
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
}

.dropdown-user-name {
  font-weight: 600;
  color: #2b4f76;
  font-size: 1rem;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-user-email {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  color: #2b6d53;
  font-weight: 500;
  border-radius: 4px;
  margin: 0 8px;
  transition: all 0.3s;
}

.vendor-item:hover {
  background-color: rgba(43, 109, 83, 0.1);
  color: #1a503c;
}

.shop-link {
  color: #dc3545;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.shop-link:hover {
  background-color: rgba(220, 53, 69, 0.1);
  color: #c82333;
}

.back-link {
  color: #ff6b35;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.back-link:hover {
  background-color: rgba(255, 107, 53, 0.1);
  color: #e65a24;
}
</style>
