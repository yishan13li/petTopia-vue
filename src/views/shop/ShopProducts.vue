<template>
    <section id="products" class="container my-5">

        <div v-if="searchProductKeyword">
            <h2 class="mb-3">
                <span>'</span>
                <span style="color: crimson;">{{ searchProductKeyword ? searchProductKeyword : "" }}</span>
                <span>' 搜尋結果</span>
            </h2>
        </div>

        <!-- 商店標題 -->
        <div class="section-header d-md-flex justify-content-between align-items-center">
            <h2 class="display-3 fw-normal">商品</h2>
        </div>

        <!-- 商品內容 -->
        <div class="container row">
            <!-- 商品Card -->
            <div class="col-md-4 col-lg-3 my-4" v-if="productDetailDtoList"
                v-for="productDetailDto in productDetailDtoList" :key="productDetailDto.productDetail.id">
                <!-- 商品左上字樣 -->
                <!-- <div class="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                        New
                </div> -->
                <div class="card position-relative">
                    <!-- 商品圖片 -->
                    <div>
                        <img :src="`${PATH}/shop/products/api/getPhoto?productDetailId=${productDetailDto.productDetail.id}`"
                            alt="image" class="img-fluid rounded-4">
                    </div>
                    <div class="card-body p-0">
                        <!-- 商品名稱 -->
                        <h3 class="card-title pt-4 m-0">{{ productDetailDto.productDetail.name }}</h3>
                        <div class="card-text">
                            <!-- 商品評價 星星 -->
                            <span class="rating secondary-font">
                                <Icon icon="clarity:star-solid" class="text-primary"></Icon>
                                <Icon icon="clarity:star-solid" class="text-primary"></Icon>
                                <Icon icon="clarity:star-solid" class="text-primary"></Icon>
                                <Icon icon="clarity:star-solid" class="text-primary"></Icon>
                                <Icon icon="clarity:star-solid" class="text-primary"></Icon>
                                5.0
                            </span>

                            <!-- 商品價錢 -->
                            <h3 class="secondary-font text-primary">$ {{ productDetailDto.minPriceProduct.discountPrice
                                ? productDetailDto.minPriceProduct.discountPrice :
                                productDetailDto.minPriceProduct.unitPrice }}
                                <span>&nbsp;</span>
                                <span v-if="productDetailDto.minPriceProduct.discountPrice" style="color: crimson;">
                                    {{ (10 * productDetailDto.minPriceProduct.discountPrice /
                                        productDetailDto.minPriceProduct.unitPrice).toFixed(1) }}折
                                </span>
                            </h3>

                            <!-- 查看詳情 -->
                            <div class="d-flex flex-wrap mt-3">
                                <!-- 詳情按鈕 -->
                                <RouterLink
                                    :to="{ path: '/shop/productDetail', query: { productDetailId: productDetailDto.productDetail.id } }">
                                    <div class="btn btn-light btn-sm me-3 px-4 pt-3 pb-3">
                                        <h5 class="text-uppercase m-0">看詳情</h5>
                                    </div>
                                </RouterLink>
                                <!-- 愛心按鈕 -->
                                <!-- <a href="#" class="btn-wishlist px-4 pt-3 ">
                                        <iconify-icon icon="fluent:heart-28-filled" class="fs-5"></iconify-icon>
                                </a> -->
                            </div>


                        </div>

                    </div>
                </div>
            </div>
            <div v-else>
                <h2>查無內容</h2>
            </div>
        </div>

        <!-- 分頁 -->
        <div class="container" v-if="total > 0">
            <Paginate v-model="currentPage" :page-count="pages" :initial-page="currentPage" :page-range="3"
                :margin-pages="1" :click-handler="onChangePage" :first-last-button="true">

            </Paginate>
        </div>

    </section>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from "vue-router";
import Paginate from 'vuejs-paginate-next';
import axios from 'axios';
import { Icon } from '@iconify/vue';

const route = useRoute();

const PATH = `${import.meta.env.VITE_API_URL}`;

// 初始載入
const productDetailDtoList = ref([]);

// 商品分類
const selectedCategory = ref(route.query.category || "所有商品");   // 預設從 query 讀取
// 關鍵字搜尋
const searchProductKeyword = ref(route.query.keyword || "");

// 分頁
const currentPage = ref(1); // 目前在第幾頁
const pages = ref(0);   // 總共有幾頁
const total = ref(0);   // 總共有幾筆
const rows = ref(10);   // 每頁顯示幾筆
const start = ref(0);   // 從第幾筆資料開始
const lastPageRows = ref(0); // 最後一頁有幾筆

onMounted(async () => {
    onChangePage();
})
// #region Event function =================================================

// 分頁切換
function onChangePage(page) {
    if (page) {
        currentPage.value = page;
        start.value = (page - 1) * rows.value;
    } else {
        currentPage.value = 1;
        start.value = 0;
    }

    const data = {
        "start": start.value,
        "rows": rows.value,
        "category": selectedCategory.value,
        "keyword": searchProductKeyword.value ? searchProductKeyword.value : null
    }

    getProducts(data);

}

// #endregion =================================================


// 加載商品
async function getProducts(data) {
    await axios({
        method: 'get',
        url: `${PATH}/shop/products`,
        params: data
    })
        .then(response => {
            // console.log(response.data);
            productDetailDtoList.value = response.data.productDetailDtoList;

            // 分頁
            total.value = response.data.count;
            pages.value = Math.ceil(total.value / rows.value);
            lastPageRows.value = total.value % rows.value;
        })

        .catch(error => console.log(error));
}

// 監聽query變化
watch(() => route.query, async () => {
    selectedCategory.value = route.query.category || "所有商品";
    searchProductKeyword.value = route.query.keyword || "";
    onChangePage();

}, { deep: true });


</script>

<style></style>