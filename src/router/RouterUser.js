// RouterUser.js
// import ShopIndex from '@/views/shop/ShopIndex.vue';
// import ShopCheckout from '@/views/shop/ShopCheckout.vue';
// import ShopOrderHistory from '@/views/shop/ShopOrderHistory.vue';
// import ShopOrderDetail from '@/views/shop/ShopOrderDetail.vue';
// import UserProfile from '@/views/user/UserProfile.vue';
// import UserOrders from '@/views/user/UserOrders.vue';
// import UserSettings from '@/views/user/UserSettings.vue';
// import UserFavorites from '@/views/user/UserFavorites.vue';

import Profile from '@/views/Profile.vue'
import VendorMember from '@/views/vendor/VendorMember.vue'
import ActivityMember from '@/views/activity/ActivityMember.vue'
import Coupons from '@/views/Coupons.vue'
import ChangePassword from '@/views/ChangePassword.vue'
import Address from '@/views/Address.vue'

export default [
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '會員個人資料 - PetTopia',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/:section',
    name: 'ProfileSection',
    component: Profile,
    meta: {
      title: '會員中心 - PetTopia',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/coupons',
    name: 'Coupons',
    component: Coupons,
    meta: {
      title: '我的優惠券 - PetTopia',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/management/vendor',
    name: 'VendorManagement',
    component: VendorMember,
    meta: {
      title: '會員管理店家相關 - PetTopia',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/management/activity',
    name: 'ActivityManagement',
    component: ActivityMember,
    meta: {
      title: '會員管理活動相關 - PetTopia',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/password',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: {
      requiresAuth: true,
      title: '更改密碼'
    }
  },
  {
    path: '/profile/address',
    name: 'Address',
    component: Address,
    meta: {
      title: '收貨地址設定 - PetTopia',
      requiresAuth: true,
    },
  },
]
