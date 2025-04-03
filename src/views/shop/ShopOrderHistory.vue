<template>
  <div class="container mt-5">
    <h2 class="text-center">歷史訂單查詢</h2>
    <form @submit.prevent="searchOrders">
      <div class="row mb-3">
        <div class="col-md-2 col-sm-2">
          <label>起始日期</label>
          <input type="date" class="form-control" v-model="filters.startDate" :max="today"
            @change="fetchOrderHistoryData">
        </div>
        <div class="col-md-2 col-sm-2">
          <label>結束日期</label>
          <input type="date" class="form-control" v-model="filters.endDate" :max="today"
            @change="fetchOrderHistoryData">
        </div>

        <div class="col-md-2 col-sm-3">
          <label>訂單狀態</label>
          <select class="form-control" v-model="filters.orderStatus" @change="fetchOrderHistoryData">
            <option value="">全部</option>
            <option value="待付款">待付款</option>
            <option value="待出貨">待出貨</option>
            <option value="配送中">配送中</option>
            <option value="待收貨">待收貨</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
          </select>
        </div>

        <div class="col-md-3 col-sm-3">
          <label>搜尋</label>
          <input type="text" class="form-control" v-model="filters.searchProduct" placeholder="請輸入訂單編號或商品名稱"
            @keydown.enter="fetchOrderHistoryData">
        </div>

        <div class="col-md-2 col-sm-2 d-flex align-items-end">
          <button type="submit" class="btn btn-secondary text-dark border-0"
            style="height: 37px; min-width: 60px; width: 60px; display: flex; justify-content: center; align-items: center; padding: 0;">
            查詢
          </button>
          <button type="button" class="btn btn-light text-dark border-0 ml-4" @click="clearFilters"
            style="height: 37px; min-width: 60px; width: 60px; margin-left:20px; background-color: #d3d3d3 !important;">
            清除
          </button>
        </div>
      </div>
    </form>

    <div class="container mt-4 mb-5">
      <div v-if="noContentMessage" class="no-content-message">
        {{ noContentMessage }}
      </div>
      <div v-for="order in currentPageOrders" :key="order.orderId" class="info-card mb-4">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>訂單編號 </strong>#{{ order.orderId }}
              <br>
              <strong>訂單日期：</strong>{{ order.createdTime }}
              <br>
              <strong>訂單狀態：</strong><span>{{ order.orderStatus }}</span>, <span><span>{{ order.paymentStatus === '付款失敗'
                ? '待付款' : order.paymentStatus }}</span></span>
              <br>
              <strong>訂單總計：</strong><span>NT$ {{ order.totalAmount }}</span>
            </div>
            <router-link :to="`/shop/orders/${order.orderId}`">
              <button class="btn detail-btn">查看詳情</button>
            </router-link>

          </div>
          <hr>
          <div v-for="item in order.orderItems" :key="item.orderId"
            class="border-bottom py-3 d-flex align-items-center">
            <img :src="'data:image/jpeg;base64,' + item.productPhoto" :alt="item.productPhoto" class="rounded"
              width="80" height="80">
            <div class="flex-grow-1 mx-3">
              <h6 class="mb-1">{{ item.productName }}</h6>
              <p class="text-muted small">顏色: {{ item.productColor || '無' }} | 尺寸: {{ item.productSize || '無' }}<br>
                單價：${{ item.discountPrice ? item.discountPrice : item.unitPrice }}
                <br>數量：{{ item.quantity }}
              </p>
            </div>
            <span class="mx-3">NT$ {{ item.totalPrice }}</span>
            <div class="d-flex flex-column justify-content-between align-items-end">

              <!-- 如果已經評論過，禁用按鈕 -->
              <span class="action-link" :class="{ 'disabled': item.hasReviewed }"
                @click="checkReviewStatus(item.productId)">
                我要評價
              </span>

              <!-- 商品評論 Modal -->
              <ShopProductReview v-if="selectedProduct" :productName="selectedProduct.productName"
                :productColor="selectedProduct.productColor" :productSize="selectedProduct.productSize"
                :productPhoto="selectedProduct.productPhoto" :index="index" @submit-review="submitReview"
                @close="closeModal" />

              <router-link :to="`/shop/productDetail/?productDetailId=${item.productDetailId}`"
                class="action-link"><span>再買一次</span></router-link>
            </div>
          </div>

        </div>
      </div>
    </div>

    <nav class="mb-5">
      <ul class="pagination justify-content-center">
        <!-- 第一頁 -->
        <li class="page-item" :class="{ disabled: filters.page === 1 }">
          <button class="page-link" @click="changePage(1)">«</button>
        </li>

        <!-- 上一頁 -->
        <li class="page-item" :class="{ disabled: filters.page === 1 }">
          <button class="page-link" @click="changePage(filters.page - 1)">‹</button>
        </li>

        <!-- 分頁號碼 -->
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === filters.page }">
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>

        <!-- 下一頁 -->
        <li class="page-item" :class="{ disabled: filters.page === totalPages }">
          <button class="page-link" @click="changePage(filters.page + 1)">›</button>
        </li>

        <!-- 最後一頁 -->
        <li class="page-item" :class="{ disabled: filters.page === totalPages }">
          <button class="page-link" @click="changePage(totalPages)">»</button>
        </li>
      </ul>
    </nav>


  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { fetchOrderHistory } from '@/api/shop/orderApi';
import ShopProductReview from './ShopProductReview.vue';
import { useAuthStore } from "@/stores/auth";
import { createProductReview, checkIfReviewed } from '@/api/shop/productReviewApi';
import Swal from 'sweetalert2';
const authStore = useAuthStore();
const memberId = authStore.memberId;

