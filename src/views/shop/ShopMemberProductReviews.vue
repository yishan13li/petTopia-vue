<template>
    <div class="container mt-4">
        <h2 class="text-center mb-4">我的商品評論</h2>

        <div class="table-responsive">
            <table class="table table-bordered align-middle">
                <thead class="table-light">
                    <tr>
                        <th>商品</th>
                        <th>評分</th>
                        <th>評論內容</th>
                        <th>評論時間</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 使用 v-for 渲染評論列表 -->
                    <tr v-for="review in reviews" :key="review.id">
                        <!-- 商品名稱和圖片 -->
                        <td>
                            <div class="d-flex align-items-center">
                                <!-- <img :src="review.productImage" alt="Product Image" class="img-thumbnail" width="100" /> -->
                                <div class="ms-3 text-start">
                                    <h5>
                                        <router-link :to="`/shop/productDetail?productDetailId=${review.productId}`"
                                            class="text-dark">
                                            <!-- {{ review.productName }} -->
                                        </router-link>
                                    </h5>
                                </div>
                            </div>
                        </td>

                        <!-- 評分 -->
                        <td class="text-center">
                            <span v-for="star in 5" :key="star"
                                :class="['fa', 'fa-star', { 'fas': star <= review.rating, 'far': star > review.rating }]"></span>
                        </td>

                        <!-- 評論內容 -->
                        <td>
                            <p>{{ review.reviewDescription || '無評論內容' }}</p>
                        </td>

                        <!-- 評論時間 -->
                        <td class="text-center">
                            <p>{{ formatDate(review.reviewTime) }}</p>
                        </td>

                        <!-- 編輯或刪除操作 -->
                        <td>
                            <button @click="editReview(review)" class="btn btn-sm btn-warning">編輯</button>
                            <button @click="deleteReview(review.id)" class="btn btn-sm btn-danger">刪除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from "@/stores/auth";
import { getMemberReviews } from '@/api/shop/productReviewApi'

const authStore = useAuthStore();
const memberId = authStore.memberId;

const reviews = ref([]) // 存儲商品評論資料

// 取得該會員的所有評論
const fetchReviews = async () => {
    try {
        reviews = await getMemberReviews(memberId);
        reviews.value = reviews;
        console.log('會員的評論:', reviews.value);
    } catch (error) {
        console.error('無法獲取評論', error);
    }
};

// 格式化評論時間
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(date).toLocaleDateString('zh-TW', options)
}

// 編輯評論
const editReview = (review) => {
    console.log('編輯評論', review)
    // 實現編輯功能，可能會顯示編輯表單
}

// 刪除評論
const deleteReview = async (reviewId) => {
    try {
        const response = await axios.delete(`/api/reviews/${reviewId}`)
        if (response.status === 200) {
            reviews.value = reviews.value.filter(review => review.id !== reviewId)
            alert('評論已刪除')
        }
    } catch (error) {
        console.error('刪除評論出錯', error)
        alert('刪除評論失敗')
    }
}

// 在組件掛載時抓取會員的所有評論
onMounted(() => {
    fetchReviews();
});
</script>

<style scoped>
/* 可根據需求自定義樣式 */
</style>