<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-end">
        <div class="col-md-5">
          <div class="register-container">
            <h2 class="mb-4">會員註冊</h2>

            <!-- 驗證提示 -->
            <div v-if="showVerification" class="verification-notice">
              <div class="alert alert-success">
                <h4 class="alert-heading">註冊成功！</h4>
                <p>我們已發送驗證郵件至您的信箱：{{ email }}</p>
                <p>請在 {{ countdown }} 秒內完成驗證</p>
                <div class="verification-form mt-3">
                  <div class="form-group mb-3">
                    <label for="verificationCode">請輸入驗證碼</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="verificationCode" 
                      v-model="verificationCode" 
                      placeholder="請輸入6位數驗證碼"
                      maxlength="6"
                    >
                  </div>
                  <button 
                    class="btn btn-primary w-100 mb-3" 
                    @click="verifyEmail"
                    :disabled="!verificationCode">
                    驗證
                  </button>
                </div>
                <hr>
                <p class="mb-0">
                  沒收到驗證信？
                  <button 
                    class="btn btn-link p-0" 
                    @click="resendVerification" 
                    :disabled="countdown > 0">
                    重新發送
                  </button>
                </p>
              </div>
            </div>

            <!-- 郵箱驗證成功後顯示 loading -->
            <div v-if="showLoading" class="preloader-wrapper active">
              <div class="preloader"></div>
              <div class="loading-message">
                <h4>{{ loadingMessage }}</h4>
                <p v-if="countdownSeconds > 0">{{ countdownSeconds }} 秒後轉至登入頁面...</p>
              </div>
            </div>

            <!-- 成功消息显示 -->
            <div v-if="success" class="alert alert-success">
              <span>{{ success }}</span>
            </div>

            <!-- 错误消息显示 -->
            <div v-if="error" class="alert alert-danger">
              <span>{{ error }}</span>
            </div>

            <form v-if="!showVerification" @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="email" class="form-label">電子郵件</label>
                <input type="email" class="form-control" id="email" v-model="email" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">密碼</label>
                <input type="password" class="form-control" id="password" v-model="password" required>
                <small class="text-muted">請輸入您想設置的密碼</small>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">確認密碼</label>
                <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block w-100 mb-3">註冊</button>
              </div>

              <div class="divider"><span>或</span></div>
              
              <a href="/oauth2/authorization/google" class="social-btn">
                <img src="/user_static/icon/Google_icon.png" alt="Google"> 使用   Google   註冊
              </a>
              
              <a href="/oauth2/authorization/facebook" class="social-btn">
                <img src="/user_static/icon/Facebook_icon.png" alt="Facebook"> 使用 Facebook 註冊
              </a>
            </form>
            <p v-if="!showVerification" class="text-center mt-3">已經有帳號？ <router-link to="/login">登入</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
      showVerification: false,
      countdown: 300,
      timer: null,
      canResend: false,
      success: null,
      error: null,
      showLoading: false,
      loadingMessage: '驗證成功！',
      countdownSeconds: 2,
      countdownTimer: null
    };
  },
  methods: {
    startCountdown() {
      this.countdown = 300;
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    
    // 開始跳轉倒計時的方法
    startRedirectCountdown() {
      this.countdownSeconds = 2;
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
      }
      
      this.countdownTimer = setInterval(() => {
        if (this.countdownSeconds > 0) {
          this.countdownSeconds--;
        } else {
          clearInterval(this.countdownTimer);
          // 驗證成功後跳轉到登入頁面
          this.$router.push('/login?verified=true&message=' + encodeURIComponent('郵箱驗證成功，請登入'));
        }
      }, 1000);
    },
    async handleRegister() {
      try {
        // 清除之前的錯誤和成功消息
        this.error = null;
        this.success = null;

        // 基本驗證
        if (!this.email || !this.password) {
          this.error = '請填寫所有必填欄位';
          return;
        }

        // 驗證密碼
        if (this.password !== this.confirmPassword) {
          this.error = '兩次輸入的密碼不一致';
          return;
        }

        // 準備註冊數據
        const registerData = {
          email: this.email.trim(),
          password: this.password,
          confirmPassword: this.confirmPassword
        };

        console.log('準備發送註冊請求，完整數據:', JSON.stringify(registerData, null, 2));

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registerData)
        });

        console.log('服務器響應狀態:', response.status);
        
        // 檢查響應內容類型
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
          console.log('註冊響應完整數據:', JSON.stringify(data, null, 2));
        } else {
          const text = await response.text();
          console.log('非 JSON 響應:', text);
          data = { message: '服務器響應格式不正確' };
        }

        if (response.ok) {
          this.success = '註冊成功！請查看您的電子郵件信箱進行驗證';
          this.showVerification = true;
          this.startCountdown();  // 開始倒數計時
        } else {
          // 處理具體的錯誤情況
          if (data.error) {
            this.error = data.error;
          } else if (response.status === 400) {
            this.error = '註冊資料格式不正確，請檢查您的輸入';
            console.error('請求數據:', registerData);
            console.error('響應數據:', data);
          } else if (response.status === 409) {
            this.error = '該電子郵件已被註冊';
          } else {
            this.error = '註冊失敗，請稍後再試';
          }
          console.error('註冊失敗:', {
            status: response.status,
            data: data,
            requestData: registerData
          });
        }
      } catch (error) {
        console.error('註冊過程發生錯誤:', error);
        this.error = '系統錯誤，請稍後再試';
      }
    },
    async verifyEmail() {
      try {
        const response = await fetch('/api/auth/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            code: this.verificationCode
          })
        });

        const data = await response.json();

        if (response.ok && data.verified) {
          // 顯示 loading 動畫
          this.loadingMessage = '郵箱驗證成功！';
          this.showLoading = true;
          this.startRedirectCountdown();
        } else {
          this.error = data.error || '驗證碼錯誤，請重新輸入';
        }
      } catch (error) {
        console.error('驗證過程發生錯誤:', error);
        this.error = '系統錯誤，請稍後再試';
      }
    },
    async resendVerification() {
      try {
        const response = await fetch('/api/auth/send-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email
          })
        });

        const data = await response.json();

        if (response.ok) {
          this.success = '驗證郵件已重新發送，請查收';
          this.startCountdown();
        } else {
          this.error = data.error || '重新發送失敗，請稍後再試';
        }
      } catch (error) {
        console.error('重新發送驗證郵件時發生錯誤:', error);
        this.error = '系統錯誤，請稍後再試';
      }
    }
  },
  beforeUnmount() {
    // 組件銷毀前清除計時器
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }
};
</script>

