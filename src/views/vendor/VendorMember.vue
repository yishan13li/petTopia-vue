<template>
  <div class="profile-page">
    <div class="container-fluid py-4">
      <div class="page-container">
        <ProfileSidebar />
        <div class="main-container">
          <nav>
            <h1 class="mb-3">店家管理</h1>
            <button class="btn btn-primary" @click="switchLikePage()" style="margin-right: 20px">
              收藏
            </button>
            <button class="btn btn-primary" @click="switchReviewPage()">評論</button>
          </nav>
          <!-- 店家收藏 -->
          <div class="container mt-4" v-if="isLikeVisible">
            <h2 class="mb-3">店家收藏列表</h2>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>編號</th>
                  <th>店家名稱</th>
                  <th>店家類別</th>
                  <th>店家詳情</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(like, index) in likeList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <a :href="`/vendor/detail/${like.vendorId}`"
                      ><span v-if="like.vendorName">{{ like.vendorName }}</span>
                      <span v-else style="color: #cfcfcf"> 無店家名稱 </span></a
                    >
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
          <!-- 店家收藏 -->

          <!-- 店家評論 -->
          <div class="container mt-4" v-if="isReviewVisible">
            <h2 class="mb-3">店家評論列表</h2>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>編號</th>
                  <th>店家名稱</th>
                  <th>評論內容</th>
                  <th>環境評分</th>
                  <th>價錢評分</th>
                  <th>服務評分</th>
                  <th>評論圖片</th>
                  <th>評論時間</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(review, index) in reviewList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <a :href="`/vendor/detail/${review.vendorId}`"
                      ><span v-if="review.vendorName">{{ review.vendorName }}</span>
                      <span v-else style="color: #cfcfcf"> 無店家名稱 </span></a
                    >
                  </td>
                  <td>{{ review.reviewContent }}</td>
                  <td>{{ review.ratingEnvironment }}</td>
                  <td>{{ review.ratingPrice }}</td>
                  <td>{{ review.ratingService }}</td>
                  <td>
                    <span
                      class="hover-area"
                      @click="openReviewPhoto(review.reviewId, index)"
                      v-if="review.reviewPhotos?.length"
                      >{{ review.reviewPhotos?.length }}張</span
                    ><span v-else>0張</span>
                  </td>
                  <td>{{ formatDate(review.reviewTime) }}</td>
                  <td>
                    <button
                      class="btn btn-danger btn-sm"
                      @click="openReview(review.reviewId, index)"
                    >
                      修改
                    </button>
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
        </div>
      </div>
    </div>
  </div>

  <!-- 留言修改視窗 -->
  <div v-if="isPopupReviewVisible" class="overlay">
    <div class="popup-review">
      <h3><b>修改評論</b></h3>
      <div style="margin-bottom: 5px">評論編號：{{ reviewIndexId }}</div>

      <form>
        <textarea
          v-model="review.content"
          placeholder="輸入感想"
          style="width: 400px; height: 100px"
          required
        ></textarea>
        <br />

        <div>
          環境：<input v-model="review.ratingEnvironment" type="number" min="1" max="5" />
          價格：<input v-model="review.ratingPrice" type="number" min="1" max="5" /> 服務：<input
            v-model="review.ratinService"
            type="number"
            min="1"
            max="5"
          />
        </div>
        <br />

        <input
          type="file"
          multiple
          @change="handleFileUpload"
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          style="margin-bottom: 20px"
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
                width="100"
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
              <img :src="photo.previewUrl" alt="選擇的圖片" class="preview-img" width="100" />
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

  <!-- 評論圖片視窗 -->
  <div v-if="isPopupPhotoVisible" class="overlay">
    <div class="popup-review">
      <h3><b>評論圖片</b></h3>
      <div></div>
      <span
        v-for="(photo, index) in originReviewPhotoList"
        :key="index"
        class="image-container"
        style="margin: 10px"
      >
        <img :src="photo.photoBase64" alt="評論圖片" width="100" />
      </span>
      <div>
        <button
          type="button"
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          @click="closePhoto()"
          style="margin: 5px"
        >
          關閉
        </button>
      </div>
    </div>
  </div>
  <!-- 評論圖片視窗 -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import ProfileSidebar from '@/components/ProfileSidebar.vue'
const authStore = useAuthStore()
const authMemberId = authStore.memberId
let memberId = ref(authMemberId)

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
const reviewIndexId = ref() // 此全域變數為留言列表流水號

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

const openReview = async (reviewId, index) => {
  isPopupReviewVisible.value = true
  rewriteReviewId.value = reviewId // 存到全域變數
  reviewIndexId.value = index + 1

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
const formatDate = (dateString) => {
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

/* 7. 頁面切換按鈕 */
const isLikeVisible = ref(true)
const isReviewVisible = ref(false)

const switchLikePage = () => {
  isLikeVisible.value = true
  isReviewVisible.value = false
}

const switchReviewPage = () => {
  isLikeVisible.value = false
  isReviewVisible.value = true
}

/* 8. 開啟評論圖片 */
const isPopupPhotoVisible = ref(false)
const openReviewPhoto = async (reviewId, index) => {
  isPopupPhotoVisible.value = true
  rewriteReviewId.value = reviewId // 存到全域變數
  reviewIndexId.value = index + 1

  const response = await fetch(`http://localhost:8080/api/vendor/review/${reviewId}/photo`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  const result = await response.json()
  originReviewPhotoList.value = result
}

const closePhoto = () => {
  isPopupPhotoVisible.value = false
}
</script>

<style scoped>
/* 限制表格最大寬度 */
.table-container {
  max-width: 800px;
  /* 可依需求調整 */
  overflow-x: auto;
  /* 若超出則允許橫向滾動 */
}

/* 頁面容器樣式 */
.profile-page {
  background: url('/user_static/images/background-img.png') no-repeat center center/cover;
  min-height: calc(100vh - 60px);
  width: 100%;
  margin: 0;
  padding: 0;
}

.container-fluid {
  width: 100%;
  max-width: 100%;
  padding: 0 2%;
}

.page-container {
  display: flex;
  width: 100%;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

/* 主內容區域樣式 */
.main-container {
  position: relative;
  flex: 1;
  min-width: 0;
  /* 防止flex子項溢出 */
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* 遮罩層樣式 */
.overlay {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;

  z-index: 100;
}

/* 彈出框樣式 */
.popup-review {
  background: white !important;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;

  width: 500px;
  max-width: 90%;
  z-index: 110;
}

/* 上傳圖片預覽 */
.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}
.image-container {
  position: relative;
}
.preview-img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}
.img-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: red;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 4px;
}

.hover-area {
  cursor: zoom-in;
}
</style>
