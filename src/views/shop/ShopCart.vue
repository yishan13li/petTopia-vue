<template>
    <section id="cart" class="container my-5">
        <div class="row">

            <!-- 購物車 -->
            <h3 class="mb-4">購物車</h3>

            <!-- 商品清單 -->
            <div class="card mb-4">
                <div class="card-body">
                    <!-- 商品 -->
                    <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3"
                        v-for="(cart, index) in cartList">
                        <div class="d-flex align-items-center">
                            <!-- checkbox -->
                            <input type="checkbox" :value="cart.product.id" v-model="selectedCarts">
                            <!-- 商品圖片 -->
                            <img :src="`${PATH}/shop/cart/api/getPhoto?productId=${cart.product.id}`" alt="Product 1"
                                class="img-thumbnail" style="width: 100px;">
                            <div class="ms-3">
                                <!-- 商品名稱 -->
                                <h5>
                                    <RouterLink
                                        :to="{ path: '/shop/productDetail', query: { productDetailId: cart.product.productDetail.id } }">
                                        {{ cart.product.productDetail.name }}</RouterLink>
                                </h5>
                                <!-- 商品規格 -->
                                <p v-show="cart.product.productSize || cart.product.productColor">
                                    {{ cart.product.productSize?.name ? `尺寸: ${cart.product.productSize.name}` : '' }}
                                    <span v-if="cart.product.productSize && cart.product.productColor"> | </span>
                                    {{ cart.product.productColor?.name ? `顏色: ${cart.product.productColor.name}` : '' }}
                                </p>

                            </div>
                            <!-- 單價 -->
                            <div class="ms-3">
                                <span>${{ cart.product.unitPrice }}</span>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <!-- 數量控制 -->
                            <div class="d-flex">
                                <button class="btn btn-light btn-sm" @click="onClickDecreaseBtn(cart)">-</button>
                                <input type="number" class="form-control form-control-sm text-center no-spinner"
                                    :value="cart.quantity" @input="onQuantityInputChange(cart)"
                                    @blur="onQuantityInputBlur(cart)" min="1" style="width: 50px;">
                                <button class="btn btn-light btn-sm" @click="onClickIncreaseBtn(cart)">+</button>
                            </div>
                            <!-- 單品小計 -->
                            <div class="ms-3">
                                <span>${{ (cart.product.unitPrice * cart.quantity).toLocaleString() }}</span>
                            </div>
                            <!-- 移除按鈕 -->
                            <button class="btn btn-danger btn-sm ms-3" @click="onClickDeleteCartBtn(cart)"
                                style="color: black;">刪除</button>
                        </div>
                    </div>

                    <!-- 優惠券選擇區域 -->
                    <div class="mb-5 mt-4 d-flex justify-content-center">
                        <div class="w-100 text-center">
                            <h3 for="coupon" class="form-label mb-4">使用優惠券</h3>
                            <button id="couponButton" ref="couponButton" type="button"
                                class="btn w-100 d-flex align-items-center justify-content-center" style="height:50px"
                                @click="openModal">
                                {{ selectedCoupon ? selectedCoupon.name : '選擇優惠券' }}
                            </button>
                        </div>
                    </div>

                    <!-- 優惠券選擇模態視窗 -->
                    <div v-if="isModalOpen" class="modal fade show" tabindex="-1" aria-labelledby="couponModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="couponModalLabel">選擇優惠券</h5>
                                    <button type="button" class="btn-close" @click="closeModal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="list-group">
                                        <p class="fw-bold" style="margin-bottom: 5px;">可用優惠券</p>

                                        <div v-if="availableCoupons.length > 0">
                                            <div v-for="coupon in availableCoupons" :key="coupon.id">
                                                <button type="button"
                                                    class="list-group-item list-group-item-action coupon-btn text-dark"
                                                    style="border: 1px solid rgb(192, 192, 192); margin-bottom: 3px; border-radius: 5px;"
                                                    @click="selectCoupon(coupon)">
                                                    <div
                                                        style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                                        <span>{{ coupon.name }}</span>
                                                        <span>{{ coupon.discountType ? `－${(coupon.discountValue *
                                                            100).toFixed(0)}%` :
                                                            `－$${coupon.discountValue.toFixed(0)}` }}</span>
                                                    </div>
                                                </button>
                                            </div>

                                        </div>
                                        <p v-else class="text-muted text-center">目前無可用使用券</p>
                                    </div>

                                    <div class="list-group mt-3">
                                        <p class="fw-bold" style="margin-bottom: 5px;">未滿額優惠券</p>
                                        <div v-if="notMeetCoupons.length > 0">

                                            <div v-for="coupon in notMeetCoupons" :key="coupon.id">
                                                <button type="button"
                                                    class="list-group-item list-group-item-action coupon-btn disabled text-body-secondary"
                                                    style="margin-bottom: 3px; border-radius: 5px;">
                                                    <div
                                                        style="display: flex; justify-content: space-between; align-items: center; width: 100%; color: rgb(158, 158, 158);">
                                                        <span>{{ coupon.name }}</span>
                                                        <span>需滿額 ${{ coupon.minOrderValue.toFixed(0) }}</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                        <p v-else class="text-muted text-center">無</p>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="coupon-close-btn" @click="closeModal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 總計 -->
            <div class="card">
                <div class="card-body">
                    <h3 class="mb-4 text-center">總計 ({{ selectedCarts.length }} 個商品)</h3>
                    <div class="d-flex justify-content-between">
                        <p>小計</p>
                        <p class="subtotal">$ {{ subtotal.toLocaleString() }}</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p>優惠折扣</p>
                        <p class="discount" style="color: crimson;">$ {{ discountAmount.toLocaleString() }}</p>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between">
                        <h5>總金額</h5>
                        <h5 class="final-total">$ {{ totalAmount.toLocaleString() }}</h5>
                    </div>

                    <div class="d-flex justify-content-center mt-4 submit-btn">
                        <button type="submit" class="btn" @click="onClickGoToCheckOut"
                            style="width: 250px; height: 60px; font-size: 18x;font-weight: bold;">
                            去買單
                        </button>

                    </div>
                    <div class="mb-5 mt-4 d-flex justify-content-center">
                        <label class="form-label ms-3" style="color: crimson;">{{ messages }}</label>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

