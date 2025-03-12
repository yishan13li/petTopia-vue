import ShopIndex from '@/views/shop/ShopIndex.vue';
import ShopCheckout from '@/views/shop/ShopCheckout.vue';
import ShopOrderHistory from '@/views/shop/ShopOrderHistory.vue';
import ShopOrderDetail from '@/views/shop/ShopOrderDetail.vue';
import ShopProducts from '@/views/shop/ShopProducts.vue';
import ShopProductDetail from '@/views/shop/ShopProductDetail.vue';

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
    },

    {
        path: '/shop/products',
        name: 'ShopProducts',
        component: ShopProducts
    },

    {
        path: '/shop/productDetail',
        name: 'ShopProductDetail',
        component: ShopProductDetail
    },

];
