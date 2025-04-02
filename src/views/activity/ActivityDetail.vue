<template>
  <!-- 主要內容開始 -->
  <div class="padding-medium mt-xl-5">
    <div class="container rounded-4" style="background-color: #f9f3ec; padding: 20px">
      <div class="row align-items-center mt-xl-5">
        <div class="h-auto offset-md-1 col-md-5">
          <div class="d-flex justify-content-center" v-if="activityImageList.length != 0">
            <button class="swiper-button-prev custom-prev"></button>
            <Swiper
              :modules="[Pagination, Navigation]"
              :pagination="{
                clickable: true,
              }"
              :navigation="{
                nextEl: '.custom-next',
                prevEl: '.custom-prev',
              }"
            >
              <SwiperSlide
                v-for="(image, index) in activityImageList"
                :key="index"
                class="thumbnail"
                width="400"
                @click="openImage(image.imageBase64)"
                ><div style="display: flex; justify-content: center; align-items: center">
                  <img
                    :src="image.imageBase64"
                    class="img-fluid rounded-4"
                    alt="image"
                    style="max-width: 500px; max-height: 300px; margin: 10px"
                  />
                </div> </SwiperSlide
            ></Swiper>
            <button class="swiper-button-next custom-next"></button>
          </div>
          <div class="d-flex justify-content-center" v-else>
            <img
              src="/user_static/images/tool/no-photo.png"
              alt="活動圖片"
              class="img-fluid rounded-4"
              width="250"
            />
          </div>
        </div>

        <div class="col-md-5 mt-5 mt-md-0">
          <div class="mb-3">
            <h2 class="display-6 fw-semibold">{{ activity.name }}</h2>
          </div>
          <p>{{ activity.description }}</p>
          <p>
            分類：
            <span v-if="activity.activityType"
              ><b style="color: red">{{ activity.activityType.name }}</b
              ><button
                class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
                style="margin-left: 10px"
                @click="openSameType(activity.activityType.id)"
              >
                查看同型別活動
              </button></span
            >
            <span v-else style="color: gray">( 無分類 )</span>
          </p>

          <p>
            主辦店家：<span style="margin: 5px" v-if="activity.vendor.logoImgBase64">
              <img
                :src="activity.vendor.logoImgBase64"
                alt="店家圖片"
                class="img-fluid rounded-4"
                width="30" /></span
            ><a :href="`/vendor/detail/${activity.vendor.id}`" v-if="activity.vendor.name"
              ><b>{{ activity.vendor.name }}</b></a
            ><a :href="`/vendor/detail/${activity.vendor.id}`" v-else style="color: gray"
              ><b>( 無店家名稱 )</b></a
            >
          </p>
          <p>
            開始時間：<b>{{ formatDate(activity.startTime) }}</b>
          </p>
          <p>
            結束時間：<b>{{ formatDate(activity.endTime) }}</b>
          </p>
          <p>
            地址：<b>{{ activity.address }}</b>
          </p>
          <p>需要報名：<b v-if="activity.isRegistrationRequired">是</b><b v-else>否</b></p>

          <p v-if="activity.isRegistrationRequired">
            報名人數：<b>{{ currentPeople }}</b
            ><button
              :disabled="!isAvalible"
              style="margin-left: 10px"
              class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
              @click="registActivityConfirm()"
            >
              {{ registractionStatus }}
            </button>

            <button
              class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
              @click="openRegistrationConditon()"
            >
              報名狀態
            </button>
          </p>
          <p v-if="activity.isRegistrationRequired">
            報名人數上限：<b>{{ maxPeople }}</b>
          </p>
          <p>
            瀏覽人數：<b>{{ activityForNumberOfVisitor.numberVisitor }}</b>
          </p>

          <div class="d-flex">
            <div class="d-flex flex-wrap mt-3">
              <button
                class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
                @click="toggleLike()"
              >
                {{ likeStatus }}
              </button>
              <button
                class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
                :disabled="isAddReviewDisabled"
                @click="openComment()"
              >
                {{ addReviewButton }}
              </button>
              <button
                class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
                @click="openShare()"
              >
                分享
              </button>
            </div>
          </div>
          <br />
          <div
            @click="openMember()"
            :style="{ cursor: cursorStyle }"
            @mouseover="cursorStyle = 'zoom-in'"
            @mouseleave="cursorStyle = 'default'"
          >
            <b>查看誰收藏</b>
          </div>
          <br />
        </div>
      </div>
    </div>
  </div>
  <!-- 主要內容結束 -->

  <!-- 留言區開始 -->
  <div class="container" style="padding: 20px" v-if="reviewList.length != 0">
    <div class="section-header d-md-flex justify-content-between align-items-center mb-3">
      <h2 class="display-6 fw-normal">留言區</h2>
    </div>

    <div v-for="review in reviewList" :key="review.reviewId">
      <div class="comment">
        <div class="container rounded-3" style="background-color: #f9f3ec; padding: 20px">
          <div class="row">
            <div class="col-lg-3">
              <div class="image-container" v-if="review.profilePhotoBase64">
                <img
                  class="img-fluid rounded-4"
                  :src="review.profilePhotoBase64"
                  alt="alternative"
                  style="max-width: 200px; max-height: 200px"
                />
              </div>
              <div class="image-container" v-else>
                <img
                  class="img-fluid rounded-4"
                  src="/user_static/images/tool/no-photo.png"
                  alt="alternative"
                  style="max-width: 250px"
                />
              </div>
            </div>

            <div class="col-lg-9">
              <div class="text-container" style="padding-top: 20px">
                <h2>
                  <b v-if="review.name">{{ review.name }}</b>
                  <b v-else style="color: gray">( 無名稱 )</b>
                </h2>

                <p>發表時間：{{ formatDate(review.reviewTime) }}</p>

                <p>
                  留言內容：
                  <span v-if="review.reviewContent">{{ review.reviewContent }}</span>
                  <span style="color: gray" v-else>( 沒有內容 )</span>
                </p>

                <div class="d-flex flex-wrap mt-3" v-if="review.memberId == memberId">
                  <button
                    class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 me-4"
                    @click="openRewirte(review.reviewId)"
                  >
                    修改
                  </button>

                  <button
                    class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 me-4"
                    @click="deleteComment(review.reviewId)"
                  >
                    刪除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
  </div>
  <!-- 留言區結束 -->

  <!-- 活動列表 -->
  <div class="container mt-4">
    <h2 class="display-6 fw-normal">其他活動</h2>
    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">名稱</th>
          <th scope="col">類別</th>
          <th scope="col">主辦店家</th>
          <th scope="col">開始時間</th>
          <th scope="col">結束時間</th>
          <th scope="col">需要報名</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(activity, index) in activityList" :key="activity.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>
            <a :href="`/activity/detail/${activity.id}`">{{ activity.name }}</a>
          </td>
          <td>{{ activity.activityType.name }}</td>
          <td>
            <a :href="`/vendor/detail/${activity.vendor.id}`"
              ><span v-if="activity.vendor.name">{{ activity.vendor.name }}</span>
              <span v-else style="color: #c0c0c0">無店家名稱</span></a
            >
          </td>
          <td>{{ formatDate(activity.startTime) }}</td>
          <td>{{ formatDate(activity.endTime) }}</td>
          <td style="text-align: center">
            <span v-if="activity.isRegistrationRequired" style="color: red">是</span>
            <span v-else>否</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 活動列表 -->

  <!-- 報名狀態視窗 -->
  <div v-if="isPopupConditionVisible" class="overlay">
    <div class="popup">
      <h3><b>報名狀況</b></h3>

      <div class="scroll-container">
        <div v-if="confirmedList.length != 0">
          <h5><b>核准名單</b></h5>
          <div v-for="(confirmed, index) in confirmedList" :key="index" style="font-size: 24px">
            <span v-if="confirmed.member.profilePhotoBase64">
              <img
                :src="confirmed.member.profilePhotoBase64"
                class="img-fluid rounded-4"
                alt="image"
                style="max-width: 30px; max-height: 30px; margin: 10px"
              />
            </span>
            <span v-else>
              <img
                src="/user_static/images/tool/no-photo.png"
                class="img-fluid rounded-4"
                alt="image"
                style="max-width: 30px; max-height: 30px; margin: 10px"
              />
            </span>
            <span v-if="confirmed.member.name">{{ confirmed.member.name }}</span
            ><span v-else style="color: gray">( 無名稱 )</span>
          </div>
        </div>

        <div v-if="pendingList.length != 0">
          <h5><b>待核准名單</b></h5>
          <div v-for="(pending, index) in pendingList" :key="index" style="font-size: 24px">
            <span v-if="pending.member.profilePhotoBase64"
              ><img
                :src="pending.member.profilePhotoBase64"
                class="img-fluid rounded-4"
                alt="image"
                style="max-width: 30px; max-height: 30px; margin: 10px"
            /></span>
            <span v-else
              ><img
                src="/user_static/images/tool/no-photo.png"
                class="img-fluid rounded-4"
                alt="image"
                style="max-width: 30px; max-height: 30px; margin: 10px"
            /></span>
            <span v-if="pending.member.name">{{ pending.member.name }}</span
            ><span v-else style="color: gray">( 無名稱 )</span>
          </div>
        </div>

        <div
          v-if="confirmedList.length == 0 && pendingList.length == 0"
          style="color: gray; margin: 50px"
        >
          目前沒有人報名唷
        </div>
      </div>
      <button
        class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        style="margin: 5px"
        @click="closeRegistrationConditon()"
      >
        關閉
      </button>
    </div>
  </div>
  <!-- 報名狀態視窗 -->

  <!-- 留言視窗 -->
  <div v-if="isPopupCommentVisible" class="overlay">
    <div class="popup">
      <h3>
        <b>
          <span v-if="commentButton">新增留言</span>
          <span v-else-if="rewriteButton">修改留言</span></b
        >
      </h3>
      <textarea
        placeholder="輸入感想"
        rows="5"
        col="10"
        style="resize: none"
        v-model="commentForm.content"
        required
      ></textarea>
      <div>
        <button
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          style="margin: 5px"
          @click="closeComment()"
        >
          關閉
        </button>
        <button
          v-if="commentButton"
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          style="margin: 5px"
          @click="submitComment()"
        >
          送出
        </button>
        <button
          v-if="rewriteButton"
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          style="margin: 5px"
          @click="submitRewrite(reviewIdForRewrite)"
        >
          修改
        </button>
      </div>
    </div>
  </div>
  <!-- 留言視窗 -->

  <!-- 同類別店家視窗 -->
  <div v-if="isPopupTypeVisible" class="overlay">
    <div class="popup">
      <h3>
        <b v-if="typeActivityList.length != 0"
          >同類別活動：<span style="color: red">{{
            typeActivityList[0].activityType.name
          }}</span></b
        ><b v-else>同類別活動</b>
      </h3>
      <div class="scroll-container" v-if="typeActivityList.length != 0">
        <div v-for="(activity, index) in typeActivityList" :key="index" style="font-size: 24px">
          <!-- 圖片抓法要改 -->
          <!-- <img
            :src="activity.logoImgBase64"
            class="img-fluid rounded-4"
            alt="image"
            style="max-width: 30px; max-height: 30px; margin: 10px"
          /> -->
          <a :href="`/activity/detail/${activity.id}`">{{ activity.name }}</a>
        </div>
      </div>
      <div v-else style="color: gray; margin: 50px">目前沒有其他同類別活動～</div>
      <button
        class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        style="margin: 5px"
        @click="closeSameType()"
      >
        關閉
      </button>
    </div>
  </div>
  <!-- 同類別店家視窗 -->

  <!-- 收藏名單視窗 -->
  <div v-if="isPopupMemberVisible" class="overlay">
    <div class="popup">
      <h3><b>有誰收藏</b></h3>
      <div class="scroll-container" v-if="memberList.length != 0">
        <div v-for="(member, index) in memberList" :key="index" style="font-size: 24px">
          <span v-if="member.profilePhotoBase64"
            ><img
              :src="member.profilePhotoBase64"
              class="img-fluid rounded-4"
              alt="image"
              style="max-width: 30px; max-height: 30px; margin: 10px"
          /></span>
          <span v-else
            ><img
              src="/user_static/images/tool/no-photo.png"
              class="img-fluid rounded-4"
              alt="image"
              style="max-width: 30px; max-height: 30px; margin: 10px"
          /></span>
          <span v-if="member.name">{{ member.name }}</span
          ><span v-else style="color: gray">( 無名稱 )</span>
        </div>
      </div>
      <div v-else style="color: gray; margin: 50px">目前沒有人收藏唷～</div>
      <button
        class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        style="margin: 5px"
        @click="closeMember()"
      >
        關閉
      </button>
    </div>
  </div>
  <!-- 收藏名單視窗 -->

  <!-- 圖片放大 -->
  <div v-if="isImageOpen" class="overlay" @click="closeImage">
    <img :src="imageSrc" alt="Large Image" class="large-image" @click.stop />
  </div>
  <!-- 圖片放大 -->

  <!-- 活動分享視窗 -->
  <div v-if="isPopupShareVisible" class="overlay">
    <div class="popup">
      <h3><b>分享</b></h3>
      <div class="container d-flex justify-content-center">
        <div @click="shareOnFacebook()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="blue"
          >
            <path
              d="M22.675 0h-21.35C.597 0 0 .598 0 1.333v21.333C0 23.402.597 24 1.325 24h11.5v-9.3h-3.1v-3.6h3.1v-2.7c0-3.1 1.9-4.8 4.7-4.8 1.3 0 2.5.1 2.8.1v3.3h-1.9c-1.5 0-1.9.7-1.9 1.8v2.3h3.8l-.5 3.6h-3.3V24h6.5c.7 0 1.3-.598 1.3-1.333V1.333C24 .598 23.402 0 22.675 0z"
            />
          </svg>
        </div>
        &emsp;
        <div @click="shareOnLine()">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/LINE_logo.svg/480px-LINE_logo.svg.png"
            alt="LINE Logo"
            width="100px"
            height="100px"
          />
        </div>
        &emsp;
        <div @click="shareOnX()">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/450px-X_logo_2023.svg.png"
            alt="LINE Logo"
            width="100px"
            height="100px"
          />
        </div>
      </div>
      <br />

      <div>
        <input class="share-url" v-model="shareUrl" readonly />&emsp;<button
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          @click="copyUrl()"
        >
          複製
        </button>
      </div>
      <div>{{ copyMessage || `&nbsp;` }}</div>

      <button
        class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        style="margin: 5px"
        @click="closeShare()"
      >
        關閉
      </button>
    </div>
  </div>
  <!-- 活動分享視窗 -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import { Navigation } from 'swiper/modules'
