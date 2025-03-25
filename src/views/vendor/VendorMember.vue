<template>
  <!-- 店家收藏 -->
  <div class="container mt-4">
    <h2 class="mb-3">店家收藏列表</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>流水號</th>
          <th>店家名稱</th>
          <th>店家類別</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vendor, index) in vendorList" :key="index">
          <td>{{ vendor.id }}</td>
          <td>{{ vendor.name }}</td>
          <td>{{ vendor.vendorCategory }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="removeStore(index)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- 店家收藏 -->

  <!-- 店家評論 -->
  <div class="container mt-4">
    <h2 class="mb-3">店家評論列表</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>流水號</th>
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
          <td>{{ review.id }}</td>
          <td>{{ review.vendorName }}</td>
          <td>{{ review.reviewTime }}</td>
          <td>{{ review.reviewContent }}</td>
          <td>{{ review.ratingEnvironment }}</td>
          <td>{{ review.ratingPrice }}</td>
          <td>{{ review.ratingService }}</td>
          <td>
            <button class="btn btn-danger btn-sm">修改</button>
            <button class="btn btn-danger btn-sm">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- 店家評論 -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const vendorList = ref([
  { id: 1, name: '店家A', vendorCategory: 'A' },
  { id: 2, name: '店家B', vendorCategory: 'A' },
  { id: 3, name: '店家C', vendorCategory: 'A' },
])

const reviewList = ref([
  {
    id: 1,
    vendorName: '店家A',
    reviewTime: '2025-03-25',
    reviewContent: '測試',
    ratingEnvironment: 3,
    ratingPrice: 3,
    ratingService: 3,
  }, // 之後要補圖片
  {
    id: 1,
    vendorName: '店家A',
    reviewTime: '2025-03-25',
    reviewContent: '測試',
    ratingEnvironment: 3,
    ratingPrice: 3,
    ratingService: 3,
  },
  {
    id: 1,
    vendorName: '店家A',
    reviewTime: '2025-03-25',
    reviewContent: '測試',
    ratingEnvironment: 3,
    ratingPrice: 3,
    ratingService: 3,
  },
])
</script>

<style>
.container {
  max-width: 600px;
}
</style>
