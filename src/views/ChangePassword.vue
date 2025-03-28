<template>
  <div class="profile-page">
    <div class="container-fluid py-4">
      <div class="page-container">
        <ProfileSidebar />
        <div class="profile-container">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">更改密碼</h2>
            
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
            @submit.prevent="handleSubmit" 
            class="password-form"
            :class="{ 'fade-in': !isLoading }"
            :style="{ visibility: isLoading ? 'hidden' : 'visible' }"
          >
            <div class="form-group">
              <label class="form-label">電子郵件</label>
              <div class="input-group">
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="form.email" 
                  required
                  :disabled="isEmailVerified"
                >
                <button 
                  type="button" 
                  class="btn btn-primary" 
                  @click="sendVerificationCode"
                  :disabled="isEmailVerified || countdown > 0"
                >
                  {{ countdown > 0 ? `${countdown}秒後重試` : '發送驗證碼' }}
                </button>
              </div>
            </div>

            <div class="form-group" v-if="!isEmailVerified">
              <label class="form-label">驗證碼</label>
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="form.verificationCode" 
                  required
                >
                <button 
                  type="button" 
                  class="btn btn-primary" 
                  @click="verifyCode"
                  :disabled="isLoading || !form.verificationCode"
                >
                  {{ isLoading ? '驗證中...' : '驗證' }}
                </button>
              </div>
            </div>

            <div class="form-group" v-if="isEmailVerified">
              <label class="form-label">新密碼</label>
              <input 
                type="password" 
                class="form-control" 
                v-model="form.newPassword" 
                required
              >
            </div>

            <div class="form-group" v-if="isEmailVerified">
              <label class="form-label">確認新密碼</label>
              <input 
                type="password" 
                class="form-control" 
                v-model="form.confirmPassword" 
                required
              >
            </div>

            <div class="d-grid gap-2 mt-4">
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="isLoading || !isEmailVerified"
              >
                {{ isLoading ? '處理中...' : '更改密碼' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';
import ProfileSidebar from '@/components/ProfileSidebar.vue';

export default {
  name: 'ChangePassword',
  components: {
    ProfileSidebar
  },
  setup() {
    const authStore = useAuthStore();
    const isLoading = ref(false);
    const isEmailVerified = ref(false);
    const countdown = ref(0);

    const form = reactive({
      email: authStore.user?.email || '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: ''
    });

    const startCountdown = () => {
      countdown.value = 60;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    };

    const sendVerificationCode = async () => {
      try {
        isLoading.value = true;
        const response = await fetch('/api/auth/send-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify({ email: form.email })
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: '驗證碼已發送',
            text: '請檢查您的電子郵件',
            timer: 3000,
            showConfirmButton: false
          });
          startCountdown();
        } else {
          const data = await response.json();
          throw new Error(data.error || '發送驗證碼失敗');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '錯誤',
          text: error.message || '發送驗證碼時發生錯誤'
        });
      } finally {
        isLoading.value = false;
      }
    };

    const verifyCode = async () => {
      try {
        isLoading.value = true;
        const response = await fetch('/api/auth/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify({
            email: form.email,
            code: form.verificationCode
          })
        });

        const data = await response.json();

        if (response.ok) {
          isEmailVerified.value = true;
          Swal.fire({
            icon: 'success',
            title: '驗證成功',
            text: '請繼續設置新密碼',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(data.error || '驗證碼錯誤');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '錯誤',
          text: error.message || '驗證碼驗證失敗'
        });
      } finally {
        isLoading.value = false;
      }
    };

    const handleSubmit = async () => {
      if (!isEmailVerified.value) {
        Swal.fire({
          icon: 'error',
          title: '錯誤',
          text: '請先驗證驗證碼'
        });
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: '錯誤',
          text: '兩次輸入的密碼不一致'
        });
        return;
      }

      try {
        isLoading.value = true;
        const response = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify({
            email: form.email,
            newPassword: form.newPassword
          })
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: '密碼更改成功',
            text: '下次登入時請使用新密碼',
            confirmButtonText: '確定'
          });
          // 清空表單
          form.newPassword = '';
          form.confirmPassword = '';
          form.verificationCode = '';
          isEmailVerified.value = false;
        } else {
          throw new Error(data.error || '密碼更改失敗');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '錯誤',
          text: error.message || '更改密碼時發生錯誤'
        });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      form,
      isLoading,
      isEmailVerified,
      countdown,
      sendVerificationCode,
      verifyCode,
      handleSubmit
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