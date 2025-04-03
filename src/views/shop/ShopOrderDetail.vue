<template>
  <div v-if="orderDetails" class="container mt-5" style="max-width: 1000px;">
    <h2 class="text-center">您的訂單已提交</h2>

    <div class="card mt-4">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">訂單編號 #<span>{{ orderDetails.orderId }}</span></h5>
          <h5 class="mb-0 text-end">訂單日期: {{ orderDetails.createdTime }}</h5>
        </div>
        <h5 class="mt-3">訂單狀態: {{ orderDetails.orderStatus }}, {{ orderDetails.paymentInfo.paymentStatus }}</h5>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-body">
        <h4>訂單資訊</h4>
        <table class="table" style="table-layout: fixed; width: 100%;">
          <thead>
            <tr>
              <th style="width: 40%;" class="text-start">商品</th>
              <th style="width: 15%;" class="text-center">數量</th>
              <th style="width: 20%;" class="text-center">單價</th>
              <th style="width: 25%;" class="text-center">商品總價</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in orderDetails.orderItems" :key="index">
              <td class="d-flex align-items-center">
                <img :src="'data:image/jpeg;base64,' + product.productPhoto" alt="Product" class="img-thumbnail me-3"
                  style="width: 80px;">

                <div>
                  <span class="fw-bold">{{ product.productName }}</span><br>
                  <span class="text-muted" style="font-size: 0.9em;">
                    顏色: {{ product.productColor || '無' }} | 尺寸: {{ product.productSize || '無' }}
                  </span>
                </div>
              </td>
              <td class="text-center" style="vertical-align: middle;">{{ product.quantity }}</td>
              <td class="text-center" style="vertical-align: middle;">
                <!-- 顯示原價並劃掉 -->
                <span v-if="product.discountPrice" style="text-decoration: line-through; color: #999;">
                  ${{ product.unitPrice }}
                </span>
                <!-- 顯示折扣價格或原價 -->
                <span :style="{ color: product.discountPrice ? 'red' : '' }">
                  &nbsp;${{ product.discountPrice || product.unitPrice }}
                </span>
              </td>
              <td class="text-center" style="vertical-align: middle;">
                <!-- 顯示原價乘以數量並劃掉 -->
                <span v-if="product.discountPrice" style="text-decoration: line-through; color: #999;">
                  ${{ product.unitPrice * product.quantity }}
                </span>
                <!-- 顯示折扣價格乘以數量或原價乘以數量 -->
                <span :style="{ color: product.discountPrice ? 'red' : '' }">
                  &nbsp;${{ product.discountPrice ? product.discountPrice * product.quantity : product.unitPrice *
                    product.quantity }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>



    <div class="card mt-4">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mb-4">配送與付款資訊</h4>
        </div>
        <p><strong>收件人姓名:</strong> {{ orderDetails.shippingInfo.receiverName }}</p>
        <p><strong>收件人電話:</strong> {{ orderDetails.shippingInfo.receiverPhone }}</p>
        <p><strong>收件地址:</strong> {{ orderDetails.shippingInfo.city }}{{ orderDetails.shippingInfo.street }}</p>
        <p><strong>配送方式:</strong> {{ orderDetails.shippingInfo.shippingCategory }}</p>
        <p><strong>付款方式:</strong> {{ orderDetails.paymentInfo.paymentCategory }}</p>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-body">
        <h4 class="mb-4">訂單總計</h4>
        <p><strong>商品總額:</strong> <span class="float-end">${{ orderDetails.subtotal }}</span></p>
        <p><strong>運費:</strong> <span class="float-end">${{ orderDetails.shippingFee }}</span></p>
        <p><strong>優惠折扣:</strong> <span class="float-end">- ${{ orderDetails.discountAmount }}</span></p>
        <hr>
        <h5><strong>應付總額:</strong> <span class="float-end">${{ orderDetails.totalAmount }}</span></h5>
      </div>
    </div>
  </div>

  <div class="d-flex justify-content-center align-items-center gap-5 mt-4 mb-5">
    <div :title="!canCancel ? '此訂單不可進行此操作，請聯繫客服人員' : ''">
      <!-- 取消訂單按鈕 -->
      <button type="button" class="btn btn-secondary px-5 py-3" style="min-width: 180px;"
        @click="canCancel ? cancelOrder(orderId, memberId) : null" :disabled="!canCancel">
        取消訂單
      </button>
    </div>

    <!-- 查看歷史訂單 -->
    <router-link to="/shop/orderHistory" class="btn px-5 py-3 ">
      查看歷史訂單
    </router-link>

    <!-- 繼續購物 -->
    <router-link to="/shop/products" class="btn px-5 py-3" style="min-width: 180px;">
      繼續購物
    </router-link>
  </div>

  <div v-if="!orderDetails" class="text-center mt-5">
    <p>正在載入訂單資料...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchOrderDetails } from '@/api/shop/orderApi';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const memberId = authStore.memberId;

// API路徑
const URL = import.meta.env.VITE_API_URL;

//router
const router = useRouter();

//使用路由
const route = useRoute();

const orderDetails = ref(null);
const orderId = route.params.orderId;

onMounted(async () => {
  try {
    const data = await fetchOrderDetails(orderId, memberId);  // 使用 fetchOrderDetails 函數來獲取訂單詳細資料
    orderDetails.value = data;
  } catch (error) {
    console.error('無法載入訂單資料:', error);
  }
});

//判斷是否可以取消訂單
const canCancel = computed(() => {
  if (!orderDetails.value) return false;

  const orderStatus = orderDetails.value.orderStatus; // 訂單狀態
  const paymentStatus = orderDetails.value.paymentInfo.paymentStatus; // 付款狀態
  const paymentCategory = orderDetails.value.paymentInfo.paymentCategory; // 付款方式

  // 訂單狀態為「已取消」，不可取消
  if (orderStatus === '已取消') return false;

  return (
    (paymentCategory === '信用卡付款' && paymentStatus === '待付款') || // 信用卡 & 待付款
    (paymentCategory === '貨到付款' && orderStatus === '待出貨') // 貨到付款 & 待出貨
  );
});

const cancelOrder = async (orderId, memberId) => {
  try {
    // 顯示 SweetAlert 確認對話框
    const result = await Swal.fire({
      title: '確定要取消訂單嗎?',
      text: '取消後無法復原',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定取消',
      cancelButtonText: '取消'
    });

    // 如果使用者選擇確定
    if (result.isConfirmed) {
      const response = await axios.put(`${URL}/shop/orders/${orderId}/cancel`, null, {
        params: {
          memberId: memberId
        }
      });

      if (response.status === 200) {
        Swal.fire('成功!', '訂單已取消', 'success');
        router.push('/shop/orderHistory');
      }
    } else {
      Swal.fire('已取消', '訂單未取消', 'info');
    }
  } catch (error) {
    console.error('無法取消訂單:', error);
    Swal.fire('錯誤', '無法取消訂單', 'error');
  }
};

</script>

<style scoped>
.btn {
  border-color: #eecda2 !important;
  background-color: #eecda2 !important;
}

/* hover 效果 */
.btn:hover {
  background-color: #f8d1a3 !important;
  /* 稍微變深的顏色 */
  color: #fff !important;
}
</style>
