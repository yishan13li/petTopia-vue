<template>
    <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="reviewModalLabel">給予評價</h5>
                    <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <img :src="selectedProduct.productPhoto" alt="Product Image" class="img-thumbnail mb-3" width="150">
                    <p><strong>{{
                        selectedProduct.productName }}</strong>
                    </p>
                    <p>顏色: {{ selectedProduct.productColor || '無' }} | 尺寸: {{ selectedProduct.productSize || '無' }}
                    </p>
                    <div class="mb-2">
                        <label class="form-label">評分 (1~5 顆星)</label>
                        <div class="star-rating">
                            <i v-for="star in 5" :key="star" :class="['fa', 'fa-star', {
                                'fas': star <= (hoverRating || review.rating),
                                'far': star > (hoverRating || review.rating)
                            }]" @click="setRating(star)" @mouseover="hoverRatingStar(star)"
                                @mouseleave="clearHover"></i>
                        </div>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">評論內容</label>
                        <textarea v-model="review.reviewDescription" required class="form-control" rows="3"></textarea>
                    </div>
                    <!-- 圖片上傳區域 -->
                    <div class="mb-2">
                        <label class="form-label">上傳最多五張圖片</label>
                        <input type="file" class="form-control" multiple @change="handleImageUpload" accept="image/*">
                        <div v-if="selectedImages.length > 0" class="mt-2">
                            <p>選擇的圖片：</p>
                            <div class="d-flex">
                                <img v-for="(image, index) in selectedImages" :key="index" :src="image.preview"
                                    class="img-thumbnail" width="50" height="50">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
                    <button type="button" class="btn btn-secondary" @click="submitReview">提交</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

// 定義事件
const emit = defineEmits(['close', 'submit-review']);

// 定義 props 來接收父元件的資料
const props = defineProps({
    productName: String,
    productColor: String,
    productSize: String,
    productPhoto: String
});

// 使用 ref 來存儲選中的商品
const selectedProduct = ref({
    productName: props.productName,
    productColor: props.productColor,
    productSize: props.productSize,
    productPhoto: props.productPhoto
});

const review = ref({
    rating: 0,
    reviewDescription: ''
});

const hoverRating = ref(0);
const selectedImages = ref([]);  // 儲存選擇的圖片

// 設定評分
const setRating = (star) => {
    review.value.rating = star;
};

// 懸停顯示評分星星
const hoverRatingStar = (star) => {
    hoverRating.value = star;
};

// 清除懸停效果
const clearHover = () => {
    hoverRating.value = 0;
};

// 處理圖片上傳
const handleImageUpload = (event) => {
    const files = event.target.files;
    const maxImages = 5;

    // 限制最多選擇5張圖片
    if (files.length + selectedImages.value.length > maxImages) {
        alert('最多只能選擇5張圖片');
        return;
    }

    // 顯示選擇的圖片
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImages.value.push({ file, preview: e.target.result });
        };
        reader.readAsDataURL(file);
    }
};

// 提交評論
const submitReview = () => {
    const formData = new FormData();
    formData.append('rating', review.value.rating);
    formData.append('reviewDescription', review.value.reviewDescription);

    // 添加圖片到 FormData
    selectedImages.value.forEach(image => {
        formData.append('reviewPhotos', image.file);
    });

    // 提交表單數據
    emit('submit-review', formData);
    closeModal();
};

// 關閉 Modal
const closeModal = () => {
    emit('close');
};

// 監聽 props 變化並更新 selectedProduct
watch(() => props.productName, () => {
    selectedProduct.value = {
        productName: props.productName,
        productColor: props.productColor,
        productSize: props.productSize,
        productPhoto: props.productPhoto
    };
});

onMounted(() => {
    const modalElement = document.getElementById('reviewModal');
    modalElement.addEventListener('hidden.bs.modal', closeModal);
});
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
