<template>
  <!-- 主要內容開始 -->
  <section id="about" class="padding-medium mt-xl-5">
    <div
      class="container rounded-4"
      style="background-color: #f9f3ec; padding: 20px"
    >
      <div class="row align-items-center mt-xl-5">
        <div class="h-auto offset-md-1 col-md-5">
          <img
            :src="vendor.logoImgBase64"
            alt="店家圖片"
            class="img-fluid rounded-4"
            width="400"
          />
        </div>

        <div class="col-md-5 mt-5 mt-md-0">
          <div class="mb-3">
            <h2 class="display-6 fw-semibold">{{ vendor.name }}</h2>
          </div>
          <p>{{ vendor.description }}</p>
          <div class="d-flex">
            <div class="d-flex flex-wrap mt-3">
              <button
                class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
                @click="addToFavorites"
              >
                收藏
              </button>
              <button
                class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
                @click="rateVendor"
              >
                評分
              </button>
              <button
                class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
                @click="leaveComment"
              >
                留言
              </button>
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
  </section>
  <!-- 主要內容結束 -->

  <!-- 圖片區開始 -->
  <section id="about" class="padding-medium mt-xl-5" style="padding: 20px">
    <div class="container">
      <div
        class="section-header d-md-flex justify-content-between align-items-center mb-3"
      >
        <h2 class="display-6 fw-normal">店家圖片列表</h2>
      </div>
    </div>

    <div
      class="container rounded-4"
      style="background-color: #f9f3ec; padding: 20px"
    >
      <img
        v-for="(image, index) in imageList"
        :key="index"
        :src="image.imageBase64 || 'https://via.placeholder.com/500x300'"
        class="img-fluid rounded-4"
        alt="image"
        style="max-width: 500px; max-height: 300px; margin-right: 10px"
      />
    </div>
  </section>
  <!-- 圖片區結束 -->

  <!-- 留言區開始 -->
  <div class="container" style="padding: 20px">
    <div
      class="section-header d-md-flex justify-content-between align-items-center mb-3"
    >
      <h2 class="display-6 fw-normal">留言區</h2>
    </div>

    <section v-for="review in reviewList" :key="review.reviewId">
      <div class="comment" :data-id="review.reviewId">
        <div
          class="container rounded-3"
          style="background-color: #f9f3ec; padding: 20px"
        >
          <div class="row">
            <div class="col-lg-3">
              <div class="image-container">
                <img
                  class="img-fluid rounded-4"
                  :src="review.profilePhotoBase64"
                  alt="alternative"
                  style="max-width: 200px; max-height: 200px"
                />
              </div>
            </div>

            <div class="col-lg-9">
              <div class="text-container" style="padding-top: 20px">
                <h2>
                  <b>{{ review.name }}</b>
                </h2>

                <p>
                  環境評分：
                  <span
                    v-for="i in review.ratingEnvironment"
                    :key="'env-gold-' + i"
                    style="color: gold"
                    >★
                  </span>
                  <span
                    v-for="i in 5 - (review.ratingEnvironment || 0)"
                    :key="'env-gray-' + i"
                    style="color: gray"
                    >★
                  </span>
                </p>

                <p>
                  價格評分：
                  <span
                    v-for="i in review.ratingPrice"
                    :key="'price-gold-' + i"
                    style="color: gold"
                    >★
                  </span>
                  <span
                    v-for="i in 5 - (review.ratingPrice || 0)"
                    :key="'price-gray-' + i"
                    style="color: gray"
                    >★
                  </span>
                </p>

                <p>
                  服務評分：
                  <span
                    v-for="i in review.ratingService"
                    :key="'service-gold-' + i"
                    style="color: gold"
                    >★
                  </span>
                  <span
                    v-for="i in 5 - (review.ratingService || 0)"
                    :key="'service-gray-' + i"
                    style="color: gray"
                    >★
                  </span>
                </p>

                <p>
                  <b>發表時間：{{ review.reviewTime }}</b>
                </p>

                <p>{{ review.reviewContent }}</p>

                <div class="d-flex flex-wrap mt-3">
                  <button
                    class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 me-4"
                    @click="rewriteComment(review.reviewId)"
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
    </section>
  </div>
  <!-- 留言區結束 -->
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";

/* 主要內容 */
/* 1. 接收從父元件傳來的 vendorId */
const props = defineProps({
  vendorId: Number,
});

/* 2. vendor 的預設資料 */
const vendor = ref({
  name: "載入中...",
  description: "請稍候，正在獲取店家資訊...",
  logoImgBase64: null,
});

/* 3. 透過 API 獲取資料 */
const fetchVendorData = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/vendor/${props.vendorId}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`); // 確認為ok

    const data = await response.json();
    vendor.value = data.vendor;
  } catch (error) {
    console.error("獲取店家資料失敗:", error);
  }
};
onMounted(fetchVendorData); // 當元件掛載到 DOM 後，立即發送 API 請求

// const addToFavorites = () => {
//   alert(`已收藏 ${vendor.value.name}`);
// };

// const rateVendor = () => {
//   alert(`請為 ${vendor.value.name} 評分`);
// };

// const leaveComment = () => {
//   alert(`請留言給 ${vendor.value.name}`);
// };

/* 店家圖片列表 */
/* 5. 圖片列表預設資料 */
const imageList = ref([]);

/* 6. 透過 API 獲取圖片列表 */
const fetchVendorImageList = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/vendor/${props.vendorId}/image`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    imageList.value = data.imageList || [];
  } catch (error) {
    console.error("獲取店家圖片列表失敗:", error);
  }
};
onMounted(fetchVendorImageList);

/* 留言區 */
/* 7. 留言區預設資料 */
const reviewList = ref([
  {
    reviewId: 1,
    name: "載入中...",
    profilePhotoBase64: null,
    ratingEnvironment: 0,
    ratingPrice: 0,
    ratingService: 0,
    reviewTime: "載入中...",
    reviewContent: "載入中...",
  },
]);

/* 8. 透過 API 獲取評論清單 */
const fetchVendorReviewList = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/vendor/${props.vendorId}/review`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    reviewList.value = data.reviewList;
  } catch (error) {
    console.error("獲取店家評論清單失敗:", error);
  }
};
onMounted(fetchVendorReviewList);

// 修改留言
// const rewriteComment = (id) => {
//   console.log("修改留言 ID:", id);
// };

// 刪除留言
// const deleteComment = (id) => {
//   console.log("刪除留言 ID:", id);
//   reviewList.value = reviewList.value.filter(
//     (review) => review.reviewId !== id
//   );
// };
</script>

<style></style>
