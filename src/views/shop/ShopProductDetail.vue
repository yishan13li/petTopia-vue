<template>
    <section id="product_detail" class="container my-5" th:data-product-detail-id="${productDetail.id}">

        <div class="row">
            <!-- 商品圖片 -->
            <div class="col-md-6 d-flex justify-content-center align-items-center">
                <img v-if="productList.length > 0"
                    :src="`${PATH}/shop/productDetail/api/getPhoto?productId=${productList[0].id}`"
                    class="img-fluid rounded-4 product-image" alt="Product Image">
            </div>

            <div class="col-md-6">
                <!-- 商品名稱 -->
                <h2>{{ productDetail.name }}</h2>

                <!-- 商品價錢 -->
                <div v-if="productList.length == 1">
                    <h4 class="show-product-price text-primary">
                        ${{ productList[0].discountPrice ? productList[0].discountPrice : productList[0].unitPrice }}
                        <span>&nbsp;&nbsp;</span>
                        <span v-if="productList[0].discountPrice"
                            style="text-decoration: line-through; color: #999;">${{
                                productList[0].unitPrice
                            }}
                        </span>
                    </h4>
                </div>
                <div v-if="productList.length > 1">
                    <h4 class="show-product-price text-primary">
                        <template v-if="minPrice === maxPrice">
                            ${{ minPrice }}
                        </template>
                        <template v-else>
                            ${{ minPrice }} - ${{ maxPrice }}
                        </template>
                        <span>&nbsp;&nbsp;</span>
                        <span v-if="isShowOriginalPrice" style="text-decoration: line-through; color: #999;">
                            <template v-if="minUnitPrice === maxUnitPrice">
                                ${{ minUnitPrice }}
                            </template>
                            <template v-else>
                                ${{ minUnitPrice }} - ${{ maxUnitPrice }}
                            </template>
                        </span>
                    </h4>
                </div>

                <!-- 商品評分 -->
                <p>
                    <span>
                        <!-- 顯示星星和數字評分 -->
                        <span v-for="i in 5" :key="i" class="star-rating">
                            <i :class="i <= (averageRating || 0) ? 'fas fa-star' : 'far fa-star'"></i>
                        </span>
                        ({{ (averageRating || 0).toFixed(1) }})
                    </span>
                </p>

                <!-- 商品敘述 -->
                <p class="text-muted" style="white-space: pre-line;">
                    {{ productDetail.description }}
                </p>

                <!-- 商品規格選擇 -->
                <!-- 尺寸選擇 -->
                <div class="option-container mb-3">

                    <div v-if="sizeList.length > 0">

                        <label class="form-label">尺寸</label>
                        <div class="option-grid">
                            <div v-for="(size, index) in sizeList" class="form-check">
                                <input class="size-radio form-check-input" type="radio" name="size" :id="'size' + index"
                                    :value="size.id" v-model="selectedSizeRadio" ref="sizeRadios"
                                    @change="onChangeRadio(size, index)" @click="onClickRadio(size, index)">
                                <label class="form-check-label no-select" :for="'size' + index">
                                    {{ size.name }}
                                </label>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- 顏色選擇 -->
                <div class="option-container mb-3">

                    <div v-if="colorList.length > 0">

                        <label class="form-label">顏色</label>
                        <div class="option-grid">
                            <div v-for="(color, index) in colorList" class="form-check">
                                <input class="color-radio form-check-input" type="radio" name="color"
                                    :id="'color' + index" :value="color.id" v-model="selectedColorRadio"
                                    ref="colorRadios" @change="onChangeRadio(color, index)"
                                    @click="onClickRadio(color, index)">
                                <label class="form-check-label no-select" :for="'color' + index">
                                    {{ color.name }}
                                </label>
                            </div>
                        </div>

                    </div>


                </div>

                <!-- 購買數量 -->
                <div class="d-flex align-items-center mb-3">
                    <label class="form-label">數量</label>
                    <button class="btn btn-outline-secondary ms-4" id="decrease-btn" :disabled="isQuantityInputDisabled"
                        @click="onClickDecreaseBtn">-</button>
                    <input type="number" class="form-control text-center mx-2 no-spinner" id="product-quantity-input"
                        v-model="quantity" :disabled="isQuantityInputDisabled" @input="onQuantityInput"
                        style="width: 60px;">
                    <button class="btn btn-outline-secondary" id="increase-btn" :disabled="isQuantityInputDisabled"
                        @click="onClickIncreaseBtn">+</button>
                    <label class="form-label ms-3" id="show-stock-quantity">還剩 {{ showQuantity }} 件</label>
                    <label class="form-label ms-3" id="messages" style="color: crimson;">{{ messages }}</label>
                </div>

                <button class="btn btn-primary w-100" id="add-to-cart-btn" @click="onClickAddToCartBtn"
                    style="color: black;">加入購物車</button>

            </div>

            <div class="mt-5 ">
                <h2 class="text-start mb-4 mt-5 container-fluid p-0" style="padding-left: 10em !important;">商品評論 ({{
                    reviewCount
                }})</h2>

                <div class="review-list">
                    <div class="review-item card mb-3 shadow-sm rounded p-3" v-for="review in reviews"
                        :key="review.reviewId" style="max-width: 650px; margin: 0 auto; background-color: #f8f9fa;">
                        <div class="card-body">
                            <!-- 商品資訊和評論內容 -->
                            <div class="product-info mb-3">
                                <h5 class="product-name">
                                    <router-link :to="`/shop/productDetail?productDetailId=${review.productDetailId}`"
                                        class="text-dark">
                                        {{ review.productName }}
                                        <span v-if="review.productColor !== '無' || review.productSize !== '無'">
                                            {{ review.productColor !== '無' ? review.productColor : '' }}
                                            <span v-if="review.productColor !== '無' && review.productSize !== '無'"> /
                                            </span>
                                            {{ review.productSize !== '無' ? review.productSize : '' }}
                                        </span>
                                    </router-link>
                                </h5>
                                <p class="text-muted mb-2">評論者：{{ review.memberName }}</p>

                                <!-- 評分 -->
                                <div class="review-rating mb-2">
                                    <div class="star-rating-review">
                                        <i v-for="star in 5" :key="star" :class="['fa', 'fa-star', {
                                            'fas': star <= review.rating,
                                            'far': star > review.rating
                                        }]"></i>
                                    </div>
                                </div>

                                <!-- 評論內容 -->
                                <p class="review-description">
                                    {{ review.reviewDescription || '' }}
                                </p>
                            </div>

                            <!-- 顯示圖片，放在描述和時間之間 -->
                            <div class="review-images d-flex flex-wrap mb-3">
                                <div v-for="(photo, index) in review.productReviewPhoto" :key="index"
                                    class="position-relative">
                                    <img :src="'data:image/jpeg;base64,' + photo.reviewPhotos" alt="Review Photo"
                                        class="img-thumbnail m-1" width="100" height="100" />
                                </div>
                            </div>

                            <!-- 評論時間 -->
                            <div class="review-time mt-2 text-muted">
                                <p>{{ formatDate(review.reviewTime) }}</p>
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
                        <li v-for="page in totalPages" :key="page" class="page-item"
                            :class="{ active: page === currentPage }">
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


        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, watch, watchEffect, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

