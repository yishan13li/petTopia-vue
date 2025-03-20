<template>
  <!-- 主要內容開始 -->
  <div class="padding-medium mt-xl-5">
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
          <p>
            分類：
            <span v-if="vendor.vendorCategory"
              ><b style="color: red">{{ vendor.vendorCategory.name }}</b
              ><button
                class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
                style="margin-left: 10px"
                @click="openCategory(vendor.vendorCategory.id)"
              >
                查看同類別店家
              </button></span
            >
            <span v-else style="color: gray">( 無分類 )</span>
          </p>
          <p>
            地址：<b>{{ vendor.address }}</b>
          </p>
          <p>
            電話：<b>{{ vendor.phone }}</b>
          </p>
          <p>
            信箱：<b>{{ vendor.contactEmail }}</b>
          </p>
          <p>
            統編：<b>{{ vendor.taxidNumber }}</b>
          </p>
          <p>
            聯絡人：<b>{{ vendor.contactPerson }}</b>
          </p>

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
                @click="openStar"
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
          <div
            @click="openMember()"
            :style="{ cursor: cursorStyle }"
            @mouseover="cursorStyle = 'zoom-in'"
            @mouseleave="cursorStyle = 'default'"
          >
            <b>查看誰收藏</b>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 主要內容結束 -->

  <!-- 圖片區開始 -->
  <div
    class="padding-medium mt-xl-5"
    style="padding: 20px"
    v-if="imageList.length != 0"
  >
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
        style="max-width: 500px; max-height: 300px; margin: 10px"
      />
    </div>
  </div>
  <!-- 圖片區結束 -->

  <!-- 留言區開始 -->
  <div class="container" style="padding: 20px" v-if="reviewList.length != 0">
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

                <p>發表時間：{{ review.reviewTime }}</p>

                <p>
                  留言內容：
                  <span v-if="review.reviewContent">{{
                    review.reviewContent
                  }}</span>
                  <span style="color: gray" v-else>( 沒有內容 )</span>
                </p>

                <!-- 評論之圖片 -->
                <div>
                  留言圖片：
                  <span>
                    <span
                      v-if="review.reviewPhotos.length == 0"
                      style="color: gray"
                      >( 沒有圖片 )</span
                    >
                    <span v-else style="display: flex; flex-wrap: wrap">
                      <img
                        v-for="(photo, index) in review.reviewPhotos"
                        :key="index"
                        :src="photo.photoBase64"
                        class="img-fluid rounded-4"
                        alt="image"
                        style="
                          max-width: 150px;
                          max-height: 150px;
                          margin: 10px;
                        "
                      />
                    </span>
                  </span>
                </div>
                <!-- 評論之圖片 -->

                <div class="d-flex flex-wrap mt-3">
                  <!-- <button
                    class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 me-4"
                    :disabled="!review.hasPhotos"
                    @click="openReviewPhotos(review.reviewId)"
                  >
                    圖片{{ review.reviewId }}
                  </button> -->

                  <button
                    class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 me-4"
                    @click="openRewrite(review.reviewId)"
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

  <!-- 收藏視窗 -->
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
  <!-- 收藏視窗 -->

  <!-- 留言視窗 -->
  <div v-if="isPopupReviewVisible" class="overlay">
    <div class="popup">
      <h3><b>留言</b></h3>
      <form @submit.prevent="submitReview">
        <textarea
          v-model="review.content"
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
  <!-- 留言視窗 -->

  <!-- 留言圖片視窗 -->
  <!-- <div v-if="isPopupPhotosVisible" class="overlay">
    <div class="popup">
      <h3><b>評論照片</b></h3>

      <div class="d-flex flex-row">
        <img
          v-for="(photo, index) in reviewPhotoList"
          :key="index"
          :src="photo.photoBase64"
          class="img-fluid rounded-4"
          alt="image"
          style="max-width: 150px; max-height: 150px; margin: 30px"
        />
      </div>

      <button
        class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        @click="closeReviewPhotos"
      >
        關閉
      </button>
    </div>
  </div> -->
  <!-- 留言圖片視窗 -->

  <!-- 留言改寫視窗 -->
  <div v-if="isPopupRewriteVisible" class="overlay">
    <div class="popup">
      <h3><b>修改留言</b></h3>
      <form @submit.prevent="submitRewirte()">
        <textarea
          v-model="rewrite.reviewContent"
          rows="6"
          col="400"
          style="resize: none"
        ></textarea>
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
          @click="closeRewrite()"
        >
          取消
        </button>
      </form>
    </div>
  </div>
  <!-- 留言改寫視窗 -->

  <!-- 星星視窗 -->
  <div v-if="isPopupStarVisible" class="overlay">
    <div class="popup">
      <h3><b>給點評分</b></h3>
      <div class="stars">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{
            active: tempRating1 > 0 ? star <= tempRating1 : star <= rating1, // hover執行順序優於click
          }"
          @click="setRating1(star)"
          @mouseover="hoverRating1(star)"
          @mouseout="resetHover1"
        >
          ★
        </span>
        <span>環境：{{ rating1 }}</span>
      </div>

      <div class="stars">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{
            active: tempRating2 > 0 ? star <= tempRating2 : star <= rating2, // hover執行順序優於click
          }"
          @click="setRating2(star)"
          @mouseover="hoverRating2(star)"
          @mouseout="resetHover2"
        >
          ★
        </span>
        <span>價格：{{ rating2 }}</span>
      </div>

      <div class="stars">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{
            active: tempRating3 > 0 ? star <= tempRating3 : star <= rating3, // hover執行順序優於click
          }"
          @click="setRating3(star)"
          @mouseover="hoverRating3(star)"
          @mouseout="resetHover3"
        >
          ★
        </span>
        <span>服務：{{ rating3 }}</span>
      </div>

      <button
        class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        style="margin: 10px"
      >
        重設</button
      ><br />
      <button
        class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        @click="closeStar()"
        style="margin: 5px"
      >
        取消
      </button>
      <button
        class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        @click="sendStar()"
        style="margin: 5px"
      >
        送出
      </button>
    </div>
  </div>
  <!-- 星星視窗 -->

  <!-- 收藏名單視窗 -->
  <div v-if="isPopupMemberVisible" class="overlay">
    <div class="popup">
      <h3><b>有誰收藏</b></h3>
      <div class="scroll-container" v-if="memberList.length != 0">
        <div
          v-for="(member, index) in memberList"
          :key="index"
          style="font-size: 24px"
        >
          <img
            :src="member.profilePhotoBase64"
            class="img-fluid rounded-4"
            alt="image"
            style="max-width: 30px; max-height: 30px; margin: 10px"
          />{{ member.name }}
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

  <!-- 同類別店家視窗 -->
  <div v-if="isPopupCategoryVisible" class="overlay">
    <div class="popup">
      <h3>
        <b
          >同類別店家：<span style="color: red">{{
            categoryVendorList[0].vendorCategory.name
          }}</span></b
        >
      </h3>
      <div class="scroll-container" v-if="categoryVendorList.length != 0">
        <div
          v-for="(vendor, index) in categoryVendorList"
          :key="index"
          style="font-size: 24px"
        >
          <img
            :src="vendor.logoImgBase64"
            class="img-fluid rounded-4"
            alt="image"
            style="max-width: 30px; max-height: 30px; margin: 10px"
          /><a :href="`/vendor/detail/${vendor.id}`">{{ vendor.name }}</a>
        </div>
      </div>
      <div v-else style="color: gray; margin: 50px">
        目前沒有其他同類別店家～
      </div>
      <button
        class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        style="margin: 5px"
        @click="closeCategory()"
      >
        關閉
      </button>
    </div>
  </div>
  <!-- 同類別店家視窗 -->