import { fetchCartCouponsForMember } from '@/api/shop/couponApi';

const router = useRouter();

const PATH = `${import.meta.env.VITE_API_URL}`;

// ===================== 初始載入 =====================
const cartList = ref([]);       // 購物車列表
const selectedCarts = ref([]);  // 勾選的購物車

const messages = ref("");   // 提示訊息

// ===================== 優惠券 =====================
const availableCoupons = ref([]);
const notMeetCoupons = ref([]);

const isModalOpen = ref(false);
const selectedCoupon = ref(null);  // 儲存選擇的優惠券
const selectedCouponId = null;

// ===================== 金額計算 =====================
// 小計
const subtotal = computed(() => {
    return cartList.value.reduce((sum, cart) => {
        return selectedCarts.value.includes(cart.product.id)
            ? sum + Math.round(cart.quantity * cart.product.unitPrice)
            : sum;
    }, 0);

});
// 優惠券折抵
const discountAmount = computed(() => {
    if (!selectedCoupon.value) return 0;

    const coupon = selectedCoupon.value;

    // 轉換 discountType 為布林值
    const isPercentage = coupon.discountType === true;

    if (!isPercentage) {
        // 如果是金額折扣
        return coupon.discountValue;
    } else {
        // 如果是百分比折扣
        return Math.round(subtotal.value * coupon.discountValue);
    }

});
//總金額：
const totalAmount = computed(() => {
    return subtotal.value - discountAmount.value;
});



// #region 初始化 & 監聽 =================================================

onMounted(async () => {
    getMemberCart();
    fetchCoupons();

})


//FIXME: 有使用memberId改為登入獲取
// 加載會員購物車
async function getMemberCart() {
    await axios({
        method: 'post',
        url: `${PATH}/shop/cart`,
        params: {
            memberId: 11,
        }
    })
        .then(response => {
            console.log(response.data);
            cartList.value = response.data;

        })

        .catch(error => console.log(error));
}

