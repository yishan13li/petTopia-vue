<template>
    <div class="container mt-4">
        <h2 class="text-center mb-4">商品評論</h2>

        <div class="table-responsive">
            <table class="table table-bordered align-middle">
                <thead class="table-light">
                    <tr>
                        <th>商品</th>
                        <th>規格</th>
                        <th>單價</th>
                        <th>數量</th>
                        <th>總價</th>
                        <th>評論</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <!-- 商品資訊 -->
                        <td>
                            <div class="d-flex align-items-center">
                                <img :src="productPhoto" alt="Product Image" class="img-thumbnail" width="100">
                                <div class="ms-3 text-start">
                                    <h5>
                                        <router-link :to="`/shop/productDetail?productDetailId=${productId}`"
                                            class="text-dark">
                                            {{ productName }}
                                        </router-link>


                                    </h5>
                                </div>
                            </div>
                        </td>

                        <!-- 顏色 / 尺寸 -->
                        <td>
                            <p class="mb-0">顏色: {{ productColor || '無' }}</p>
                            <p class="mb-0">尺寸: {{ productSize || '無' }}</p>
                        </td>

                        <!-- 單價 -->
                        <td class="text-center">
                            <!-- 顯示原價並劃掉 -->
                            <span v-if="unitPrice" class="text-muted text-decoration-line-through me-2">
                                ${{ unitPrice }}
                            </span>
                            <!-- 顯示優惠價並加紅色 -->
                            <span :style="{ color: discountPrice ? 'red' : '' }" class="fw-bold">
                                ${{ discountPrice || unitPrice }}
                            </span>
                        </td>

                        <!-- 數量 -->
                        <td class="text-center">{{ quantity }}</td>

                        <!-- 總價 -->
                        <td class="text-center">
                            <!-- 顯示原價並劃掉 -->
                            <span v-if="unitPrice" class="text-muted text-decoration-line-through">
                                ${{ unitPrice * quantity }}
                            </span>
                            <!-- 顯示優惠價並加紅色 -->
                            <span :style="{ color: discountPrice ? 'red' : '' }" class="fw-bold">
                                ${{ totalPrice }}
                            </span>
                        </td>


                        <!-- 評論 -->
                        <td>
                            <form @submit.prevent="submitReview">
                                <div class="mb-2">
                                    <label for="rating" class="form-label">評分 (1~5 顆星)</label>
                                    <div class="star-rating">
                                        <i v-for="star in 5" :key="star" :class="['fa', 'fa-star', {
                                            'fas': star <= (hoverRating || review.rating),
                                            'far': star > (hoverRating || review.rating)
                                        }]" @click="setRating(star)" @mouseover="hoverRatingStar(star)"
                                            @mouseleave="clearHover"></i>
                                    </div>
                                    <input type="number" id="rating" v-model.number="review.rating" hidden required />
                                </div>
                                <div class="mb-2">
                                    <label for="reviewDescription" class="form-label">評論內容</label>
                                    <textarea id="reviewDescription" v-model="review.reviewDescription" required
                                        class="form-control" rows="2"></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary btn-sm ">提交評論</button>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import { createProductReview } from "@/api/shop/productReview";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const memberId = authStore.memberId;

const route = useRoute();
const productId = ref("");
const productName = ref("");
const productPhoto = ref("");
const productColor = ref("");
const productSize = ref("");
const unitPrice = ref(0);
const discountPrice = ref(0);
const quantity = ref(0);
const totalPrice = ref(0);
const review = ref({
    rating: 0,
    reviewDescription: "",
});

const hoverRating = ref(null);  // 這是用來儲存鼠標懸停時選擇的評分

onMounted(() => {
    productId.value = route.query.productId || "";
    productName.value = route.query.productName || "未知商品";
    productPhoto.value = route.query.productPhoto || "";
    productColor.value = route.query.productColor || "無";
    productSize.value = route.query.productSize || "無";
    unitPrice.value = route.query.unitPrice || 0;
    discountPrice.value = route.query.discountPrice || 0;
    quantity.value = route.query.quantity || 1;
    totalPrice.value = discountPrice.value ? discountPrice.value * quantity.value : unitPrice.value * quantity.value;

});

//評分星星
const setRating = (rating) => {
    review.value.rating = rating;
};

const hoverRatingStar = (star) => {
    hoverRating.value = star;
};

const clearHover = () => {
    hoverRating.value = null;
};

//提交評論
const submitReview = async () => {
    try {

        if (review.value.rating === 0) {
            // 顯示提示要求用戶評分
            await Swal.fire({
                title: '請評分星星!',
                text: '請選擇一顆到五顆星來給商品評分。',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return; // 中斷提交
        }

        const { isConfirmed } = await Swal.fire({
            title: '確認提交評論?',
            html: `評分：${review.value.rating}<br>內容：${review.value.reviewDescription}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            reverseButtons: true,
        });

        if (isConfirmed) {
            const result = await createProductReview(memberId, productId.value, review.value);
            if (result.status === 201) {
                await Swal.fire({
                    title: '評論提交成功',
                    html: `評分：${review.value.rating}<br>內容：${review.value.reviewDescription}`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            } else {
                // 顯示提交失敗的提示
                await Swal.fire({
                    title: '提交失敗',
                    text: '評論提交失敗，請稍後再試。',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } else {
            // 如果用戶取消提交
            console.log("評論提交已取消");
        }
    } catch (error) {
        console.error("提交評論時出錯:", error);
        await Swal.fire({
            title: '提交評論時出錯',
            text: '提交評論時出現錯誤，請稍後再試。',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
};


</script>

<style scoped>
.table {
    border: 1px solid #ddd;
    background: #fff;
    text-align: center;
    text-align: center;
}

.star-rating {
    font-size: 3rem;
    /* 調整星星的大小 */
    cursor: pointer;
}

.star-rating i {
    transition: color 0.3s ease;
    /* 星星顏色過渡效果 */
}

.star-rating i.fas {
    color: #f8c307;
    /* 填滿星星的顏色 */
}

.star-rating i.far {
    color: #ddd;
    /* 空心星星顏色 */
}

.star-rating i:hover {
    color: #f8c307;
    /* 滑鼠懸停時變為金色 */
}
</style>