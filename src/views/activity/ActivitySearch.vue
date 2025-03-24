<template>
  <!-- 主畫面 -->

  <section class="padding-medium mt-xl-5">
    <div
      class="container rounded-4"
      style="background-color: #f9f3ec; padding: 20px; margin-top: 10px"
      v-for="(activity, index) in activityList"
      :key="index"
      v-if="activityList.length !== 0"
    >
      <div class="row align-items-center mt-xl-5">
        <div class="h-auto offset-md-1 col-md-5">
          <!-- <img
            :src="vendor.logoImgBase64"
            alt="店家圖片"
            class="img-fluid rounded-4"
            width="400"
            style="max-width: 200px; max-height: 200px"
          /> -->
          <div class="mb-3">
            <h2 class="display-6 fw-semibold">
              <a :href="`/activity/detail/${activity.id}`">{{ activity.name }}</a>
            </h2>
          </div>
        </div>

        <div class="col-md-5 mt-5 mt-md-0">
          <p>
            詳情：<b>{{ activity.description }}</b>
          </p>
          <p>
            開始時間：<b>{{ activity.startTime }}</b>
          </p>
          <p>
            結束時間：<b>{{ activity.endTime }}</b>
          </p>
          <p>
            分類：
            <span v-if="activity.activityType"
              ><b style="color: red">{{ activity.activityType.name }}</b
              ><button
                class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
                style="margin-left: 10px"
                @click="openSameType(activity.activityType.id, activity.id)"
              >
                查看同型別活動
              </button></span
            >
            <span v-else style="color: gray">( 無分類 )</span>
          </p>
        </div>
      </div>
    </div>

    <div
      v-else-if="route.query.keyword && activityList.length == 0"
      style="color: gray; display: flex; justify-content: center"
    >
      找不到符合的活動……
    </div>
    <div v-else style="color: gray; display: flex; justify-content: center">
      輸入條件來搜尋活動～
    </div>
  </section>
  <br />
  <br />
  <br />
  <!-- 主畫面 -->

  <!-- 同類別店家視窗 -->
  <div v-if="isPopupTypeVisible" class="overlay">
    <div class="popup">
      <h3>
        <b v-if="typeActivityList.length != 0"
          >同類別活動：<span style="color: red">{{
            typeActivityList[0].activityType.name
          }}</span></b
        ><b v-else>同類別活動</b>
      </h3>
      <div class="scroll-container" v-if="typeActivityList.length != 0">
        <div v-for="(activity, index) in typeActivityList" :key="index" style="font-size: 24px">
          <!-- 圖片抓法要改 -->
          <!-- <img
            :src="activity.logoImgBase64"
            class="img-fluid rounded-4"
            alt="image"
            style="max-width: 30px; max-height: 30px; margin: 10px"
          /> -->
          <a :href="`/activity/detail/${activity.id}`">{{ activity.name }}</a>
        </div>
      </div>
      <div v-else style="color: gray; margin: 50px">目前沒有其他同類別活動～</div>
      <button
        class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
        style="margin: 5px"
        @click="closeSameType()"
      >
        關閉
      </button>
    </div>
  </div>
  <!-- 同類別店家視窗 -->
</template>

<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activityList = ref([])
const keyword = ref('')
const keywordForApi = {
  keyword: keyword,
}

/* 關鍵字搜尋 */
const searchActivity = async (keyword) => {
  //   if (!keyword.value) {
  //     alert('請輸入關鍵字!')
  //     return
  //   }

  keywordForApi.value = { keyword: keyword }

  try {
    const response = await fetch(`http://localhost:8080/api/activity/find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keywordForApi.value),
    })
    const data = await response.json()
    activityList.value = data
  } catch (error) {
    console.error('提交失敗:', error)
    activityList.value = []
  }
}

/* 監聽關鍵字變更，自動重新搜尋 */
watchEffect(() => {
  if (route.query.keyword) {
    searchActivity(route.query.keyword)
  }
})

/* 頁面載入時，如果有關鍵字則自動搜尋 */
onMounted(() => {
  if (route.query.keyword) {
    searchActivity(route.query.keyword)
  }
})

/* 同類別活動視窗 */
const typeActivityList = ref([
  {
    id: '',
    name: '',
    description: '',
    activityType: {
      id: '',
      name: '載入中',
    },
  },
])
const isPopupTypeVisible = ref(false)

const fetchSameTypeActivitiesExceptOne = async (typeId, activityId) => {
  const response = await fetch(
    `http://localhost:8080/api/activity/type/${typeId}/except/activity/${activityId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  let result = await response.json()
  typeActivityList.value = result
  console.log(result)
  console.log(typeActivityList.value)
}

const openSameType = (typeId, activityId) => {
  isPopupTypeVisible.value = true
  fetchSameTypeActivitiesExceptOne(typeId, activityId)
}

const closeSameType = () => {
  isPopupTypeVisible.value = false
}
</script>

<style></style>
