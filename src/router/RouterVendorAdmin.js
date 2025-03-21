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

import VendorAdminProfile from '@/views/vendor-admin/VendorAdminProfile.vue';

export default [
    {
        path: '/vendor_admin/vendor_admin_profile',
        name: 'VendorAdminProfile',
        component: VendorAdminProfile,
        meta: {
            title: '商家資料管理 - PetTopia',
            requiresAuth: true,
            role: 'VENDOR'
        }
    }
]; 
  