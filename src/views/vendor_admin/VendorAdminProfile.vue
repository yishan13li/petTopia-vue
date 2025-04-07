<template>
  <!-- <VendorAdminSidebar></VendorAdminSidebar> -->
  <div class="content-body">
    <div class="container">
      <div class="content-box">
        <form @submit.prevent="updateVendor" enctype="multipart/form-data">

          <div class="row">
            <div class="col-md-4 border-right d-flex align-items-center justify-content-center">
              <div class="text-center p-3 py-5">
                <div class="slogan-container">
                  <div class="slogan-block" v-for="(slogan, index) in storeSlogans" :key="index"
                    :style="getSloganStyle(index)">
                    {{ slogan }}
                  </div>
                </div>

                <img :src="computedVendorLogoImg" class="rounded-circle mt-3" width="90" @click="triggerFileInput" />
                <input type="file" ref="imageUpload" accept="image/*" style="display: none" @change="previewImage" />
                <br />
                <span class="font-weight-bold">會員ID: {{ vendor.id }}</span>
                <br />
                店家等級:<span class="text-black-50">{{ vendor.vendorLevel }}</span><br />
                總活動數:<span class="font-weight-bold">{{ vendor.eventCount }}</span><br />

              </div>
            </div>
            <div class="col-md-8">
              <div class="p-3 py-5">
                <div class="row mt-2">
                  <div class="col-md-6">
                    <label>店家名稱:</label>
                    <input type="text" class="form-control" v-model="vendor.name" />
                  </div>
                  <div class="col-md-6">
                    <label>店家類別:</label>
                    <select class="form-control" v-model="vendor.vendorCategory.id" v-if="vendor.vendorCategory">
                      <option v-for="type in allcategory" :key="type.id" :value="type.id">
                        {{ type.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col-md-6">
                    <label>Email:</label>
                    <input type="email" class="form-control" v-model="vendor.contactEmail" required />
                    <span v-if="emailError" style="color: red">請輸入有效的 Email。</span>
                  </div>
                  <div class="col-md-6">
                    <label>電話號碼:</label>
                    <input type="text" class="form-control" v-model="vendor.phone" required />
                    <span v-if="phoneError" style="color: red">請輸入有效的電話號碼。</span>
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
                    <input type="text" class="form-control" v-model="vendor.contactPerson" />
                  </div>
                  <div class="col-md-6">
                    <label>統一編號:</label>
                    <input type="text" class="form-control" v-model="vendor.taxidNumber" />
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col-md-6">
                    <label>註冊日期:</label>
                    <input type="text" class="form-control" v-model="vendor.registrationDate" disabled />
                  </div>
                  <div class="col-md-6">
                    <label>認證狀態:</label>
                    <input type="text" class="form-control" :value="vendor.status ? '已認證' : '未認證'" disabled />
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col-md-12">
                    <label>店家圖片:</label>
                    <div v-if="vendorImages.length > 0" class="image-upload">
                      <div class="image-preview" v-for="(image, index) in vendorImages" :key="index">
                        <img :src="image.url" alt="店家圖片" class="preview-image" />
                        <button @click="deleteImage(image.id, $event)" class="delete-btn">
                          刪除
                        </button>
                      </div>
                    </div>

                    <div v-else>
                      <p>目前沒有圖片</p>
                    </div>
                    <br />
                    <label>新增活動圖片:</label>
                    <div>
                      <input type="file" ref="fileInput" id="house_photo" name="files" multiple
                        @change="handleFileChange" />
                      <br />
                      <div class="image-upload" id="preview-container">
                        <div v-for="(file, index) in imagePreviews" :key="index" class="image-preview">
                          <img :src="file.preview" alt="活動圖片" class="preview-image" />
                          <button type="button" class="delete-btn" @click="removePreview(index)">
                            刪除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-5 d-flex justify-content-end">
                  <button class="btn btn-secondary" @click="updateDemoData" type="button">Demo</button>
                  <button class="btn btn-primary profile-button" type="submit">更新資訊</button>
                </div>

                <div class="modal fade" id="updateSuccessModal" tabindex="-1">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">更新成功</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                      </div>
                      <div class="modal-body">您的資料已成功更新！</div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                          確定
                        </button>
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
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
// import VendorAdminSidebar from '@/components/VendorAdminSidebar.vue';
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
const authStore = useAuthStore()
const userId = authStore.userId

// 初始化資料
const vendor = ref({
  id: userId, //登入後要改
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
})

const allcategory = ref([])
const emailError = ref(false)
const phoneError = ref(false)
const vendorLogoImg = ref('https://cdn0.popo.tw/uc/61/50365/O.jpg')
const imageUpload = ref(null)
const vendorImages = ref([])
const imagePreviews = ref([])
const deletedImageIds = ref([]) // 存放要刪除的圖片 ID
const fileInput = ref(null)
const storeSlogans = ref([])

const defaultImage = 'https://cdn0.popo.tw/uc/61/50365/O.jpg'; // 預設圖片網址

const computedVendorLogoImg = computed(() => {
  return vendorLogoImg.value ? vendorLogoImg.value : defaultImage;
});


const validateForm = () => {
  emailError.value = !/\S+@\S+\.\S+/.test(vendor.value.contactEmail);
  phoneError.value = !/^\d{10}$/.test(vendor.value.phone); // 假设为 10 位数字
  return !(emailError.value || phoneError.value);
};

const updateDemoData = () => {
  // 这里模拟更新数据，你可以根据需要更新任何数据
  vendor.value.name = '狗狗訓練';
  vendor.value.vendorCategory = { id: 6, name: '寵物訓練' };
  vendor.value.contactEmail = 'doggod@gmail.com';
  vendor.value.phone = '0919766558';
  vendor.value.address = '高雄市苓雅區成功路';
  vendor.value.description = '這是一個狗狗訓練的好場所。';
  vendor.value.contactPerson = '陳小姐';
  vendor.value.taxidNumber = '1234567789';
};


const deleteImage = (imageId, event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  if (!deletedImageIds.value.includes(imageId)) {
    deletedImageIds.value.push(imageId) // 加入刪除列表
  }

  // 从前端列表中移除该图片
  vendorImages.value = vendorImages.value.filter((image) => image.id !== imageId)
}

// 处理文件上传预览
function handleFileChange(event) {
  const files = event.target.files
  imagePreviews.value = [] // 清空现有的预览
  Array.from(files).forEach((file) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      imagePreviews.value.push({ preview: e.target.result, file })
    }
    reader.readAsDataURL(file)

    // 确保文件添加到 FormData
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('files', file))

    // 输出 FormData 内容检查
    console.log([...formData])
  })
}

