<template>
    <div class="container mt-4">
        <h2 class="text-center mb-4">我的商品評論</h2>

        <div class="review-list">
            <div class="review-item" v-for="review in reviews" :key="review.reviewId">
                <div class="d-flex">
                    <div class="product-img">

                        <img :src="'data:image/jpeg;base64,' + review.productPhoto" class="img-fluid rounded-circle" />
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

                <!-- ==============編輯中的顯示=============== -->
                <div v-if="isEditing && editingReviewId === review.reviewId" class="edit-review-content">
                    <!-- 評分 -->
                    <div class="review-rating my-2">
                        <div class="star-rating">
                            <i v-for="star in 5" :key="star" :class="['fa', 'fa-star', {
                                'fas': star <= editedReview.rating,
                                'far': star > editedReview.rating
                            }]" @click="setRating(star)"></i>
                        </div>
                    </div>
                    <!-- 描述 -->
                    <textarea v-model="editedReview.reviewDescription" class="form-control" rows="3"></textarea>

                    <!-- 上傳圖片 -->
                    <input type="file" @change="onFileChange" multiple accept="image/*" class="form-control mt-2" />

                    <!-- 顯示圖片 -->
                    <div class="mt-3"
                        v-if="(review.productReviewPhoto && review.productReviewPhoto.length > 0) || (editedReview.productReviewPhoto && editedReview.productReviewPhoto.length > 0)">
                        <div class="d-flex flex-wrap">
                            <!-- 顯示原始圖片 -->
                            <div v-for="(photo, index) in review.productReviewPhoto" :key="'original-' + index"
                                class="position-relative">
                                <img v-if="photo.reviewPhotos" :src="'data:image/jpeg;base64,' + photo.reviewPhotos"
                                    alt="評論圖片" class="img-thumbnail m-1" width="100" />
                                <!-- 只有在編輯模式下才顯示刪除按鈕 -->
                                <button v-if="isEditing && editingReviewId === review.reviewId"
                                    @click="deleteOriginalImage(photo.reviewPhotoId, review)"
                                    class="btn btn-danger btn-sm position-absolute top-0 end-0" title="刪除原始圖片">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>

                            <!-- 顯示新上傳的圖片（File 物件，使用 preview URL） -->
                            <div v-for="(photoObj, index) in editedReview.productReviewPhoto" :key="'new-' + index"
                                class="position-relative">
                                <img :src="photoObj.preview" alt="新上傳圖片" class="img-thumbnail m-1" width="100" />
                                <button v-if="isEditing && editingReviewId === review.reviewId"
                                    @click="removeSelectedImage(index)"
                                    class="btn btn-danger btn-sm position-absolute top-0 end-0" title="刪除編輯圖片">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>

                        </div>
                    </div>

                    <button @click="submitEdit(review)" class="btn btn-secondary me-2 mt-2">提交</button>
                    <button @click="cancelEdit" class="btn btn-secondary mt-2">取消</button>
                </div>

                <!-- ===========編輯前的顯示================ -->
                <div v-else>
                    <!-- 評分 -->
                    <div class="review-rating my-2">
                        <div class="star-rating">
                            <i v-for="star in 5" :key="star" :class="['fa', 'fa-star', {
                                'fas': star <= review.rating,
                                'far': star > review.rating
                            }]" @click="setRating(star)"></i>
                        </div>
                    </div>
                    <!-- 描述 -->
                    <p class="review-description">
                        {{ review.reviewDescription || '' }}
                    </p>
                    <!-- 圖片 -->
                    <div class="d-flex flex-wrap">
                        <div v-for="(photo, index) in review.productReviewPhoto" :key="index" class="position-relative">
                            <img :src="'data:image/jpeg;base64,' + photo.reviewPhotos" alt="Review Photo"
                                class="img-thumbnail m-1" width="100" />
                        </div>

                    </div>
                    <!-- 編輯按鈕 -->
                    <div class="review-time-edit">
                        <p class="review-time">{{ formatDate(review.reviewTime) }}</p>
                        <button @click="editReview(review)" class="btn btn-sm btn-warning">編輯</button>
                    </div>

                </div>
            </div>
        </div>

        <!-- 分頁導航 -->
        <nav class="mb-5">
            <ul class="pagination justify-content-center">
                <!-- 第一頁 -->
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(1)">«</button>
                </li>

                <!-- 上一頁 -->
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">‹</button>
                </li>

                <!-- 分頁號碼 -->
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>

                <!-- 下一頁 -->
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="changePage(currentPage + 1)">›</button>
                </li>

                <!-- 最後一頁 -->
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="changePage(totalPages)">»</button>
                </li>
            </ul>
        </nav>

    </div>
</template>

<script setup>
import { ref, onMounted, toRaw } from 'vue'
import { useAuthStore } from "@/stores/auth";
import { getMemberReviews } from '@/api/shop/productReviewApi'
import { updateProductReview } from '@/api/shop/productReviewApi';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const memberId = authStore.memberId;

const reviews = ref([])
const totalPages = ref(0)  // 存儲總頁數
const totalElements = ref(0)  // 存儲總評論數
const currentPage = ref(1)  // 當前頁碼
const pageSize = ref(5)  // 每頁評論數