import Swal from 'sweetalert2'

import 'swiper/css'
import 'swiper/css/pagination'

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const memberId = authStore.memberId

/* 0. 隨機排列 */
const shuffleList = (array) => {
  return array.sort(() => Math.random() - 0.5)
}

/* 1. activityId及預設游標 */
const props = defineProps({
  activityId: Number,
})
const cursorStyle = ref('default') // 預設游標

/* 2. 活動資料 */
const activity = ref({
  id: 1,
  vendor: {
    id: 1,
    name: '毛孩天堂寵物美容',
  },
})
const fetchActivityData = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/activity/${props.activityId}`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    activity.value = data
  } catch (error) {
    console.error('獲取活動資料失敗:', error)
  }
}
onMounted(fetchActivityData)

/* 3. 活動圖片列表 */
const activityImageList = ref({ id: '', imageBase64: '' })

const fetchActivityImageList = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/activity/${props.activityId}/image`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    activityImageList.value = data
  } catch (error) {
    console.error('獲取活動圖片列表失敗:', error)
  }
}
onMounted(fetchActivityImageList)

/* 4. 留言區 */
const reviewList = ref([])

const fetchReviewList = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/activity/${props.activityId}/review`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    reviewList.value = data
  } catch (error) {
    console.error('獲取活動留言清單失敗:', error)
  }
}
onMounted(fetchReviewList)

/* 5. 其他活動列表 */
const activityList = ref([])

const fetchActivityList = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/all/except/${props.activityId}`
    )
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    activityList.value = shuffleList(data)
  } catch (error) {
    console.error('獲取店家清單失敗:', error)
  }
}
onMounted(fetchActivityList)

