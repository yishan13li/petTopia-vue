<template>
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

// 初始化資料
const vendor = ref({
    id: null,
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
    status: false,
    vendorCategory: { id: null, name: '' }
});

const allcategory = ref([]);
const emailError = ref(false);
const phoneError = ref(false);
const vendorLogoImg = ref('');
const imageUpload = ref(null);

// 格式化日期的函數
const formatReviewDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? '下午' : '上午';

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${year}年${month}月${day}日 ${period} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

// 返回首頁
const goHome = () => {
    window.location.href = '/vendor_admin/vendor_admin_dashboard';
};

// 登出
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
};

// 觸發圖片上傳
const triggerFileInput = () => imageUpload.value.click();

// 預覽圖片
const previewImage = (event) => {
    if (event.target.files && event.target.files[0]) {
        vendorLogoImg.value = URL.createObjectURL(event.target.files[0]);
    }
};

// 獲取用戶ID
const getCurrentUserId = () => {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (userData.vendorId) return userData.vendorId;
        if (userData.userId) return userData.userId;
        if (userData.id) return userData.id;
        
        const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));
                
                if (payload.userId) return payload.userId;
                if (payload.id) return payload.id;
            } catch (jwtError) {
                console.error('解析 JWT 時出錯:', jwtError);
            }
        }
        
        return null;
    } catch (error) {
        console.error('獲取用戶ID時發生錯誤:', error);
        return null;
    }
};

// 更新店家資料
const updateVendor = async () => {
    if (!vendor.value.id) {
        alert('無法獲取商家ID，請重新登入');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('請先登入');
        window.location.href = '/login?switch=vendor';
        return;
    }

    // 驗證必填字段
    if (!vendor.value.contactEmail || !vendor.value.phone) {
        if (!vendor.value.contactEmail) emailError.value = true;
        if (!vendor.value.phone) phoneError.value = true;
        return;
    }

    const formData = new FormData();
    formData.append("vendorName", vendor.value.name);
    formData.append("contactEmail", vendor.value.contactEmail);
    formData.append("vendorPhone", vendor.value.phone);
    formData.append("vendorAddress", vendor.value.address);
    formData.append("vendorDescription", vendor.value.description);
    formData.append("contactPerson", vendor.value.contactPerson);
    formData.append("vendorTaxidNumber", vendor.value.taxidNumber);
    
    if (vendor.value.vendorCategory && vendor.value.vendorCategory.id) {
        formData.append("category", vendor.value.vendorCategory.id);
    }

    // 檢查是否有選擇 logo 圖片
    const logoInput = imageUpload.value;
    if (logoInput && logoInput.files && logoInput.files.length > 0) {
        formData.append("vendorLogoImg", logoInput.files[0]);
    }

    try {
        const url = `/api/vendor-admin/profile/${vendor.value.id}`;
        
        const response = await axios.put(url, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200 || response.data.success) {
            alert('商家資料更新成功');
            window.location.reload();
        } else {
            alert('更新失敗: ' + (response.data.error || '未知錯誤'));
        }
    } catch (error) {
        console.error('更新商家資料時發生錯誤：', error);
        if (error.response?.status === 401) {
            alert('登入已過期，請重新登入');
            window.location.href = '/login?switch=vendor';
        } else {
            alert('更新失敗: ' + (error.response?.data?.error || error.message || '請檢查網絡連接'));
        }
    }
};

// 頁面載入後執行
onMounted(async () => {
    // 檢查用戶角色
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'VENDOR') {
        alert('您沒有權限訪問此頁面');
        window.location.href = '/login?switch=vendor';
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('請先登入');
        window.location.href = '/login?switch=vendor';
        return;
    }
    
    try {
        const vendorId = getCurrentUserId();
        if (!vendorId) {
            alert('無法獲取商家ID，請重新登入');
            window.location.href = '/login?switch=vendor';
            return;
        }

        const url = `/api/vendor-admin/profile/${vendorId}`;
        
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.data && response.data.vendor) {
            vendor.value = response.data.vendor;
            
            if (!vendor.value.vendorCategory) {
                vendor.value.vendorCategory = { id: null, name: '' };
            }
            
            if (response.data.allcategory) {
                allcategory.value = response.data.allcategory;
            }
            
            vendorLogoImg.value = `/api/vendor-admin/profile/${vendorId}/logo`;
            
            if (vendor.value.registrationDate) {
                vendor.value.registrationDate = formatReviewDate(vendor.value.registrationDate);
            }
        } else {
            console.error('獲取商家資料失敗：回應無效');
            alert('無法獲取商家資料，請重新登入');
            window.location.href = '/login?switch=vendor';
        }
    } catch (error) {
        console.error('獲取商家資料時發生錯誤：', error);
        if (error.response?.status === 401) {
            alert('登入已過期，請重新登入');
            window.location.href = '/login?switch=vendor';
        } else {
            alert('獲取商家資料失敗: ' + (error.response?.data?.error || error.message || '請檢查網絡連接'));
        }
    }
});
</script>

<style scoped>
.container {
    max-width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.content-box {
    width: 100%;
    max-width: 100%;
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

select.form-control {
    height: calc(2.25rem + 2px);
    padding: 0.375rem 0.75rem;
}

input[type="email"],
.email-class {
    text-transform: none;
}
</style> 