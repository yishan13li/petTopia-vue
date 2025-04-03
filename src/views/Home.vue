<template>
  <section id="banner" style="background: #F9F3EC;">
    <div class="container">
      <div class="swiper main-swiper">
        <div class="swiper-wrapper">
          <div v-for="(slide, index) in slides" :key="index" class="swiper-slide py-5">
            <div class="row banner-content align-items-center">
              <div class="img-wrapper col-md-6">
                <img :src="slide.img" class="img-fluid" alt="banner-image">
              </div>
              <div class="content-wrapper col-md-6 p-5 mb-3">
                <div class="secondary-font text-primary text-uppercase mb-4">
                  {{ slide.discount }}
                </div>
                <h3 class="banner-title display-4 fw-normal">{{ slide.title }}</h3>
                <div class="d-flex">
                  <router-link to="/shop" class="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 me-4 mt-5">
                    尋找寵物商品Go
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                      <use xlink:href="#arrow-right"></use>
                    </svg>
                  </router-link>
                  <router-link to="/vendor" class="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 mt-5">
                    尋找友善店家Go
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                      <use xlink:href="#arrow-right"></use>
                    </svg>
                  </router-link>
                </div>
              </div>
            </div>

          </div>
        </div>
        <!-- 分頁指示器 -->
        <div class="swiper-pagination mb-5"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = ref([
  {
    img: '/user_static/images/banner-img2.png',
    discount: 'petTopia 買到',
    title: '最喜愛商品',
  },
  {
    img: '/user_static/images/item5.jpg',
    discount: 'petTopia 找到',
    title: '最適合店家',
  },
  {
    img: '/user_static/images/insta4.jpg',
    discount: 'petTopia 提供',
    title: '最好玩活動',
  }
]);
onMounted(async () => {
  await nextTick();

  setTimeout(() => {
    const swiper = new Swiper('.main-swiper', {
      modules: [Autoplay, Pagination, Navigation],
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
    });

    swiper.update();
  }, 100);
});


</script>

<style scoped>
.main-swiper {
  width: 100%;
  height: 500px;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-pagination {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.img-fluid {
  max-width: 400px;
  min-width: 350px;
  margin-right: 100px;
}

.secondary-font {
  font-size: 24px;
}

.btn:hover {
  background-color: #ffca8a !important;
  color: #0b0b0b;
}
</style>