/* 6. 瀏覽人數 */
const activityForNumberOfVisitor = ref([])

const increaseNumberOfVisitor = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/${props.activityId}/increase/number/visitor`
    )
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    const data = await response.json()
    activityForNumberOfVisitor.value = data
  } catch {
    console.error('瀏覽人數增加失敗:', error)
  }
}
onMounted(increaseNumberOfVisitor)

/* 7. 報名人數 */
const currentPeople = ref()
const maxPeople = ref()

const getActivityPeople = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/${props.activityId}/registration/people/number`
    )
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    const data = await response.json()
    currentPeople.value = data.currentParticipants
    maxPeople.value = data.maxParticipants
  } catch {
    console.error('瀏覽人數增加失敗:', error)
  }
}
onMounted(getActivityPeople)

/* 8. 是否能留言*/
const addReviewButton = ref('留言')
const isAddReviewDisabled = ref(false)

const getReviewIsExisied = async () => {
  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/member/${memberId}/review/exist`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  let result = await response.json()
  if (result.action) {
    addReviewButton.value = '已留言'
    isAddReviewDisabled.value = true
  } else {
    addReviewButton.value = '留言'
    isAddReviewDisabled.value = false
  }
}
onMounted(getReviewIsExisied)

/* 9. 時間轉換 */
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

/* 10. 圖片放大 */
const imageSrc = ref()
const isImageOpen = ref(false)

const openImage = (image) => {
  isImageOpen.value = true
  imageSrc.value = image
  document.body.style.overflow = 'hidden'
}

const closeImage = () => {
  isImageOpen.value = false
  document.body.style.overflow = ''
}

/* 11. 活動報名 */
const registractionStatus = ref()
const isAvalible = ref(true)

const isActivityAvalible = async () => {
  // 判斷人數是否達上限，達到上限true，未達上限true
  const response1 = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/registration/status`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  let result1 = await response1.json()

  // 判斷報名狀態
  const response2 = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/member/${memberId}/regist/status`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  let result2 = await response2.json()

  isAvalible.value = result1

  // 報名達上限還可以取消報名
  if (result1 == false && result2.action == true) {
    isAvalible.value = true
  }
}
onMounted(isActivityAvalible)

const getRegistractionStatus = async () => {
  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/member/${memberId}/regist/status`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  let result = await response.json()

  if (result.action) {
    registractionStatus.value = '已報名'
  } else {
    registractionStatus.value = '報名'
  }
}
onMounted(getRegistractionStatus)

