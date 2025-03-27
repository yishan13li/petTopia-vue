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
          <th>評論圖片</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(review, index) in reviewList" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <a :href="`/vendor/detail/${review.vendorId}`">{{ review.vendorName }}</a>
          </td>
          <td>{{ formatReviewDate(review.reviewTime) }}</td>
          <td>{{ review.reviewContent }}</td>
          <td>{{ review.ratingEnvironment }}</td>
          <td>{{ review.ratingPrice }}</td>
          <td>{{ review.ratingService }}</td>
          <td>XXX</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="openReview(review.reviewId)">修改</button>
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

  <!-- 留言修改視窗 -->
  <div v-if="isPopupReviewVisible" class="overlay">
    <div class="popup-review">
      <h3><b>修改評論</b></h3>
      <form>
        <input v-model="review.content" placeholder="輸入感想" style="width: 200px" required />
        <br />

        <div>環境：<input v-model="review.ratingEnvironment" type="number" min="1" max="5" /></div>
        <div>價格：<input v-model="review.ratingPrice" type="number" min="1" max="5" /></div>
        <div>服務：<input v-model="review.ratinService" type="number" min="1" max="5" /></div>

        <input
          type="file"
          multiple
          @change="handleFileUpload"
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        />

        <div class="scroll-container">
          <!-- 原有圖片 -->
          <div v-if="originReviewPhotoList.length != 0">=== 原有圖片 ===</div>
          <div class="image-preview">
            <div
              v-for="(photo, index) in originReviewPhotoList"
              :key="index"
              class="image-container"
            >
              <img
                :src="photo.photoBase64"
                alt="選擇的圖片"
                class="preview-img"
                v-if="!removeImageList.includes(photo.id)"
              />
              <button
                type="button"
                class="img-button"
                @click="removeOriginImage(photo.id)"
                v-if="!removeImageList.includes(photo.id)"
              >
                刪除
              </button>
            </div>
          </div>
          <!-- 原有圖片 -->

          <!-- 新增圖片 -->
          <div v-if="reviewPhotos.length != 0">=== 新增圖片 ===</div>
          <div class="image-preview">
            <div v-for="(photo, index) in reviewPhotos" :key="index" class="image-container">
              <img :src="photo.previewUrl" alt="選擇的圖片" class="preview-img" />
              <button type="button" class="img-button" @click="removeImage(index)">刪除</button>
            </div>
          </div>
          <!-- 新增圖片 -->
        </div>
        <br />

        <button
          type="button"
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          @click="closeReview()"
        >
          取消
        </button>
        &emsp;
        <button
          type="button"
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          @click="resetComment()"
        >
          重設
        </button>
        &emsp;
        <button
          type="button"
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          @click="submitRewirte"
        >
          修改
        </button>
      </form>
    </div>
  </div>
  <!-- 留言修改視窗 -->
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

/* 4. 修改評論 */
const review = ref({
  memberId: '',
  content: '',
  ratingEnvironment: '',
  ratingPrice: '',
  ratinService: '',
  reviewPhotos: [],
})
const reviewPhotos = ref([])
const isPopupReviewVisible = ref(false)
const rewriteReviewId = ref(0) // 此全域變數為修改留言送出之使用
const originReviewPhotoList = ref([])
const removeImageList = ref([])

const closeReview = async () => {
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
  isPopupReviewVisible.value = false
  removeImageList.value = []
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)

  const newPhotos = files.map((file) => ({
    file,
    previewUrl: URL.createObjectURL(file),
  }))

  reviewPhotos.value.push(...newPhotos)
}

const removeImage = (index) => {
  URL.revokeObjectURL(reviewPhotos.value[index].previewUrl)
  reviewPhotos.value.splice(index, 1)
}

const removeOriginImage = (photoId) => {
  if (!removeImageList.value.includes(photoId)) {
    removeImageList.value.push(photoId)
  }
  console.log(removeImageList.value)
}

const openReview = async (reviewId) => {
  isPopupReviewVisible.value = true
  rewriteReviewId.value = reviewId // 存到全域變數

  const response1 = await fetch(`http://localhost:8080/api/vendor/review/${reviewId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  const result1 = await response1.json()
  review.value.content = result1.review.reviewContent
  review.value.ratingEnvironment = result1.review.ratingEnvironment
  review.value.ratingPrice = result1.review.ratingPrice
  review.value.ratinService = result1.review.ratingService

  const response2 = await fetch(`http://localhost:8080/api/vendor/review/${reviewId}/photo`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  const result2 = await response2.json()
  originReviewPhotoList.value = result2
}

const submitRewirte = async () => {
  const ask = await Swal.fire({
    title: '確定修改？',
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

  const formData = new FormData()
  formData.append('ratingEnv', review.value.ratingEnvironment)
  formData.append('ratingPrice', review.value.ratingPrice)
  formData.append('ratingService', review.value.ratinService)
  formData.append('content', review.value.content)
  formData.append('deletePhotoIds', removeImageList.value.length > 0 ? removeImageList.value : [0])

  reviewPhotos.value.forEach(({ file }) => {
    formData.append('reviewPhotos', file)
  })

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/review/${rewriteReviewId.value}/rewrite/final`,
      {
        method: 'PUT',
        body: formData,
      }
    )

    await Swal.fire({
      title: '修改成功',
      icon: 'success',
      confirmButtonText: '確定',
    })
    window.location.reload()
  } catch (error) {
    console.error('提交失敗:', error)
    alert('留言修改失敗，請重試！')
  }
}

const resetComment = async () => {
  const ask = await Swal.fire({
    title: '確定重置？',
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

  const response1 = await fetch(
    `http://localhost:8080/api/vendor/review/${rewriteReviewId.value}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  const result1 = await response1.json()
  review.value.content = result1.review.reviewContent
  review.value.ratingEnvironment = result1.review.ratingEnvironment
  review.value.ratingPrice = result1.review.ratingPrice
  review.value.ratinService = result1.review.ratingService

  const response2 = await fetch(
    `http://localhost:8080/api/vendor/review/${rewriteReviewId.value}/photo`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  const result2 = await response2.json()
  originReviewPhotoList.value = result2

  removeImageList.value = []
  reviewPhotos.value = []
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

/* 6. 時間轉換 */
const formatReviewDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? '下午' : '上午'
  hours = hours % 12 || 12
  return `${year}年${month}月${day}日 ${period} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
}
</script>

<style>
.container {
  max-width: 600px;
}
</style>