</template>

<script setup>
import { ref, onMounted } from "vue";

/* 主要內容 */
/* 1. vendorId及預設游標 */
const props = defineProps({
  vendorId: Number,
});
const cursorStyle = ref("default"); // 預設游標

/* 2. 店家資料 */
const vendor = ref({
  name: "載入中...",
  description: "請稍候，正在獲取店家資訊...",
  vendorCategory: { name: "載入中..." },
  logoImgBase64: null,
});

const fetchVendorData = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/${props.vendorId}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`); // 確認為ok

    const data = await response.json();
    vendor.value = data;
  } catch (error) {
    console.error("獲取店家資料失敗:", error);
  }
};
onMounted(fetchVendorData);

/* 3. 店家圖片列表 */
const imageList = ref([]);

const fetchVendorImageList = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/${props.vendorId}/image`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    imageList.value = data;
  } catch (error) {
    console.error("獲取店家圖片列表失敗:", error);
  }
};
onMounted(fetchVendorImageList);

/* 4. 留言區 */
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
    reviewPhotos: "",
  },
]);

const fetchVendorReviewList = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/${props.vendorId}/review`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    reviewList.value = data;
  } catch (error) {
    console.error("獲取店家評論清單失敗:", error);
  }
};
onMounted(fetchVendorReviewList);

/* 5. 其他店家列表 */
const vendorList = ref([
  {
    id: 1,
    name: "載入中...",
    description: "請稍候，正在獲取店家資訊...",
    logoImgBase64: null,
  },
]);

const fetchVendorList = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/all/except/${props.vendorId}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    vendorList.value = data;
  } catch (error) {
    console.error("獲取店家清單失敗:", error);
  }
};
onMounted(fetchVendorList);

/* 11. 收藏視窗 */
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

/* 12. 留言視窗 */
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
  formData.append("memberId", 12); // 之後要改寫
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

    alert("留言提交成功！");
    review.value = { memberId: "", content: "", reviewPhotos: [] };

    window.location.reload(); // 重刷頁面，之後有時間改渲染
  } catch (error) {
    console.error("提交失敗:", error);
    alert("提交失敗，請重試！");
  } finally {
    closeReview();
  }
};

/* 13. 留言圖片視窗 */
// const reviewPhotoList = ref({
//   id: "",
//   photo: [],
// });
// const isPopupPhotosVisible = ref(false);

// const fetchReviewPhotoList = async (reviewId) => {
//   try {
//     const response = await fetch(
//       `http://localhost:8080/api/vendor/review/${reviewId}/photo`
//     );
//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//     const data = await response.json();
//     reviewPhotoList.value = data;
//   } catch (error) {
//     console.error("獲取評論圖片失敗:", error);
//   }
// };

