<template>
    <section id="products" class="container my-5">

        <!-- 商店標題 -->
        <div class="section-header d-md-flex justify-content-between align-items-center">
            <h2 class="display-3 fw-normal">商品</h2>
        </div>

        <!-- 商品內容 -->
        <div class="isotope-container row">
            <!-- 商品Card -->
            <div class="item cat col-md-4 col-lg-3 my-4" v-for="productDetailDto in productDetailDtoList"
                :key="productDetailDto.productDetail.id">
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
                            <!-- 商品評價 星星 iconify-icon會跳出錯誤但是還是會顯示-->
                            <span class="rating secondary-font">
                                <Icon icon="clarity:star-solid" class="text-primary"></Icon>
                                <Icon icon="clarity:star-solid" class="text-primary"></Icon>
                                <Icon icon="clarity:star-solid" class="text-primary"></Icon>
                                <Icon icon="clarity:star-solid" class="text-primary"></Icon>
                                <Icon icon="clarity:star-solid" class="text-primary"></Icon>
                                5.0
                            </span>

                            <!-- 商品價錢 -->
                            <h3 class="secondary-font text-primary">$ {{ productDetailDto.unitPrice }}</h3>

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

        </div>

    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Icon } from '@iconify/vue';

const PATH = `${import.meta.env.VITE_API_URL}`;

const productDetailDtoList = ref({});

onMounted(async () => {
    getAllProducts();
})

// 加載所有商品
async function getAllProducts() {
    await axios({
        method: 'get',
        url: `${PATH}/shop/products`,
    })
        .then(response => {
            console.log(response.data.productDetailListDto);
            productDetailDtoList.value = response.data.productDetailListDto;
        })

        .catch(error => console.log(error));
}

</script>

<style></style>