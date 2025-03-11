<template>
    <section id="product_detail" class="container my-5" th:data-product-detail-id="${productDetail.id}">

        <div class="row">
            <!-- 商品圖片 -->
            <div class="col-md-6">
                <img v-if="productList.length > 0"
                    :src="`${path}/shop/productDetail/api/getPhoto?productId=${productList[0].id}`"
                    class="img-fluid rounded-4" alt="Product Image">
            </div>
            <div class="col-md-6">
                <!-- 商品名稱 -->
                <h2>{{ productDetail.name }}</h2>
                <!-- 商品敘述 -->
                <p class="text-muted">
                    {{ productDetail.description }}
                </p>
                <!-- 商品價錢 -->
                <h4 v-if="productList.length == 1" class="show-product-price text-primary">
                    ${{ productList[0].unitPrice }}
                </h4>
                <h4 v-if="productList.length > 1" class="text-primary" id="show-product-price">
                    ${{ minPriceProduct.unitPrice }} - ${{ maxPriceProduct.unitPrice }}</h4>

                <!-- 商品評分 -->
                <p>
                    <!-- <strong>Rating:</strong> -->
                    ⭐⭐⭐⭐⭐ (5.0)
                </p>

                <!-- 商品規格選擇 -->
                <!-- 尺寸選擇 -->
                <div class="mb-3">

                    <div v-if="sizeList.length > 0">

                        <label class="form-label">尺寸</label>

                        <div v-for="(size, index) in sizeList" class="form-check">
                            <input class="size-radio form-check-input" type="radio" name="size" :id="'size' + index"
                                :value="size.id" v-model="selectedSizeRadio" @click="onClickRadio(size)">
                            <label class="form-check-label no-select" :for="'size' + index">
                                {{ size.name }}
                            </label>
                        </div>

                    </div>

                </div>

                <!-- 顏色選擇 -->
                <div class="mb-3">

                    <div v-if="colorList.length > 0">

                        <label class="form-label">顏色</label>

                        <div v-for="(color, index) in colorList" class="form-check">
                            <input class="color-radio form-check-input" type="radio" name="color" :id="'color' + index"
                                :value="color.id">
                            <label class="form-check-label no-select" :for="'color' + index">
                                {{ color.name }}
                            </label>
                        </div>

                    </div>


                </div>

                <!-- 購買數量 -->
                <div class="d-flex align-items-center mb-3">
                    <label class="form-label">數量</label>
                    <button class="btn btn-outline-secondary ms-4" id="decrease-btn" :disabled="isDisabled"
                        @click="onClickDecreaseBtn">-</button>
                    <input type="number" class="form-control text-center mx-2 no-spinner" id="product-quantity-input"
                        v-model="quantity" :disabled="isDisabled" style="width: 60px;">
                    <button class="btn btn-outline-secondary" id="increase-btn" :disabled="isDisabled"
                        @click="onClickIncreaseBtn">+</button>
                    <label class="form-label ms-3" id="show-stock-quantity">還剩 {{ totalStockQuantity }} 件</label>
                    <label class="form-label ms-3" id="messages"></label>
                </div>

                <button class="btn btn-primary w-100" id="add-to-cart-btn">加入購物車</button>

            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();

const path = `${import.meta.env.VITE_API_URL}`;
const productDetailId = route.query.productDetailId;

// 初始載入
const productList = ref([]);
const sizeList = ref([]);
const colorList = ref([]);
const minPriceProduct = ref({});
const maxPriceProduct = ref({});
const productDetail = ref({});
const totalStockQuantity = ref(0);

// 已選擇的規格選項
const selectedSizeRadio = ref(null);
const selectedColorRadio = ref(null);

// 購買數量
const quantity = ref(1);

// 元件 +-按鍵和輸入數量 disabled
const isDisabled = ref(false);



// 檢查所有選項是否已選擇
let isAllOptionChecked = false;

onMounted(async () => {
    getProductDetail();
})

// 加載商品詳情
async function getProductDetail() {
    await axios({
        method: 'get',
        url: `${path}/shop/productDetail?productDetailId=${productDetailId}`,
    })
        .then(response => {
            // console.log(response.data);
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

// #region Event function =================================================

// 規格選項 點擊事件
function onClickRadio(currentRadio) {
    console.log(currentRadio.id);
    console.log(currentRadio.name);
    console.log(selectedSizeRadio.value);
}

// +按鍵
function onClickIncreaseBtn() {
    quantity.value++;
}

// -按鍵
function onClickDecreaseBtn() {
    quantity.value--;
}

// #endregion ===============================================================



// #region General function =================================================

// 設定 +- 按鈕 和 輸入數量的disabled
function setQuantityBtnAndInputDisabled(setDisabled) {
    isDisabled = setDisabled;
}

// #endregion ===============================================================

</script>

<!-- 自訂外觀 -->
<style>
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
</style>