// const openReviewPhotos = (reviewId) => {
//   isPopupPhotosVisible.value = true;
//   fetchReviewPhotoList(reviewId);
// };

// const closeReviewPhotos = () => {
//   isPopupPhotosVisible.value = false;
// };

/* 14. 留言改寫視窗 */
const rewrite = ref({
  reviewContent: "載入中",
});
const rewriteReviewId = ref(0); // 此全域變數為修改留言送出之使用
const isPopupRewriteVisible = ref(false);

const openRewrite = (reviewId) => {
  isPopupRewriteVisible.value = true;

  const fetchReviewContent = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/vendor/review/${reviewId}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      // rewrite.value.content = data.review.reviewContent;
      rewrite.value = data.review;
    } catch (error) {
      console.error("獲取評論失敗:", error);
    }
  };

  fetchReviewContent(reviewId);
  rewriteReviewId.value = reviewId; // 將一個全域變數設值讓送出的函數可用
};

const submitRewirte = async () => {
  if (!rewrite.value.reviewContent) {
    alert("留言不得空白!");
    return;
  }

  const formData = new FormData();
  formData.append("content", rewrite.value.reviewContent);

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/review/${rewriteReviewId.value}/rewrite`,
      {
        method: "POST",
        body: formData, // fetch 會自動處理 Content-Type
      }
    );

    const updatedReview = reviewList.value.find(
      (review) => review.reviewId === rewriteReviewId.value //  find()找到reviewList陣列中符合reviewId的留言
    );
    if (updatedReview) {
      updatedReview.reviewContent = rewrite.value.reviewContent; // 更新留言內容
    }

    alert("留言修改成功！");
  } catch (error) {
    console.error("提交失敗:", error);
    alert("留言修改失敗，請重試！");
  } finally {
    closeRewrite();
  }
};

const closeRewrite = () => {
  isPopupRewriteVisible.value = false;
};

/* 14. 留言刪除 */
const deleteComment = async (reviewId) => {
  const isConfirmed = window.confirm("確定刪除留言？");
  if (!isConfirmed) return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/review/${reviewId}/delete`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    alert("留言刪除成功！");

    reviewList.value = reviewList.value.filter(
      (review) => review.reviewId !== reviewId // 過濾reviewId等於reviewId的留言
    );
  } catch (error) {
    console.error("提交失敗:", error);
    alert("留言刪除失敗！");
  } finally {
    closeRewrite();
  }
};

