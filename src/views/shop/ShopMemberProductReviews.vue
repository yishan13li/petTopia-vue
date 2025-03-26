<template>
    <div class="container mt-4">
        <h2 class="text-center mb-4">我的商品評論</h2>

        <div class="review-list">
            <div class="review-item" v-for="review in reviews" :key="review.reviewId">
                <div class="d-flex">
                    <div class="product-img">
                        <img :src="review.productPhoto" alt="Product Photo" class="img-fluid rounded-circle" />
                    </div>
                    <div class="product-info ms-3">
                        <h5 class="product-name">
                            <router-link :to="`/shop/productDetail?productDetailId=${review.productDetailId}`"
                                class="text-dark">
                                {{ review.productName }} <span
                                    v-if="review.productColor !== '無' || review.productSize !== '無'">
                                    {{ review.productColor !== '無' ? review.productColor : '' }}
                                    <span v-if="review.productColor !== '無' && review.productSize !== '無'"> / </span>
                                    {{ review.productSize !== '無' ? review.productSize : '' }}
                                </span>



                            </router-link>

                        </h5>
                    </div>
                </div>

                <!-- 評分 -->
                <div class="review-rating my-2">
                    <div class="star-rating">
                        <!-- 顯示評論星星 -->
                        <i v-for="star in 5" :key="star" :class="['fa', 'fa-star', {
                            'fas': star <= (isEditing && editingReviewId === review.reviewId ? (hoverRating || editedReview.rating) : review.rating),
                            'far': star > (isEditing && editingReviewId === review.reviewId ? (hoverRating || editedReview.rating) : review.rating)
                        }]" @click="setRating(star)" @mouseover="hoverRatingStar(star)" @mouseleave="clearHover"></i>
                    </div>
                </div>

                <!-- 評論內容 -->
                <div v-if="isEditing && editingReviewId === review.reviewId" class="edit-review-content">
                    <textarea v-model="editedReview.reviewDescription" class="form-control" rows="3"></textarea>
                    <input type="file" @change="onFileChange" multiple class="form-control mt-2" />
                    <button @click="submitEdit(review)" class="btn btn-secondary me-2 mt-2">提交</button>
                    <button @click="cancelEdit" class="btn btn-secondary mt-2">取消</button>
                </div>
                <div v-else>
                    <p class="review-description">
                        {{ review.reviewDescription || '無評論內容' }}
                    </p>

                    <!-- 顯示編輯中的圖片 -->
                    <div v-if="isEditing && editingReviewId === review.reviewId" class="edit-review-images mt-2">
                        <p>編輯評論圖片：</p>
                        <div class="d-flex flex-wrap">
                            <div v-for="(image, index) in editedReview.value.imageBase64" :key="index"
                                class="position-relative">
                                <img :src="'data:image/jpeg;base64,' + image" alt="New Image" class="img-thumbnail m-1"
                                    width="100" />
                                <!-- 你可以選擇刪除新增的圖片 -->
                                <button @click="removeSelectedImage(index)"
                                    class="btn btn-danger btn-sm position-absolute top-0 end-0" title="刪除圖片">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 顯示原始評論圖片 -->
                    <div v-else>
                        <div v-if="review.imageBase64 && review.imageBase64.length">
                            <div class="d-flex flex-wrap">
                                <div v-for="(photo, index) in review.imageBase64" :key="index"
                                    class="position-relative">
                                    <img :src="'data:image/jpeg;base64,' + photo" alt="Review Photo"
                                        class="img-thumbnail m-1" width="100" />
                                    <!-- 只有在編輯模式下才顯示刪除按鈕 -->
                                    <button v-if="isEditing && editingReviewId === review.reviewId"
                                        @click="deleteOriginalImage(index)"
                                        class="btn btn-danger btn-sm position-absolute top-0 end-0" title="刪除圖片">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <span class="text-muted">沒有評論圖片</span>
                        </div>
                    </div>


                    <div class="review-time-edit">
                        <p class="review-time">{{ formatDate(review.reviewTime) }}</p>
                        <button @click="editReview(review)" class="btn btn-sm btn-warning">編輯</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from "@/stores/auth";
