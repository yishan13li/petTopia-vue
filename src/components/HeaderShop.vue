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
            <router-link to="/">
              <img src="/user_static/images/logo.png" alt="logo" class="img-fluid">
            </router-link>
          </div>
        </div>

        <!-- 搜尋商品 -->
        <div class="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
          <div class="search-bar border rounded-2 px-3 border-dark-subtle">
            <form id="search-form" class="text-center d-flex align-items-center" action="" method="">

              <!-- 搜尋商品 Input -->
              <input type="text" class="form-control border-0 bg-transparent" placeholder="搜尋商品"
                v-model="searchProductKeyword" @keydown.enter.prevent="updateSearchQuery" />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                @click="updateSearchQuery">
                <path fill="currentColor"
                  d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" />
              </svg>

            </form>
          </div>
        </div>

        <!-- 登入、註冊 -->
        <div
          class="col-sm-8 col-lg-4 d-flex justify-content-end align-items-center gap-3 mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
          <div class="d-none d-xl-block">
            <ul class="d-flex list-unstyled m-0 gap-3">
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
                <li>
                  <a href="http://localhost:5173/vendor" class="mx-3 vendor-link">
                    <Icon icon="mdi:store-search" class="fs-5"></Icon> <span class="fs-5">搜尋友善店家</span>
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
        </div>

      </div>
    </div>

    <div class="container-fluid">
      <hr class="m-0">
    </div>

    <!-- nav -->
    <div class="container">
      <nav class="main-menu d-flex navbar navbar-expand-lg ">

        <div class="d-flex d-lg-none align-items-end mt-3">
          <ul class="d-flex justify-content-end list-unstyled m-0">
            <li>
              <a href="account.html" class="mx-3">
                <Icon icon="healthicons:person" class="fs-4"></Icon>
              </a>
            </li>
            <li>
              <a href="wishlist.html" class="mx-3">
                <Icon icon="mdi:heart" class="fs-4"></Icon>
              </a>
            </li>

            <li>
              <!-- 當 cartCount > 0 時，顯示正常的購物車鏈接 -->
              <router-link v-if="cartCount > 0" to="/shop/cart" class="nav-link">
                <Icon icon="mdi:cart" class="fs-4 position-relative"></Icon>
                <span
                  class="position-absolute translate-middle badge rounded-circle bg-primary border border-white pt-2 text-white">
                  {{ cartCount }}
                </span>
              </router-link>

              <!-- 當 cartCount = 0 時，顯示購物車圖示，並且在 hover 時顯示提示訊息 -->
              <div v-else class="nav-link text-muted" title="購物車是空的，請前往購物" style="cursor: not-allowed;">
                <Icon icon="mdi:cart" class="fs-4 position-relative"></Icon>
                <span
                  class="position-absolute translate-middle badge rounded-circle bg-secondary border border-white pt-2 text-white">
                  0
                </span>
              </div>
            </li>

            <li>
              <a href="#" class="mx-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSearch"
                aria-controls="offcanvasSearch">
                <Icon icon="tabler:search" class="fs-4"></Icon>

              </a>
            </li>
          </ul>

        </div>

        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">

          <div class="offcanvas-header justify-content-center">
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>

          <!-- 商品分類 Option -->
          <div class="offcanvas-body justify-content-between">
            <select class="filter-categories border-0 mb-0 me-5 text-center" v-model="selectedCategory">
              <option disabled value="">商品分類</option>
              <option value="所有商品">所有商品</option>
              <option value="食品保健">食品保健</option>
              <option value="日常用品">日常用品</option>
              <option value="服飾">服飾</option>
              <option value="玩具">玩具</option>
              <option value="其他">其他</option>
            </select>

            <ul class="navbar-nav menu-list list-unstyled d-flex gap-md-3 mb-0">
              <li class="nav-item">
                <router-link to="/shop" class="nav-link active">首頁</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/shop/products" class="nav-link">瀏覽商品</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/shop/orderHistory" class="nav-link">歷史訂單</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/profile/coupons" class="nav-link">我的優惠券</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/shop/member/product/review" class="nav-link">商品評價</router-link>
              </li>
            </ul>

            <div class="d-none d-lg-flex align-items-end">
              <ul class="d-flex justify-content-end list-unstyled m-0">
                <li>
                  <a href="index.html" class="mx-3">
                    <Icon icon="healthicons:person" class="fs-4"></Icon>
                  </a>
                </li>
                <li>
                  <a href="index.html" class="mx-3">
                    <Icon icon="mdi:heart" class="fs-4"></Icon>
                  </a>
                </li>

                <!-- 購物車連結 -->
                <li class="">
                  <!-- <a href="index.html" class="mx-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart"
                    aria-controls="offcanvasCart"> -->

                  <!-- 當 cartCount > 0 時，顯示正常的購物車鏈接 -->
                  <router-link v-if="cartCount > 0" to="/shop/cart" class="nav-link">
                    <Icon icon="mdi:cart" class="fs-4 position-relative"></Icon>
                    <span
                      class="position-absolute translate-middle badge rounded-circle bg-primary border border-white pt-2 text-white">
                      {{ cartCount }}
                    </span>
                  </router-link>

                  <!-- 當 cartCount = 0 時，顯示購物車圖示，並且在 hover 時顯示提示訊息 -->
                  <div v-else class="nav-link text-muted" title="購物車是空的，請前往購物" style="cursor: not-allowed;">
                    <Icon icon="mdi:cart" class="fs-4 position-relative"></Icon>
                    <span
                      class="position-absolute translate-middle badge rounded-circle bg-secondary border border-white pt-2 text-white">
                      0
                    </span>
                  </div>

                  <!-- </a> -->
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>

  </header>
