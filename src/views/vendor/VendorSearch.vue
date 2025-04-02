<template>
  <!-- 主畫面 -->

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
              ><b style="color: red">{{ vendor.vendorCategory.name }}</b
              ><button
                class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
                style="margin-left: 10px"
                @click="openCategory(vendor.vendorCategory.id, vendor.id)"
              >
                查看同類別店家
              </button></span
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
  <!-- 主畫面 -->

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
import { ref, watchEffect, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const vendorList = ref([]);

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

/* 同類別店家視窗 */
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
const openCategory = async (categoryId, vendorId) => {
  isPopupCategoryVisible.value = true;

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/category/${categoryId}/except/vendor/${vendorId}`,
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

<style></style>
