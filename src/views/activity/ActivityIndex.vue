<template>
  <!-- 幻燈片開始 -->
  <section id="banner" style="background: #f9f3ec">
    <div class="container">
      <Swiper
        style="height: 75vh"
        direction="vertical"
        :modules="[Pagination, Autoplay]"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
      >
        <SwiperSlide v-for="(slide, index) in activityRandomList" :key="index" class="py-5">
          <div class="row banner-content align-items-center">
            <div class="img-wrapper col-md-5" style="text-align: center">
              <span v-if="slide.vendor.logoImgBase64"
                ><img
                  :src="slide.vendor.logoImgBase64"
                  class="img-fluid"
                  alt="image"
                  width="300"
                  style="margin-bottom: 15px"
              /></span>
              <span v-else
                ><img
                  src="/user_static/images/tool/no-photo.png"
                  class="img-fluid"
                  alt="image"
                  width="300"
                  style="margin-bottom: 15px"
              /></span>
              <h3>
                主辦店家：<a :href="`/vendor/detail/${slide.vendor.id}`"
                  ><span v-if="slide.vendor.name">{{ slide.vendor.name }}</span
                  ><span v-else style="gray">無店家名稱</span></a
                >
              </h3>
            </div>
            <div class="content-wrapper col-md-7 p-5 mb-5">
              <div class="secondary-font text-primary text-uppercase mb-4">
                {{ slide.description }}
              </div>
              <h2 class="banner-title display-2 fw-normal">
                {{ slide.name }}
              </h2>
              <div>
                {{ formatDate(slide.startTime) }}&nbsp;&nbsp;~&nbsp;&nbsp;{{
                  formatDate(slide.endTime)
                }}
              </div>
              <div class="d-flex">
                <a
                  :href="`/activity/detail/${slide.id}`"
                  class="btn btn-outline-dark btn-lg text-uppercase fs-4 rounded-1 me-4"
                  :style="{ marginTop: '30px' }"
                >
                  前往活動
                  <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                    <use xlink:href="#arrow-right"></use>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
  <!-- 幻燈片結束 -->

  <!-- 店家列表開始 -->
  <section class="my-5">
    <div class="container my-5 py-5">
      <div class="section-header d-md-flex justify-content-between align-items-center">
        <h2 class="display-3 fw-normal" :style="{ marginBottom: '5px' }">活動列表</h2>
      </div>
      <div class="mb-4 mb-md-0">
        <p class="m-0">
          <!-- 篩選按鈕開始 -->
          <span style="margin-right: 20px">類別：</span>
          <button
            v-for="filter in filters"
            :key="filter.id"
            class="filter-button me-4"
            :class="{ active: activeFilter === filter.id }"
            @click="setFilter(filter.id)"
          >
            <!-- activeFilter === filter.id 為用來判斷active為true或false -->

            {{ filter.name }}
          </button>
          <!-- 篩選按鈕結束 -->
        </p>
        <br />
      </div>

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
          <tr
            v-for="(activity, index) in filteredActivities"
            :key="index"
            :class="['item', activity.id, 'col-md-4', 'col-lg-3', 'my-4']"
          >
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
  </section>
  <!-- 店家列表結束 -->
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import { ref, computed, onMounted } from 'vue'

/* 0. 隨機排列 */
const shuffleList = (array) => {
  return array.sort(() => Math.random() - 0.5)
}

/* 1-1. 活動列表 */
const activityList = ref([])
const fetchActivityList = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/activity/all`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    activityList.value = data
  } catch (error) {
    console.error('獲取活動清單失敗:', error)
  }
}
onMounted(fetchActivityList)

/* 1-2. 活動列表(隨機排列) */
const activityRandomList = ref([])
const fetchActivityRandomList = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/activity/all`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    activityRandomList.value = shuffleList(data)
  } catch (error) {
    console.error('獲取活動清單失敗:', error)
  }
}
onMounted(fetchActivityRandomList)

/* 2. 店家篩選 */
const activeFilter = ref(0)
const filters = ref([])

const fetchActivityType = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/activity/type/show`)

    const data = await response.json()
    filters.value = filters.value = [
      { id: 0, name: '全部' },
      ...data,
      { id: null, name: '沒有分類' },
    ]
  } catch (error) {
    console.error('獲取活動類別失敗:', error)
  }
}
onMounted(fetchActivityType)

const setFilter = (filter) => {
  activeFilter.value = filter
}

const filteredActivities = computed(() => {
  if (activeFilter.value === 0) {
    return activityList.value
  } else if (activeFilter.value === null) {
    const filteredActivityList = activityList.value.filter((activiy) => !activiy.activityType)
    return filteredActivityList
  } else {
    const filteredActivityList = activityList.value.filter(
      (activiy) => activiy.activityType && activiy.activityType.id === activeFilter.value // 第一個條件為要有分類，第二個條件為篩選
    )
    return filteredActivityList
  }
})

/* 3. 時間轉換 */
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
</script>

<style>
.filter-button.active {
  font-weight: bold;
  border-bottom: 2px solid black;
}
</style>
