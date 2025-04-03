<template>
  <div class="profile-page">
    <div class="container-fluid py-4">
      <div class="page-container">
        <ProfileSidebar />
        <div class="main-container">
          <nav>
            <h1 class="mb-3">活動管理</h1>
            <button class="btn btn-primary" @click="switchLikePage()" style="margin-right: 20px">
              收藏
            </button>
            <button class="btn btn-primary" @click="switchReviewPage()" style="margin-right: 20px">
              評論
            </button>
            <button class="btn btn-primary" @click="switchRegistrationPage">報名</button>
          </nav>
          <!-- 活動收藏 -->
          <div class="container mt-4" v-if="isLikeVisible">
            <h2 class="mb-3">活動收藏列表</h2>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>編號</th>
                  <th>活動名稱</th>
                  <th>活動類別</th>
                  <th>開始時間</th>
                  <th>結束時間</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(like, index) in likeList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <a :href="`/activity/detail/${like.vendorActivity.id}`">{{
                      like.vendorActivity.name
                    }}</a>
                  </td>
                  <td>{{ like.vendorActivity.activityType.name }}</td>
                  <td>{{ formatDate(like.vendorActivity.startTime) }}</td>
                  <td>{{ formatDate(like.vendorActivity.endTime) }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="deleteLike(like.id)">刪除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 活動收藏 -->

          <!-- 活動評論 -->
          <div class="container mt-4" v-if="isReviewVisible">
            <h2 class="mb-3">活動評論列表</h2>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>編號</th>
                  <th>活動名稱</th>
                  <th>評論內容</th>
                  <th>評論時間</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(review, index) in reviewList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <a :href="`/activity/detail/${review.vendorActivity.id}`">{{
                      review.vendorActivity.name
                    }}</a>
                  </td>

                  <!-- 判斷是否在編輯模式 -->
                  <td v-if="editIndex === index">
                    <input v-model="editedContent" class="form-control" />
                  </td>
                  <td v-else>{{ review.reviewContent }}</td>
                  <!-- 判斷是否在編輯模式 -->

                  <td>{{ formatDate(review.reviewTime) }}</td>

                  <td>
                    <!-- 編輯模式 -->
                    <template v-if="editIndex === index">
                      <button
                        class="btn btn-success btn-sm"
                        @click="confirmEdit(review.id, editedContent, index)"
                      >
                        確認
                      </button>
                      <button
                        class="btn btn-secondary btn-sm"
                        @click="cancelEdit"
                        style="margin-left: 5px"
                      >
                        取消
                      </button>
                    </template>
                    <!-- 編輯模式 -->

                    <!-- 非編輯模式 -->
                    <button
                      v-else
                      class="btn btn-primary btn-sm"
                      @click="editReview(index, review.reviewContent)"
                    >
                      修改
                    </button>
                    <!-- 非編輯模式 -->

                    <button
                      class="btn btn-danger btn-sm"
                      @click="deleteReview(review.id)"
                      style="margin-left: 10px"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 活動評論 -->

          <!-- 活動報名 -->
          <div class="container mt-4" v-if="isRegistrationVisible">
            <h2 class="mb-3">活動報名列表</h2>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>編號</th>
                  <th>活動名稱</th>
                  <th>報名時間</th>
                  <th>報名狀態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(registration, index) in registrationList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <a :href="`/activity/detail/${registration.vendorActivity.id}`">{{
                      registration.vendorActivity.name
                    }}</a>
                  </td>
                  <td>{{ formatDate(registration.registrationTime) }}</td>
                  <td v-if="registration.status == 'confirmed'">成功</td>
                  <td v-else>審核中</td>

                  <td>
                    <button
                      class="btn btn-danger btn-sm"
                      @click="deleteRegistration(registration.id)"
                    >
                      取消
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <!-- 活動報名 -->
        </div>
      </div>
    </div>
  </div>
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
    id: 1,
    vendorActivity: {
      id: 3,
      name: '新品試吃會',
      description: '提供新款寵物食品試吃，讓毛孩找到最愛的口味',
      startTime: '2025-04-03T02:35:12.593+00:00',
      endTime: '2025-04-03T02:35:12.593+00:00',
      isRegistrationRequired: false,
      activityType: {
        id: 4,
        name: '聚餐',
      },
      registrationDate: '2025-03-24T02:35:12.593+00:00',
      numberVisitor: 2,
      address: '台中市西屯區台灣大道三段200號',
      activityPeopleNumber: {
        id: 3,
        maxParticipants: 40,
        currentParticipants: 0,
      },
    },
  },
])

