<template>

    <!-- <VendorAdminSidebar></VendorAdminSidebar> -->
    <div class="content-body">
        <div class="container">
            <div class="content-box">
                <form @submit.prevent="updateVendor" enctype="multipart/form-data">
                    <button class="btn btn-transparent profile-button" @click="goHome" type="button">返回首頁</button>
                    <div class="row">
                        <div class="col-md-4 border-right d-flex align-items-center justify-content-center">
                            <div class="text-center p-3 py-5">
                                <img :src="vendorLogoImg" class="rounded-circle mt-3" width="90"
                                    @click="triggerFileInput">
                                <input type="file" ref="imageUpload" accept="image/*" style="display: none"
                                    @change="previewImage">
                                <br>
                                <span class="font-weight-bold">會員ID: {{ vendor.id }}</span>
                                <br>
                                店家等級:<span class="text-black-50">{{ vendor.vendorLevel }}</span><br>
                                總活動數:<span class="font-weight-bold">{{ vendor.eventCount }}</span><br>
                                平均星級:<span>{{ vendor.avgRating }}</span>

                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="p-3 py-5">
                                <div class="row mt-2">
                                    <div class="col-md-6">
                                        <label>店家名稱:</label>
                                        <input type="text" class="form-control" v-model="vendor.name">
                                    </div>
                                    <div class="col-md-6">
                                        <label>店家類別:</label>
                                        <select class="form-control" v-model="vendor.vendorCategory.id"
                                            v-if="vendor.vendorCategory">
                                            <option v-for="type in allcategory" :key="type.id" :value="type.id">{{
                                                type.name }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <label>Email:</label>
                                        <input type="email" class="form-control" v-model="vendor.contactEmail" required>
                                        <span v-if="emailError" style="color: red;">請輸入有效的 Email。</span>
                                    </div>
                                    <div class="col-md-6">
                                        <label>電話號碼:</label>
                                        <input type="text" class="form-control" v-model="vendor.phone" required>
                                        <span v-if="phoneError" style="color: red;">請輸入有效的電話號碼。</span>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <label>地址:</label>
                                        <textarea class="form-control" v-model="vendor.address"></textarea>
                                    </div>
                                    <div class="col-md-6">
                                        <label>介紹:</label>
                                        <textarea class="form-control" v-model="vendor.description"></textarea>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <label>聯絡人:</label>
                                        <input type="text" class="form-control" v-model="vendor.contactPerson">
                                    </div>
                                    <div class="col-md-6">
                                        <label>統一編號:</label>
                                        <input type="text" class="form-control" v-model="vendor.taxidNumber">
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <label>註冊日期:</label>
                                        <input type="text" class="form-control" v-model="vendor.registrationDate"
                                            disabled>
                                    </div>
                                    <div class="col-md-6">
                                        <label>認證狀態:</label>
                                        <input type="text" class="form-control" :value="vendor.status ? '已認證' : '未認證'"
                                            disabled>
                                    </div>
                                </div>
                                <div class="mt-5 text-right">
                                    <button class="btn btn-primary profile-button" type="submit">更新資訊</button>
                                    <button class="btn btn-danger" @click="logout">登出</button>
                                </div>
                                <div class="modal fade" id="updateSuccessModal" tabindex="-1">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">更新成功</h5>
                                                <button type="button" class="btn-close"
                                                    data-bs-dismiss="modal"></button>
                                            </div>
                                            <div class="modal-body">您的資料已成功更新！</div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-primary"
                                                    data-bs-dismiss="modal">確定</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
// import VendorAdminSidebar from '@/components/VendorAdminSidebar.vue';

// 初始化資料
const vendor = ref({
    id: 1, //登入後要改
    name: '',
    address: '',
    vendorLevel: '',
    eventCount: 0,
    avgRating: 0,
    category: '',
    contactEmail: '',
    phone: '',
    vendorAddress: '',
    description: '',
    contactPerson: '',
    taxidNumber: '',
    registrationDate: '',
    status: false
});

const allcategory = ref([]);
const emailError = ref(false);
const phoneError = ref(false);
const vendorLogoImg = ref('/profileImage/1');
const imageUpload = ref(null);

// 格式化日期的函數
const formatReviewDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份從0開始
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? '下午' : '上午';

    // 轉換為12小時制
    hours = hours % 12;
    hours = hours ? hours : 12; // 小時為0時顯示12

    // 格式化為 'YYYY年M月D日 上午/下午 HH:mm'
    return `${year}年${month}月${day}日 ${period} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

// 返回首頁
const goHome = () => window.location.href = '/vendor_admin/vendor_admin_activity';

// 登出
const logout = () => window.location.href = '/logout';

// 觸發圖片上傳
const triggerFileInput = () => imageUpload.value.click();

// 預覽圖片
const previewImage = (event) => vendorLogoImg.value = URL.createObjectURL(event.target.files[0]);

// 更新店家資料
const updateVendor = async () => {
    const formData = new FormData();
    formData.append("vendorId", vendor.value.id);
    formData.append("vendorName", vendor.value.name);
    formData.append("contactEmail", vendor.value.contactEmail);
    formData.append("vendorPhone", vendor.value.phone);
    formData.append("vendorAddress", vendor.value.address);
    formData.append("vendorDescription", vendor.value.description);
    formData.append("contactPerson", vendor.value.contactPerson);
    formData.append("vendorTaxidNumber", vendor.value.taxidNumber);
    formData.append("category", vendor.value.vendorCategory.id);
    console.log("formData", formData);
    // 檢查是否有選擇 logo 圖片
    const logoInput = imageUpload.value;
    if (logoInput.files.length > 0) {
        formData.append("vendorLogoImg", logoInput.files[0]);
    }

    const url = `http://localhost:8080/api/vendor/update/${vendor.value.id}`;
    try {
        const response = await axios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
            alert('商家資料更新成功');
            window.location.reload();
        } else {
            alert('更新失敗');
        }
    } catch (error) {
        console.error('更新商家資料時發生錯誤：', error);
    }
};

