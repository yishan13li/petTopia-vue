// RouterUser.js
// import ShopIndex from '@/views/shop/ShopIndex.vue';
// import ShopCheckout from '@/views/shop/ShopCheckout.vue';
// import ShopOrderHistory from '@/views/shop/ShopOrderHistory.vue';
// import ShopOrderDetail from '@/views/shop/ShopOrderDetail.vue';
// import UserProfile from '@/views/user/UserProfile.vue';
// import UserOrders from '@/views/user/UserOrders.vue';
// import UserSettings from '@/views/user/UserSettings.vue';
// import UserFavorites from '@/views/user/UserFavorites.vue';

import Profile from '@/views/Profile.vue';

export default [
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '會員個人資料 - PetTopia',
      requiresAuth: true
    }
  },
  {
    path: '/profile/:section',
    name: 'ProfileSection',
    component: Profile,
    meta: {
      title: '會員中心 - PetTopia',
      requiresAuth: true
    }
  }
];
  