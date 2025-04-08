import ShopIndex from '@/views/shop/ShopIndex.vue';
import ShopCheckout from '@/views/shop/ShopCheckout.vue';
import ShopOrderHistory from '@/views/shop/ShopOrderHistory.vue';
import ShopOrderDetail from '@/views/shop/ShopOrderDetail.vue';
import ShopProducts from '@/views/shop/ShopProducts.vue';
import ShopProductDetail from '@/views/shop/ShopProductDetail.vue';
import ShopCart from '@/views/shop/ShopCart.vue';
import ShopEcpaySuccess from '@/views/shop/ShopEcpaySuccess.vue';
import ShopProductReview from '@/views/shop/ShopProductReview.vue';
import ShopMemberProductReviews from '@/views/shop/ShopMemberProductReviews.vue';

export default [
    {
        path: '/shop',
        name: 'ShopIndex',
        component: ShopIndex,
        meta: {
            title: '商城首頁 - PetTopia'
        }
    },
    {
        path: '/shop/checkout',
        name: 'ShopCheckout',
        component: ShopCheckout,
        meta: {
            requiresAuth: true,
            title: '結帳 - PetTopia'
        }
    },
    {
        path: '/shop/orderHistory',
        name: 'ShopOrderHistory',
        component: ShopOrderHistory,
        meta: {
            title: '歷史訂單 - PetTopia'
        }
    },
    {
        path: '/shop/orders/:orderId',
        name: 'ShopOrderDetail',
        component: ShopOrderDetail,
        meta: {
            requiresAuth: true,
            title: '訂單詳情 - PetTopia'
        }
    },
    {
        path: '/shop/products',
        name: 'ShopProducts',
        component: ShopProducts,
        meta: {
            title: '瀏覽商品 - PetTopia'
        }
        
    },
    {
        path: '/shop/productDetail',
        name: 'ShopProductDetail',
        component: ShopProductDetail,
        meta: {
            title: '商品詳情 - PetTopia'
        }
    },
    {
        path: '/shop/cart',
        name: 'ShopCart',
        component: ShopCart,
        meta: {
            requiresAuth: true,
            title: '購物車 - PetTopia'
        }
    },
    {
        path: '/shop/ecpay/success',
        name: 'ShopEcpaySuccess',
        component: ShopEcpaySuccess,
        meta: {
            title: '付款成功 - PetTopia'
        }
    },
    {
        path: '/shop/product/review',
        name: 'ShopProductReview',
        component: ShopProductReview,
        meta: {
            requiresAuth: true,
            title: '商品評論 - PetTopia'
        }
    },
    {
        path: '/shop/member/product/review',
        name: 'ShopMemberProductReviews',
        component: ShopMemberProductReviews,
        meta: {
            requiresAuth: true,
            title: '我的商品評論 - PetTopia'
        }
    },
];