import { getAverageRating } from '@/api/shop/productReviewApi';
import { getProductReviews } from '@/api/shop/productReviewApi';
import { getReviewCount } from '@/api/shop/productReviewApi';

import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/shop/cart";

const route = useRoute();

const PATH = `${import.meta.env.VITE_API_URL}`;
const authStore = useAuthStore();
const cartStore = useCartStore();

// 商品列表的productDetailId
const productDetailId = route.query.productDetailId;

// ===================== store =====================
const memberId = authStore.memberId;

// ===================== 初始載入 =====================
const productList = ref([]);
const sizeList = ref([]);
const colorList = ref([]);
const minPriceProduct = ref({});
const maxPriceProduct = ref({});
const productDetail = ref({});
const totalStockQuantity = ref(0);      // 商品實際庫存
const productQuantityInCart = ref(0);   // 會員購物車內該商品的數量

// 計算最低與最高的折扣價格（如果沒有折扣價則使用原價）
const minPrice = computed(() => minPriceProduct.value.discountPrice ?? minPriceProduct.value.unitPrice);
const maxPrice = computed(() => maxPriceProduct.value.discountPrice ?? maxPriceProduct.value.unitPrice);

// 計算最低與最高的原價
const minUnitPrice = computed(() => minPriceProduct.value.unitPrice);
const maxUnitPrice = computed(() => maxPriceProduct.value.unitPrice);

