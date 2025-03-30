<template>
  <!-- 幻燈片開始 -->
  <section id="banner" style="background: #f9f3ec">
    <div class="container">
      <Swiper
        :modules="[Pagination, Autoplay]"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
      >
        <SwiperSlide v-for="(vendor, index) in vendorList" :key="index" class="py-5">
          <div class="row banner-content align-items-center">
            <div class="img-wrapper col-md-5">
              <span v-if="vendor.logoImgBase64"
                ><img
                  :src="vendor.logoImgBase64"
                  class="img-fluid rounded-4"
                  alt="image"
                  width="500" /></span
              ><span v-else>
                <img
                  src="/user_static/images/tool/no-photo.png"
                  alt="店家圖片"
                  class="img-fluid rounded-4"
                  width="500"
              /></span>
            </div>
            <div class="content-wrapper col-md-7 p-5 mb-5">
              <h2 class="banner-title display-2 fw-normal">
                <span v-if="vendor.name">{{ vendor.name }}</span>
                <span v-else style="color: #c0c0c0">( 無店家名稱 )</span>
              </h2>
              <div class="secondary-font text-primary text-uppercase mb-3">
                {{ vendor.description }}
              </div>
              <div class="d-flex">
                <a
                  :href="`/vendor/detail/${vendor.id}`"
                  class="btn btn-outline-dark btn-lg text-uppercase fs-4 rounded-1 me-4"
                  style="margin-top: 0px"
                >
                  前往店家
                  <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                    <use xlink:href="#arrow-right"></use>
                  </svg>
                </a>
                <span style="font-size: 36px; color: #ffd300">★ </span>
                <span style="font-size: 28px">( {{ vendor.totalRating }} )</span>
              </div>
              <br />

              <div style="font-size: 28px; margin-top: 20px">活動列表：</div>
              <ul>
                <li
                  v-for="(activity, index) in vendor.activityDtoList"
                  :key="index"
                  style="font-size: 24px; margin-top: 30px"
                >
                  {{ activity.activityName }} &nbsp;
                  <a
                    :href="`/activity/detail/${activity.activityId}`"
                    class="btn btn-outline-dark btn-lg text-uppercase rounded-1 me-4"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                      <use xlink:href="#arrow-right"></use>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
  <!-- 幻燈片結束 -->
  <br />
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import { ref, onMounted } from 'vue'

/* 0. 隨機排列 */
const shuffleList = (array) => {
  return array.sort(() => Math.random() - 0.5)
}

/* 1. 店家列表 */
const vendorList = ref([
  {
    id: 1,
    name: '毛孩天堂寵物美容',
    description: '專業寵物美容與SPA，讓毛孩擁有最舒適的體驗',
    totalRating: 2.9,
    logoImag: null,
    logoImgBase64: '',
    activityDtoList: [
      {
        activityId: 1,
        activityName: '毛孩美容日',
        activityDescription: '提供免費寵物美容體驗，讓毛孩煥然一新',
      },
    ],
  },
])
const fetchVendorList = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/vendor/all/for/swiper`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    vendorList.value = shuffleList(data)
  } catch (error) {
    console.error('獲取店家清單失敗:', error)
  }
}
onMounted(fetchVendorList)
</script>

<style></style>
