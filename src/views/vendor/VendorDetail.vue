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
                @click="openLike"
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
                @click="openReview"
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
        :src="image.imageBase64"
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

  <!-- 店家列表 -->
  <section id="clothing" class="my-5 overflow-hidden">
    <div class="container pb-5">
      <div
        class="section-header d-md-flex justify-content-between align-items-center mb-3"
      >
        <h2 class="display-6 fw-normal">其他店家</h2>
      </div>

      <div class="row">
        <div
          class="item bird col-md-4 col-lg-3 my-4"
          v-for="vendorEach in vendorList"
          :key="vendorEach.id"
        >
          <!-- <div class="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">New</div> -->

          <div class="card position-relative">
            <a :href="`/vendor/detail/${vendorEach.id}`"
              ><img
                :src="vendorEach.logoImgBase64"
                class="img-fluid rounded-4"
                alt="image"
                style="max-width: 200px; max-height: 200px"
            /></a>
            <div class="card-body p-0">
              <a>
                <h2 class="card-title pt-4 m-0">{{ vendorEach.name }}</h2>
              </a>

              <div class="card-text">
                <span class="rating secondary-font">{{
                  vendorEach.description
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- 店家列表 -->

  <!-- 收藏彈跳視窗 -->
  <div v-if="isPopupLikeVisible" class="overlay">
    <div class="popup">
      <h3>
        <b>{{ likeContent }}</b>
      </h3>
      <div>
        <img :src="likeGif" style="max-width: 150px; max-height: 150px" />
      </div>
      <br />
      <button
        class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        @click="closeLike"
      >
        關閉
      </button>
    </div>
  </div>
  <!-- 收藏彈跳視窗 -->

  <!-- 留言彈跳視窗 -->
  <div v-if="isPopupReviewVisible" class="overlay">
    <div class="popup">
      <h3><b>留言</b></h3>
      <form @submit.prevent="submitReview">
        <textarea
          v-model="review.content"
          id="newInputField"
          name="context"
          placeholder="輸入感想"
          rows="5"
          col="10"
          style="resize: none"
          required
        ></textarea>
        <input type="file" multiple @change="handleFileUpload" />
        <br />
        <button
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          type="submit"
        >
          送出
        </button>
        &emsp;
        <button
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          @click="closeReview"
        >
          取消
        </button>
      </form>
    </div>
  </div>
  <!-- 留言彈跳視窗 -->
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
    vendor.value = data;
  } catch (error) {
    console.error("獲取店家資料失敗:", error);
  }
};
onMounted(fetchVendorData); // 當元件掛載到 DOM 後，立即發送 API 請求

const addToFavorites = () => {
  alert(`已收藏 ${vendor.value.name}`);
};

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
    imageList.value = data;
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
    reviewList.value = data;
  } catch (error) {
    console.error("獲取店家評論清單失敗:", error);
  }
};
onMounted(fetchVendorReviewList);

/* 9. 店家列表預設資料 */
const vendorList = ref([
  {
    id: 1,
    name: "載入中...",
    description: "請稍候，正在獲取店家資訊...",
    logoImgBase64: null,
  },
]);

/* 10. 透過 API 獲取店家清單 */
const fetchVendorList = async () => {
  try {
    const response = await fetch(`http://localhost:8080/vendor/all`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    vendorList.value = data;
  } catch (error) {
    console.error("獲取店家評論清單失敗:", error);
  }
};
onMounted(fetchVendorList);

/* 彈跳視窗 */
/* 11. 收藏彈跳視窗 */
const likeContent = ref("載入中...");
const likeGif = ref("");
const isPopupLikeVisible = ref(false);
const openLike = async () => {
  isPopupLikeVisible.value = true;

  let data = {
    memberId: 15, // 這裡之後要改成實際的會員 ID
  };
  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/${props.vendorId}/like/toggle`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    let likeData = await response.json();
    console.log(likeData);
    if (likeData.action) {
      likeContent.value = "成功收藏";
      likeGif.value = "/user_static/images/tool/yes.gif";
    } else {
      likeContent.value = "取消收藏";
      likeGif.value = "/user_static/images/tool/no.gif";
    }
  } catch (error) {
    console.error("切換收藏失敗:", error);
  }
};
const closeLike = () => {
  isPopupLikeVisible.value = false;
};

/* 12. 評論彈跳視窗 */
const review = ref({
  memberId: "",
  content: "",
  reviewPhotos: [],
});
const isPopupReviewVisible = ref(false);
const openReview = async () => {
  isPopupReviewVisible.value = true;
};
const closeReview = () => {
  isPopupReviewVisible.value = false;
};
const handleFileUpload = (event) => {
  review.value.reviewPhotos = Array.from(event.target.files); // 儲存選擇的圖片
};
const submitReview = async () => {
  if (!review.value.content) {
    alert("留言不得空白!");
    return;
  }

  const formData = new FormData();
  formData.append("memberId", 11); // 之後要改寫
  formData.append("content", review.value.content);

  review.value.reviewPhotos.forEach((file) => {
    formData.append("reviewPhotos", file);
  });

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/${props.vendorId}/review/add`,
      {
        method: "POST",
        body: formData, // fetch 會自動處理 Content-Type
      }
    );

    alert("評論提交成功！");
    review.value = { memberId: "", content: "", reviewPhotos: [] };
  } catch (error) {
    console.error("提交失敗:", error);
    alert("提交失敗，請重試！");
  } finally {
    closeReview();
  }
};
</script>

<style>
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

  z-index: 9999;
}

/* 彈出框樣式 */
.popup {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;

  width: 400px;
  height: 350px;
  max-width: 90%;
}
</style>
