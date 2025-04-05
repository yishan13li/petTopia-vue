<template>
    <section id="cart" class="container my-5">
        <div class="row">

            <!-- 購物車 -->
            <h3 class="mb-4">購物車</h3>

            <div v-if="cartCount === 0" class="empty-cart-message">
                <p>您的購物車是空的，請前往商店選擇商品。</p>
                <router-link to="/shop/products" class="btn btn-primary">前往購物</router-link>
            </div>

            <div v-else>
                <!-- 商品清單 -->
                <div class="card mb-4">
                    <div class="card-body">
                        <!-- 標題列 -->
                        <div class="d-flex py-2 border-bottom fw-bold text-center">
                            <!-- 全選Checkbox -->
                            <div class="col-1">
                                <input type="checkbox" v-model="isSelectAll" @change="onSelectAll">
                            </div>
                            <div class="col-4 text-start">商品</div>
                            <div class="col-2">單價</div>
                            <div class="col-2">數量</div>
                            <div class="col-2">總計</div>
                            <div class="col-1">操作</div>
                        </div>

                        <!-- 商品項目 -->
                        <div class="d-flex align-items-center py-3 border-bottom text-center"
                            v-for="(cart, index) in cartList">
                            <!-- checkbox -->
                            <div class="col-1">
                                <input type="checkbox" :value="{ cartId: cart.id, productId: cart.product.id }"
                                    v-model="selectedCarts" @change="onChangeTest">
                            </div>

                            <!-- 商品 -->
                            <div class="col-4 d-flex align-items-center text-start">
                                <img :src="`${PATH}/shop/cart/api/getPhoto?productId=${cart.product.id}`"
                                    alt="Product Image" class="img-thumbnail me-2" style="width: 80px;">
                                <div>
                                    <h5>
                                        <RouterLink
                                            :to="{ path: '/shop/productDetail', query: { productDetailId: cart.product.productDetail.id } }">
                                            {{ cart.product.productDetail.name }}
                                        </RouterLink>
                                    </h5>
                                    <p v-show="cart.product.productSize || cart.product.productColor">
                                        {{ cart.product.productSize?.name ? `尺寸: ${cart.product.productSize.name}` : ''
                                        }}
                                        <span v-if="cart.product.productSize && cart.product.productColor"> | </span>
                                        {{ cart.product.productColor?.name ? `顏色: ${cart.product.productColor.name}` :
                                            '' }}
                                    </p>
                                </div>
                            </div>

                            <!-- 單價 -->
                            <div class="col-2 text-center">
                                <span v-if="cart.product.discountPrice" class="text-muted text-decoration-line-through">
                                    ${{ cart.product.unitPrice }}
                                </span>
                                <span :style="{ color: cart.product.discountPrice ? 'red' : '' }"> &nbsp;${{
                                    cart.product.discountPrice ? cart.product.discountPrice : cart.product.unitPrice
                                }}</span>
                            </div>

                            <!-- 數量控制 -->
                            <div class="col-2 d-flex justify-content-center align-items-center">
                                <button class="btn btn-light btn-sm" @click="onClickDecreaseBtn(cart)">-</button>
                                <input type="number" class="form-control form-control-sm text-center mx-2 no-spinner"
                                    :value="cart.quantity" @input="onQuantityInputChange(cart)"
                                    @blur="onQuantityInputBlur(cart)" min="1" style="width: 50px;">
                                <button class="btn btn-light btn-sm" @click="onClickIncreaseBtn(cart)">+</button>
                            </div>

                            <!-- 單品小計 -->
                            <div class="col-2 text-center">
                                <span>${{ ((cart.product.discountPrice ? cart.product.discountPrice :
                                    cart.product.unitPrice) * cart.quantity).toLocaleString() }}</span>
                            </div>

                            <!-- 操作 -->
                            <div class="col-1 d-flex justify-content-center">
                                <button class="btn btn-danger btn-sm text-dark" @click="onClickDeleteCartBtn(cart)">
                                    刪除
                                </button>
                            </div>
                        </div>

                        <!-- 優惠券選擇區域 -->
                        <div class="mb-5 mt-4 d-flex justify-content-center">
                            <div class="w-40 text-center">
                                <h3 for="coupon" class="form-label mb-4">使用優惠券</h3>
                                <button id="couponButton" ref="couponButton" type="button"
                                    class="btn w-100 d-flex align-items-center justify-content-center"
                                    style="height:50px" @click="openModal">
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
                                            <button class="coupon-btn list-group-item"
                                                style="border: 1px solid rgb(192, 192, 192); border-radius: 5px;"
                                                @click="clearCoupon">不使用優惠券</button>
                                            <br>
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
                                        <button type="button" class="coupon-close-btn"
                                            @click="closeModal">Close</button>
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
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

import { fetchCartCouponsForMember } from '@/api/shop/couponApi';

import { storeToRefs } from 'pinia';
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/shop/cart";

const router = useRouter();

const PATH = `${import.meta.env.VITE_API_URL}`;
const authStore = useAuthStore();
const cartStore = useCartStore();

// 購物車數量
const { cartCount } = storeToRefs(cartStore);

// ===================== store =====================
const memberId = authStore.memberId;

