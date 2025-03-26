<template>
  <!-- 店家收藏 -->
  <div class="container mt-4">
    <h2 class="mb-3">#店家收藏列表</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>編號</th>
          <th>店家詳情</th>
          <th>店家名稱</th>
          <th>店家類別</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(like, index) in likeList" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <a :href="`/vendor/detail/${like.vendorId}`">{{ like.vendorName }}</a>
          </td>
          <td>{{ like.vendorCategory }}</td>
          <td>{{ like.vendorDescription }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteLike(like.id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <br />
  <!-- 店家收藏 -->

  <!-- 店家評論 -->
  <div class="container mt-4">
    <h2 class="mb-3">#店家評論列表</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>編號</th>
          <th>店家名稱</th>
          <th>評論時間</th>
          <th>評論內容</th>
          <th>環境評分</th>
          <th>價錢評分</th>
          <th>服務評分</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(review, index) in reviewList" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <a :href="`/vendor/detail/${review.vendorId}`">{{ review.vendorName }}</a>
          </td>
          <td>{{ review.reviewTime }}</td>
          <td>{{ review.reviewContent }}</td>
          <td>{{ review.ratingEnvironment }}</td>
          <td>{{ review.ratingPrice }}</td>
          <td>{{ review.ratingService }}</td>
          <td>
            <button class="btn btn-danger btn-sm">修改</button>
            <button
              class="btn btn-danger btn-sm"
              style="margin-left: 10px"
              @click="deleteReview(review.reviewId)"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <br />
  <!-- 店家評論 -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
const memberId = ref(11)

const likeList = ref([
  {
    id: 11,
    vendorId: 2,
    vendorName: '汪喵精品寵物用品',
    vendorDescription: '提供各種寵物食品與用品，滿足毛孩需求',
    vendorCategory: '寵物用品店',
  },
])

const reviewList = ref([
  {
    reviewId: 1,
    vendorName: '店家B',
    reviewTime: '2025-03-25',
    reviewContent: '測試',
    ratingEnvironment: 3,
    ratingPrice: 3,
    ratingService: 3,
  }, // 之後要補圖片
])

/* 1. 獲取收藏列表 */
const fetchActivityLike = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/vendor/member/${memberId.value}/like`)

    const data = await response.json()
    likeList.value = data
  } catch (error) {
    console.error('獲取收藏資料失敗:', error)
  }
}
onMounted(fetchActivityLike)

/* 2. 獲取評論列表 */
const fetchActivityReview = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/vendor/member/${memberId.value}/review`)

    const data = await response.json()
    reviewList.value = data
  } catch (error) {
    console.error('獲取評論資料失敗:', error)
  }
}
onMounted(fetchActivityReview)

/* 3. 取消收藏 */
const deleteLike = async (likeId) => {
  const ask = await Swal.fire({
    title: '確定取消？',
    icon: 'warning',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: '確認',
    cancelButtonText: '返回',
    reverseButtons: true,
  })
  if (!ask.isConfirmed) {
    return
  }

  try {
    const response = await fetch(`http://localhost:8080/api/vendor/like/${likeId}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await response.json()

    likeList.value = likeList.value.filter((like) => like.id !== likeId)
  } catch (error) {
    console.error('取消收藏失敗:', error)
  }
}

/* 5. 刪除評論 */
const deleteReview = async (reviewId) => {
  const ask = await Swal.fire({
    title: '確定刪除？',
    icon: 'warning',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: '確認',
    cancelButtonText: '返回',
    reverseButtons: true,
  })
  if (!ask.isConfirmed) {
    return
  }

  try {
    const response = await fetch(`http://localhost:8080/api/vendor/review/${reviewId}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await response.json()

    reviewList.value = reviewList.value.filter((review) => review.reviewId !== reviewId)
  } catch (error) {
    console.error('刪除評論失敗:', error)
  }
}
</script>

<style>
.container {
  max-width: 600px;
}
</style>