/* 15. 星星評分視窗 */
const isPopupStarVisible = ref(false);
const rating1 = ref(0);
const tempRating1 = ref(0);
const rating2 = ref(0);
const tempRating2 = ref(0);
const rating3 = ref(0);
const tempRating3 = ref(0);

// 第一組
const setRating1 = (value) => {
  rating1.value = value;
};
const hoverRating1 = (value) => {
  tempRating1.value = value;
};
const resetHover1 = () => {
  tempRating1.value = 0;
};

// 第二組
const setRating2 = (value) => {
  rating2.value = value;
};
const hoverRating2 = (value) => {
  tempRating2.value = value;
};
const resetHover2 = () => {
  tempRating2.value = 0;
};

// 第三組
const setRating3 = (value) => {
  rating3.value = value;
};
const hoverRating3 = (value) => {
  tempRating3.value = value;
};
const resetHover3 = () => {
  tempRating3.value = 0;
};

const openStar = () => {
  isPopupStarVisible.value = true;
};

const sendStar = async () => {
  if (rating1.value == 0 || rating2.value == 0 || rating3.value == 0) {
    alert("仍有項目未評分唷！");
    return;
  }
  const formData = new FormData();
  formData.append("memberId", 16); // 這裡之後要改
  formData.append("ratingEnv", rating1.value);
  formData.append("ratingPrice", rating2.value);
  formData.append("ratingService", rating3.value);

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/${props.vendorId}/review/star/add`,
      {
        method: "POST",
        body: formData, // fetch 會自動處理 Content-Type
      }
    );

    alert("評分提交成功！");
    closeStar();
    window.location.reload(); // 重刷頁面，之後有時間改渲染
  } catch (error) {
    console.error("評分提交失敗:", error);
    alert("提交失敗，請重試！");
  } finally {
    closeReview();
  }
};

const closeStar = () => {
  isPopupStarVisible.value = false;
};

/* 16. 收藏之會員視窗 */
const isPopupMemberVisible = ref(false);
const memberList = ref([
  {
    memberId: "載入中",
    name: "",
    gender: "",
    profilePhoto: "",
    profilePhotoBase64: "",
  },
]);

const openMember = async () => {
  isPopupMemberVisible.value = true;

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/${props.vendorId}/like`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    let members = await response.json();
    memberList.value = members;
  } catch (error) {
    console.error("讀取會員失敗:", error);
  }
};

const closeMember = () => {
  isPopupMemberVisible.value = false;
};

/* 17. 同類別店家視窗 */
const categoryVendorList = ref([
  {
    id: "",
    name: "",
    description: "",
    vendorCategory: {
      id: "",
      name: "",
    },
  },
]);
const isPopupCategoryVisible = ref(false);
const openCategory = async (categoryId) => {
  isPopupCategoryVisible.value = true;

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/category/${categoryId}/except/vendor/${props.vendorId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    let result = await response.json();
    categoryVendorList.value = result;
  } catch (error) {
    console.error("讀取同類別店家失敗:", error);
  }
};
const closeCategory = () => {
  isPopupCategoryVisible.value = false;
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

  width: 500px;
  height: 380px;
  max-width: 90%;
}

/* 星星樣式 */
.stars {
  display: flex;
  justify-content: center;
  font-size: 30px;
  cursor: pointer;
}
.star {
  color: gray;
  transition: color 0.2s;
}
.star.active {
  color: gold;
}
.star.hover {
  color: gold;
}

/* 會員視窗 */
.scroll-container {
  max-height: 240px; /* 設定最大高度，超過則產生滾動條 */
  overflow-y: auto; /* 當內容超過 max-height 時顯示垂直滾動條 */
  border: 1px solid #ccc; /* 可選，增加邊框以區分區塊 */
  padding: 10px; /* 可選，增加內邊距 */
}
</style>