// 取得該會員的所有評論
const fetchReviews = async (page = 1, size = 5) => {
    try {
        const response = await getMemberReviews(memberId, page, size);
        reviews.value = response.data.content;  // 記錄當前頁面的評論資料
        totalPages.value = response.data.totalPages;  // 獲取總頁數
        totalElements.value = response.data.totalElements;  // 獲取總評論數
        currentPage.value = page;  // 更新當前頁碼

    } catch (error) {
        console.error('無法獲取評論', error);
    }
};

// 分頁處理
const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    fetchReviews(page, pageSize.value);  // 請求新的頁面資料
};

// 格式化評論時間
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(date).toLocaleDateString('zh-TW', options)
}

//==========編輯評論===========
const isEditing = ref(false)
const editingReviewId = ref(null)
const editedReview = ref({
    rating: 5,
    reviewDescription: '',
    productReviewPhoto: [],

});

const editReview = (review) => {
    editingReviewId.value = review.reviewId;

    // 逐個屬性更新，保證不覆蓋整個物件
    editedReview.value.rating = review.rating;
    editedReview.value.reviewDescription = review.reviewDescription;
    editedReview.value.productReviewPhoto = [];

    // 確保 deletePhotoIds 被初始化
    if (!editedReview.value.deletePhotoIds) {
        editedReview.value.deletePhotoIds = [];
    }

    isEditing.value = true;
};



// 刪除編輯中的圖片
const removeSelectedImage = (index) => {
    editedReview.value.productReviewPhoto.splice(index, 1)
}

// 用 ref 定義 deletePhotoIds
const deletePhotoIds = ref([]);

const deleteOriginalImage = (reviewPhotoId, review) => {
    if (!review || !review.productReviewPhoto) {
        console.error('Review 或 productReviewPhoto 未初始化');
        return;
    }

    // 初始化 deleteIds（如果沒有的話）
    if (!review.deleteIds) {
        review.deleteIds = [];
    }

    const deletedImageIndex = review.productReviewPhoto.findIndex(photo => photo.reviewPhotoId === reviewPhotoId);

    if (deletedImageIndex !== -1) {
        const deletedImage = review.productReviewPhoto.splice(deletedImageIndex, 1)[0];
        const deletedImageId = deletedImage.reviewPhotoId;

        // 確保 review.deleteIds 一致
        review.deleteIds.push(deletedImageId);
    } else {
        console.error('未找到該圖片');
    }
};



// 設定評分
const setRating = (star) => {
    editedReview.value.rating = star;  // 更新編輯中的評分
};


const submitEdit = async (review) => {

    const formData = new FormData();
    const rawData = toRaw(editedReview.value);
    const deleteIds = review.deleteIds;

    const rating = rawData.rating;
    const reviewDescription = rawData.reviewDescription;

    // 加入基本數據
    formData.append('reviewId', editingReviewId.value);
    formData.append('rating', rawData.rating);
    formData.append('reviewDescription', rawData.reviewDescription);

    // 加入 deleteIds（以 list integer 傳送）
    if (deleteIds && deleteIds.length > 0) {
        deleteIds.forEach(id => {
            formData.append('deletePhotoIds', id);
        });
    }

    // 加入新上傳的圖片
    if (rawData.productReviewPhoto && rawData.productReviewPhoto.length > 0) {
        rawData.productReviewPhoto.forEach((fileObj) => {
            if (fileObj.file instanceof File) {  // 確保從物件中取出 file 屬性
                formData.append('newPhotos', fileObj.file);  // 確保是 File 物件
            } else {
                console.warn("忽略非 File 類型的項目:", fileObj);
            }
        });
    }

    try {

        if (rating === 0) {
            await Swal.fire({
                title: '請評分星星!',
                text: '請選擇一顆到五顆星來給商品評分。',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }

        const { isConfirmed } = await Swal.fire({
            title: '確認提交評價?',
            html: `評分：${rating}<br>內容：${reviewDescription}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            reverseButtons: true,
        });

        if (isConfirmed) {

            const result = await updateProductReview(formData);
            if (result?.status === 200 || result?.status === 201) {  // 修正判斷條件
                await Swal.fire({
                    title: '評論提交成功',
                    html: `評分：${rating}<br>內容：${reviewDescription}`,
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false,
                });
                fetchReviews();
                cancelEdit();


            } else {
                console.error("評論提交失敗，API 回應:", result);
                throw new Error("評論提交失敗");
            }
        } else {
            console.log("評論提交已取消");
        }
    } catch (error) {

        await Swal.fire({
            title: '提交失敗',
            text: '評論提交失敗，請稍後再試。',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
};

// 取消編輯
const cancelEdit = () => {
    isEditing.value = false;
    editingReviewId.value = null;
}

// 處理圖片上傳
const onFileChange = (event) => {
    const files = event.target.files;
    if (!files.length) return;

    // 初始化陣列，確保能正常存入新圖片
    if (!editedReview.value.productReviewPhoto) {
        editedReview.value.productReviewPhoto = [];
    }

    Array.from(files).forEach((file) => {
        // 確認 file 是否是 File 類型
        console.log(file);  // 在這裡檢查 file 物件

        const previewUrl = URL.createObjectURL(file);
        editedReview.value.productReviewPhoto.push({ file, preview: previewUrl });
    });
};

// 初始化評論
onMounted(() => {
    fetchReviews(currentPage.value, pageSize.value);
});

</script>

<style scoped>
@import '/user_static/css/shop_pagination.css';

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
}

.product-info {
    flex: 1;
    min-width: 0;
}
</style>