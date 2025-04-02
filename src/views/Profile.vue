<template>
  <div class="profile-page">
    <div class="container-fluid py-4">
      <div class="page-container">
        <!-- 使用側邊欄組件 -->
        <ProfileSidebar />

        <!-- 主內容區域 -->
        <div class="profile-container">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">個人資料設定</h2>
            
            <!-- 顯示訊息 -->
            <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
              <i class="fas fa-check-circle"></i>
              <span>{{ success }}</span>
              <button type="button" class="btn-close" @click="success = null"></button>
            </div>
            <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="fas fa-exclamation-circle"></i>
              <span>{{ error }}</span>
              <button type="button" class="btn-close" @click="error = null"></button>
            </div>
          </div>

          <div v-if="isLoading" class="loading-overlay">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <form 
            @submit.prevent="updateProfile" 
            enctype="multipart/form-data" 
            id="profileForm" 
            :class="{ 'fade-in': !isLoading }"
            :style="{ visibility: isLoading ? 'hidden' : 'visible' }"
          >
            <!-- 頭像上傳區域 -->
            <div class="avatar-section mb-4">
              <img 
                :src="userAvatar" 
                alt="用戶頭像" 
                class="avatar-img" 
                id="avatar-preview"
                @error="handleAvatarError"
              >
              <div class="text-center mt-2">
                <span class="text-muted">{{ userEmail }}</span>
              </div>
              <div class="mt-2">
                <label for="photo" class="btn btn-outline-primary">
                  更換頭像
                  <input type="file" id="photo" name="photo" accept="image/*" @change="previewImage" style="display: none;">
                </label>
              </div>
            </div>

            <!-- 基本資料 -->
            <div class="form-group mb-3">
              <label class="form-label">姓名</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="profile.name" 
                placeholder="請輸入姓名（選填）"
              >
            </div>

            <div class="form-group mb-3">
              <label class="form-label">電話</label>
              <input 
                type="tel" 
                class="form-control" 
                v-model="profile.phone"
                @input="validatePhone"
                :class="{'is-invalid': phoneError, 'is-valid': profile.phone && !phoneError}"
                placeholder="請輸入手機號碼（選填）"
                style="width: 100%; min-width: 200px;"
              >
              <small v-if="!phoneError" class="form-text text-muted">請輸入09開頭的10位手機號碼（選填）</small>
              <div v-else class="invalid-feedback">{{ phoneError }}</div>
            </div>

            <div class="form-group mb-3">
              <label class="form-label">生日</label>
              <input 
                type="date" 
                class="form-control" 
                id="birthdate" 
                v-model="profile.birthdate"
                :max="maxDate"
              >
            </div>

            <div class="form-group mb-3">
              <label class="form-label">性別</label>
              <div class="gender-options">
                <div class="form-check form-check-inline">
                  <input 
                    type="radio" 
                    class="form-check-input" 
                    name="gender" 
                    id="male" 
                    :value="false"
                    v-model="profile.gender"
                  >
                  <label class="form-check-label" for="male">男</label>
                </div>
                <div class="form-check form-check-inline">
                  <input 
                    type="radio" 
                    class="form-check-input" 
                    name="gender" 
                    id="female" 
                    :value="true"
                    v-model="profile.gender"
                  >
                  <label class="form-check-label" for="female">女</label>
                </div>
              </div>
            </div>

            <div class="form-group mb-3">
              <label class="form-label">地址</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="profile.address" 
                placeholder="請輸入詳細地址"
              >
            </div>

            <div class="text-muted mb-3">
              <small>* 標示為必填欄位</small>
            </div>

            <div class="d-grid gap-2 mt-4">
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                {{ isLoading ? '更新中...' : '更新資料' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import ProfileSidebar from '@/components/ProfileSidebar.vue';

export default {
  components: {
    ProfileSidebar
  },
  setup() {
    const authStore = useAuthStore();
    const route = useRoute();
    
    const success = ref(null);
    const error = ref(null);
    const isLoading = ref(false);
    const photoFile = ref(null);
    const avatarPreview = ref(null);
    const phoneError = ref(null);
    
    const profile = reactive({
      name: '',
      phone: '',
      birthdate: '',
      gender: false,
      address: ''
    });
    
    // 獲取用戶資料
    const fetchUserProfile = async () => {
      try {
        isLoading.value = true;
        const response = await fetch('/api/member/profile', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          profile.name = data.name || '';
          profile.phone = data.phone || '';
          profile.birthdate = data.birthdate || '';
          profile.gender = data.gender !== undefined ? data.gender : false;
          profile.address = data.address || '';
        }
      } catch (error) {
        console.error('獲取用戶資料失敗:', error);
      } finally {
        // 延遲 100ms 後再關閉 loading 狀態
        setTimeout(() => {
          isLoading.value = false;
        }, 100);
      }
    };
    
    // 電話號碼格式驗證
    const validatePhone = () => {
      if (!profile.phone) {
        // 如果為空，不顯示錯誤（選填欄位）
        phoneError.value = null;
        return;
      }
      
      // 只允許數字輸入
      if (!/^\d*$/.test(profile.phone)) {
        profile.phone = profile.phone.replace(/\D/g, '');
      }
      
      // 長度驗證
      if (profile.phone.length > 0 && profile.phone.length < 10) {
        phoneError.value = '手機號碼長度不足';
      } else if (profile.phone.length > 10) {
        profile.phone = profile.phone.substring(0, 10); // 限制長度為10位
      } else if (profile.phone.length === 10 && !profile.phone.startsWith('09')) {
        phoneError.value = '手機號碼必須以09開頭';
      } else {
        phoneError.value = null;
      }
    };

    // 更新用戶資料
    const updateProfile = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        success.value = null;
        
        // 驗證手機號碼
        if (profile.phone) {
          validatePhone();
          if (phoneError.value) {
            error.value = phoneError.value;
            return;
          }
        }
        
        // 驗證生日
        if (profile.birthdate) {
          const birthDate = new Date(profile.birthdate);
          const today = new Date();
          if (birthDate > today) {
            error.value = '生日不能選擇未來日期';
            return;
          }
        }
        
        // 準備會員基本資料（不包含頭像）
        const memberData = {
          name: profile.name,
          phone: profile.phone,
          gender: profile.gender,
          address: profile.address,
          birthdate: profile.birthdate
        };
        
        // 第一步：更新會員基本資料
        const response = await fetch('/api/member/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'  // 防止快取
          },
          body: JSON.stringify(memberData)
        });
        
        if (!response.ok) {
          const data = await response.json();
          error.value = data.error || '更新失敗，請稍後再試';
          return;
        }
        
        // 第二步：如果有頭像文件，單獨上傳
        if (photoFile.value) {
          const photoFormData = new FormData();
          photoFormData.append('photo', photoFile.value);
          
          const photoResponse = await fetch('/api/member/upload-photo', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Cache-Control': 'no-cache'  // 防止快取
            },
            body: photoFormData
          });
          
          if (!photoResponse.ok) {
            const photoData = await photoResponse.json();
            error.value = photoData.error || '頭像上傳失敗，但基本資料已更新';
          }
        }
        
        // 更新成功
        success.value = '資料更新成功';
        
        // 清除選擇的文件
        photoFile.value = null;
        document.getElementById('photo').value = '';
        
        // 創建更新後的用戶資訊
        const updatedUser = {
          ...authStore.user,
          name: profile.name,
          memberName: profile.name
        };
        
        // 更新 authStore
        authStore.setUser(updatedUser);
        
        // 更新 localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const updatedUserData = {
          ...userData,
          name: profile.name,
          memberName: profile.name
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // 更新名稱緩存
        if (authStore.userId) {
          localStorage.setItem(`db_name_${authStore.userId}`, profile.name);
        }
        
        // 發送全局事件通知其他組件用戶資訊已更新
        window.dispatchEvent(new CustomEvent('profile-updated', {
          detail: {
            user: updatedUser,
            updateAvatar: !!photoFile.value
          }
        }));
        
        // 重新獲取用戶資料和頭像
        await fetchUserProfile();
        await fetchAvatar();
        
      } catch (err) {
        console.error('更新用戶資料時發生錯誤:', err);
        error.value = '系統錯誤，請稍後再試';
      } finally {
        isLoading.value = false;
      }
    };
    
    // 圖片預覽
    const previewImage = (event) => {
      const input = event.target;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // 檢查文件類型
        if (!file.type.startsWith('image/')) {
          error.value = '請選擇圖片文件';
          input.value = '';
          return;
        }
        
        // 檢查文件大小（限制為 5MB）
        if (file.size > 5 * 1024 * 1024) {
          error.value = '圖片大小不能超過 5MB';
          input.value = '';
          return;
        }
        
        // 儲存文件以便後續上傳
        photoFile.value = file;
        
        // 預覽圖片
        const reader = new FileReader();
        reader.onload = (e) => {
          avatarPreview.value = e.target.result;
        };
        reader.onerror = () => {
          error.value = '圖片讀取失敗，請重試';
          input.value = '';
        };
        reader.readAsDataURL(file);
      }
    };
    
    // 獲取用戶名稱
    const userName = computed(() => {
      if (!authStore.user) return '用戶';
      return authStore.user.memberName || 
             authStore.user.name || 
             authStore.user.email || 
             '用戶';
    });
    
    // 獲取用戶電子郵件
    const userEmail = computed(() => {
      if (!authStore.user) return '';
      return authStore.user.email || '';
    });
    
    // 獲取頭像URL
    const avatarUrl = ref(null);
    
    const userAvatar = computed(() => {
      // 如果有預覽圖片，優先使用
      if (avatarPreview.value) {
        return avatarPreview.value;
      }
      
      if (!authStore.user) {
        return '/user_static/images/default-avatar.png';
      }
      
      // 如果是第三方登錄用戶，優先使用第三方頭像
      if (authStore.user.provider) {
        return authStore.user.avatar || 
               authStore.user.picture || 
               '/user_static/images/default-avatar.png';
      }
      
      // 本地用戶，從後端獲取頭像
      return avatarUrl.value || '/user_static/images/default-avatar.png';
    });
    
    // 獲取頭像
    const fetchAvatar = async () => {
      if (!authStore.user || authStore.user.provider) {
        return;
      }
      
      try {
        const response = await fetch('/api/member/profile-photo', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 0) {
            avatarUrl.value = URL.createObjectURL(blob);
          } else {
            avatarUrl.value = '/user_static/images/default-avatar.png';
          }
        } else {
          avatarUrl.value = '/user_static/images/default-avatar.png';
        }
      } catch (error) {
        console.error('獲取頭像時發生錯誤:', error);
        avatarUrl.value = '/user_static/images/default-avatar.png';
      }
    };
    
    // 頭像加載錯誤處理
    const handleAvatarError = () => {
      if (!isLoading.value) {
        fetchAvatar();
      }
    };
    
    // 設置生日的最大日期（今天）
    const maxDate = computed(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
    
    // 在組件掛載時初始化頭像
    onMounted(() => {
      fetchUserProfile();
      fetchAvatar();
    });

    return {
      profile,
      success,
      error,
      isLoading,
      userName,
      userEmail,
      userAvatar,
      avatarPreview,
      maxDate,
      previewImage,
      updateProfile,
      handleAvatarError,
      phoneError,
      validatePhone
    };
  }
};
</script>