// 判斷是否顯示原價（有折扣時才顯示）
const isShowOriginalPrice = computed(() =>
    minPriceProduct.value.discountPrice !== null || maxPriceProduct.value.discountPrice !== null
);

// 計算顯示庫存 = 商品實際庫存 - 會員購物車內該商品的數量
const showQuantity = computed(() => {
    return Number(totalStockQuantity.value) - Number(productQuantityInCart.value);
});

// 規格選項元件
const sizeRadios = ref([]);
const colorRadios = ref([]);

// 已選擇的規格選項
const selectedSizeRadio = ref(null);
const selectedColorRadio = ref(null);

// 購買數量
const quantity = ref(1);

// +-按鍵和輸入數量元件的disabled
const isQuantityInputDisabled = ref(false);
// 是否規格選項都選取
const isAllOptionChecked = ref(false);

// 提示訊息
const messages = ref("");

// #region 初始化 & 監聽 =================================================

onMounted(async () => {
    getProductDetail();
})

// 加載商品詳情
async function getProductDetail() {
    await axios({
        method: 'get',
        url: `${PATH}/shop/productDetail?productDetailId=${productDetailId}`,
    })
        .then(response => {
            console.log(response.data);
            productList.value = response.data.productList;
            sizeList.value = response.data.sizeList;
            colorList.value = response.data.colorList;
            minPriceProduct.value = response.data.minPriceProduct;
            maxPriceProduct.value = response.data.maxPriceProduct;
            productDetail.value = response.data.productDetail;
            totalStockQuantity.value = response.data.totalStockQuantity;


        })
        .catch(error => console.log(error));

}

watchEffect(() => {
    // console.log("選中的尺寸:", selectedSizeRadio.value);
    // console.log("選中的顏色:", selectedColorRadio.value);

});

watch([sizeList, colorList, selectedSizeRadio, selectedColorRadio], ([sizeList, colorList, selectedSizeRadioValue, selectedColorRadioValue]) => {
    // 監聽 是否規格選項都選擇
    if (sizeList.length === 0 && colorList.length === 0) {
        setIsAllOptionChecked(true);
    }
    else {
        if ((colorList.length === 0 && selectedSizeRadioValue !== null) ||
            (sizeList.length === 0 && selectedColorRadioValue !== null) ||
            (selectedSizeRadioValue !== null && selectedColorRadioValue !== null)) {
            setIsAllOptionChecked(true);
        }
        else
            setIsAllOptionChecked(false);

    }


});

// #endregion ===============================================================


// #region Event function =================================================

// 規格選項 變更事件 (點選同一個選項不會觸發)
async function onChangeRadio(currentRadio, index) {
    // console.log(currentRadio.id);
    // console.log(currentRadio.name);
    // console.log("選擇的 size radio:", selectedSizeRadio.value);
    // console.log("選擇的 color radio:", selectedColorRadio.value);

    let optionName = event.target.name;

    if ((selectedSizeRadio.value !== null && selectedColorRadio.value !== null)) {
        confirmProduct();
    }
    else if ((selectedSizeRadio.value !== null && colorList.value.length === 0) ||
        (selectedColorRadio.value !== null && sizeList.value.length === 0)) {
        confirmProductWithOneOption();
    }
    else {
        selectOneOption(currentRadio.id, optionName);
    }



}

