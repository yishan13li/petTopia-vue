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
  