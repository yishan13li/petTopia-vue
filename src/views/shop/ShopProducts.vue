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
                            alt="image" class="img-fluid rounded-4" style="height: 180px;">
                    </div>
                    <div class="card-body p-0">
                        <!-- 商品名稱 -->
                        <h3 class="card-title pt-4 m-0" style="font-size: 1.2em;">{{ productDetailDto.productDetail.name
                            }}</h3>
                        <div class="card-text">
                            <!-- 商品評價 星星 -->

                            <span class="rating secondary-font">
                                <span class="star-rating">
                                    <i v-for="star in 5" :key="star" :class="['fa', {
                                        'fa-star fas text-primary': star <= (productDetailDto.avgRating || 0),
                                        'fa-star far text-secondary': star > (productDetailDto.avgRating || 0)
                                    }]">
                                    </i>
                                </span>
                                ({{ (productDetailDto.avgRating || 0).toFixed(1) }})
                            </span>


                            <!-- 商品價錢 -->
                            <h3 class="secondary-font text-primary" style="font-size: 1.2em;">$ {{
                                productDetailDto.minPriceProduct.discountPrice
                                    ? productDetailDto.minPriceProduct.discountPrice :
                                    productDetailDto.minPriceProduct.unitPrice }}
                                <span>&nbsp;</span>
                                <span v-if="productDetailDto.minPriceProduct.discountPrice" class="discount-tag">
                                    {{ (10 * productDetailDto.minPriceProduct.discountPrice /
                                        productDetailDto.minPriceProduct.unitPrice).toFixed(1) }}折
                                </span>
                            </h3>

                            <!-- 查看詳情 -->
                            <div class="d-flex flex-wrap mt-3 detail-button-container">
                                <!-- 詳情按鈕 -->
                                <RouterLink
                                    :to="{ path: '/shop/productDetail', query: { productDetailId: productDetailDto.productDetail.id } }">
                                    <div class="detail-button btn btn-light btn-sm me-3 px-4 pt-3 pb-3">
                                        看詳情
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
                :margin-pages="1" :click-handler="onChangePage" :first-last-button="true"
                prev-text="<i class= 'bi bi-chevron-left' > </i>" next-text="<i class= 'bi bi-chevron-right' > </i>"
                first-button-text="<i class= 'bi bi-chevron-bar-left' > </i>"
                last-button-text="<i class= 'bi bi-chevron-bar-right' > </i>">

            </Paginate>
        </div>

    </section>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from "vue-router";
import Paginate from 'vuejs-paginate-next';
import axios from 'axios';

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
const rows = ref(12);   // 每頁顯示幾筆
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
            console.log(response.data);
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

<style scoped>
/* card樣式 */
/* 計算淡化後的背景色：#F7E8C8（#EBC37F 淡化 80%） */
.card {
    width: 250px;
    /* 固定寬度 */
    min-height: 400px;
    /* 固定最小高度 */
    background-color: #fffcf6;
    border-radius: 10px;
    /* 圓角 */
    position: relative;
    /* 讓按鈕能夠絕對定位 */
    padding-bottom: 60px;
    /* 預留按鈕的高度，避免內容被壓住 */
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    /* 增加一點陰影 */
}

/* 圖片固定大小 */
.card img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
}

/* 讓 card-body 占滿可用空間，推動按鈕到底部 */
.card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 50px;
    /* 預留空間，避免內容被按鈕覆蓋 */
}

.card-title {
    font-size: 1.5em;
}

.card-text {
    flex-grow: 1;
    /* 讓內容區塊填滿剩餘空間 */
    margin-bottom: 10px;
    /* 確保與按鈕不重疊 */
}

/* 確保 RouterLink 也佔滿 */
.detail-button-container {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
}

/* 讓按鈕固定在 Card 底部並佔滿寬度 */
.detail-button {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    /* 確保完全佔滿 */
    text-align: center;
    padding: 15px 0;
    font-size: 1.2em;
    border-radius: 0 0 15px 15px;
    /* 讓按鈕與 Card 的圓角一致 */
    transition: 0.3s;
    background-color: #F4D8B1 !important;
    /* 按鈕背景色 */
}

.detail-button:hover {
    background-color: #e9ca94 !important;
    color: #000;
}

/* 打折字體樣式 */
.discount-tag {
    background-color: #ffecec;
    /* 淡紅色背景 */
    color: #d7000f;
    /* 深紅色文字 */
    font-size: 0.6em;
    padding: 2px 4px;
    border-radius: 3px;
    display: inline-block;
    min-width: 30px;
    /* 保持正方形外觀 */
    text-align: center;
}

.star-rating i.fas {
    padding-top: 5px;
    color: #f8c307 !important;
    font-size: 1rem;
}

.star-rating i.far {
    padding-top: 5px;
    color: #ddd;
    font-size: 1rem;
}
</style>