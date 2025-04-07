<template>
  <div id="main-wrapper">
    <div>
      <!-- 這裡可以根據需要引用其他組件 -->
      <div class="content-body">
        <div class="container">
          <h2>新增活動</h2>
          <form @submit.prevent="submitForm" id="activity_form">
            <div class="form-row">
              <!-- 要去抓登入者的id -->
              <input type="hidden" name="vendor_id" :value="vendorId" />
              <div class="form-group">
                <label>活動名稱:</label>
                <input type="text" name="activity_name" id="activity_name" v-model="activityName" required="required" />
              </div>
              <div class="form-group">
                <label>活動類型:</label>
                <select name="activity_type_id" class="form-control" id="activity_type_id" v-model="activityTypeId"
                  required>
                  <option value="" disabled selected>請選擇活動類型</option>
                  <option v-for="type in activityTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>活動描述:</label>
                <textarea name="activity_description" id="activity_description" v-model="activityDescription"
                  required="required"></textarea>
              </div>
              <div class="form-group">
                <label>活動地址:</label>
                <textarea name="activity_address" id="activity_address" v-model="activityAddress"
                  required="required"></textarea>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>開始時間:</label>
                <input type="datetime-local" id="start_time" name="start_time" v-model="startTime"
                  :min="currentDateTime" required="required" />
              </div>
              <div class="form-group">
                <label>結束時間:</label>
                <input type="datetime-local" name="end_time" id="end_time" v-model="endTime" :min="startTime"
                  required="required" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>是否需要報名:</label>
                <select name="is_registration_required" class="form-control" id="is_registration_required"
                  @change="toggleMaxParticipants" v-model="isRegistrationRequired" required="required">
                  <option v-for="option in registrationOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="max_participants">活動最大報名人數:</label>
                <input type="number" id="max_participants" name="max_participants" class="form-control"
                  v-model="maxParticipants" required min="0" />
              </div>
            </div>
            <div class="form-group full-width">
              <label>活動圖片:</label>
              <input type="file" id="house_photo" name="files" multiple @change="handleFileChange"
                required="required" />
              <div id="preview-container">
                <!-- 預覽圖片區域 -->
                <div v-for="(preview, index) in imagePreviews" :key="index" class="image-preview">
                  <img :src="preview.preview" alt="活動圖片預覽" width="100" />
                  <button type="button" class="delete-btn" @click="removeFile(index)">刪除</button>
                </div>
              </div>
            </div>
            <div style="text-align: right">
              <button type="button" class="btn btn-outline-secondary" @click="demoButtonClicked">Demo</button>
              <button type="submit" class="btn btn-outline-primary" id="sendBtn">新增活動</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const userId = authStore.userId

// 表單資料
const vendorId = ref(userId) // 假設登入者的 vendor_id 是 1
const activityName = ref('')
const activityTypeId = ref('')
const activityDescription = ref('')
const activityAddress = ref('')
const startTime = ref('')
const endTime = ref('')
const isRegistrationRequired = ref('')
const maxParticipants = ref(0)
const imagePreviews = ref([])

const checkTimeConflict = async (vendorId, startTime, endTime) => {
  try {
    const response = await axios.get('/api/vendor_admin/activity/checkConflict', {
      params: { vendorId, startTime, endTime }
    });
    console.log(response.data)
    if (response.data) {
      return true
    }
  } catch (error) {
    console.error('檢查時間衝突失敗', error);
  }
};

const validateTimeConflict = async () => {
  if (startTime.value && endTime.value) {
    // 輸出原始的 startTime 和 endTime
    console.log(startTime.value, endTime.value);

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

    const formattedStartTime = formatDate(startTime.value);
    const formattedEndTime = formatDate(endTime.value);

    // 輸出轉換後的時間
    console.log(formattedStartTime, formattedEndTime);

    // 呼叫檢查時間衝突的方法，傳入轉換後的時間
    await checkTimeConflict(vendorId.value, formattedStartTime, formattedEndTime);
  }
};


// Demo 按鈕的點擊事件處理函數
const demoButtonClicked = () => {
  activityName.value = "寵物美容日"
  activityTypeId.value = activityTypes.value[2]?.id || "" // 假設有活動類型
  activityDescription.value = "為您的毛小孩提供專業美容服務，讓牠們煥然一新！"
  activityAddress.value = "台北市信義區松山路123號"
  startTime.value = getCurrentDateTime()
  endTime.value = new Date(new Date().getTime() + 100000000).toISOString().slice(0, 16) // 假設結束時間比開始時間晚一小時
  isRegistrationRequired.value = "true"
  maxParticipants.value = 20


}