const registActivityConfirm = async () => {
  if (memberId == null) {
    await Swal.fire({
      title: '無法報名',
      text: '請先登入再執行',
      icon: 'error',
      confirmButtonText: '確定',
    })
    return
  }

  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/member/${memberId}/regist/status`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  let regisitrationStatus = await response.json()

  if (regisitrationStatus.action) {
    const result = await Swal.fire({
      title: '取消報名？',
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: '返回',
      confirmButtonText: '確認',
      reverseButtons: true,
    })
    if (result.isConfirmed) {
      registActivity()
    }
  } else {
    const result = await Swal.fire({
      title: '執行報名？',
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: '返回',
      confirmButtonText: '確認',
      reverseButtons: true,
    })
    if (result.isConfirmed) {
      registActivity()
    }
  }
}

const registActivity = async () => {
  const data = {
    memberId: memberId,
  }

  const response = await fetch(`http://localhost:8080/api/activity/${props.activityId}/regist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  let regisitrationStatus = await response.json()

  if (!isActivityAvalible.value) {
    isActivityAvalible.value = true
  }

  if (regisitrationStatus.action) {
    currentPeople.value += 1
    Swal.fire({
      title: '報名成功',
      icon: 'success',
      confirmButtonText: '確定',
    })
    registractionStatus.value = '已報名'
  } else {
    currentPeople.value -= 1
    Swal.fire({
      title: '報名取消',
      icon: 'error',
      confirmButtonText: '確定',
    })
    registractionStatus.value = '報名'
  }
}

