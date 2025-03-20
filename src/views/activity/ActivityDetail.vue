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
            需要報名：<button
              class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4"
            >
              報名</button
            ><b>{{ activity.isRegistrationRequired }}</b>
          </p>
          <p>報名人數：<b></b></p>
          <p>
            瀏覽人數：<b>{{ activity.numberVisitor }}</b>
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
    console.log(data);
  } catch (error) {
    console.error("獲取店家資料失敗:", error);
  }
};
onMounted(fetchActivityData);
</script>

<style></style>
