<<<<<<< HEAD
import ShopIndex from '@/views/shop/ShopIndex.vue';
import ShopCheckout from '@/views/shop/ShopCheckout.vue';
import ShopOrderHistory from '@/views/shop/ShopOrderHistory.vue';
import ShopOrderDetail from '@/views/shop/ShopOrderDetail.vue';

export default [
    {
        path: '/shop/',
        name: 'ShopIndex',
        component: ShopIndex
    },
    {
        path: '/shop/checkout',
        name: 'ShopCheckout',
        component: ShopCheckout
    },

    {
        path: '/shop/orderHistory',
        name: 'ShopOrderHistory',
        component: ShopOrderHistory
    },

    {
        path: '/shop/orders/:orderId',
        name: 'ShopOrderDetail',
        component: ShopOrderDetail
    }
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
>>>>>>> 2218635 (上傳本地專案到 f1/lai 分支)
  