// 規格選項 點擊事件 => 取消選項選擇的狀態
function onClickRadio(currentRadio, index) {
    if (event.target.name === 'size') {
        if (sizeRadios.value[index].checked && selectedSizeRadio.value === currentRadio.id) {
            sizeRadios.value[index].checked = false;
            selectedSizeRadio.value = null;

            // 所有選項都被取消
            if (selectedSizeRadio.value === null && selectedColorRadio.value === null) {
                cancelAllOption();
            }
            // 一個選項被取消
            else {
                selectOneOption(selectedColorRadio.value, 'color');

            }
        }
    }
    else if (event.target.name === 'color') {
        if (colorRadios.value[index].checked && selectedColorRadio.value === currentRadio.id) {
            colorRadios.value[index].checked = false;
            selectedColorRadio.value = null;

            // 所有選項都被取消
            if (selectedSizeRadio.value === null && selectedColorRadio.value === null) {
                cancelAllOption();
            }
            // 一個選項被取消
            else {
                selectOneOption(selectedSizeRadio.value, 'size');

            }
        }
    }


}

// +按鍵
function onClickIncreaseBtn() {
    if (Number(quantity.value) < Number(totalStockQuantity.value))
        quantity.value++;
}

// -按鍵
function onClickDecreaseBtn() {
    if (Number(quantity.value) > 1)
        quantity.value--;
}

// 數量輸入
function onQuantityInput() {
    if (Number(quantity.value) < 1) {
        quantity.value = 1;
    }
    else if (Number(quantity.value) > Number(totalStockQuantity.value)) {
        quantity.value = Number(totalStockQuantity.value);
    }
}

// 加入購物車
function onClickAddToCartBtn() {
    if (isAllOptionChecked.value) {
        addToCart();
    }
    else {
        messages.value = "請選擇商品規格";
    }
}

// #endregion ===============================================================



// #region General function =================================================

// 當所有規格都被選擇時，確認選定商品
async function confirmProduct() {
    await axios({
        method: 'post',
        url: `${PATH}/shop/productDetail/api/getConfirmProductByDetailIdSizeIdColorId`,
        params: {
            memberId: memberId,
            productDetailId: productDetailId,
            productSizeId: selectedSizeRadio.value !== null ? selectedSizeRadio.value : null,
            productColorId: selectedColorRadio.value !== null ? selectedColorRadio.value : null,
        }
    })
        .then(response => {
            // console.log(response.data);
            productList.value = [response.data.product];
            totalStockQuantity.value = response.data.product.stockQuantity;
            productQuantityInCart.value = Number(response.data.productQuantityInCart) || 0;

            // 除了被選擇的選項都設為 disabled = true
            sizeRadios.value.forEach(sizeRadio => {
                if (Number(sizeRadio.value) !== Number(selectedSizeRadio.value))
                    sizeRadio.disabled = true;
                else
                    sizeRadio.disabled = false;
            });
            colorRadios.value.forEach(colorRadio => {
                if (Number(colorRadio.value) !== Number(selectedColorRadio.value))
                    colorRadio.disabled = true;
                else
                    colorRadio.disabled = false;
            });

        })
        .catch(error => console.log(error));
}

// 當所有規格都被選擇時，確認選定商品 (只有單規格時)
async function confirmProductWithOneOption() {
    await axios({
        method: 'post',
        url: `${PATH}/shop/productDetail/api/getConfirmProductByDetailIdSizeIdColorId`,
        params: {
            memberId: memberId,
            productDetailId: productDetailId,
            productSizeId: selectedSizeRadio.value !== null ? selectedSizeRadio.value : null,
            productColorId: selectedColorRadio.value !== null ? selectedColorRadio.value : null,
        }
    })
        .then(response => {
            // console.log(response.data);
            productList.value = [response.data.product];
            totalStockQuantity.value = response.data.product.stockQuantity;
            productQuantityInCart.value = Number(response.data.productQuantityInCart) || 0;

        })
        .catch(error => console.log(error));
}

