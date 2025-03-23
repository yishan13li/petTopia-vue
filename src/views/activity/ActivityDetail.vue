<template>
  <!-- 主要內容開始 -->
  <div class="padding-medium mt-xl-5">
    <div
      class="container rounded-4"
      style="background-color: #f9f3ec; padding: 20px"
    >
      <div class="row align-items-center mt-xl-5">
        <div class="h-auto offset-md-1 col-md-5">
          <div class="d-flex justify-content-center">
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
                ><div
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
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
              >
                查看同型別活動
              </button></span
            >
            <span v-else style="color: gray">( 無分類 )</span>
          </p>

          <p>
            開始時間：<b>{{ activity.startTime }}</b>
          </p>
          <p>
            結束時間：<b>{{ activity.endTime }}</b>
          </p>
          <p>
            地址：<b>{{ activity.address }}</b>
          </p>
          <p>
            需要報名：<b v-if="activity.isRegistrationRequired">是</b
            ><b v-else>否</b>
          </p>

          <p v-if="activity.isRegistrationRequired">
            報名人數：<b>{{ currentPeople }}</b
            ><button
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
              >
                分享
              </button>
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
  </div>
  <!-- 主要內容結束 -->

  <!-- 留言區開始 -->
  <div class="container" style="padding: 20px" v-if="reviewList.length != 0">
    <div
      class="section-header d-md-flex justify-content-between align-items-center mb-3"
    >
      <h2 class="display-6 fw-normal">留言區</h2>
    </div>

    <div v-for="review in reviewList" :key="review.reviewId">
      <div class="comment">
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

                <p>發表時間：{{ review.reviewTime }}</p>

                <p>
                  留言內容：
                  <span v-if="review.reviewContent">{{
                    review.reviewContent
                  }}</span>
                  <span style="color: gray" v-else>( 沒有內容 )</span>
                </p>

                <div class="d-flex flex-wrap mt-3">
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
  <section id="clothing" class="my-5 overflow-hidden">
    <div class="container pb-5">
      <div
        class="section-header d-md-flex justify-content-between align-items-center mb-3"
      >
        <h2 class="display-6 fw-normal">其他活動</h2>
      </div>

      <div class="row">
        <div
          class="item bird col-md-4 col-lg-3 my-4"
          v-for="activity in activityList"
          :key="activity.id"
        >
          <div class="card position-relative">
            <div class="card-body p-0">
              <a>
                <h2 class="card-title pt-4 m-0">
                  <a :href="`/activity/detail/${activity.id}`">{{
                    activity.name
                  }}</a>
                </h2>
              </a>

              <div class="card-text">
                <span class="rating secondary-font">{{
                  activity.description
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- 活動列表 -->

  <!-- 報名狀態視窗 -->
  <div v-if="isPopupConditionVisible" class="overlay">
    <div class="popup">
      <h3><b>報名狀況</b></h3>

      <div class="scroll-container">
        <div v-if="confirmedList.length != 0">
          <h5><b>核准名單</b></h5>
          <div
            v-for="(pending, index) in confirmedList"
            :key="index"
            style="font-size: 24px"
          >
            <img
              :src="pending.member.profilePhotoBase64"
              class="img-fluid rounded-4"
              alt="image"
              style="max-width: 30px; max-height: 30px; margin: 10px"
            />{{ pending.member.name }}
          </div>
        </div>

        <div v-if="pendingList.length != 0">
          <h5><b>待核准名單</b></h5>
          <div
            v-for="(pending, index) in pendingList"
            :key="index"
            style="font-size: 24px"
          >
            <img
              :src="pending.member.profilePhotoBase64"
              class="img-fluid rounded-4"
              alt="image"
              style="max-width: 30px; max-height: 30px; margin: 10px"
            />{{ pending.member.name }}
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
      <h3><b>新增留言</b></h3>
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
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import { Navigation } from "swiper/modules";
import Swal from "sweetalert2";

import "swiper/css";
import "swiper/css/pagination";

/* 0. 取得member */
let memberId = ref(16); // 之後要改
let member = ref({ memberId: 16 }); // 之後要改

/* 1. activityId及預設游標 */
const props = defineProps({
  activityId: Number,
});
const cursorStyle = ref("default"); // 預設游標

/* 2. 活動資料 */
const activity = ref({});
const fetchActivityData = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/${props.activityId}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`); // 確認為ok

    const data = await response.json();
    activity.value = data;
  } catch (error) {
    console.error("獲取活動資料失敗:", error);
  }
};
onMounted(fetchActivityData);

/* 3. 活動圖片列表 */
const activityImageList = ref({ id: "", imageBase64: "" });

const fetchActivityImageList = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/${props.activityId}/image`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    activityImageList.value = data;
  } catch (error) {
    console.error("獲取活動圖片列表失敗:", error);
  }
};
onMounted(fetchActivityImageList);