<style>
.register-page {
  width: 100%;
  min-height: 100vh;
  background: url('/user_static/images/background-img.png') no-repeat center center/cover;
  display: flex;
  align-items: center;
  padding: 40px 0;
}

.register-container {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.register-form {
  max-width: 500px;
  margin: 0 auto;
}

.verify-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.verify-input {
  flex: 1;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider span {
  padding: 0 10px;
  background-color: white;
  position: relative;
  z-index: 5;
}

.divider:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ddd;
  z-index: 1;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  padding: 10px 0;
  border-radius: 5px;
  text-decoration: none;
  color: #333;
  border: 1px solid #ccc;
  transition: all 0.3s;
}

.social-btn:hover {
  background-color: #f5f5f5;
}

.social-btn img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

/* Loading 動畫樣式 */
.preloader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.preloader-wrapper .preloader {
  margin: 0 auto;
  transform: translateZ(0);
  position: relative;
}

.preloader:before,
.preloader:after,
.preloader {
  border-radius: 50%;
  width: 2em;
  height: 2em;
  animation: animation 1.2s infinite ease-in-out;
}

.preloader {
  animation-delay: -0.16s;
}

.preloader:before {
  content: '';
  position: absolute;
  top: 0;
  left: -3.5em;
  animation-delay: -0.32s;
}

.preloader:after {
  content: '';
  position: absolute;
  top: 0;
  left: 3.5em;
}

@keyframes animation {
  0%,
  80%,
  100% {
    box-shadow: 0 2em 0 -1em var(--accent-color, #ff6b6b);
  }
  40% {
    box-shadow: 0 2em 0 0 var(--accent-color, #ff6b6b);
  }
}

.loading-message {
  margin-top: 2rem;
  text-align: center;
  color: #333;
}

.loading-message h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ff6b6b;
}
</style> 