// 當有單一規格選項被選擇時，過濾是否有符合該規格的顏色或尺寸，並切換為可點擊或不可點擊
async function selectOneOption(optionId, optionName) {
    await axios({
        method: 'post',
        url: `${PATH}/shop/productDetail/api/getProductByOption`,
        params: {
            productDetailId: productDetailId,
            optionId: optionId,
            optionName: optionName,
        }
    })
        .then(response => {
            // console.log(response.data);
            productList.value = response.data.productList;
            minPriceProduct.value = response.data.minPriceProduct;
            maxPriceProduct.value = response.data.maxPriceProduct;
            totalStockQuantity.value = response.data.totalStockQuantity;
            productQuantityInCart.value = 0;

            // 選擇尺寸 篩選顏色 (尺寸的其他選項要切為可選)
            if (optionName === 'size') {
                colorRadios.value.forEach(colorRadio => {
                    colorRadio.disabled = true;
                    for (let i = 0; i < productList.value.length; i++) {
                        if (Number(colorRadio.value) === Number(productList.value[i].productColor.id)) {
                            colorRadio.disabled = false;
                            break;
                        }
                    }
                });
                sizeRadios.value.forEach(sizeRadio => {
                    sizeRadio.disabled = false;
                });
            }
            // 選擇顏色 篩選尺寸 (顏色的其他選項要切為可選)
            if (optionName === 'color') {
                sizeRadios.value.forEach(sizeRadio => {
                    sizeRadio.disabled = true;
                    for (let i = 0; i < productList.value.length; i++) {
                        if (Number(sizeRadio.value) === Number(productList.value[i].productSize.id)) {
                            sizeRadio.disabled = false;
                            break;
                        }
                    }
                });
                colorRadios.value.forEach(colorRadio => {
                    colorRadio.disabled = false;
                });
            }


        })
        .catch(error => console.log(error));
}

// 取消所有規格選項
async function cancelAllOption() {
    await axios({
        method: 'get',
        url: `${PATH}/shop/productDetail/api/getProductByProductDetailId?productDetailId=${productDetailId}`,
    })
        .then(response => {
            // console.log(response.data);
            productList.value = response.data.productList;
            minPriceProduct.value = response.data.minPriceProduct;
            maxPriceProduct.value = response.data.maxPriceProduct;
            totalStockQuantity.value = response.data.totalStockQuantity;
            productQuantityInCart.value = 0;

            // 重置全部radio disabled
            sizeRadios.value.forEach(sizeRadio => {
                sizeRadio.disabled = false;
            });
            colorRadios.value.forEach(colorRadio => {
                colorRadio.disabled = false;
            });

        })
        .catch(error => console.log(error));
}

// 加入購物車
async function addToCart() {
    await axios({
        method: 'post',
        url: `${PATH}/shop/productDetail/api/addProductToCart`,
        params: {
            memberId: memberId,
            productDetailId: productDetailId,
            productSizeId: selectedSizeRadio.value !== null ? selectedSizeRadio.value : null,
            productColorId: selectedColorRadio.value !== null ? selectedColorRadio.value : null,
            quantity: quantity.value,
        }
    })
        .then(response => {
            console.log(response.data);
            // messages.value = "成功加入購物車!"
            messages.value = ""
            cartStore.fetchCartCount(memberId);
            Swal.fire({
                icon: 'success',
                title: '成功加入購物車!',
                showConfirmButton: false,
                timer: 1500
            });
        })
        .catch(error => console.log(error));

}

// 設定 +- 按鈕 和 輸入數量的disabled
function setIsAllOptionChecked(setBool) {
    isAllOptionChecked.value = setBool;
    isQuantityInputDisabled.value = !setBool;
}

//================商品評論===================

