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
    align-items: center;
    height: 50vh;
    text-align: center;
    font-size: 1.5rem;
}
</style>