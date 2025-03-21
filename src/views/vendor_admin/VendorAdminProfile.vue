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
const vendorLogoImg = ref(''); // 將在獲取數據後設置
const imageUpload = ref(null);

// 格式化日期的函數
const formatReviewDate = (dateString) => {
    if (!dateString) return '';
    
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
const goHome = () => {
    window.location.href = '/vendor_admin/vendor_admin_activity';
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
        // 簡化獲取用戶ID的邏輯，只保留最常用的幾種方式
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // 按優先順序返回ID
        if (userData.vendorId) return userData.vendorId;
        if (userData.userId) return userData.userId;
        if (userData.id) return userData.id;
        
        // 從 JWT 獲取
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
        // 使用正確的API端點
        const url = `/api/vendor/profile`;
        
        // 獲取商家資料，加入 token
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.data && response.data.vendor) {
            // 更新商家資料
            vendor.value = response.data.vendor;
            
            // 確保 vendorCategory 有效
            if (!vendor.value.vendorCategory) {
                vendor.value.vendorCategory = { id: null, name: '' };
            }
            
            // 更新類別列表
            if (response.data.allcategory) {
                allcategory.value = response.data.allcategory;
            }
            
            // 設置Logo圖片路徑
            vendorLogoImg.value = `/api/vendor/profile/image`;
            
            // 格式化註冊日期
            if (vendor.value.registrationDate) {
                vendor.value.registrationDate = formatReviewDate(vendor.value.registrationDate);
            }
            
            // 更新活動數量
            if (response.data.activityCount !== undefined) {
                vendor.value.eventCount = response.data.activityCount;
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
        // 使用正確的 API 路徑
        const url = `/api/vendor/profile`;
        
        // 使用 PUT 方法提交表單，加入 token
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