// 獲取優惠券
const fetchCoupons = async () => {
    try {
        const { availableCoupons: available, notMeetCoupons: notMeet, selectedCoupon: cartSelectedCoupon } = await fetchCartCouponsForMember({ selectedCouponId });
        availableCoupons.value = available;
        // notMeetCoupons.value = notMeet;
        selectedCoupon.value = cartSelectedCoupon;
    } catch (error) {
        console.error('Error fetching coupons in Vue:', error);
    }
};



// #endregion ===============================================================

// #region Event function =================================================

function onClickTest() {
    // console.log(selectedCarts.value);


}

// +按鍵
function onClickIncreaseBtn(cart) {
    if (Number(cart.quantity) < Number(cart.product.stockQuantity))
        cart.quantity++;

    updateCartProductQuantity(cart);

}

// -按鍵
function onClickDecreaseBtn(cart) {
    if (Number(cart.quantity) > 1)
        cart.quantity--;

    updateCartProductQuantity(cart);

}

// 數量輸入 @change
function onQuantityInputChange(cart) {
    let value = event.target.value;

    if (Number(value) < 1) {
        value = 1;
        cart.quantity = value;
    }
    else if (Number(value) > Number(cart.product.stockQuantity)) {
        value = Number(cart.product.stockQuantity);
        cart.quantity = value;
    }
    else {
        cart.quantity = value;
    }



}

// 數量輸入 @blur
function onQuantityInputBlur(cart) {
    updateCartProductQuantity(cart);
}

// 刪除該商品的購物車
function onClickDeleteCartBtn(cart) {
    Swal.fire({
        title: "確定要刪除嗎？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "確定刪除",
        cancelButtonText: "取消"
    }).then((result) => {
        if (result.isConfirmed)
            deleteCart(cart);
    });
}

// 去買單 => 前往買單頁面
function onClickGoToCheckOut() {
    if (selectedCarts.value === null || selectedCarts.value.length === 0) {
        messages.value = "請先勾選商品在進行結帳";
        return;
    }

    router.push({
        path: '/shop/checkout',
        query: {
            productIds: selectedCarts.value,
            selectedCouponId: selectedCoupon.value ? selectedCoupon.value.id : null,
        },
    });
}

// #endregion =================================================

// #region General function =================================================

// -------- 優惠券 --------
// 開啟 Modal
const openModal = () => {
    isModalOpen.value = true;
    nextTick(() => {
        // 在 Modal 顯示後，聚焦於關閉按鈕
        document.querySelector('.btn-close').focus();
    });
};

// 關閉 Modal
const closeModal = () => {
    isModalOpen.value = false;
    nextTick(() => {
        // 返回焦點至觸發 Modal 開啟的按鈕
        document.querySelector('#couponButton').focus();
    });
};

// 選擇優惠券
const selectCoupon = (coupon) => {
    selectedCoupon.value = coupon;  // 更新選擇的優惠券
    closeModal();  // 關閉 Modal
};

// 更新購物車內該商品的數量
async function updateCartProductQuantity(cart) {
    await axios({
        method: 'post',
        url: `${PATH}/shop/cart/api/updateCartProductQuantity`,
        params: {
            memberId: 11,
            productId: cart.product.id,
            quantity: cart.quantity,
        }
    })
        .then(response => console.log(response.data))
        .catch(error => console.log("更新購物車內該商品的數量失敗", error));

}

async function deleteCart(cart) {
    await axios({
        method: 'get',
        url: `${PATH}/shop/cart/api/deleteCartById`,
        params: {
            cartId: cart.id
        }
    })
        .then(response => {
            let deleteCartId = response.data;
            // 從 cartList 移除已刪除的項目
            if (deleteCartId !== null)
                cartList.value = cartList.value.filter(cart => cart.id !== deleteCartId);
        })
        .catch(error => console.log("刪除購物車商品失敗:", error));
}

// #endregion =================================================

</script>

<style>
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