<style scoped>
/* 頁面容器樣式 */
.profile-page {
  background: url('/user_static/images/background-img.png') no-repeat center center/cover;
  min-height: calc(100vh - 60px);
  width: 100%;
  margin: 0;
  padding: 0;
}

.container-fluid {
  width: 100%;
  max-width: 100%;
  padding: 0 2%;
}

.page-container {
  display: flex;
  width: 100%;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

/* 主內容區域樣式 */
.profile-container {
  position: relative;
  flex: 1;
  min-width: 0; /* 防止flex子項溢出 */
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* 表單布局 */
form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
  transition: visibility 0.2s ease-in-out;
}

/* 表單組件樣式 */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-control {
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25);
  outline: none;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control.is-valid {
  border-color: #28a745;
}

/* 頭像上傳區域 */
.avatar-section {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.avatar-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 表單按鈕樣式 */
.btn-primary {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
  padding: 10px 20px;
}

.btn-primary:hover {
  background-color: #ff5252;
  border-color: #ff5252;
}

.btn-outline-primary {
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.btn-outline-primary:hover {
  background-color: #ff6b6b;
  color: white;
}

/* 響應式設計 */
@media (max-width: 992px) {
  .container-fluid {
    padding: 0 1rem;
  }
  
  .page-container {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-label {
    min-width: auto;
    width: 100%;
    text-align: left;
    margin-bottom: 0.5rem;
  }
  
  .form-control {
    width: 100%;
  }
}

/* 修改過渡動畫 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.2s ease-in-out;
}

.fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style> 