<template>
  <HeaderVendor></HeaderVendor>

  <!-- 幻燈片開始 -->

  <section id="banner" style="background: #f9f3ec">
    <div class="container">
      <Swiper
        :modules="[Pagination, Autoplay]"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        class="main-swiper"
      >
        <SwiperSlide v-for="(slide, index) in slides" :key="index" class="py-5">
          <div class="row banner-content align-items-center">
            <div class="img-wrapper col-md-5">
              <img :src="slide.image" class="img-fluid" alt="banner image" />
            </div>
            <div class="content-wrapper col-md-7 p-5 mb-5">
              <div class="secondary-font text-primary text-uppercase mb-4">
                {{ slide.description }}
              </div>
              <h2 class="banner-title display-1 fw-normal">
                {{ slide.title }}
              </h2>
              <div class="d-flex">
                <a
                  href="#"
                  class="btn btn-outline-dark btn-lg text-uppercase fs-4 rounded-1 me-4"
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

  <!-- 主體開始 -->

  <section id="foodies" class="my-5">
    <div class="container my-5 py-5">
      <div
        class="section-header d-md-flex justify-content-between align-items-center"
      >
        <h2 class="display-3 fw-normal">店家列表</h2>
        <div class="mb-4 mb-md-0">
          <p class="m-0">
            <!-- 篩選按鈕開始 -->
            <button
              v-for="filter in filters"
              :key="filter.value"
              class="filter-button me-4"
              :class="{ active: activeFilter === filter.value }"
              @click="setFilter(filter.value)"
            >
              {{ filter.label }}
            </button>
          </p>
          <!-- 篩選按鈕結束 -->
        </div>
      </div>

      <div class="row">
        <div
          v-for="vendor in filteredVendors"
          :key="vendor.id"
          :class="['item', vendor.category, 'col-md-4', 'col-lg-3', 'my-4']"
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

  <!-- 主體結束 -->

  <!-- footer開始 -->

  <footer>
    <section>
      <br />
      <div style="display: flex; justify-content: center">
        <a
          href="#"
          class="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1"
        >
          回最上層
        </a>
      </div>
      <br />
    </section>

    <div id="footer-bottom">
      <div class="container">
        <hr class="m-0" />
        <div class="row mt-3">
          <div class="col-md-6 copyright">
            <p class="secondary-font">© 2023 Waggy. All rights reserved.</p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="secondary-font">
              Free HTML Template by
              <a
                href="https://templatesjungle.com/"
                target="_blank"
                class="text-decoration-underline fw-bold text-black-50"
              >
                TemplatesJungle
              </a>
              Distributed by
              <a
                href="https://themewagon.com/"
                target="_blank"
                class="text-decoration-underline fw-bold text-black-50"
              >
                ThemeWagon
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <!-- footer末端 -->
</template>

<script setup>
import HeaderVendor from "@/components/HeaderVendor.vue";

import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper/modules";

import { ref, computed } from "vue";

const slides = [
  {
    image: "images/banner-img.png",
    title: "毛孩樂園",
    description: "提供專業寵物美容、洗澡與寄宿服務，讓毛孩享受頂級待遇。",
  },
  {
    image: "images/banner-img3.png",
    title: "喵星人之家",
    description: "專為貓咪打造的寵物店，提供貓咪專用玩具、食品與美容服務。",
  },
  {
    image: "images/banner-img4.png",
    title: "汪汪樂園",
    description: "狗狗專屬美容、訓練與健康檢查，讓毛小孩快樂成長。",
  },
];

const filters = [
  { label: "全部", value: "*" },
  { label: "貓咪", value: "cat" },
  { label: "狗狗", value: "dog" },
  { label: "鳥兒", value: "bird" },
];

const activeFilter = ref("*");
const vendorList = ref([
  {
    id: 1,
    name: "毛孩樂園",
    description: "專業寵物美容",
    category: "dog",
    logoImgBase64: "images/vendor1.png",
  },
  {
    id: 2,
    name: "喵星人之家",
    description: "貓咪專屬用品",
    category: "cat",
    logoImgBase64: "images/vendor2.png",
  },
  {
    id: 3,
    name: "鳥兒樂園",
    description: "鳥兒專屬服務",
    category: "bird",
    logoImgBase64: "images/vendor3.png",
  },
]);

const setFilter = (filter) => {
  activeFilter.value = filter;
};

const filteredVendors = computed(() => {
  if (activeFilter.value === "*") {
    return vendorList.value;
  }
  return vendorList.value.filter(
    (vendor) => vendor.category === activeFilter.value
  );
});
</script>

<style>
.filter-button.active {
  font-weight: bold;
  border-bottom: 2px solid black;
}
</style>
