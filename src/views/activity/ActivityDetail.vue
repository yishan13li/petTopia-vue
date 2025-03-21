<template>
  <!-- 主要內容開始 -->
  <div class="padding-medium mt-xl-5">
    <div
      class="container rounded-4"
      style="background-color: #f9f3ec; padding: 20px"
    >
      <div class="row align-items-center mt-xl-5">
        <div class="h-auto offset-md-1 col-md-5">
          <!-- <img
            :src="vendor.logoImgBase64"
            alt="店家圖片"
            class="img-fluid rounded-4"
            width="400"
          /> -->
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
            需要報名：<b>{{ activity.isRegistrationRequired }}</b>
          </p>
          <p>
            報名人數：<b>{{ currentPeople }}</b
            ><button
              style="margin-left: 10px"
              class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
              @click="registActivity()"
            >
              報名
            </button>
            <button
              class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
              @click="openRegistrationConditon()"
            >
              報名狀態
            </button>
          </p>
          <p>
            報名人數上限：<b>{{ maxPeople }}</b>
          </p>
          <p>
            瀏覽人數：<b>{{ activityForNumberOfVisitor.numberVisitor }}</b>
          </p>

          <div class="d-flex">
            <div class="d-flex flex-wrap mt-3">
              <button
                class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
              >
                收藏
              </button>
              <button
                class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
              >
                留言
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

  <!-- 圖片區開始 -->
  <div
    class="padding-medium mt-xl-5"
    style="padding: 20px"
    v-if="activityImageList.length != 0"
  >
    <div class="container">
      <div
        class="section-header d-md-flex justify-content-between align-items-center mb-3"
      >
        <h2 class="display-6 fw-normal">活動圖片列表</h2>
      </div>
    </div>

    <div
      class="container rounded-4"
      style="background-color: #f9f3ec; padding: 20px"
    >
      <!-- 這裡還要補寫放大圖片功能 -->
      <img
        v-for="(image, index) in activityImageList"
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

    <div v-for="review in reviewList" :key="review.reviewId">
      <div class="comment" :data-id="review.reviewId">
        <div
          class="container rounded-3"
          style="background-color: #f9f3ec; padding: 20px"
        >
          <div class="row">
            <div class="col-lg-3">
              <div class="image-container">
                <!-- <img
                  class="img-fluid rounded-4"
                  :src="review.profilePhotoBase64"
                  alt="alternative"
                  style="max-width: 200px; max-height: 200px"
                /> -->
                <!-- 放user照片  -->
              </div>
            </div>

            <div class="col-lg-9">
              <div class="text-container" style="padding-top: 20px">
                <h2>
                  <b>{{ review.name }}</b>
                  <!-- 放user名字  -->
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
                  >
                    修改
                  </button>

                  <button
                    class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 me-4"
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
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

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
const activityImageList = ref([]);

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

/* 11. 活動報名 */
const registActivity = async () => {
  let member = {
    memberId: 16, // 之後這裡要改
  };

  const response = await fetch(
    `http://localhost:8080/api/activity/${props.activityId}/regist`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    }
  );
  let regisitrationStatus = await response.json();

  if (regisitrationStatus.action) {
    console.log("成功報名");
    currentPeople.value += 1;
  } else {
    console.log("取消報名");
    currentPeople.value -= 1;
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
</style>
