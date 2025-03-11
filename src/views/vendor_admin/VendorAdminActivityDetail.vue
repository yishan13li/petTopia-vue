<template>
    <div id="main-wrapper">
        <div>
            <!-- 使用 layout 组件 -->
            <vendor-admin-header></vendor-admin-header>
        </div>
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
                                id="start_time" required />
                        </div>
                        <div class="form-group">
                            <label>結束時間:</label>
                            <input type="datetime-local" v-model="vendorActivity.endTime" name="end_time" id="end_time"
                                required />
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
                            <div v-for="imageId in vendorActivityImageIdList" :key="imageId" class="image-preview"
                                :data-image-id="imageId">
                                <img :src="`http://localhost:8080/photos/download?photoId=${imageId}`" alt="活動圖片"
                                    class="img-fluid rounded imgact" />
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
                        <button type="submit" class="btn btn-outline-primary" id="sendBtn">修改活動</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const vendorActivity = ref({
    id: null,
    name: '',
    activityType: { id: null, name: '' },
    description: '',
    address: '',
    startTime: '',
    endTime: '',
    isRegistrationRequired: false
});

const activityTypes = ref([]);
const registrationOptions = ref([
    { value: 'true', label: '是' },
    { value: 'false', label: '否' }
]);

const activityPeopleNumber = ref({
    maxParticipants: 0
});

const vendorActivityImageIdList = ref([]);
const imagePreviews = ref([]);
let deletedImageIds = ref([]);

const fileInput = ref(null);

// 切换最大参与人数输入框状态
function toggleMaxParticipants() {
    if (vendorActivity.value.isRegistrationRequired === 'false') {
        activityPeopleNumber.value.maxParticipants = 0;
        activityPeopleNumber.value.maxParticipants = 0;
    } else {
        if (activityPeopleNumber.value.maxParticipants === 0) {
            activityPeopleNumber.value.maxParticipants = 1;
        }
    }
}

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
function deleteExistingImage(imageId) {
    deletedImageIds.value.push(imageId);
    vendorActivityImageIdList.value = vendorActivityImageIdList.value.filter(id => id !== imageId);
}

// 删除预览图片
function removePreview(index) {
    imagePreviews.value.splice(index, 1);
}

// 返回按钮
function goBack() {
    window.location.href = '/vendor_admin/vendor_admin_activity';
}

// 表单提交处理
function submitForm() {
    const formData = new FormData();
    formData.append('vendor_id', 1);
    formData.append('activity_id', vendorActivity.value.id);
    formData.append('name', vendorActivity.value.name);
    formData.append('description', vendorActivity.value.description);
    formData.append('address', vendorActivity.value.address);
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
            alert('更新成功');
            window.location.reload();
        })
        .catch(error => {
            alert('更新失敗');
        });
}

// 页面加载时初始化状态
onMounted(() => {
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
    max-width: 95%;
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