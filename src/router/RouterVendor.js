<<<<<<< HEAD
import VendorIndex from "@/views/vendor/VendorIndex.vue";
import VendorDetail from "@/views/vendor/VendorDetail.vue";
import ActivityIndex from "@/views/activity/ActivityIndex.vue";
import ActivityDetail from "@/views/activity/ActivityDetail.vue";
import VendorSearch from "@/views/vendor/VendorSearch.vue";

export default [
  {
    path: "/vendor",
    name: "VendorIndex",
    component: VendorIndex,
  },

  {
    path: "/vendor/detail/:vendorId",
    name: "VendorDetail",
    component: VendorDetail,
    props: (route) => ({ vendorId: Number(route.params.vendorId) }), // 確保vendorId為數字
  },

  {
    path: "/vendor/search",
    name: "VendorSearch",
    component: VendorSearch,
  },

  {
    path: "/activity",
    name: "ActivityIndex",
    component: ActivityIndex,
  },

  {
    path: "/activity/detail/:activityId",
    name: "ActivityDetail",
    component: ActivityDetail,
    props: (route) => ({ activityId: Number(route.params.activityId) }), // 確保activityId為數字
  },
];
=======
// RouterVendor.js
// import ShopIndex from '@/views/shop/ShopIndex.vue';
// import ShopCheckout from '@/views/shop/ShopCheckout.vue';
// import ShopOrderHistory from '@/views/shop/ShopOrderHistory.vue';
// import ShopOrderDetail from '@/views/shop/ShopOrderDetail.vue';
// import VendorDashboard from '@/views/vendor/VendorDashboard.vue';
// import VendorProducts from '@/views/vendor/VendorProducts.vue';
// import VendorOrders from '@/views/vendor/VendorOrders.vue';
// import VendorProfile from '@/views/vendor/VendorProfile.vue';
// import VendorAnalytics from '@/views/vendor/VendorAnalytics.vue';

export default [];  // 導出空陣列
  
>>>>>>> f1/lai2
