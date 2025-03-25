import ShopIndex from '@/views/shop/ShopIndex.vue';
import ShopCheckout from '@/views/shop/ShopCheckout.vue';
import ShopOrderHistory from '@/views/shop/ShopOrderHistory.vue';
import ShopOrderDetail from '@/views/shop/ShopOrderDetail.vue';

import ShopTest from '@/views/shop/ShopTest.vue';

import ShopProducts from '@/views/shop/ShopProducts.vue';
import ShopProductDetail from '@/views/shop/ShopProductDetail.vue';
import ShopCart from '@/views/shop/ShopCart.vue';
import ShopEcpaySuccess from '@/views/shop/ShopEcpaySuccess.vue';
import ShopProductReview from '@/views/shop/ShopProductReview.vue';
import ShopMemberProductReviews from '@/views/shop/ShopMemberProductReviews.vue';

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

        path: '/shop/test',
        name: 'ShopTest',
        component: ShopTest
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

    {
        path: '/shop/cart',
        name: 'ShopCart',
        component: ShopCart
    },

    {
        path: '/shop/ecpay/success',
        name: 'ShopEcpaySuccess',
        component: ShopEcpaySuccess
    },

    {
        path: '/shop/product/review',
        name: 'ShopProductReview',
        component: ShopProductReview,
    },

    {
        path: '/shop/member/product/review',
        name: 'ShopMemberProductReviews',
        component: ShopMemberProductReviews,
    },
];
