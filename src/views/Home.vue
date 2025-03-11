<template>
  <section id="banner" style="background: #F9F3EC;">
    <div class="container">
      <div class="swiper main-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide py-5">
            <div class="row banner-content align-items-center">
              <div class="img-wrapper col-md-5">
                <img src="/user_static/images/banner-img.png" class="img-fluid">
              </div>
              <div class="content-wrapper col-md-7 p-5 mb-5">
                <div class="secondary-font text-primary text-uppercase mb-4">Save 10 - 20 % off</div>
                <h2 class="banner-title display-1 fw-normal">Best destination for <span class="text-primary">your
                    pets</span></h2>
                <div class="d-flex">
                  <router-link to="/shop/" class="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 me-4">
                    尋找寵物商品Go
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                      <use xlink:href="#arrow-right"></use>
                    </svg>
                  </router-link>
                  <a href="#" class="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">
                    尋找友善店家Go
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                      <use xlink:href="#arrow-right"></use>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="swiper-slide py-5">
            <div class="row banner-content align-items-center">
              <div class="img-wrapper col-md-5">
                <img src="/user_static/images/banner-img3.png" class="img-fluid">
              </div>
              <div class="content-wrapper col-md-7 p-5 mb-5">
                <div class="secondary-font text-primary text-uppercase mb-4">Save 10 - 20 % off</div>
                <h2 class="banner-title display-1 fw-normal">Best destination for <span class="text-primary">your
                    pets</span></h2>
                <div class="d-flex">
                  <router-link to="/shop/" class="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 me-4">
                    尋找寵物商品Go
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                      <use xlink:href="#arrow-right"></use>
                    </svg>
                  </router-link>
                  <a href="#" class="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">
                    尋找友善店家Go
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                      <use xlink:href="#arrow-right"></use>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="swiper-slide py-5">
            <div class="row banner-content align-items-center">
              <div class="img-wrapper col-md-5">
                <img src="/user_static/images/banner-img4.png" class="img-fluid">
              </div>
              <div class="content-wrapper col-md-7 p-5 mb-5">
                <div class="secondary-font text-primary text-uppercase mb-4">Save 10 - 20 % off</div>
                <h2 class="banner-title display-1 fw-normal">Best destination for <span class="text-primary">your
                    pets</span></h2>
                <div class="d-flex">
                  <router-link to="/shop/" class="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 me-4">
                    尋找寵物商品Go
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                      <use xlink:href="#arrow-right"></use>
                    </svg>
                  </router-link>
                  <a href="#" class="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">
                    尋找友善店家Go
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                      <use xlink:href="#arrow-right"></use>
                    </svg>
                  </a>
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
import { onMounted } from 'vue';

onMounted(() => {

  const swiper = new Swiper('.main-swiper', {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });
});

</script>
<style></style>
