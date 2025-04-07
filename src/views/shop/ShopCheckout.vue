<template>
  <!-- 隱藏表單，包含 paymentData -->
  <form ref="ecpayForm" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post">
    <input type="hidden" :value="paymentData.merchantId" name="MerchantID" />
    <input type="hidden" :value="paymentData.merchantTradeNo" name="MerchantTradeNo" />
    <input type="hidden" :value="paymentData.merchantTradeDate" name="MerchantTradeDate" />
    <input type="hidden" :value="paymentData.paymentType" name="PaymentType" />
    <input type="hidden" :value="paymentData.totalAmount" name="TotalAmount" />
    <input type="hidden" :value="paymentData.tradeDesc" name="TradeDesc" />
    <input type="hidden" :value="paymentData.itemName" name="ItemName" />
    <input type="hidden" :value="paymentData.returnURL" name="ReturnURL" />
    <input type="hidden" :value="paymentData.orderResultURL" name="OrderResultURL" />
    <input type="hidden" :value="paymentData.choosePayment" name="ChoosePayment" />
    <input type="hidden" :value="paymentData.checkMacValue" name="CheckMacValue" />
    <input type="hidden" :value="paymentData.encryptType" name="EncryptType" />
    <input type="hidden" :value="paymentData.clientBackURL" name="ClientBackURL" />
  </form>

  <section id="checkout">
    <div class="container">
      <div class="row my-5 py-5 justify-content-center">
        <div class="col-md-12">
          <!-- 訂單內容 -->
          <h3 class="mb-4 text-center">訂單確認</h3>

          <div v-if="!productIds || productIds.length === 0" class="empty-cart-message text-center">
            <p>請至 <router-link to="/shop/cart">購物車</router-link> 選取商品。</p>
          </div>

          <div v-else>
            <div class="card card-bg">
              <div class="card-body">
                <table class="table align-middle text-center" style="table-layout: fixed; width: 100%;">
                  <thead>
                    <tr class="text-center">
                      <th style="width: 30%;" class="text-start">已選商品</th>
                      <th style="width: 20%;" class="text-start">規格</th>
                      <th style="width: 15%;">單價</th>
                      <th style="width: 10%;">數量</th>
                      <th style="width: 15%;">商品總價</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(cartItem, index) in cartItems" :key="index" class="border-bottom product">
                      <td>
                        <div class="d-flex align-items-center">
                          <img :src="`${PATH}/shop/productDetail/api/getPhoto?productId=${cartItem.product.id}`"
                            alt="Product Image" class="img-thumbnail" style="width: 100px;">
                          <div class="ms-3 text-start">
                            <h5><a :href="`/product/details/${cartItem.product.id}`" class="text-dark">{{
                              cartItem.product.productDetail.name }}</a></h5>
                          </div>
                        </div>
                      </td>
                      <td class="text-start">
                        <!-- 檢查 productColor 和 productSize 是否存在，再顯示它們的 name 屬性 -->
                        <p class="mb-0">顏色: {{ cartItem.product.productColor?.name || '無' }}</p>
                        <p class="mb-0">尺寸: {{ cartItem.product.productSize?.name || '無' }}</p>
                      </td>

                      <td class="px-3">
                        <span v-if="cartItem.product.discountPrice"
                          style="text-decoration: line-through;color: #999;">${{
                            cartItem.product.unitPrice }}</span>
                        <span :style="{ color: cartItem.product.discountPrice ? 'red' : '' }"> &nbsp;${{
                          cartItem.product.discountPrice || cartItem.product.unitPrice }}</span>
                      </td>
                      <td class="text-center px-3">{{ cartItem.quantity }}</td>
                      <td class="px-3">
                        <span v-if="cartItem.product.discountPrice"
                          style="text-decoration: line-through; color: #999;">${{ cartItem.product.unitPrice *
                            cartItem.quantity }}</span>
                        <span :style="{ color: cartItem.product.discountPrice ? 'red' : '' }"> &nbsp;${{
                          productTotal(cartItem) }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="container">
              <div class="row">
                <!-- 收件資訊同會員資訊 -->
                <div class="col-md-7">
                  <h3 class="mb-3 text-center">收件資訊</h3>
                  <div class="mb-3 d-flex align-items-center">
                    <input type="checkbox" class="form-check-input" id="sameMember" v-model="sameMember"
                      :checked="sameMember" @click="toggleSameMember" />
                    <label class="form-check-label ms-2" for="sameMember">同會員資訊</label>
                  </div>

                  <!-- 收件人姓名 -->
                  <div class="mb-3 d-flex align-items-center">
                    <label for="name" class="form-label me-3" style="min-width: 120px;">收件人姓名</label>
                    <input type="text" class="form-control" v-model="name" placeholder="請輸入收件人姓名" required
                      @input="handleUserInput('name')" />
                  </div>

                  <!-- 收件地址 -->
                  <div class="mb-2 d-flex align-items-center">
                    <label for="city" class="form-label me-3" style="min-width: 120px;">收件地址</label>
                    <select class="form-control" v-model="city" required style="height: 40px; width: 120px;"
                      @change="handleUserInput('city')">
                      <option value="" disabled>請選擇縣市</option>

                      <!-- 動態填充縣市 -->
                      <option v-for="(cityItem, index) in cities" :key="index" :value="cityItem">{{ cityItem }}</option>
                    </select>
                    <input type="text" class="form-control ms-3" v-model="street" placeholder="請輸入收件地址" required
                      style="height: 40px; flex-grow: 1;" @input="handleUserInput('street')" />
                  </div>

                  <!-- 同上次訂單收件地址 -->
                  <div class="mb-3 d-flex align-items-center" style="margin-left: 140px;">
                    <input type="checkbox" class="form-check-input" id="sameAddress" v-model="sameAddress"
                      :checked="sameAddress" @click="toggleSameAddress" />
                    <label class="form-check-label ms-2" for="sameAddress">最近一次訂單收件地址</label>

                    <!-- 顯示無上次訂單地址資訊的提示 -->
                    <span v-if="addressInfoMessage" style="color: #f59f3eea; font-size: 14px; margin-left: 10px;">
                      {{ addressInfoMessage }}
                    </span>

                  </div>
                  <!-- 收件人電話 -->
                  <div class="mb-3 d-flex align-items-center">
                    <label for="phone" class="form-label me-3" style="min-width: 120px;">收件人電話</label>
                    <input type="text" class="form-control" v-model="phone" placeholder="請輸入收件人電話" required
                      @input="validatePhone" />
                  </div>
                  <p v-if="phoneError" class="phone-message">{{ phoneError }}</p>

                  <!-- 運送方式 -->
                  <div class="mb-3 d-flex">
                    <label class="form-label me-3" style="min-width: 120px;">配送方式</label>
                    <div class="d-flex flex-column" v-for="(shipping, index) in shippingCategories" :key="index">
                      <div class="radio-container">
                        <input type="radio" :id="`shipping-${index}`" :value="shipping.id" v-model="selectedShipping"
                          required>
                        <label :for="`shipping-${index}`">
                          {{ shipping.name }}
                          (運費: {{ shipping.shippingCost.toFixed(0) }} 元), 預計送達: {{ shipping.shippingDay }} 天
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 優惠券 -->
                <div class="col-md-4 offset-md-1">
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
                          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
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
                                    <span>{{ coupon.discountType ? `－${(coupon.discountValue * 100).toFixed(0)}%` :
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

                  <!-- 付款方式 -->
                  <div class="card mt-5 mb-4">
                    <h3 class="mb-4 text-center">付款方式</h3>
                    <div class="d-flex justify-content-center gap-5 align-items-center" id="paymentCategoriesContainer">
                      <div v-for="(payment, index) in paymentCategories" :key="index">
                        <input type="radio" :id="`payment-${index}`" v-model="selectedPayment" :value="payment.id"
                          required>
                        <label :for="`payment-${index}`">{{ payment.name }}</label>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- 訂單總計區域 -->
            <div class="card">
              <div class="card-body">
                <h3 class="mb-4 text-center">訂單總金額</h3>
                <div class="d-flex justify-content-between">
                  <p>商品總金額</p>
                  <p class="subtotal">{{ formatCurrency(subtotal) }}</p>
                </div>
                <div class="d-flex justify-content-between">
                  <p>運費</p>
                  <p class="shipping-cost">{{ formatCurrency(shippingCost) }}</p>
                </div>
                <div class="d-flex justify-content-between">
                  <p>優惠折扣</p>
                  <p class="discount">- {{ formatCurrency(discountAmount) }}</p>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                  <h5>結帳總金額</h5>
                  <h5 class="final-total">{{ formatCurrency(finalTotal) }}</h5>
                </div>

                <div class="d-flex justify-content-center mt-4 submit-btn">

                  <router-link to="/shop/cart">
                    <button class="btn btn-secondary return-to-cart-btn"
                      style="width: 250px;height: 60px; margin-right: 100px; font-size: 18x;border-color: wheat;">返回購物車</button>
                  </router-link>

                  <button type="submit" class="btn"
                    style="width: 250px; height: 60px; font-size: 18x;font-weight: bold;" @click="submitOrder">
                    下訂單
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import axios from 'axios';
import { fetchCouponsForMember } from '@/api/shop/couponApi';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

import { useRoute } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/shop/cart";

const PATH = `${import.meta.env.VITE_API_URL}`;

const cartStore = useCartStore();
const authStore = useAuthStore();
const memberId = authStore.memberId;


const route = useRoute();
const productIds = route.query.productIds;  // 從購物車勾選商品後傳過來 // 

// API路徑
const URL = import.meta.env.VITE_API_URL;

// 建立 Router 物件
const router = useRouter();

//===========從checkout獲得購物車,商品總金額,運送方式,付款方式================
// 定義資料
const checkoutData = ref(null);
const selectedShipping = ref(null);
const selectedPayment = ref(null);
const cartItems = ref([]);
const subtotal = ref(0);
const shippingCategories = ref([]);
const paymentCategories = ref([]);

// 從後端獲取資料
const fetchCheckoutData = async () => {
  try {
    const response = await axios.get(`${URL}/shop/checkout?productIds=${productIds}&memberId=${memberId}`);
    checkoutData.value = response.data;
    cartItems.value = checkoutData.value.cartItems;
    subtotal.value = checkoutData.value.subtotal;
    shippingCategories.value = checkoutData.value.shippingCategories;
    paymentCategories.value = checkoutData.value.paymentCategories;
    console.log("checkoutData.value", checkoutData.value);
  } catch (error) {
    console.error("Error fetching checkout data:", error);
  }
};

// 計算每項商品總價
const productTotal = (cartItem) => {
  let discountPrice = cartItem.product.discountPrice;
  let unitPrice = cartItem.product.unitPrice;
  return (discountPrice || unitPrice) * cartItem.quantity;
};

// 頁面加載時獲取資料
onMounted(() => {
  fetchCheckoutData();
});

console.log("memberId");
//=========================運送資訊=============================

const sameMember = ref(false);
const sameAddress = ref(false);
const name = ref('');
const phone = ref('');
const city = ref('');
const street = ref('');

let memberData = null;
let addressData = null;
let cancelTokenSource = null;

//請求會員資料
async function fetchMemberData() {
  if (memberData) return memberData; // 已經存在資料，直接返回

  if (cancelTokenSource) {
    cancelTokenSource.cancel("Request canceled due to new request.");
  }

  cancelTokenSource = axios.CancelToken.source();

  try {
    const response = await axios({
      method: "GET",
      url: `${URL}/shop/member`,
      cancelToken: cancelTokenSource.token,
      params: {
        memberId: memberId
      },
    });

    memberData = response.data; // 儲存資料
    return memberData;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("Error fetching member data:", error);
    }
  }
}

//請求上一次訂單地址資料
async function fetchAddressData() {
  if (addressData) {
    return addressData;
  }

  if (cancelTokenSource) {
    cancelTokenSource.cancel("Request canceled due to new request.");
  }

  cancelTokenSource = axios.CancelToken.source();

  try {
    const response = await axios({
      method: "GET",
      url: `${URL}/shop/shipping/address`,
      cancelToken: cancelTokenSource.token,
      params: {
        memberId: memberId
      },
    });

    addressData = response.data;
    return addressData;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("Error fetching address data:", error);
    }
  }
}

// 填入會員資料
async function fillWithMemberInfo() {
  const member = await fetchMemberData();
  if (!member) return;

  name.value = member.name;
  phone.value = member.phone;

  let memberCity = "";
  let memberStreet = member.address;

  const cityKeyword = ["縣", "市", "島"];
  let cityIndex = -1;

  for (let keyword of cityKeyword) {
    cityIndex = member.address.indexOf(keyword);
    if (cityIndex !== -1) break;
  }

  if (cityIndex !== -1) {
    memberCity = member.address.substring(0, cityIndex + 1);
    memberStreet = member.address.substring(cityIndex + 1).trim();
  }

  city.value = memberCity;
  street.value = memberStreet;
}

const addressInfoMessage = ref('');  // 用來儲存顯示提示訊息

// 填入地址資料
async function fillWithLastOrderAddress() {
  const address = await fetchAddressData();
  if (!address) return;

  // 檢查 city 和 street 是否有值
  if (address.city && address.street) {
    city.value = address.city;
    street.value = address.street;
    addressInfoMessage.value = '';  // 如果有地址資料，清空提示訊息
  } else {
    addressInfoMessage.value = '查無上次訂單收件地址!';  // 顯示提示訊息
  }
}

//會員跟地址checkbox邏輯-sameMember
async function toggleSameMember() {
  sameMember.value = !sameMember.value;

  await nextTick();
  if (sameMember.value) {
    await fillWithMemberInfo();

    if (!addressData) {
      addressData = await fetchAddressData();
    }

    if (city.value !== addressData.city || street.value !== addressData.street) {
      sameAddress.value = false;
    }
  }
}

//會員跟地址checkbox邏輯-sameAddress
async function toggleSameAddress() {
  sameAddress.value = !sameAddress.value;

  await nextTick();
  if (sameAddress.value) {
    await fillWithLastOrderAddress();

    if (!addressData) {
      addressData = await fetchAddressData();
    }

    if (city.value !== addressData.city || street.value !== addressData.street) {
      sameMember.value = false;
    }
  } else {
    // 如果取消 `sameAddress` 且 `sameMember` 被勾選，則填充會員資料
    if (sameMember.value) {
      await fillWithMemberInfo();
    }
  }
}

// 使用者手動修改輸入欄位時，取消相應的勾選
function handleUserInput(field) {
  if (field === "name" || field === "phone") {
    sameMember.value = false; // 使用者改了 name，就取消勾選 sameMember
  }
  if (field === "city" || field === "street") {
    sameMember.value = false; // 當使用者修改地址欄位時，取消 sameMember 的勾選
    sameAddress.value = false; // 同時取消 sameAddress 的勾選
  }
}

// 定義縣市選項
const cities = [
  "台北市", "新北市", "基隆市", "台中市", "台南市", "高雄市", "桃園市",
  "新竹市", "新竹縣", "苗栗縣", "彰化縣", "南投縣", "雲林縣", "嘉義市",
  "嘉義縣", "屏東縣", "宜蘭縣", "台東縣", "花蓮縣", "澎湖縣", "金門縣",
  "連江縣", "馬祖列島"
];
//=====================電話================
const phoneError = ref("");
const validatePhone = () => {
  // 只允許輸入數字
  phone.value = phone.value.replace(/\D/g, "");

  // 限制最多10碼
  if (phone.value.length > 10) {
    phone.value = phone.value.slice(0, 10);
  }

  // 驗證格式（09開頭，10碼）
  const phoneRegex = /^09\d{8}$/;
  if (phone.value && !phoneRegex.test(phone.value)) {
    phoneError.value = "請輸入台灣地區有效的手機號碼（09XXXXXXXX）";
  } else {
    phoneError.value = "";
  }
};

//======================優惠券============================

const formatCurrency = (value) => {
  if (value == null || isNaN(value)) {
    return '$0';
  }
  return `$${value.toFixed(0)}`;
};

const availableCoupons = ref([]);
const notMeetCoupons = ref([]);

const isModalOpen = ref(false);
const selectedCoupon = ref(null);  // 儲存選擇的優惠券
const selectedCouponId = route.query.selectedCouponId || null;  // 購物車選擇的優惠券Id 

// 獲取優惠券
const fetchCoupons = async () => {
  try {
    const { availableCoupons: available, notMeetCoupons: notMeet } = await fetchCouponsForMember({ productIds: productIds, memberId: memberId }); // ***** 修改 *****

    availableCoupons.value = available;
    notMeetCoupons.value = notMeet;

    // 根據 selectedCouponId 找到對應的優惠券
    // 如果在購物車選到未滿額的，到了結帳頁會變成選擇優惠券
    if (selectedCouponId) {
      const coupon = availableCoupons.value.find(coupon => coupon.id === Number(selectedCouponId));
      if (coupon) {
        selectedCoupon.value = coupon;  // 更新選擇的優惠券
      }
    }

  } catch (error) {
    console.error('Error fetching coupons in Vue:', error);
  }

};

// 在組件加載時呼叫 fetchCoupons
onMounted(async () => {
  fetchCoupons();
});

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

const clearCoupon = () => {
  selectedCoupon.value = null;
  closeModal();
};

//==================金額計算=======================

//監聽運費
onMounted(() => {
  // 設置運費的選擇
  document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
      shippingCost.value = parseFloat(event.target.getAttribute('data-shipping-cost')) || 0;
    });
  });
});