// ===================== 初始載入 =====================
const cartList = ref([]);       // 購物車列表
const selectedCarts = ref([]);  // 勾選的購物車
const isSelectAll = ref(false)  // 全選checkbox的狀態

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
        const isSelected = selectedCarts.value.some(cartItem => cartItem.productId === cart.product.id);

        return isSelected
            ? sum + Math.round(cart.quantity * (cart.product.discountPrice ? cart.product.discountPrice : cart.product.unitPrice))
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

// 總金額
const totalAmount = computed(() => {
    return subtotal.value - discountAmount.value;
});

// ===================== 傳入訂單頁面的productIds =====================
// 轉換 selectedCarts 裡面的 productId，轉成 "xx,xx,xx" 格式
const productIds = computed(() => {
    return selectedCarts.value.map(cart => cart.productId).join(",");
});

// #region 初始化 & 監聽 =================================================

onMounted(async () => {
    getMemberCart();
    fetchCoupons();
})

// 監控 selectedCarts 的變動，來更新全選checkbox的狀態
watch(selectedCarts, () => {
    isSelectAll.value = selectedCarts.value.length === cartList.value.length;
}, { immediate: true })

// 當 cartList 更新時，檢查是否需要更新全選狀態
watch(cartList, () => {
    nextTick(() => {
        isSelectAll.value = selectedCarts.value.length === cartList.value.length
    })
})

// 監聽subtotal => 勾選的購物車商品是否達到優惠券滿額
watch(subtotal, (subtotal) => {
    if (selectedCoupon.value) {
        if (Number(subtotal) < Number(selectedCoupon.value.minOrderValue)) {
            selectedCoupon.value = null;
        }
    }

    // 重新計算符合條件的優惠券
    const newAvailableCoupons = [];
    const newNotMeetCoupons = [];

    availableCoupons.value.forEach(coupon => {
        if (Number(subtotal) >= Number(coupon.minOrderValue)) {
            newAvailableCoupons.push(coupon); // 符合條件的繼續留在 availableCoupons
        } else {
            newNotMeetCoupons.push(coupon); // 不符合條件的放入 notMeetCoupons
        }
    });

    notMeetCoupons.value.forEach(coupon => {
        if (Number(subtotal) >= Number(coupon.minOrderValue)) {
            newAvailableCoupons.push(coupon); // 如果原本不符合的，現在符合了，就加回 availableCoupons
        } else {
            newNotMeetCoupons.push(coupon); // 仍然不符合的繼續留在 notMeetCoupons
        }
    });

    availableCoupons.value = newAvailableCoupons;
    notMeetCoupons.value = newNotMeetCoupons;

});

// 加載會員購物車
async function getMemberCart() {
    await axios({
        method: 'post',
        url: `${PATH}/shop/cart`,
        params: {
            memberId: memberId,
        }
    })
        .then(response => {
            // console.log(response.data);
            cartList.value = response.data;

        })

        .catch(error => console.log(error));
}

// 獲取優惠券
const fetchCoupons = async () => {
    try {
        const { availableCoupons: available, notMeetCoupons: notMeet, selectedCoupon: cartSelectedCoupon } = await fetchCartCouponsForMember({ selectedCouponId, memberId });
        availableCoupons.value = available;
        // notMeetCoupons.value = notMeet;
        selectedCoupon.value = cartSelectedCoupon;
        turnAvailableCouponSToNotMeetCoupons();

    } catch (error) {
        console.error('Error fetching coupons in Vue:', error);
    }
};


// #endregion ===============================================================

// #region Event function =================================================

function onChangeTest() {
    // console.log(selectedCarts.value);


}

// 當全選checkbox變動時，控制所有checkbox的狀態 @change
function onSelectAll() {
    if (isSelectAll.value) {
        selectedCarts.value = cartList.value.map(cart => ({ cartId: cart.id, productId: cart.product.id }));
    } else {
        selectedCarts.value = [];
    }
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
            productIds: productIds.value,
            selectedCouponId: selectedCoupon.value ? selectedCoupon.value.id : null,
        },
    });
}

// #endregion =================================================

// #region General function =================================================

// 獲取優惠券後先將availableCoupons放入notMeetCoupons
function turnAvailableCouponSToNotMeetCoupons() {
    availableCoupons.value.forEach(available => {
        notMeetCoupons.value.push(available);
    });

    availableCoupons.value = [];

}

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

// 選擇 不使用優惠券
const clearCoupon = () => {
    selectedCoupon.value = null;
    closeModal();
};

// 更新購物車內該商品的數量
async function updateCartProductQuantity(cart) {
    await axios({
        method: 'post',
        url: `${PATH}/shop/cart/api/updateCartProductQuantity`,
        params: {
            memberId: memberId,
            productId: cart.product.id,
            quantity: cart.quantity,
        }
    })
        .then(response => {
            // console.log(response.data);
        })
        .catch(error => console.log("更新購物車內該商品的數量失敗", error));

}

// 刪除購物車
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
            if (deleteCartId !== null) {
                // 從 cartList 移除已刪除的項目
                cartList.value = cartList.value.filter(cart => cart.id !== deleteCartId);
                // 刪除有勾選的購物車
                if (selectedCarts.value !== null || selectedCarts.value.length !== 0) {
                    selectedCarts.value = selectedCarts.value.filter(cart => cart.cartId !== deleteCartId);
                }

            }


            cartStore.fetchCartCount(memberId);

        })
        .catch(error => console.log("刪除購物車商品失敗:", error));
}

// #endregion =================================================

</script>

<style scoped>
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