/* 4. 留言區 */
const reviewList = ref([]);

// watch(
//   reviewList,
//   (newList, oldList) => {
//     console.log("reviewList 變了！");
//     console.log("舊值:", oldList);
//     console.log("新值:", newList);
//   },
//   { deep: true } // 需要加 `deep: true` 才能監聽陣列內部變化
// );

const fetchReviewList = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/${props.activityId}/review`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    reviewList.value = data;
  } catch (error) {
    console.error("獲取活動留言清單失敗:", error);
  }
};
onMounted(fetchReviewList);

/* 5. 其他活動列表 */
const activityList = ref([]);

const fetchActivityList = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/all/except/${props.activityId}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    activityList.value = data;
  } catch (error) {
    console.error("獲取店家清單失敗:", error);
  }
};
onMounted(fetchActivityList);

/* 6. 其他活動列表 */
const activityForNumberOfVisitor = ref([]);

const increaseNumberOfVisitor = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/${props.activityId}/increase/number/visitor`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    activityForNumberOfVisitor.value = data;
  } catch {
    console.error("瀏覽人數增加失敗:", error);
  }
};
onMounted(increaseNumberOfVisitor);

/* 7. 報名人數 */
const currentPeople = ref();
const maxPeople = ref();

const getActivityPeople = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/${props.activityId}/registration/people/number`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    currentPeople.value = data.currentParticipants;
    maxPeople.value = data.maxParticipants;
  } catch {
    console.error("瀏覽人數增加失敗:", error);
  }
};
onMounted(getActivityPeople);

/* 8. 是否能留言*/
const addReviewButton = ref("留言");
const isAddReviewDisabled = ref(false);

const getReviewIsExisied = async () => {
  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/member/${memberId.value}/review/exist`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  let result = await response.json();
  console.log(result);
  if (result.action) {
    addReviewButton.value = "已留言";
    isAddReviewDisabled.value = true;
  } else {
    addReviewButton.value = "留言";
    isAddReviewDisabled.value = false;
  }
};
onMounted(getReviewIsExisied);

/* 11. 活動報名 */
const registractionStatus = ref();

const getRegistractionStatus = async () => {
  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/member/${memberId.value}/regist/status`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  let result = await response.json();

  if (result.action) {
    registractionStatus.value = "已報名";
  } else {
    registractionStatus.value = "報名";
  }
};
onMounted(getRegistractionStatus);

const registActivityConfirm = async () => {
  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/member/${memberId.value}/regist/status`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  let regisitrationStatus = await response.json();

  if (regisitrationStatus.action) {
    const result = await Swal.fire({
      title: "取消報名？",
      icon: "warning",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: "確認",
      cancelButtonText: "返回",
    });
    if (result.isConfirmed) {
      registActivity();
    }
  } else {
    const result = await Swal.fire({
      title: "執行報名？",
      icon: "warning",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: "確認",
      cancelButtonText: "返回",
    });
    if (result.isConfirmed) {
      registActivity();
    }
  }
};

const registActivity = async () => {
  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/regist`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member.value),
    }
  );
  let regisitrationStatus = await response.json();

  if (regisitrationStatus.action) {
    currentPeople.value += 1;
    Swal.fire({
      title: "報名成功",
      icon: "success",
      confirmButtonText: "確定",
    });
    registractionStatus.value = "已報名";
  } else {
    currentPeople.value -= 1;
    Swal.fire({
      title: "報名取消",
      icon: "error",
      confirmButtonText: "確定",
    });
    registractionStatus.value = "報名";
  }
};

/* 12. 報名狀況 */
const isPopupConditionVisible = ref(false);
const pendingList = ref([]);
const confirmedList = ref([]);

const openRegistrationConditon = async () => {
  isPopupConditionVisible.value = true;

  const response1 = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/registration/pending`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  pendingList.value = await response1.json();

  const response2 = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/registration/confirmed`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  confirmedList.value = await response2.json();
};
const closeRegistrationConditon = () => {
  isPopupConditionVisible.value = false;
};

/* 13. 切換收藏 */
const likeStatus = ref();

const getLikeStatus = async () => {
  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/member/${memberId.value}/like/status`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  let result = await response.json();

  if (result.action) {
    likeStatus.value = "已收藏";
  } else {
    likeStatus.value = "收藏";
  }
};
onMounted(getLikeStatus);

