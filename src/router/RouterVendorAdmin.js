import ShopIndex from '@/views/shop/ShopIndex.vue';
import ShopCheckout from '@/views/shop/ShopCheckout.vue';
import ShopOrderHistory from '@/views/shop/ShopOrderHistory.vue';
import ShopOrderDetail from '@/views/shop/ShopOrderDetail.vue';
import VendorAdminProfile from '@/views/vendor_admin/VendorAdminProfile.vue';
import VendorAdminActivity from '@/views/vendor_admin/VendorAdminActivity.vue';
import VendorAdminActivityDetail from '@/views/vendor_admin/VendorAdminActivityDetail.vue';

export default [
    {
        path: '/vendor/admin/profile',
        name: 'VendorAdminProfile',
        component: VendorAdminProfile
    },
    {
        path: '/vendor/admin/activity',
        name: 'VendorAdminActivity',
        component: VendorAdminActivity
    },

    {
        path: '/vendor/admin/activity/detail',
        name: 'VendorAdminActivityDetail',
        component: VendorAdminActivityDetail
    },

    {
        path: '/shop/orders/:orderId',
        name: 'ShopOrderDetail',
        component: ShopOrderDetail
    }
];
