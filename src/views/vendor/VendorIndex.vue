<template>
  <!-- 幻燈片開始 -->
  <section id="banner" style="background: #f9f3ec">
    <div class="container">
      <Swiper
        :modules="[Pagination, Autoplay]"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 2000, disableOnInteraction: false }"
      >
        <SwiperSlide
          v-for="(slide, index) in vendorList"
          :key="index"
          class="py-5"
        >
          <div class="row banner-content align-items-center">
            <div class="img-wrapper col-md-5">
              <img
                :src="slide.logoImgBase64"
                class="img-fluid"
                alt="banner image"
              />
            </div>
            <div class="content-wrapper col-md-7 p-5 mb-5">
              <div class="secondary-font text-primary text-uppercase mb-4">
                {{ slide.description }}
              </div>
              <h2 class="banner-title display-2 fw-normal">
                {{ slide.name }}
              </h2>
              <div class="d-flex">
                <a
                  :href="`/vendor/detail/${slide.id}`"
                  class="btn btn-outline-dark btn-lg text-uppercase fs-4 rounded-1 me-4"
                  style="margin-top: 30px"
                >
                  前往店家
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
      <div
        class="section-header d-md-flex justify-content-between align-items-center"
      >
        <h2 class="display-3 fw-normal">店家列表</h2>
      </div>
      <div class="mb-4 mb-md-0">
        <p class="m-0">
          <!-- 篩選按鈕開始 -->
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
      </div>

      <div class="row">
        <div
          v-for="vendor in filteredVendors"
          :key="vendor.id"
          :class="['item', vendor.id, 'col-md-4', 'col-lg-3', 'my-4']"
        >
          <div class="card position-relative">
            <a :href="`/vendor/detail/${vendor.id}`">
              <img
                :src="vendor.logoImgBase64"
                class="img-fluid rounded-4"
                alt="店家圖片"
              />
            </a>
            <div class="card-body p-0">
              <a :href="`/vendor/detail/${vendor.id}`">
                <h2 class="card-title pt-4 m-0">{{ vendor.name }}</h2>
              </a>
              <div class="card-text">
                <span class="rating secondary-font">{{
                  vendor.description
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- 店家列表結束 -->
</template>

<script setup>
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper/modules";
import { ref, computed, onMounted } from "vue";

/* 1. 店家列表 */
const vendorList = ref([]);
const fetchVendorList = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/vendor/all`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    vendorList.value = data;
  } catch (error) {
    console.error("獲取店家清單失敗:", error);
  }
};
onMounted(fetchVendorList);

/* 2. 店家篩選 */
const activeFilter = ref(0);
const filters = ref([]);

const fetchVendorCategory = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/category/show`
    );

    const data = await response.json();
    filters.value = filters.value = [
      { id: 0, name: "全部" },
      ...data,
      { id: null, name: "沒有分類" },
    ];
  } catch (error) {
    console.error("獲取店家類別失敗:", error);
  }
};
onMounted(fetchVendorCategory);

const setFilter = (filter) => {
  activeFilter.value = filter;
};

const filteredVendors = computed(() => {
  if (activeFilter.value === 0) {
    return vendorList.value;
  } else if (activeFilter.value === null) {
    const filteredVendorList = vendorList.value.filter(
      (vendor) => !vendor.vendorCategory
    );
    return filteredVendorList;
  } else {
    const filteredVendorList = vendorList.value.filter(
      (vendor) =>
        vendor.vendorCategory && vendor.vendorCategory.id === activeFilter.value // 第一個條件為要有分類，第二個條件為篩選
    );
    return filteredVendorList;
  }
});

/* 3. 幻燈片 */
// const mySwiper = ref(null);
// const onSlideChange = () => {
//   if (mySwiper.value) {
//     mySwiper.value.swiper.pagination.update(); // 強制更新分頁
//   }
// };
</script>

<style>
.filter-button.active {
  font-weight: bold;
  border-bottom: 2px solid black;
}
</style>