//商品平均評分
const averageRating = ref(null);
const fetchAverageRating = async () => {
    try {
        const avgRating = await getAverageRating(productDetailId);
        averageRating.value = avgRating; // 設定獲取到的平均評分
        console.log(averageRating)
    } catch (error) {
        console.error('無法獲取平均評分', error);
        averageRating.value = null; // 如果有錯誤則設為 null
    }
};

const reviewCount = ref(0);
const fetchReviewCount = async () => {
    try {
        // 從 API 獲取評論總數
        const count = await getReviewCount(productDetailId);
        reviewCount.value = count;
        console.log('評論總數:', reviewCount.value);
    } catch (error) {
        console.error('無法獲取評論總數', error);
        reviewCount.value = 0;
    }
};


//該商品所有評論
const reviews = ref([]);  // 儲存評論數據
const totalPages = ref(0)  // 存儲總頁數
const totalElements = ref(0)  // 存儲總評論數
const currentPage = ref(1)  // 當前頁碼
const pageSize = ref(5)  // 每頁評論數

const fetchProductReviews = async (page = 1, size = 10) => {
    try {
        const response = await getProductReviews(productDetailId, page, size);

        // 更新評論資料、總頁數、總評論數和當前頁碼
        reviews.value = response.content;  // 獲取當前頁面的評論資料
        totalPages.value = response.totalPages;  // 獲取總頁數
        totalElements.value = response.totalElements;  // 獲取總評論數
        currentPage.value = page;  // 更新當前頁碼

        console.log(response);
    } catch (error) {
        console.error('無法獲取商品評論', error);
    }
};

// 分頁處理
const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    fetchProductReviews(page, pageSize.value);  // 請求新的頁面資料
};

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(date).toLocaleDateString('zh-TW', options)
}

// 頁面加載後自動加載商品評論
onMounted(() => {
    fetchAverageRating();
    fetchProductReviews(currentPage.value);
    fetchReviewCount();
});
// #endregion ===============================================================

</script>

<!-- 自訂外觀 -->
<style scoped>
@import '/user_static/css/shop_pagination.css';

.product-image {
    width: 450px;
    height: 450px;
    object-fit: cover;
}

.option-container {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
}

.option-grid {
    display: flex !important;
    flex-wrap: wrap !important;
    /* 允許換行，但元素會從左到右排列 */
    gap: 10px !important;
    /* 調整項目之間的間隔 */
}

.form-check {
    display: flex !important;
    align-items: center !important;
}


/* form radio 外觀 */
.form-check-input[type="radio"] {
    display: none;
}

.form-check-input[type="radio"]+.form-check-label {
    display: inline-block;
    padding: 10px 20px;
    border: 2px solid #5b5b5b;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
}

.form-check-input[type="radio"]:checked+.form-check-label {
    border-color: red;
    color: red;
}

.form-check:hover .form-check-label {
    border-color: red;
    color: red;
}

/* 禁止文字被滑鼠選取 */
.no-select {
    user-select: none;
    /* 禁止選取 */
    -webkit-user-select: none;
    /* 適用於 Safari / Chrome */
    -moz-user-select: none;
    /* 適用於 Firefox */
    -ms-user-select: none;
    /* 適用於 Internet Explorer / Edge */
}

/* 隱藏所有瀏覽器的數字上下箭頭 */
.no-spinner {
    -moz-appearance: textfield;
    /* Firefox */
    appearance: textfield;
}

.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.star-rating i.fas {
    padding-top: 5px;
    color: #f8c307;
    font-size: 2rem;
}

.star-rating i.far {
    padding-top: 5px;
    color: #ddd;
    font-size: 2rem;
}

.star-rating-review i.fas {
    color: #f8c307;
}

.star-rating-review i.far {
    color: #ddd;
}

.review-images img {
    width: 100px;
    /* 固定寬度 */
    height: 100px;
    /* 固定高度 */
    object-fit: cover;
    /* 保持圖片比例，填滿容器 */
}
</style>