// =========訂單查詢過濾條件========

// 目前日期 (格式：yyyy-mm-dd)
const today = new Date().toISOString().split('T')[0];

const filters = ref({
  startDate: '',
  endDate: '',
  orderStatus: '',
  searchProduct: '',
  page: 1,
  size: 5,
});

// 清除篩選條件
const clearFilters = () => {
  filters.value.startDate = '';
  filters.value.endDate = '';
  filters.value.orderStatus = '';
  filters.value.searchProduct = '';
  fetchOrderHistoryData();
};

// 日期檢查方法
const validateDates = () => {
  if (filters.value.startDate && filters.value.endDate && filters.value.startDate > filters.value.endDate) {
    alert('起始日期不能大於結束日期');
    filters.value.startDate = ''; // 重設起始日期
  }
};

// 訂單列表
const orders = ref([]);
const noContentMessage = ref('')
const totalPages = ref(1); // 總頁數

// 取得訂單歷史資料
const fetchOrderHistoryData = async () => {

  try {
    const { orders: fetchedOrders, totalPages: fetchedTotalPages } = await fetchOrderHistory(filters.value, memberId);
    orders.value = fetchedOrders;
    totalPages.value = fetchedTotalPages;
    noContentMessage.value = orders.value.
      length === 0 ? '查無相關資訊' : '';

  } catch (error) {
    console.error('獲取訂單失敗:', error);
    orders.value = [];
    totalPages.value = 1;
    noContentMessage.value = '無法載入資料，請檢查網路或稍後再試';
  }
};


// 直接回傳從 API 取得的當前頁面資料
const currentPageOrders = computed(() => {
  return orders.value;
});

// 變更頁數
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    filters.value.page = newPage;  // 更新頁碼

    // 使用 nextTick 等待頁碼更新後再請求資料
    nextTick(() => {
      fetchOrderHistoryData();  // 確保在頁碼更新後再請求資料
    });
  }
};

// 當頁碼變更時，重新獲取訂單資料
watch(() => filters.value.page, (newPage) => {
  fetchOrderHistoryData();
});

// 提交表單時請求 API
const searchOrders = () => {
  filters.value.page = 1; // 每次搜尋時重設為第 1 頁
  fetchOrderHistoryData();
};

// 頁面載入時先取得一次訂單資訊
onMounted(() => {
  fetchOrderHistoryData();
});

//==============評論modal=================
const selectedProduct = ref(null);

const selectProduct = (productId) => {

  // 從 orders 中的每個 order 找到對應的 orderItem
  const selectedItem = orders.value
    .flatMap(order => order.orderItems)  // 展開每個訂單中的 orderItems
    .find(item => item.productId === productId);  // 根據 productId 查找商品

  // 確保找到商品後再更新 selectedProduct
  if (selectedItem) {
    selectedProduct.value = selectedItem;
  }

  // 顯示 Modal
  nextTick(() => {
    const modalElement = document.getElementById('reviewModal');
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();  // 顯示 Modal
  });
};


const closeModal = () => {
  const modalElement = document.getElementById('reviewModal');
  if (!modalElement) {
    return;
  }

  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) {
    modalInstance.hide(); // 只有 modal 存在時才執行隱藏
  } else {
    console.warn("modalInstance 為 null，無法執行 hide()");
  }

  selectedProduct.value = null; // 清空選中的商品
};


const submitReview = async (formData) => {

  try {

    const rating = formData.get('rating');
    const reviewDescription = formData.get('reviewDescription');
    const reviewPhotos = formData.getAll('reviewPhotos');

    const productId = selectedProduct.value.productId;

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
      const formDataToSend = new FormData();
      formDataToSend.append('rating', rating);
      formDataToSend.append('reviewDescription', reviewDescription);
      formDataToSend.append('memberId', memberId);

      // 添加圖片到 FormData
      reviewPhotos.forEach((file, index) => {
        formDataToSend.append('reviewPhotos', file);  // 這裡將每個圖片都加入 FormData
      });

      const result = await createProductReview(productId, formDataToSend);
      if (result?.status === 201 || result?.status === 200) {  // 修正判斷條件
        await Swal.fire({
          title: '評論提交成功',
          html: `評分：${rating}<br>內容：${reviewDescription}`,
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });

        // 添加「前往查看評論」按鈕
        await Swal.fire({
          title: '評論成功!',
          text: '您可以查看您的評論。',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: '前往查看評論',
          cancelButtonText: '前往歷史訂單',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `/shop/member/product/review`;
          } else {
            closeModal();
          }
        });
      } else {
        console.error("評論提交失敗，API 回應:", result);
        throw new Error("評論提交失敗");
      }
    } else {
      console.log("評論提交已取消");
    }
  } catch (error) {
    // 當錯誤發生時處理錯誤
    if (error.response && error.response.status === 400) {
      // 當收到 400 錯誤並且返回的訊息是 "您已經評論過該商品"
      await Swal.fire({
        title: '提交失敗',
        text: error.response.data, // 從後端接收到的錯誤訊息
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } else {
      // 其他錯誤
      await Swal.fire({
        title: '提交失敗',
        text: '評論提交失敗，請稍後再試。',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
};

//是否已評論過該商品
const checkReviewStatus = async (productId) => {
  const result = await checkIfReviewed(productId, memberId);
  if (result.hasReviewed) {
    Swal.fire({
      icon: 'info',
      title: '您已經評論過該商品',
      timer: 1200,
      showConfirmButton: false,
    });
  } else {
    selectProduct(productId);
  }
};


</script>

<style scoped>
@import '/user_static/css/shop_order_history.css';
</style>