// 删除预览图片
function removePreview(index) {
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
  imagePreviews.value.splice(index, 1)
}

const getSloganStyle = (index) => {
  const colors = ['#005AB5', '#01B468', '#AE57A4', '#5A5AAD', '#5A5AAD'] // 定義顏色陣列
  const colorIndex = index % colors.length // 根據 index 循環顏色
  return {
    backgroundColor: colors[colorIndex],
    color: '#fff',
    padding: '5px',
    borderRadius: '20px',
    marginBottom: '5px',
  }
}

// 格式化日期的函數
const formatReviewDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份從0開始
  const day = date.getDate()
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? '下午' : '上午'

  // 轉換為12小時制
  hours = hours % 12
  hours = hours ? hours : 12 // 小時為0時顯示12

  // 格式化為 'YYYY年M月D日 上午/下午 HH:mm'
  return `${year}年${month}月${day}日 ${period} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
}

// 返回首頁
const goHome = () => (window.location.href = '/vendor_admin/vendor_admin_activity')

// 登出
const logout = () => (window.location.href = '/logout')

// 觸發圖片上傳
const triggerFileInput = () => imageUpload.value.click()

// 預覽圖片
const previewImage = (event) => (vendorLogoImg.value = URL.createObjectURL(event.target.files[0]))

// 更新店家資料
const updateVendor = async () => {

  if (!validateForm()) {

    return; // 如果验证失败，停止提交
  }
  const formData = new FormData()
  formData.append('vendorId', vendor.value.id)
  formData.append('vendorName', vendor.value.name)
  formData.append('contactEmail', vendor.value.contactEmail)
  formData.append('vendorPhone', vendor.value.phone)
  formData.append('vendorAddress', vendor.value.address)
  formData.append('vendorDescription', vendor.value.description)
  formData.append('contactPerson', vendor.value.contactPerson)
  formData.append('vendorTaxidNumber', vendor.value.taxidNumber)
  formData.append('category', vendor.value.vendorCategory.id)

  // 处理要删除的图片 ID
  deletedImageIds.value.forEach((id) => {
    formData.append('deletedImageIds', id)
  })

  console.log(imagePreviews.value)
  // 附加新上传的图片
  imagePreviews.value.forEach((file) => {
    console.log(file.file)
    formData.append('files', file.file)
  })
  // 檢查是否有選擇 logo 圖片
  const logoInput = imageUpload.value
  if (logoInput.files.length > 0) {
    formData.append('vendorLogoImg', logoInput.files[0])
  }
  console.log('formData', formData)
  const url = `http://localhost:8080/api/vendor/update/${vendor.value.id}`
  try {
    const response = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    console.log(response.data)
    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: '商家資料更新成功',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.reload(); // 成功后重新加载页面
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '更新失敗',
        text: '請稍後再試。',
        confirmButtonText: 'OK'
      });
    }
  } catch (error) {
    console.error('更新商家資料時發生錯誤：', error)
  }
}