</template>
<script setup>
import { ref, watch, onMounted, computed, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Icon } from '@iconify/vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';

import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/shop/cart";

const router = useRouter();
const route = useRoute();

const PATH = `${import.meta.env.VITE_API_URL}`;
const authStore = useAuthStore();
const cartStore = useCartStore();

// store
const memberId = authStore.memberId;

// 購物車數量
const { cartCount } = storeToRefs(cartStore);

// 商品分類
const selectedCategory = ref(route.query.category || "所有商品"); // 預設從 query 讀取
// 搜尋關鍵字
const searchProductKeyword = ref(route.query.keyword || "");

// 認證狀態
const isAuthenticated = computed(() => authStore.isAuthenticated);

// 用戶名稱計算屬性
const userName = computed(() => {
  // 檢查字符串是否為郵箱格式
  const isEmailFormat = (text, email) => {
    if (!text || !email) return false
    if (text.toLowerCase() === email.toLowerCase()) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(text)
  }

  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const user = authStore.user || userData
  const userEmail = user?.email || ''

  if (authStore.userId) {
    const cachedName = localStorage.getItem(`db_name_${authStore.userId}`)
    if (cachedName && cachedName !== 'null' && cachedName !== 'undefined') {
      return cachedName
    }
  }

  if (user) {
    if (user.name && user.name !== 'null' && user.name !== 'undefined' && !isEmailFormat(user.name, userEmail)) {
      return user.name
    }
    if (user.memberName && user.memberName !== 'null' && user.memberName !== 'undefined' && !isEmailFormat(user.memberName, userEmail)) {
      return user.memberName
    }
    if (user.given_name && user.given_name !== 'null' && user.given_name !== 'undefined') {
      return user.given_name
    }
    if (userEmail) {
      return userEmail.split('@')[0]
    }
  }

  return '用戶'
});

// 用戶頭像
const avatarUrl = ref(null);
const userAvatar = computed(() => {
  if (!authStore.user) {
    return '/user_static/images/default-avatar.png';
  }

  if (authStore.user.provider) {
    const avatar = authStore.user.avatar || authStore.user.picture || '/user_static/images/default-avatar.png';
    return avatar;
  }

  if (avatarUrl.value) {
    return avatarUrl.value;
  }

  fetchAvatar();
  return '/user_static/images/default-avatar.png';
});

// 用戶郵箱
const userEmail = computed(() => {
  if (!authStore.user) return ''
  return authStore.user.email || ''
});

// 顯示商家按鈕
const showBecomeVendorButton = computed(() => {
  if (!authStore.isAuthenticated) return false
  return authStore.user?.role === 'MEMBER' || !authStore.user?.role
});

// 用戶選單狀態
const showUserMenu = ref(false);
const shouldForceRefreshUserData = ref(false);

