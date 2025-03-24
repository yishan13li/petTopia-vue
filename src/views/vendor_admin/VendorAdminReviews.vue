<template>
  <div id="main-wrapper">
    <div class="content-body">
      <div class="container mt-4">
        <h4>
          總平均評分:
          <span id="overallRating" class="text-primary fw-bold">{{ overallRating }}</span>
        </h4>

        <!-- 評分圖表 -->
        <div class="chart-container mb-4">
          <canvas id="ratingChart" style="width: 80%; max-width: 800px; margin: auto;"></canvas>
        </div>


        <!-- 評價表格 -->
        <div class="table-responsive">
          <table id="reviewsTable" class="table table-bordered table-hover shadow-sm rounded">
            <thead class="text-light">
              <tr>
                <th>評論者</th>
                <th>評價時間</th>
                <th>評價內容</th>
                <th>平均評分</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="review in ratingsData.reviews" :key="review.id" v-if="ratingsData.reviews.length > 0"
                @click="toggleReviewDetails(review)">
                <td>{{ review.memberId }}</td>
                <td>{{ formatReviewDate(review.reviewTime) }}</td>
                <td>{{ review.reviewContent }}</td>
                <td>⭐ ({{ calculateAverageRating(review) }})</td>
                <td>
                  <button class="btn btn-danger btn-sm" @click="deleteReview($event, review.id)">刪除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 評論詳情卡片 -->
        <div v-if="reviewDetailVisible" class="review-card">
          <div class="card">
            <div class="card-header d-flex justify-content-between">
              <h5 class="mb-0">評論詳情</h5>
              <button class="btn-close" @click="reviewDetailVisible = false"></button>
            </div>
            <div class="card-body">
              <p><strong>環境評分：</strong> {{ generateStars(Math.round(selectedReview.ratingEnvironment)) }} ({{
                selectedReview.ratingEnvironment }})</p>
              <p><strong>價格評分：</strong> {{ generateStars(Math.round(selectedReview.ratingPrice)) }} ({{
                selectedReview.ratingPrice }})</p>
              <p><strong>服務評分：</strong> {{ generateStars(Math.round(selectedReview.ratingService)) }} ({{
                selectedReview.ratingService }})</p>
              <hr>
              <div class="photo-container">
                <img v-for="photoId in reviewPhotos" :key="photoId"
                  :src="`http://localhost:8080/review_photos/download?photoId=${photoId}`" alt="Review Photo"
                  class="review-photo" @click="showPhotoModal(photoId)">
              </div>
            </div>
          </div>
        </div>

        <!-- 圖片放大模態視窗 -->
        <div v-if="photoModalVisible" class="photo-modal" @click="photoModalVisible = false">
          <div class="photo-modal-content">
            <img :src="selectedPhoto" alt="Full Image">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import { Chart as ChartJS, LinearScale, BarController, BarElement, CategoryScale, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import DataTable from 'datatables.net-dt'
import 'datatables.net-dt/css/dataTables.dataTables.css'

ChartJS.register(LinearScale, ArcElement, BarController, BarElement, CategoryScale, Title, Tooltip, Legend)

const ratingsData = ref({ reviews: [] })
const overallRating = ref('-')
let myChart = null
let dataTable = null
const reviews = ref([]);

const reviewDetailVisible = ref(false)
const selectedReview = ref(null)
const reviewPhotos = ref([])
const photoModalVisible = ref(false)
const selectedPhoto = ref('')
const searchQuery = ref('')
const filteredReviews = ref([])
// 計算平均評分
const calculateAverageRating = (review) => {

  return ((review.ratingEnvironment + review.ratingPrice + review.ratingService) / 3).toFixed(1)
}

const fetchReviews = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/vendor_admin/review?vendorId=1', {
      headers: { 'Accept': 'application/json' }
    })
    ratingsData.value.reviews = response.data
    console.log("獲取的評論資料:", ratingsData.value.reviews)


    calculateOverallRating()
    updateChart()
    initializeDataTable()  // 初始化 DataTable

  } catch (error) {
    console.error('獲取評論資料失敗:', error)
  }
}

// 計算總平均評分
const calculateOverallRating = () => {
  let total = 0, count = ratingsData.value.reviews.length
  ratingsData.value.reviews.forEach(r => total += (r.ratingEnvironment + r.ratingPrice + r.ratingService) / 3)
  overallRating.value = count ? (total / count).toFixed(1) : '-'
}
const generateStars = (rating) => {
  let stars = ''
  for (let i = 0; i < 5; i++) {
    stars += i < rating ? '⭐ ' : ' '
  }
  return stars
}