/* 12. 報名狀況 */
const isPopupConditionVisible = ref(false)
const pendingList = ref([])
const confirmedList = ref([])

watch(isPopupConditionVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const openRegistrationConditon = async () => {
  isPopupConditionVisible.value = true

  const response1 = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/registration/pending`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  pendingList.value = await response1.json()

  const response2 = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/registration/confirmed`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  confirmedList.value = await response2.json()
}
const closeRegistrationConditon = () => {
  isPopupConditionVisible.value = false
}

/* 13. 切換收藏 */
const likeStatus = ref('收藏')

const getLikeStatus = async () => {
  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/member/${memberId}/like/status`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  let result = await response.json()

  if (result.action) {
    likeStatus.value = '已收藏'
  } else {
    likeStatus.value = '收藏'
  }
}
onMounted(getLikeStatus)

const toggleLike = async () => {
  if (memberId == null) {
    await Swal.fire({
      title: '無法收藏',
      text: '請先登入再執行',
      icon: 'error',
      confirmButtonText: '確定',
    })
    return
  }

  const data = {
    memberId: memberId,
  }

  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/like/toggle`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )
  let result = await response.json()

  if (result.action) {
    Swal.fire({
      title: '成功收藏',
      icon: 'success',
      confirmButtonText: '確定',
    })
    likeStatus.value = '已收藏'
  } else {
    Swal.fire({
      title: '取消收藏',
      icon: 'error',
      confirmButtonText: '確定',
    })
    likeStatus.value = '收藏'
  }
}