onMounted(async () => {

  try {
    const email = encodeURIComponent('1234@gmail.com') // 將 email 編碼
    const password = '1234'
    const url = `http://localhost:8080/api/vendor_admin/profile?id=${vendor.value.id}` //mail的@會跑掉，所以後端先改用id

    // 獲取商家資料和類別
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(response.data)
    // 當返回成功時，將資料存入 `vendor` 和 `allcategory`
    vendor.value = response.data.vendor
    allcategory.value = response.data.allcategory
    console.log(allcategory.value)
    // 确保 vendor.category 被正确赋值
    if (response.data.vendor) {
      vendor.value = response.data.vendor
      // 赋一个默认值，防止 vendorCategory 为 undefined
      vendor.value.vendorCategory = response.data.vendor.vendorCategory || { id: null, name: '' }
    }

    // 處理 base64 格式的圖片
    if (response.data.vendorLogoImgBase64) {
      vendorLogoImg.value = response.data.vendorLogoImgBase64
    } else {
      vendorLogoImg.value = ''
    }

    // 格式化註冊日期
    const formattedDate = formatReviewDate(response.data.vendor.registrationDate)
    vendor.value.registrationDate = formattedDate
  } catch (error) {
    console.error('獲取商家資料時發生錯誤：', error)
  }

  try {
    const url = `http://localhost:8080/profile_photos/ids?vendorId=${vendor.value.id}`
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (response.status === 200) {
      // 根據圖片 ID 請求圖片文件
      vendorImages.value = await Promise.all(
        response.data.map(async (imageId) => {
          try {
            const imageResponse = await axios.get(`http://localhost:8080/profile_photos/download?photoId=${imageId}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              responseType: 'blob'
            })
            const imageUrl = URL.createObjectURL(imageResponse.data)
            return { id: imageId, url: imageUrl }
          } catch (error) {
            console.error(`獲取圖片 ${imageId} 失敗：`, error)
            return { id: imageId, url: null }
          }
        })
      )
    }
  } catch (error) {
    console.error('獲取店家圖片時發生錯誤：', error)
  }

  // 假設你有一個 API 請求來獲取標語
  axios.get(`http://localhost:8080/api/vendor/${vendor.value.id}/slogans`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then((response) => {
      console.log(response.data)
      storeSlogans.value = response.data // 更新標語
    })
    .catch((error) => {
      console.log('取得標語錯誤：', error)
    })
})
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

input[type='email'],
.email-class {
  text-transform: none;
  /* 防止强制转为大写 */
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

.store-slogans {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.store-slogans h2 {
  font-size: 12px;
  color: #333;
  margin-bottom: 10px;
}

.slogan-container {
  display: flex;
  flex-wrap: wrap;
  /* 使標語能換行 */
  gap: 5px;
  /* 每個標語區塊之間的間距 */
  justify-content: center;
  /* 使標語區塊居中對齊 */
}

.slogan-block {
  font-size: 12px;
  text-align: center;
  width: 90px;
  max-width: 100%;
  margin: 5px 0;
}
</style>