// 更新評價圖表
const updateChart = () => {
  const canvas = document.getElementById('ratingChart')
  if (!canvas) {
    console.warn('找不到 ratingChart canvas，等待 DOM 加载...')
    return
  }

  const ctx = document.getElementById('ratingChart').getContext('2d')
  if (myChart) myChart.destroy()

  const avgEnv = (ratingsData.value.reviews.reduce((sum, r) => sum + r.ratingEnvironment, 0) / ratingsData.value.reviews.length).toFixed(1);
  const avgPrice = (ratingsData.value.reviews.reduce((sum, r) => sum + r.ratingPrice, 0) / ratingsData.value.reviews.length).toFixed(1);
  const avgService = (ratingsData.value.reviews.reduce((sum, r) => sum + r.ratingService, 0) / ratingsData.value.reviews.length).toFixed(1);
  const avgOverall = overallRating.value

  myChart = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels: ['環境', '價格', '服務', '總平均評分'],
      datasets: [{
        label: '平均評分',
        data: [avgEnv, avgPrice, avgService, avgOverall],
        backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 159, 64, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)'],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 5 }
      }
    }
  })
}

// 初始化 DataTables
const initializeDataTable = () => {
  nextTick(() => {
    if (dataTable) {
      dataTable.destroy()  // 销毁旧实例
    }
    dataTable = new DataTable('#reviewsTable', {
      pageLength: 5, // 每頁顯示 5 筆資料
      lengthMenu: [5, 10, 20, 50],
      searching: true, // 啟用搜尋
      ordering: true,  // 啟用排序
      responsive: true,
      language: {
        search: "搜尋：",
        lengthMenu: "顯示 _MENU_ 筆資料",
        info: "顯示第 _START_ 筆到第 _END_ 筆，共 _TOTAL_ 筆",
        paginate: {
          first: "首頁",
          previous: "上一頁",
          next: "下一頁",
          last: "最後一頁"
        }
      }
    })
  })
}

// 監聽數據變化，當評論數據更新時重新載入 DataTables
watch(ratingsData, () => {
  setTimeout(() => {
    if (ratingsData.value.reviews.length > 0) {
      initializeDataTable()
    }
  }, 100) // 避免 DataTables 還未能正確載入數據
})

// 顯示評論詳情
const toggleReviewDetails = (review) => {
  if (selectedReview.value && selectedReview.value.id === review.id) {
    reviewDetailVisible.value = false
    selectedReview.value = null
    reviewPhotos.value = []
    return
  }
  selectedReview.value = review
  reviewDetailVisible.value = true

  // 獲取評論照片
  axios.get(`http://localhost:8080/review_photos/ids?vendorReviewId=${review.id}`, {
    headers: { 'Accept': 'application/json' }
  })
    .then(response => {
      reviewPhotos.value = response.data
    })
    .catch(error => {
      console.error('獲取評論照片失敗:', error)
    })
}

// 顯示圖片放大視窗
const showPhotoModal = (photoId) => {
  selectedPhoto.value = `http://localhost:8080/review_photos/download?photoId=${photoId}`
  photoModalVisible.value = true
}

// 刪除評論
const deleteReview = (event, reviewId) => {
  event.stopPropagation()
  if (!confirm("確定要刪除此評論嗎？")) return

  axios.delete(`http://localhost:8080/api/vendor_admin/review/delete/${reviewId}`)
    .then(() => {
      // 先销毁 DataTable（如果已初始化）
      if (dataTable) {
        dataTable.destroy();
        dataTable = null;  // 确保 DataTable 变量重置
      }

      // 从本地数据中删除该项
      ratingsData.value.reviews = ratingsData.value.reviews.filter(review => review.id !== reviewId);
      // 等待 Vue DOM 更新后再重新初始化 DataTable
      nextTick(() => {
        initializeDataTable();
      });
      alert("刪除成功")
    })
    .catch(() => {
      alert("刪除評論失敗")
    })
}

// 格式化日期
const formatReviewDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`
}

onMounted(async () => {
  await fetchReviews()
  initializeDataTable()
})
</script>
<style scoped>
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

.review-detail {
  background: #fdfdfd;
  border-left: 5px solid #007bff;
  padding: 10px;
  margin-top: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.star {
  color: gold;
  font-size: 1.2em;
}

h4 {
  text-align: center;
}

.review-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  z-index: 1050;

  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

th {
  background-color: #F4D8B1 !important;
}

.card-header {
  background: #F4D8B1 !important;
  color: rgb(0, 1, 3) !important;
  padding: 12px 16px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  padding: 20px;
  font-size: 16px;
}

.photo-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.review-photo {
  max-width: 100px;
  max-height: 100px;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.photo-modal-content img {
  width: 800px;
  /* 设置一个固定宽度 */
  height: 600px;
  /* 设置一个固定高度 */
  object-fit: contain;
  /* 保持图片的纵横比 */
  border-radius: 10px;
}

.review-photo:hover {
  transform: scale(1.1);
}

.btn-close {
  position: absolute !important;
  top: 10px !important;
  right: 10px !important;
  background: none !important;
  border: none !important;
  font-size: 20px !important;
  cursor: pointer !important;
  color: #030000 !important;
  /* 確保顏色不會被覆蓋 */
  z-index: 1060 !important;
}

.btn-close:hover {
  color: #020000;
  /* 按鈕的懸停顏色 */
}

/* 圖片放大模態視窗 */
.photo-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.photo-modal-content img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
}

.container {
  width: 70%;
  max-width: 1800px;
  margin: auto;
  overflow-x: auto;
  /* 防止超出畫面 */
}
</style>