/* 14. 新增留言 */
const isPopupCommentVisible = ref(false)
const commentButton = ref(false)
const commentForm = ref({
  memberId: memberId,
  content: '',
})

watch(isPopupCommentVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const openComment = async () => {
  if (memberId == null) {
    await Swal.fire({
      title: '無法留言',
      text: '請先登入再執行',
      icon: 'error',
      confirmButtonText: '確定',
    })
    return
  }

  isPopupCommentVisible.value = true
  commentButton.value = true
}
const closeComment = () => {
  isPopupCommentVisible.value = false
  commentButton.value = false
  rewriteButton.value = false
}

const submitComment = async () => {
  const ask = await Swal.fire({
    title: '確定送出？',
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
      `http://localhost:8080/api/activity/${props.activityId}/review/add`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentForm.value),
      }
    )
    let result = await response.json()
    if (result.success) {
      const ask = await Swal.fire({
        title: '成功送出',
        icon: 'success',
        confirmButtonText: '關閉',
      })
      closeComment()

      addReviewButton.value = '已留言'
      isAddReviewDisabled.value = true

      if (ask.isConfirmed) {
        window.location.reload()
      }
    }
  } catch (error) {
    console.error('新增留言失敗:', error)
  }
}

/* 15. 修改留言 */
const reviewIdForRewrite = ref()
const rewriteButton = ref(false)

const openRewirte = async (reviewId) => {
  isPopupCommentVisible.value = true
  rewriteButton.value = true
  reviewIdForRewrite.value = reviewId

  try {
    const response = await fetch(`http://localhost:8080/api/activity/review/${reviewId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    let result = await response.json()
    commentForm.value.content = result.review.reviewContent
  } catch (error) {
    console.error('獲取留言失敗:', error)
  }
}

const submitRewrite = async (reviewId) => {
  const ask = await Swal.fire({
    title: '確定送出？',
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
    const response = await fetch(`http://localhost:8080/api/activity/review/${reviewId}/rewrite`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentForm.value),
    })
    let result = await response.json()

    Swal.fire({
      title: '成功送出',
      icon: 'success',
      confirmButtonText: '關閉',
    })

    closeComment()

    const updatedReview = reviewList.value.find(
      (review) => review.reviewId === reviewId //  find()找到reviewList陣列中符合reviewId的留言
    )
    if (updatedReview) {
      updatedReview.reviewTime = new Date()
      updatedReview.reviewContent = result.review.reviewContent // 更新留言內容
    }
  } catch (error) {
    console.error('修改留言失敗:', error)
  }
}