const shippingCost = computed(() => {
  const selected = shippingCategories.value.find(s => s.id === selectedShipping.value);
  return selected ? selected.shippingCost : 0;
});

// 計算優惠券折扣金額
const discountAmount = computed(() => {
  if (!selectedCoupon.value) return 0;

  const coupon = selectedCoupon.value;

  // 轉換 discountType 為布林值
  const isPercentage = coupon.discountType === true;

  let discount = 0;

  // 如果是金額折扣
  if (!isPercentage) {
    discount = coupon.discountValue;
  } else {
    // 如果是百分比折扣
    discount = Math.round(subtotal.value * coupon.discountValue);
  }

  return discount;
});

// 監聽最終金額（總價、運費和折扣）
const finalTotal = computed(() => {
  return subtotal.value + shippingCost.value - discountAmount.value;
});

// 用來接收後端回傳的付款資料
const paymentData = ref({});
const ecpayForm = ref(null); // 綁定表單

//==================提交訂單=======================
const submitOrder = async () => {
  // 必填項目檢查
  if (!selectedShipping.value) {
    Swal.fire("錯誤", "請選擇運送方式！", "warning");
    return;
  }
  if (!selectedPayment.value) {
    Swal.fire("錯誤", "請選擇付款方式！", "warning");
    return;
  }
  if (!name.value.trim()) {
    Swal.fire("錯誤", "請填寫收件人姓名！", "warning");
    return;
  }
  if (!phone.value.trim()) {
    Swal.fire("錯誤", "請填寫收件人電話！", "warning");
    return;
  }
  if (!city.value) {
    Swal.fire("錯誤", "請選擇縣市！", "warning");
    return;
  }
  if (!street.value.trim()) {
    Swal.fire("錯誤", "請填寫詳細地址！", "warning");
    return;
  }

  // **彈出確認視窗**
  const result = await Swal.fire({
    title: "確定要提交訂單嗎？",
    text: "請確認訂單資訊無誤。",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "確定提交",
    cancelButtonText: "取消",
  });

  if (!result.isConfirmed) {
    return; // 取消提交
  }

  try {
    const orderData = {
      couponId: selectedCoupon.value ? selectedCoupon.value.id : null,
      shippingCategoryId: selectedShipping.value,
      paymentCategoryId: selectedPayment.value,
      paymentAmount: null,
      street: street.value,
      city: city.value,
      receiverName: name.value,
      receiverPhone: phone.value,
      cartItems: cartItems.value.map((item) => ({
        productId: item.product.id,
      })),
    };

    // **發送訂單建立請求**
    const response = await axios({
      method: "POST",
      url: `${URL}/shop/checkout`,
      data: orderData,
      withCredentials: true,
      params: {
        memberId: memberId
      },
      headers: {
        "Accept": "application/json",
      },
    });

    // **確認訂單建立成功，並取得 ECPay 付款資訊**
    if (response.data.message.includes("訂單建立成功")) {
      const orderId = response.data.orderId;

      if (selectedPayment.value === 1 && response.data.paymentData) {
        // **處理 ECPay 付款**
        paymentData.value = { ...response.data.paymentData };

        await nextTick(); // 等待 DOM 渲染完成

        if (ecpayForm.value) {
          setTimeout(() => {
            console.log("表單資料準備提交...");
            ecpayForm.value.submit(); // 用 ref 直接提交表單
          }, 500);
        } else {
          console.error("找不到表單！");
        }
      } else if (selectedPayment.value === 2) {
        // **處理貨到付款**
        Swal.fire({
          title: "訂單建立成功",
          text: `訂單成功！訂單編號：${orderId}`,
          icon: "success",
          showConfirmButton: false, // 移除取消按鈕
          timer: 1500, // 等待一段時間後自動跳轉
        }).then(() => {
          cartStore.fetchCartCount(memberId);
          router.push(`/shop/orderHistory`); // 直接跳轉
        });

      } else {
        Swal.fire("錯誤", "無法取得 ECPay 付款資訊", "error");
      }
    }
  } catch (error) {
    console.error(error); // 打印錯誤
    Swal.fire(
      "錯誤",
      "訂單建立失敗：" + (error.response?.data?.message || error.message),
      "error"
    );
  }
};


</script>
<style>
@import '/user_static/css/shop.css';
@import '/user_static/css/shop_checkout.css';
</style>
