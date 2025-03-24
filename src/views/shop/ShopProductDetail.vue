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
                    <!-- <strong>Rating:</strong> -->
                    ⭐⭐⭐⭐⭐ (5.0)
                </p>

                <!-- 商品敘述 -->
                <p class="text-muted">
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
                                <input class="color-radio form-check-input" type="radio" name="color" :id="'color' + index"
                                    :value="color.id" v-model="selectedColorRadio" ref="colorRadios"
                                    @change="onChangeRadio(color, index)" @click="onClickRadio(color, index)">
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

                <button class="btn btn-primary w-100" id="add-to-cart-btn" @click="onClickAddToCartBtn">加入購物車</button>

            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, watch, watchEffect, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

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

    if ((selectedSizeRadio.value !== null && selectedColorRadio.value !== null) ||
        (selectedSizeRadio.value !== null && colorList.value.length === 0) ||
        (selectedColorRadio.value !== null && sizeList.value.length === 0)) {
        confirmProduct();
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

            // 所有選項都被取消 or 一個選項被取消
            if (selectedSizeRadio.value === null && selectedColorRadio.value === null) {
                cancelAllOption();
            }
            else {
                selectOneOption(selectedColorRadio.value, 'color');
            }
        }
    }
    else if (event.target.name === 'color') {
        if (colorRadios.value[index].checked && selectedColorRadio.value === currentRadio.id) {
            colorRadios.value[index].checked = false;
            selectedColorRadio.value = null;

            // 所有選項都被取消 or 一個選項被取消
            if (selectedSizeRadio.value === null && selectedColorRadio.value === null) {
                cancelAllOption();
            }
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

            // 選擇尺寸 篩選顏色
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
            }
            // 選擇顏色 篩選尺寸
            else if (optionName === 'color') {
                sizeRadios.value.forEach(sizeRadio => {
                    sizeRadio.disabled = true;
                    for (let i = 0; i < productList.value.length; i++) {
                        if (Number(sizeRadio.value) === Number(productList.value[i].productSize.id)) {
                            sizeRadio.disabled = false;
                            break;
                        }
                    }
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
            messages.value = "成功加入購物車!"
            cartStore.fetchCartCount(memberId);
        })
        .catch(error => console.log(error));

}

// 設定 +- 按鈕 和 輸入數量的disabled
function setIsAllOptionChecked(setBool) {
    isAllOptionChecked.value = setBool;
    isQuantityInputDisabled.value = !setBool;
}

// #endregion ===============================================================

</script>

<!-- 自訂外觀 -->
<style scoped>
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
    flex-wrap: wrap !important; /* 允許換行，但元素會從左到右排列 */
    gap: 10px !important; /* 調整項目之間的間隔 */
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
</style>