/* 16. 刪除留言 */
const deleteComment = async (reviewId) => {
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
    let result = await response.json()

    Swal.fire({
      title: '成功刪除',
      icon: 'success',
      confirmButtonText: '關閉',
    })

    reviewList.value = reviewList.value.filter(
      (review) => review.reviewId !== reviewId // 過濾reviewId等於reviewId的留言
    )

    addReviewButton.value = '留言'
    isAddReviewDisabled.value = false
  } catch (error) {
    console.error('刪除留言失敗:', error)
  }
}

/* 17. 收藏之會員視窗 */
const isPopupMemberVisible = ref(false)
const memberList = ref([
  {
    memberId: '載入中',
    name: '',
    gender: '',
    profilePhoto: '',
    profilePhotoBase64: '',
  },
])

watch(isPopupMemberVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const openMember = async () => {
  isPopupMemberVisible.value = true

  try {
    const response = await fetch(`http://localhost:8080/api/activity/${props.activityId}/like`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    let members = await response.json()
    memberList.value = members
  } catch (error) {
    console.error('讀取會員失敗:', error)
  }
}

const closeMember = () => {
  isPopupMemberVisible.value = false
}

/* 18. 同類別活動視窗 */
const typeActivityList = ref([
  {
    id: '',
    name: '',
    description: '',
    activityType: {
      id: '',
      name: '',
    },
  },
])
const isPopupTypeVisible = ref(false)

watch(isPopupTypeVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const fetchSameTypeActivitiesExceptOne = async (typeId) => {
  const response = await fetch(
    `http://localhost:8080/api/activity/type/${typeId}/except/activity/${props.activityId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  let result = await response.json()
  typeActivityList.value = result
}

const openSameType = (typeId) => {
  isPopupTypeVisible.value = true
  fetchSameTypeActivitiesExceptOne(typeId)
}

const closeSameType = () => {
  isPopupTypeVisible.value = false
}

/* 19. 分享視窗 */
const isPopupShareVisible = ref(false)
const shareUrl = ref(window.location.href)
const copyMessage = ref()

const openShare = () => {
  isPopupShareVisible.value = true
}

const closeShare = () => {
  isPopupShareVisible.value = false
  copyMessage.value = ''
}

function shareOnFacebook() {
  const urlChange = window.location.href.replace('localhost', '127.0.0.1') // FB沒辦法直接分享localhost
  const url = encodeURIComponent(urlChange) // 取得當前網址
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}

function shareOnLine() {
  const url = encodeURIComponent(shareUrl.value) // 取得當前網址
  window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, '_blank')
}

function shareOnX() {
  const url = encodeURIComponent(shareUrl.value) // 取得當前網址
  window.open(`https://x.com/intent/tweet?url=${url}`, '_blank')
}

function copyUrl() {
  navigator.clipboard.writeText(shareUrl.value)
  copyMessage.value = '複製成功'
}
</script>

<style scoped>
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

  z-index: 10;
}

/* 彈出框樣式 */
.popup {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;

  width: 500px;
  max-width: 90%;
}

/* 列表視窗 */
.scroll-container {
  max-height: 240px; /* 設定最大高度，超過則產生滾動條 */
  overflow-y: auto; /* 當內容超過 max-height 時顯示垂直滾動條 */
  border: 1px solid #ccc; /* 可選，增加邊框以區分區塊 */
  padding: 10px; /* 可選，增加內邊距 */
}

/* 圖片自訂按鈕樣式 */
.custom-prev,
.custom-next {
  position: relative;
  transform: translateY(0%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  width: 50px;
  height: 200px;
  cursor: pointer;
  z-index: 10;
}
.custom-prev {
  left: -5px;
}
.custom-next {
  left: 5px;
}
.custom-prev:hover,
.custom-next:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* Sweet Alert */
.swal2-container {
  z-index: 9999 !important; /* 設定比你的自定義視窗更高 */
}

/* 圖片放大 */
.large-image {
  max-width: 90%;
  max-height: 90%;
}
.thumbnail {
  width: 200px;
  cursor: zoom-in;
}

/* 分享網址列 */
.share-url {
  width: 300px;
  padding: 5px;
  border: 2px solid black;
  border-radius: 10px;
  font-size: 14px;
}
</style>
