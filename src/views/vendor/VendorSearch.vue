<template>
  <section class="padding-medium mt-xl-5">
    <div
      class="container rounded-4"
      style="background-color: #f9f3ec; padding: 20px; margin-top: 10px"
      v-for="(vendor, index) in vendorList"
      :key="index"
      v-if="vendorList.length !== 0"
    >
      <div class="row align-items-center mt-xl-5">
        <div class="h-auto offset-md-1 col-md-5">
          <img
            :src="vendor.logoImgBase64"
            alt="店家圖片"
            class="img-fluid rounded-4"
            width="400"
            style="max-width: 200px; max-height: 200px"
          />
        </div>

        <div class="col-md-5 mt-5 mt-md-0">
          <div class="mb-3">
            <h2 class="display-6 fw-semibold">
              <a :href="`/vendor/detail/${vendor.id}`">{{ vendor.name }}</a>
            </h2>
          </div>
          <p>{{ vendor.description }}</p>
          <p>
            分類：
            <span v-if="vendor.vendorCategory"
              ><b style="color: red">{{ vendor.vendorCategory.name }}</b></span
            >
            <span v-else style="color: gray">( 無分類 )</span>
          </p>
        </div>
      </div>
    </div>

    <div
      v-else-if="route.query.keyword && vendorList.length == 0"
      style="color: gray; display: flex; justify-content: center"
    >
      找不到符合的店家……
    </div>
    <div v-else style="color: gray; display: flex; justify-content: center">
      輸入條件來搜尋店家～
    </div>
  </section>
  <br />
  <br />
  <br />
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const vendorList = ref([
  //   {
  //     name: "載入中...",
  //     description: "請稍候，正在獲取店家資訊...",
  //     logoImgBase64: null,
  //   },
]);

/* 關鍵字搜尋 */
const searchVendor = async (keyword) => {
  if (!keyword) return;

  const formData = new FormData();
  formData.append("keyword", keyword);

  try {
    const response = await fetch(`http://localhost:8080/api/vendor/find`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    vendorList.value = data;
  } catch (error) {
    console.error("提交失敗:", error);
    vendorList.value = [];
  }
};

/* 監聽關鍵字變更，自動重新搜尋 */
watchEffect(() => {
  if (route.query.keyword) {
    searchVendor(route.query.keyword);
  }
});

/* 頁面載入時，如果有關鍵字則自動搜尋 */
onMounted(() => {
  if (route.query.keyword) {
    searchVendor(route.query.keyword);
  }
});
</script>

<style></style>