// 獲取頭像
const fetchAvatar = async () => {
  if (!authStore.user || !authStore.token) return;

  try {
    const timestamp = Date.now();
    const response = await fetch(`/api/member/profile-photo?t=${timestamp}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      if (blob.size > 0) {
        if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
          URL.revokeObjectURL(avatarUrl.value);
        }
        avatarUrl.value = URL.createObjectURL(blob);
        shouldForceRefreshUserData.value = !shouldForceRefreshUserData.value;
      }
    }
  } catch (error) {
    console.error('獲取頭像失敗:', error);
  }
};

const handleAvatarError = () => {
  fetchAvatar();
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    if (response.ok) {
      if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl.value);
        avatarUrl.value = null;
      }

      authStore.clearToken();
      localStorage.removeItem('userData');
      localStorage.removeItem('oauth2_provider');
      localStorage.removeItem('oauth2_timestamp');
      localStorage.removeItem('oauth2_email');

      const keys = Object.keys(localStorage);
      const nameCacheKeys = keys.filter(key => key.startsWith('db_name_'));
      nameCacheKeys.forEach(key => localStorage.removeItem(key));

      showUserMenu.value = false;
      router.push('/login?logout=true');
    }
  } catch (error) {
    console.error('登出失敗:', error);
    if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(avatarUrl.value);
      avatarUrl.value = null;
    }
    authStore.clearToken();
    router.push('/login?logout=true');
  }
};

// 點擊外部關閉選單
const handleClickOutside = (event) => {
  const userDropdown = document.querySelector('.user-dropdown-container');
  const userProfileBtn = document.querySelector('.user-profile-btn');

  if (
    (userDropdown && !userDropdown.contains(event.target)) ||
    (userProfileBtn && userProfileBtn.contains(event.target) && event.target.closest('.dropdown-item'))
  ) {
    showUserMenu.value = false;
  }
};

// 成為商家
const handleBecomeVendor = async () => {
  try {
    const checkResponse = await fetch('/api/vendor/convert/check', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (!checkResponse.ok) {
      const errorData = await checkResponse.json();
      alert(`無法檢查商家資格: ${errorData.error || '未知錯誤'}`);
      return;
    }

    const checkResult = await checkResponse.json();

    if (!checkResult.eligible) {
      alert(checkResult.message || '您目前無法成為商家');
      return;
    }

    if (checkResult.hasExistingAccount) {
      if (confirm('您已有商家帳號，是否切換到商家模式？')) {
        await switchToVendor();
      }
    } else {
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
    if (!authStore.token) {
      console.error('未登入或 token 已過期');
      alert('請先登入系統');
      return;
    }

    const response = await fetch('/api/vendor/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ confirm: true }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('切換到商家帳號失敗:', errorData);
      alert(`切換到商家帳號失敗: ${errorData.error || '未知錯誤'}`);
      return;
    }

    const result = await response.json();

    if (!result.token || !result.vendorId || !result.role) {
      console.error('API 返回資料不完整:', result);
      alert('系統返回資料不完整，請稍後再試');
      return;
    }

    authStore.setToken(
      result.token,
      result.vendorId,
      result.role,
      {
        id: result.vendorId,
        email: result.email,
        role: result.role,
        provider: 'LOCAL',
      }
    );

    alert('已成功切換到商家帳號');
    window.location.href = '/vendor/admin/profile';
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
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ confirm: true }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`成為商家失敗: ${errorData.error || '未知錯誤'}`);
      return;
    }

    const result = await response.json();

    authStore.setToken(
      result.token,
      result.vendorId,
      result.role,
      {
        id: result.vendorId,
        email: result.email,
        role: result.role,
        provider: 'LOCAL',
      }
    );

    alert('您已成功成為商家，請完成後續資料填寫');
    window.location.href = '/vendor/admin/profile';
  } catch (error) {
    console.error('成為商家失敗:', error);
    alert('轉換商家時發生錯誤，請稍後再試');
  }
};

watch(selectedCategory, async (newCategory) => {
  updateSearchQuery();
});

// #region 初始化 & 監聽 =================================================

onMounted(async () => {
  cartStore.fetchCartCount(memberId);
  if (authStore.isAuthenticated && !avatarUrl.value) {
    fetchAvatar();
  }
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
  if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarUrl.value);
  }
});

// #endregion =================================================

// 更新query的關鍵字和分類
function updateSearchQuery() {
  router.push({
    path: '/shop/products', query: {
      category: selectedCategory.value,
      keyword: searchProductKeyword.value ? searchProductKeyword.value.trim() : null,
    }
  });
}


</script>
<style scoped>
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

.vendor-link {
  color: #2b6d53;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.vendor-link:hover {
  background-color: rgba(43, 109, 83, 0.1);
  color: #1a503c;
}
</style>