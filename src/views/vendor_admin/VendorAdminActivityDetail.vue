<template>
    <div id="main-wrapper">
        <div class="content-body">
            <div class="container">
                <button class="btn btn-transparent profile-button" @click="goBack" type="button">返回</button>
                <h2>活動詳情</h2>
                <form @submit.prevent="submitForm" enctype="multipart/form-data">
                    <div class="form-row">
                        <input type="hidden" name="vendor_id" value="1" />
                        <input type="hidden" name="activity_id" :value="vendorActivity.id" />
                        <div class="form-group">
                            <label>活動名稱:</label>
                            <input type="text" v-model="vendorActivity.name" name="activity_name" id="activity_name"
                                required />
                        </div>
                        <div class="form-group">
                            <label>活動類型:</label>
                            <select v-model="vendorActivity.activityType.id" name="activity_type_id"
                                class="form-control" id="activity_type_id" required>
                                <option value="" disabled selected>請選擇活動類型</option>
                                <option v-for="type in activityTypes" :key="type.id" :value="type.id">{{ type.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>活動描述:</label>
                            <textarea v-model="vendorActivity.description" name="activity_description"
                                id="activity_description" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>活動地址:</label>
                            <textarea v-model="vendorActivity.address" name="activity_address" id="activity_address"
                                required></textarea>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>開始時間:</label>
                            <input type="datetime-local" v-model="vendorActivity.startTime" name="start_time"
                                :min="currentDateTime" id="start_time" required />
                        </div>
                        <div class="form-group">
                            <label>結束時間:</label>
                            <input type="datetime-local" v-model="vendorActivity.endTime" name="end_time" id="end_time"
                                :min="vendorActivity.startTime" required />
                        </div>

                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>是否需要報名:</label>
                            <select v-model="vendorActivity.isRegistrationRequired" name="is_registration_required"
                                class="form-control" id="is_registration_required" required
                                @change="toggleMaxParticipants">
                                <option v-for="option in registrationOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="max_participants">活動最大報名人數:</label>
                            <input type="number" v-model="activityPeopleNumber.maxParticipants" id="max_participants"
                                name="max_participants" class="form-control" required min="1" />
                        </div>
                    </div>

                    <div class="form-group full-width">
                        <label>活動圖片:</label>
                        <div class="image-upload">
                            <div v-for="(imageId, index) in vendorActivityImageIdList" :key="imageId"
                                class="image-preview" :data-image-id="imageId">
                                <img :src="imageUrls[index]" alt="活動圖片" class="img-fluid rounded imgact" />
                                <button type="button" class="delete-btn"
                                    @click="deleteExistingImage(imageId)">刪除</button>
                            </div>
                        </div>
                        <br />
                        <label>新增活動圖片:</label>
                        <input type="file" ref="fileInput" id="house_photo" name="files" multiple
                            @change="handleFileChange" />
                        <br />
                        <div class="image-upload" id="preview-container">
                            <div v-for="(file, index) in imagePreviews" :key="index" class="image-preview">
                                <img :src="file.preview" alt="活動圖片" class="preview-image" />
                                <button type="button" class="delete-btn" @click="removePreview(index)">刪除</button>
                            </div>
                        </div>
                    </div>

                    <div style="text-align: right;">
                        <button type="submit" class="btn btn-outline-primary" id="sendBtn"
                            :disabled="isPast">修改活動</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { start } from '@popperjs/core';
import moment from "moment";
import Swal from 'sweetalert2'
const route = useRoute();  // 取得當前路由資訊
const activityId = route.params.id;
const userToken = localStorage.getItem('userToken');
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const vendorId = authStore.userId
const vendorActivity = ref({
    id: null,
    name: '',
    activityType: { id: null, name: '' },
    description: '',
    address: '',
    startTime: '',
    endTime: '',
    isRegistrationRequired: ''
});


const checkTimeConflict = async (vendorId, activityId, startTime, endTime) => {
    try {
        const response = await axios.get('/api/vendor_admin/activity/checkConflictDetail', {
            params: { vendorId, activityId, startTime, endTime }
        });
        console.log(response.data)
        if (response.data) {
            console.log(activityId)
            return true
        }
    } catch (error) {
        console.error('檢查時間衝突失敗', error);
    }
};

const validateTimeConflict = async () => {
    if (vendorActivity.value.startTime && vendorActivity.value.endTime) {
        // 輸出原始的 startTime 和 endTime


        // 將時間轉換為 SQL 支援的格式
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            const hours = ('0' + date.getHours()).slice(-2);
            const minutes = ('0' + date.getMinutes()).slice(-2);
            const seconds = ('0' + date.getSeconds()).slice(-2);

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        const formattedStartTime = formatDate(vendorActivity.value.startTime);
        const formattedEndTime = formatDate(vendorActivity.value.endTime);

        // 輸出轉換後的時間
        console.log(formattedStartTime, formattedEndTime);

        // 呼叫檢查時間衝突的方法，傳入轉換後的時間
        await checkTimeConflict(vendorId, activityId, formattedStartTime, formattedEndTime);
    }
};




// 取得今天的日期（不含時分秒）
const today = new Date();

// 計算是否活動已過期
const isPast = computed(() => {
    if (!vendorActivity.value.startTime) return true; // 防止沒有資料時錯誤
    const activityDate = new Date(vendorActivity.value.startTime);
    return activityDate < today;
});
const activityTypes = ref([]);
const registrationOptions = ref([
    { value: 'true', label: '需要報名' },
    { value: 'false', label: '不需報名' }
]);

const activityPeopleNumber = ref({
    maxParticipants: 0
});

const vendorActivityImageIdList = ref([]);
const imagePreviews = ref([]);
let deletedImageIds = ref([]);

const fileInput = ref(null);

// 取得當前日期時間的函數
const getCurrentDateTime = () => {
    let now = new Date();
    return now.toISOString().slice(0, 16); // 格式化為 YYYY-MM-DDTHH:MM
};

// 定義開始和結束時間
const currentDateTime = ref(getCurrentDateTime()); // 取得當前時間

// 切换最大参与人数输入框状态
function toggleMaxParticipants() {
    if (vendorActivity.value.isRegistrationRequired === 'false') {
        activityPeopleNumber.value.maxParticipants = 0; // 設定為 0
        // 禁用輸入框
        document.getElementById('max_participants').disabled = true;
    } else {
        // 啟用輸入框
        document.getElementById('max_participants').disabled = false;
        if (activityPeopleNumber.value.maxParticipants === 0) {
            activityPeopleNumber.value.maxParticipants = 1; // 如果為 0，設為 1
        }
    }
}

async function fetchActivityDetail() {
    const activityId = route.params.id; // 假設你的路由是 /vendor/admin/activity/:id
    try {
        const response = await axios.get(`http://localhost:8080/api/vendor_admin/vendor_admin_activityDetail?id=${activityId}`);
        const data = response.data;
        console.log(data)



        vendorActivity.value = data.vendorActivity;
        activityTypes.value = data.activityTypes;
        registrationOptions.value = data.registrationOptions;
        activityPeopleNumber.value = data.activityPeopleNumber;
        vendorActivityImageIdList.value = data.vendorActivityImageIdList;
        console.log(vendorActivity.value.startTime, vendorActivity.value.endTime)
        // 格式化开始时间和结束时间
        const formattedStartTime = moment(vendorActivity.value.startTime).format("YYYY-MM-DDTHH:mm");
        const formattedEndTime = moment(vendorActivity.value.endTime).format("YYYY-MM-DDTHH:mm");
        console.log(formattedStartTime, formattedEndTime)
        // 将格式化后的时间赋值给 Vue data
        vendorActivity.value.startTime = formattedStartTime;
        vendorActivity.value.endTime = formattedEndTime;
        console.log(formattedEndTime)

        // 确保 vendorActivity 中有数据
        if (data && data.vendorActivity) {
            vendorActivity.value = data.vendorActivity;
            console.log("vendorActivity:", vendorActivity.value);

            // 确保 isRegistrationRequired 是字符串
            if (typeof vendorActivity.value.isRegistrationRequired !== 'string') {
                vendorActivity.value.isRegistrationRequired = String(vendorActivity.value.isRegistrationRequired);
            }
            console.log("isRegistrationRequired:", vendorActivity.value.isRegistrationRequired);
        } else {
            console.error("返回的 vendorActivity 数据为空");
        }
    } catch (error) {
        console.error("獲取活動詳情失敗", error);
    }
}
const imageUrls = ref([]);
// 下載圖片的函式
const loadImages = () => {
    vendorActivityImageIdList.value.forEach((imageId, index) => {
        axios.get(`http://localhost:8080/photos/download?photoId=${imageId}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            },
            responseType: 'blob'  // 以二進位格式下載圖片
        })
            .then(response => {
                const url = URL.createObjectURL(response.data);  // 創建圖片 URL
                imageUrls.value[index] = url;  // 更新圖片的 URL
            })
            .catch(error => {
                console.error('圖片下載失敗', error);
            });
    });
};

// 处理文件上传预览
function handleFileChange(event) {
    const files = event.target.files;
    imagePreviews.value = []; // 清空现有的预览
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreviews.value.push({ preview: e.target.result, file });
        };
        reader.readAsDataURL(file);
    });
}

// 删除已存在的图片
const deleteExistingImage = (imageId) => {
    // 刪除已經標記為刪除的圖片 ID
    deletedImageIds.value.push(imageId);

    // 同步更新 imageUrls 和 vendorActivityImageIdList
    const index = vendorActivityImageIdList.value.findIndex(id => id === imageId);
    if (index !== -1) {
        vendorActivityImageIdList.value.splice(index, 1); // 刪除圖片 ID
        imageUrls.value.splice(index, 1); // 同步刪除圖片 URL
    }
};


// 删除预览图片
function removePreview(index) {
    // 获取文件输入框
    const fileInput = document.getElementById('house_photo');

    // 获取当前文件列表
    const files = fileInput.files;

    // 使用 DataTransfer 创建一个新的文件列表
    const newFiles = new DataTransfer();

    // 删除文件时，更新新的文件列表
    Array.from(files).forEach((file, i) => {
        if (i !== index) { // 只保留没有被删除的文件
            newFiles.items.add(file);
        }
    });

    // 更新文件输入框的文件列表
    fileInput.files = newFiles.files;
    imagePreviews.value.splice(index, 1);
}

// 返回按钮
function goBack() {
    window.location.href = '/vendor/admin/activity';
}

// 表单提交处理
const submitForm = async () => {

    if (vendorActivity.value.startTime && vendorActivity.value.endTime) {
        // 輸出原始的 startTime 和 endTime


        // 將時間轉換為 SQL 支援的格式
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            const hours = ('0' + date.getHours()).slice(-2);
            const minutes = ('0' + date.getMinutes()).slice(-2);
            const seconds = ('0' + date.getSeconds()).slice(-2);

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        const formattedStartTime = formatDate(vendorActivity.value.startTime);
        const formattedEndTime = formatDate(vendorActivity.value.endTime);

        // 輸出轉換後的時間
        console.log(formattedStartTime, formattedEndTime);

        // 檢查時間衝突
        const conflictExists = await checkTimeConflict(vendorId, activityId, formattedStartTime, formattedEndTime);

        // 如果有衝突，直接返回，不提交表單
        if (conflictExists) {
            Swal.fire({
                icon: 'warning',
                title: '時間有衝突',
                text: '請修改時間！',
                confirmButtonText: 'OK'
            })
            return;
        }
    }

    const formData = new FormData();
    formData.append('vendor_id', 1);
    formData.append('activity_id', vendorActivity.value.id);
    formData.append('activity_name', vendorActivity.value.name);
    formData.append('activity_type_id', vendorActivity.value.activityType.id);
    formData.append('activity_description', vendorActivity.value.description);
    formData.append('activity_address', vendorActivity.value.address);
    formData.append('start_time', vendorActivity.value.startTime);
    formData.append('end_time', vendorActivity.value.endTime);
    formData.append('is_registration_required', vendorActivity.value.isRegistrationRequired);
    formData.append('max_participants', activityPeopleNumber.value.maxParticipants);

    // 附加已删除的图片 ID
    deletedImageIds.value.forEach(id => formData.append('deletedImageIds', id));

    // 附加新上传的图片
    imagePreviews.value.forEach(file => formData.append('files', file.file));

    axios({
        method: 'post',
        url: 'http://localhost:8080/api/vendor_activity/update',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: '更新成功',
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                window.location.reload()
            })
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: '更新失敗',
                text: '請稍後再試或檢查表單資料',
                confirmButtonText: 'OK'
            })
        });
}

// 页面加载时初始化状态
onMounted(async () => {
    await fetchActivityDetail();
    loadImages();// ✅ 這裡可以使用 await
    console.log(vendorActivity.value.startTime);
    toggleMaxParticipants();
});
</script>

<style scoped>
.btn-transparent {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #333;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
}

.btn-transparent:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.container {
    max-width: 70%;
    margin: auto;
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    width: 48%;
}

.form-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

label {
    font-weight: bold;
}

input,
textarea,
select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.image-upload {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-upload img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
}

.image-upload img:hover {
    opacity: 0.7;
}

.image-upload .add-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border: 2px dashed #ccc;
    border-radius: 5px;
    font-size: 24px;
    color: #ccc;
    cursor: pointer;
}

.delete-mode img.selected {
    border: 3px solid lightgray;
    opacity: 0.6;
}

.delete-mode .add-image {
    pointer-events: none;
    opacity: 0.5;
}

.full-width {
    width: 100% !important;
}

.image-preview {
    position: relative;
    display: inline-block;
}

.preview-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.btn:disabled {
    visibility: hidden;
}

.delete-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: red;
    color: white;
    border: none;
    padding: 5px;
    cursor: pointer;
    font-size: 12px;
}

#sendBtn {
    align-items: right;
}
</style>