// 頁面載入後執行
// onMounted(async () => {
//     // 假設這裡是用來獲取商家資料的 API
//     try {
//         const response = await axios.get(`http://localhost:8080/api/vendor_admin/profile/${vendor.value.id}`);
//         console.log(response.data)
//         vendor.value = response.data.vendor;  // 更新 vendor 資料
//         allcategory.value = response.data.categories;  // 更新所有類別

//         // 格式化註冊日期
//         const registrationDateInput = document.getElementById('registrationDate');
//         const formattedDate = formatReviewDate(response.data.vendor.registrationDate);
//         registrationDateInput.value = formattedDate;  // 填充格式化後的日期
//     } catch (error) {
//         console.error('獲取商家資料時發生錯誤：', error);
//     }
// });


onMounted(async () => {
    try {
        const email = encodeURIComponent('1234@gmail.com');  // 將 email 編碼
        const password = '1234';
        const url = `http://localhost:8080/api/vendor_admin/profile?id=${vendor.value.id}`; //mail的@會跑掉，所以後端先改用id

        // 獲取商家資料和類別
        const response = await axios.get(url);
        console.log(response.data)
        // 當返回成功時，將資料存入 `vendor` 和 `allcategory`
        vendor.value = response.data.vendor;
        allcategory.value = response.data.allcategory;
        console.log(allcategory.value)
        // 确保 vendor.category 被正确赋值
        if (response.data.vendor) {
            vendor.value = response.data.vendor;
            // 赋一个默认值，防止 vendorCategory 为 undefined
            vendor.value.vendorCategory = response.data.vendor.vendorCategory || { id: null, name: '' };
        }
        vendorLogoImg.value = `http://localhost:8080/profileImage/${vendor.value.id}`;

        // 格式化註冊日期
        const formattedDate = formatReviewDate(response.data.vendor.registrationDate);
        vendor.value.registrationDate = formattedDate;
    } catch (error) {
        console.error("獲取商家資料時發生錯誤：", error);
    }
});
</script>



<style scoped>
.container {
    max-width: 70%;
    /* 这里将内容区域宽度设置为80%，预留20%给sidebar */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.content-box {
    width: 100%;
    max-width: 100%;
    /* 设置最大宽度为100%，让内容区域自适应缩小 */
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
}

.btn-transparent {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #333;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
}

.btn-transparent:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.rounded-circle {
    border-radius: 50% !important;
    width: 90px;
    height: 90px;
    object-fit: cover;
}

/* .container {
    max-width: 95%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.content-box {
    width: 95%;
    max-width: 95%;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
} */

.back-button {
    position: absolute;
    top: 10px;
    left: 10px;
}

select.form-control {
    height: calc(2.25rem + 2px);
    /* 與 input 標籤相同的高度 */
    padding: 0.375rem 0.75rem;
    /* 與 input 標籤相同的內邊距 */
}

input[type="email"],
.email-class {
    text-transform: none;
    /* 防止强制转为大写 */
}
</style>