const reviewList = ref([
  {
    id: 14,
    memberId: 11,
    reviewTime: '2024-05-18T16:00:00.000+00:00',
    reviewContent: '場地很大，寵物可以自由奔跑，非常適合。',
    vendorActivity: {
      id: 13,
      name: '水族設備體驗會',
      description: '介紹最新水族設備並提供試用',
      startTime: '2025-04-04T02:35:12.593+00:00',
      endTime: '2025-04-04T02:35:12.593+00:00',
      isRegistrationRequired: false,
      activityType: {
        id: 7,
        name: '其他',
      },
      registrationDate: '2025-03-24T02:35:12.593+00:00',
      numberVisitor: 0,
      address: '台南市中西區民族路77號',
      activityPeopleNumber: {
        id: 13,
        maxParticipants: 60,
        currentParticipants: 33,
      },
    },
  },
])

const registrationList = ref([
  {
    id: 4,
    vendorActivity: {
      id: 11,
      name: '狗狗行為訓練體驗',
      description: '體驗基礎狗狗行為訓練課程',
      startTime: '2025-03-30T02:35:12.593+00:00',
      endTime: '2025-03-30T02:35:12.593+00:00',
      isRegistrationRequired: true,
      activityType: {
        id: 7,
        name: '其他',
      },
      registrationDate: '2025-03-24T02:35:12.593+00:00',
      numberVisitor: 25,
      address: '新竹市東區光復路200號',
      activityPeopleNumber: {
        id: 11,
        maxParticipants: 5,
        currentParticipants: 5,
      },
    },
    registrationTime: '2025-03-24T03:52:36.433+00:00',
    status: 'confirmed',
  },
])

/* 1. 獲取收藏列表 */
const fetchActivityLike = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/activity/member/${memberId.value}/like`)

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
    const response = await fetch(
      `http://localhost:8080/api/activity/member/${memberId.value}/review`
    )

    const data = await response.json()
    reviewList.value = data
  } catch (error) {
    console.error('獲取評論資料失敗:', error)
  }
}
onMounted(fetchActivityReview)

/* 3. 獲取報名列表 */
const fetchActivityRegistration = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/member/${memberId.value}/registration`
    )

    const data = await response.json()
    registrationList.value = data
  } catch (error) {
    console.error('獲取報名資料失敗:', error)
  }
}
onMounted(fetchActivityRegistration)

/* 4. 取消收藏 */
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
    const response = await fetch(`http://localhost:8080/api/activity/like/${likeId}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await response.json()

    likeList.value = likeList.value.filter((like) => like.id !== likeId)
  } catch (error) {
    console.error('取消收藏失敗:', error)
  }
}

/* 5. 修改評論 */

// 狀態控制
const editIndex = ref(null) // 當前編輯行
const editedContent = ref('') // 存儲臨時內容

// 進入編輯模式
const editReview = (index, content) => {
  editIndex.value = index
  editedContent.value = content
}

// 確認修改
const confirmEdit = async (reviewId, content, index) => {
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

  const review = ref({
    content: content,
  })

  try {
    const response = await fetch(`http://localhost:8080/api/activity/review/${reviewId}/rewrite`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review.value),
    })
    let result = await response.json()

    reviewList.value[index].reviewContent = editedContent.value
    editIndex.value = null
  } catch (error) {
    console.error('修改留言失敗:', error)
  }
}

// 取消修改
const cancelEdit = async () => {
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
  editIndex.value = null
}

/* 6. 刪除評論 */
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
    const response = await fetch(`http://localhost:8080/api/activity/review/${reviewId}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await response.json()

    reviewList.value = reviewList.value.filter((review) => review.id !== reviewId)
  } catch (error) {
    console.error('刪除評論失敗:', error)
  }
}

/* 7. 取消報名 */
const deleteRegistration = async (registrationId) => {
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
    const response = await fetch(
      `http://localhost:8080/api/activity/registration/${registrationId}/delete`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    const data = await response.json()

    registrationList.value = registrationList.value.filter(
      (registration) => registration.id !== registrationId
    )
  } catch (error) {
    console.error('刪除評論失敗:', error)
  }
}

/* 8. 時間轉換 */
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

/* 9. 頁面切換按鈕 */
const isLikeVisible = ref(true)
const isReviewVisible = ref(false)
const isRegistrationVisible = ref(false)

const switchLikePage = () => {
  isLikeVisible.value = true
  isReviewVisible.value = false
  isRegistrationVisible.value = false
}

const switchReviewPage = () => {
  isLikeVisible.value = false
  isReviewVisible.value = true
  isRegistrationVisible.value = false
}

const switchRegistrationPage = () => {
  isLikeVisible.value = false
  isReviewVisible.value = false
  isRegistrationVisible.value = true
}
</script>

<style>
.container {
  max-width: 600px;
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
  min-width: 0; /* 防止flex子項溢出 */
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