import { getMemberReviews } from '@/api/shop/productReviewApi'
import { updateProductReview } from '@/api/shop/productReviewApi';

const authStore = useAuthStore();
const memberId = authStore.memberId;

const reviews = ref([])

// 取得該會員的所有評論
const fetchReviews = async () => {
    try {
        const response = await getMemberReviews(memberId);
        reviews.value = response.data;
    } catch (error) {
        console.error('無法獲取評論', error);
    }
};

// 格式化評論時間
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(date).toLocaleDateString('zh-TW', options)
}

//==========編輯評論===========
const isEditing = ref(false)
const editingReviewId = ref(null)
const editedReview = ref({})

// 開始編輯評論
const editReview = (review) => {
    editingReviewId.value = review.reviewId;
    editedReview.value = { ...review };  // 複製評論內容以便編輯
    isEditing.value = true;
}

// 刪除原本的圖片
const deleteOriginalImage = (index) => {
    // 根據 index 刪除指定的圖片
    review.imageBase64.splice(index, 1);  // 從原始圖片陣列中刪除
};

// 設定評分
const setRating = (star) => {
    editedReview.value.rating = star;  // 更新編輯中的評分
};

// 懸停顯示評分星星
const hoverRatingStar = (star) => {
    hoverRating.value = star;
};

// 清除懸停效果
const clearHover = () => {
    hoverRating.value = 0;
};

// 提交編輯
const submitEdit = async (review) => {
    try {
        // 創建表單數據
        const formData = new FormData();
        formData.append('rating', editedReview.value.rating);  // 評分
        formData.append('reviewDescription', editedReview.value.reviewDescription);  // 評論內容

        // 如果有圖片，將圖片加入 formData
        if (editedReview.value.imageBase64 && editedReview.value.imageBase64.length > 0) {
            editedReview.value.imageBase64.forEach((image, index) => {
                formData.append(`images[${index}]`, image);  // 使用反引號包裹字串模板
            });
        }


        // 呼叫更新評論的 API
        const response = await updateProductReview(review.reviewId, formData);

        // 若成功，隱藏編輯模式並重新載入評論
        if (response.status === 200) {
            isEditing.value = false;
            fetchReviews();  // 重新取得評論列表
        }
    } catch (error) {
        console.error('無法提交編輯', error);
    }

};
// 取消編輯
const cancelEdit = () => {
    isEditing.value = false;
    editingReviewId.value = null;
}

// 處理圖片上傳
const onFileChange = (e) => {
    const files = e.target.files;
    console.log(files);
}


// 初始化評論
onMounted(() => {
    fetchReviews();
});
</script>

<style scoped>
.review-list {
    margin-top: 20px;
    max-width: 700px;
    width: 100%;
    margin: 0 auto;
}

.review-item {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 15px;
}

.product-img img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
}

.product-info {
    max-width: 180px;
}

.product-name {
    font-size: 14px;
    font-weight: 500;
}

.review-description {
    font-size: 13px;
    margin-top: 8px;
    line-height: 1.4;
}


.review-photos img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-right: 5px;
}

.review-time-edit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    margin-top: 8px;
}

.fa-star {
    color: #f8c307 !important;
}

.review-time-edit .review-time {
    margin-right: 10px;
}

.review-item .d-flex {
    align-items: center;
    gap: 10px;
}

.star-rating i {
    transition: color 0.3s ease;
}

.star-rating i.fas {
    color: #f8c307;
}

.star-rating i.far {
    color: #ddd;
}

.star-rating i:hover {
    color: #f8c307;
}


.product-img img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
    display: block;
    /* 防止 inline-block 影響對齊 */
}

.product-info {
    flex: 1;
    /* 讓商品名稱區域佔滿剩餘空間 */
    min-width: 0;
    /* 防止內容撐開 */
}
</style>