// 取得當前日期時間的函數
const getCurrentDateTime = () => {
  let now = new Date()
  return now.toISOString().slice(0, 16) // 格式化為 YYYY-MM-DDTHH:MM
}

// 定義開始和結束時間
const currentDateTime = ref(getCurrentDateTime()) // 取得當前時間

// 活動類型選項
const activityTypes = ref([])

// 報名選項
const registrationOptions = ref([
  { value: 'true', label: '需要報名' },
  { value: 'false', label: '不需要報名' },
])

// 提交表單
const submitForm = async () => {

  if (startTime.value && endTime.value) {
    // 輸出原始的 startTime 和 endTime
    console.log(startTime.value, endTime.value);

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

    const formattedStartTime = formatDate(startTime.value);
    const formattedEndTime = formatDate(endTime.value);

    // 輸出轉換後的時間
    console.log(formattedStartTime, formattedEndTime);

    // 檢查時間衝突
    const conflictExists = await checkTimeConflict(vendorId.value, formattedStartTime, formattedEndTime);

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

  const formdata = new FormData()
  formdata.append('vendor_id', vendorId.value)
  formdata.append('activity_name', activityName.value)
  formdata.append('activity_type_id', activityTypeId.value)
  formdata.append('activity_description', activityDescription.value)
  formdata.append('activity_address', activityAddress.value)
  formdata.append('start_time', startTime.value)
  formdata.append('end_time', endTime.value)
  formdata.append('is_registration_required', isRegistrationRequired.value)
  formdata.append('max_participants', maxParticipants.value)
  imagePreviews.value.forEach((preview, index) => {
    formdata.append('files', preview.file)
  })

  axios
    .post('http://localhost:8080/api/vendor_activity/add', formdata)
    .then((response) => {
      Swal.fire({
        icon: 'success',
        title: '新增成功！',
        showConfirmButton: false,
        timer: 1000
      })
      window.location.reload()
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: '新增失敗',
        text: '請稍後再試或檢查欄位內容',
        confirmButtonText: 'OK'
      })
    })
}

// 處理圖片預覽
const handleFileChange = (event) => {
  const files = event.target.files
  imagePreviews.value = [] // 清空現有的預覽
  Array.from(files).forEach((file, index) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push({ preview: e.target.result, file })
    }
    reader.readAsDataURL(file)
  })
}

// 刪除圖片預覽
const removeFile = (index) => {
  // 获取文件输入框
  const fileInput = document.getElementById('house_photo')

  // 获取当前文件列表
  const files = fileInput.files

  // 使用 DataTransfer 创建一个新的文件列表
  const newFiles = new DataTransfer()

  // 删除文件时，更新新的文件列表
  Array.from(files).forEach((file, i) => {
    if (i !== index) {
      // 只保留没有被删除的文件
      newFiles.items.add(file)
    }
  })

  // 更新文件输入框的文件列表
  fileInput.files = newFiles.files

  // 删除预览图像
  imagePreviews.value.splice(index, 1)
}

// 切换最大参与人数输入框状态
function toggleMaxParticipants() {
  if (isRegistrationRequired.value === 'false') {
    maxParticipants.value = 0 // 設定為 0
    // 禁用輸入框
    document.getElementById('max_participants').disabled = true
  } else {
    // 啟用輸入框
    document.getElementById('max_participants').disabled = false
    if (maxParticipants.value === 0) {
      maxParticipants.value = 1 // 如果為 0，設為 1
    }
  }
}

// 設定開始時間不能選過去的日期和結束時間不能早於開始時間
onMounted(() => {
  axios
    .get('http://localhost:8080/api/vendor_admin/activity/allTypes') // 確保端點正確
    .then((response) => {
      activityTypes.value = response.data
    })
    .catch((error) => {
      console.error('獲取活動類型失敗：', error)
    })

  toggleMaxParticipants()
})
</script>

<style scoped>
.container {
  max-width: 70%;
  margin: auto;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.content-box {
  width: 100%;
  max-width: 100%;
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
  /*             overflow-x: auto; */
  /*             max-height: 200px; */
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

#preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.image-preview {
  position: relative;
  display: inline-block;
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
  z-index: 10;
}
</style>
