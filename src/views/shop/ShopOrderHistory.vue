<template>
  <div class="container mt-5">
    <h2 class="text-center">歷史訂單查詢</h2>
    <form @submit.prevent="searchOrders">
      <div class="row mb-3">
        <div class="col-md-2 col-sm-2">
          <label>起始日期</label>
          <input type="date" class="form-control" v-model="filters.startDate" :max="today" @change="validateDates">
        </div>
        <div class="col-md-2 col-sm-2">
          <label>結束日期</label>
          <input type="date" class="form-control" v-model="filters.endDate" :max="today" @change="validateDates">
        </div>

        <div class="col-md-2 col-sm-3">
          <label>訂單狀態</label>
          <select class="form-control" v-model="filters.orderStatus">
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
          <input type="text" class="form-control" v-model="filters.searchProduct" placeholder="請輸入訂單編號或商品名稱">
        </div>

        <div class="col-md-2 col-sm-2 d-flex align-items-end">
          <button type="submit" class="btn btn-secondary text-dark border-0"
            style="height: 37px; width: 60px; display: flex; justify-content: center; align-items: center; padding: 0;">
            查詢
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
          <div v-for="item in order.orderItems" :key="item.id" class="border-bottom py-3 d-flex align-items-center">
            <img :src="item.productPhoto" :alt="item.productPhoto" class="rounded" width="80" height="80">
            <div class="flex-grow-1 mx-3">
              <h6 class="mb-1">{{ item.productName }}</h6>
              <p class="text-muted small">顏色: {{ item.productColor || '無' }} | 尺寸: {{ item.productSize || '無' }}<br>
                單價：${{ item.discountPrice ? item.discountPrice : item.unitPrice }}
                <br>數量：{{ item.quantity }}
              </p>
              <p></p>
            </div>
            <span class="mx-3">NT$ {{ item.totalPrice }}</span>
            <div class="d-flex flex-column justify-content-between align-items-end">
              <span class="action-link" @click="leaveReview(item.id)">我要評論</span>
              <span class="action-link" @click="reorder(item.id)">再買一次</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <nav class="mb-5">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: filters.page === 1 }">
          <button class="page-link" @click="changePage(filters.page - 1)">«</button>
        </li>

        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === filters.page }">
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>

        <li class="page-item" :class="{ disabled: filters.page === totalPages }">
          <button class="page-link" @click="changePage(filters.page + 1)">»</button>
        </li>
      </ul>
    </nav>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { fetchOrderHistory } from '@/api/shop/orderApi';

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
    const { orders: fetchedOrders, totalPages: fetchedTotalPages } = await fetchOrderHistory(filters.value);
    orders.value = fetchedOrders;
    totalPages.value = fetchedTotalPages;
    noContentMessage.value = orders.value.length === 0 ? '查無相關資訊' : '';
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

</script>

<style scoped>
@import '/user_static/css/shop_order_history.css';
</style>