const toggleLike = async () => {
  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/like/toggle`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member.value),
    }
  );
  let result = await response.json();

  if (result.action) {
    Swal.fire({
      title: "成功收藏",
      icon: "success",
      confirmButtonText: "確定",
    });
    likeStatus.value = "已收藏";
  } else {
    Swal.fire({
      title: "取消收藏",
      icon: "error",
      confirmButtonText: "確定",
    });
    likeStatus.value = "收藏";
  }
};

/* 14. 新增留言 */
const isPopupCommentVisible = ref(false);
const commentButton = ref(false);
const commentForm = ref({
  memberId: 16, //  之後這裡要改
  content: "",
});

const openComment = () => {
  isPopupCommentVisible.value = true;
  commentButton.value = true;
};
const closeComment = () => {
  isPopupCommentVisible.value = false;
  commentButton.value = false;
  rewriteButton.value = false;
};

const submitComment = async () => {
  const ask = await Swal.fire({
    title: "確定送出？",
    icon: "warning",
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "確認",
    cancelButtonText: "返回",
  });
  if (!ask.isConfirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/${props.activityId}/review/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentForm.value),
      }
    );
    let result = await response.json();
    if (result.success) {
      const ask = await Swal.fire({
        title: "成功送出",
        icon: "success",
        confirmButtonText: "關閉",
      });
      closeComment();

      addReviewButton.value = "已留言";
      isAddReviewDisabled.value = true;

      if (ask.isConfirmed) {
        window.location.reload();
      }
    }
  } catch (error) {
    console.error("新增留言失敗:", error);
  }
};

/* 15. 修改留言 */
const reviewIdForRewrite = ref();
const rewriteButton = ref(false);

const openRewirte = async (reviewId) => {
  isPopupCommentVisible.value = true;
  rewriteButton.value = true;
  reviewIdForRewrite.value = reviewId;

  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/review/${reviewId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    let result = await response.json();
    commentForm.value.content = result.review.reviewContent;
  } catch (error) {
    console.error("獲取留言失敗:", error);
  }
};

const submitRewrite = async (reviewId) => {
  const ask = await Swal.fire({
    title: "確定送出？",
    icon: "warning",
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "確認",
    cancelButtonText: "返回",
  });
  if (!ask.isConfirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/review/${reviewId}/rewrite`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentForm.value),
      }
    );
    let result = await response.json();

    Swal.fire({
      title: "成功送出",
      icon: "success",
      confirmButtonText: "關閉",
    });

    closeComment();

    const updatedReview = reviewList.value.find(
      (review) => review.reviewId === reviewId //  find()找到reviewList陣列中符合reviewId的留言
    );
    if (updatedReview) {
      updatedReview.reviewTime = new Date();
      updatedReview.reviewContent = result.review.reviewContent; // 更新留言內容
    }
  } catch (error) {
    console.error("修改留言失敗:", error);
  }
};

/* 16. 刪除留言 */
const deleteComment = async (reviewId) => {
  const ask = await Swal.fire({
    title: "確定刪除？",
    icon: "warning",
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "確認",
    cancelButtonText: "返回",
  });
  if (!ask.isConfirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/activity/review/${reviewId}/delete`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    let result = await response.json();

    Swal.fire({
      title: "成功刪除",
      icon: "success",
      confirmButtonText: "關閉",
    });

    closeComment();

    reviewList.value = reviewList.value.filter(
      (review) => review.reviewId !== reviewId // 過濾reviewId等於reviewId的留言
    );

    addReviewButton.value = "留言";
    isAddReviewDisabled.value = false;
  } catch (error) {
    console.error("刪除留言失敗:", error);
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

  width: 500px;
  height: 380px;
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
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 25px;
  cursor: pointer;
  font-size: 20px;
  z-index: 10;
}

.custom-prev {
  left: 10px;
}
.custom-next {
  right: 10px;
}

.custom-prev:hover,
.custom-next:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* Sweet Alert */
.swal2-container {
  z-index: 9999 !important; /* 設定比你的自定義視窗更高 */
}
</style>
