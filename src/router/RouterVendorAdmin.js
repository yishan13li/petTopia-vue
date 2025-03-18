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
// RouterVendorAdmin.js
// import ShopIndex from '@/views/shop/ShopIndex.vue';
// import ShopCheckout from '@/views/shop/ShopCheckout.vue';
// import ShopOrderHistory from '@/views/shop/ShopOrderHistory.vue';
// import ShopOrderDetail from '@/views/shop/ShopOrderDetail.vue';
// import VendorAdminDashboard from '@/views/vendor-admin/VendorAdminDashboard.vue';
// import VendorManagement from '@/views/vendor-admin/VendorManagement.vue';
// import VendorApplications from '@/views/vendor-admin/VendorApplications.vue';
// import VendorReports from '@/views/vendor-admin/VendorReports.vue';
// import VendorCategories from '@/views/vendor-admin/VendorCategories.vue';

export default [];  // 導出空陣列
>>>>>>> 2218635 (上傳本地專案到 f1/lai 分支)
  