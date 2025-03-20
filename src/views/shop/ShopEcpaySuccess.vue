<template>
    <div class="container">
        <p>付款成功! 正在為您跳轉至訂單詳情頁面...</p>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    // 直接跳轉到本地的訂單歷史頁面
    setTimeout(() => {
        window.location.href = 'http://localhost:5173/shop/orderHistory';
    }, 1000); // 1秒後跳轉
});
</script>


<style scoped>
.container {
    display: flex;
    justify-content: center;
    /* 水平置中 */
    align-items: center;
    /* 垂直置中 */
    height: 50vh;
    /* 讓 div 佔滿整個視窗高度 */
    text-align: center;
    /* 文字置中 */
    font-size: 1.5rem;
    /* 讓字體稍微大一些 */
}
</style>