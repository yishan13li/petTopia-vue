<template>
  <div class="password-setup-page">
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-center mb-4">設置本地密碼</h3>
              
              <!-- 初始畫面：提供信息並提示發送驗證郵件 -->
              <div v-if="step === 'initial'">
                <div class="alert alert-info">
                  <p>您的帳號是使用 <strong>{{ provider || 'Google' }}</strong> 註冊的。</p>
                  <p>設置本地密碼後，您可以選擇使用：</p>
                  <ul>
                    <li>原有的 <strong>{{ provider || 'Google' }}</strong> 登入</li>
                    <li>使用電子郵件和密碼登入</li>
                  </ul>
                </div>
                
                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>
                
                <div v-if="message" class="alert alert-success">
                  {{ message }}
                </div>
                
                <form @submit.prevent="sendVerification" class="mt-4">
                  <div class="text-center">
                    <button type="submit" class="btn btn-primary" :disabled="isLoading">
                      {{ isLoading ? '發送中...' : '發送驗證碼' }}
                    </button>
                  </div>
                </form>
              </div>
              
              <!-- 第二步：驗證碼驗證 -->
              <div v-if="step === 'verification'">
                <div class="alert alert-info">
                  <p>我們已發送驗證碼至您的信箱：<strong>{{ email }}</strong></p>
                  <p>請在 {{ countdown }} 秒內完成驗證</p>
                </div>
                
                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>
                
                <div v-if="message" class="alert alert-success">
                  {{ message }}
                </div>
                
                <form @submit.prevent="verifyCode" class="mt-4">
                  <div class="form-group mb-3">
                    <label for="verificationCode">請輸入驗證碼</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="verificationCode" 
                      v-model="verificationCode" 
                      placeholder="請輸入6位數驗證碼"
                      maxlength="6"
                      required
                    >
                  </div>
                  
                  <div class="text-center mb-3">
                    <button type="submit" class="btn btn-primary w-100" :disabled="isLoading || !verificationCode">
                      {{ isLoading ? '驗證中...' : '驗證' }}
                    </button>
                  </div>
                </form>
                
                <div class="text-center">
                  <p class="mb-0">
                    沒收到驗證碼？
                    <button 
                      class="btn btn-link p-0" 
                      @click="resendVerification" 
                      :disabled="countdown > 0 || isLoading">
                      重新發送
                    </button>
                  </p>
                </div>
              </div>
              
              <!-- 第三步：密碼設置表單 -->
              <div v-if="step === 'password'">
                <div class="alert alert-info">
                  <p>請為您的帳號 <strong>{{ email }}</strong> 設置本地密碼</p>
                </div>
                
                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>
                
                <div v-if="message" class="alert alert-success">
                  {{ message }}
                </div>
                
                <form @submit.prevent="setPassword" class="mt-4">
                  <div class="form-group mb-3">
                    <label for="password">新密碼</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      id="password" 
                      v-model="password" 
                      required
                      minlength="8" 
                      maxlength="20"
                    >
                    <small class="form-text text-muted">
                      密碼長度必須在8-20個字元之間
                    </small>
                  </div>
                  
                  <div class="form-group mb-3">
                    <label for="confirmPassword">確認密碼</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      id="confirmPassword" 
                      v-model="confirmPassword" 
                      required
                    >
                  </div>
                  
                  <div class="text-center">
                    <button type="submit" class="btn btn-primary" :disabled="isLoading">
                      {{ isLoading ? '設置中...' : '設置密碼' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      provider: '',
      step: 'initial', // 'initial', 'verification' 或 'password'
      password: '',
      confirmPassword: '',
      error: '',
      message: '',
      isLoading: false,
      verificationCode: '',
      countdown: 0,
      countdownTimer: null
    };
  },
  created() {
    // 從URL獲取電子郵件
    const urlParams = new URLSearchParams(window.location.search);
    this.email = urlParams.get('email');
    
    if (!this.email) {
      this.error = '缺少電子郵件地址參數，請從登入頁面重新操作';
      return;
    }
    
    // 初始步驟：檢查帳號是否為第三方登入
    this.checkEmailStatus();
  },
  beforeUnmount() {
    // 清除計時器
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },
  methods: {
    // 檢查電子郵件的登入方式
    async checkEmailStatus() {
      try {
        this.isLoading = true;
        const response = await fetch(`/api/auth/local-password/check?email=${encodeURIComponent(this.email)}`);
        const data = await response.json();
        
        if (response.ok) {
          if (data.canSetupLocalPassword) {
            this.provider = data.provider;
          } else {
            this.error = '此帳號無法設置本地密碼';
            this.step = 'error';
          }
        } else {
          this.error = data.error || '檢查帳號狀態時發生錯誤';
        }
      } catch (error) {
        console.error('檢查電子郵件狀態錯誤:', error);
        this.error = '無法檢查帳號狀態，請稍後再試';
      } finally {
        this.isLoading = false;
      }
    },
    
    // 發送驗證郵件
    async sendVerification() {
      try {
        this.isLoading = true;
        this.error = '';
        this.message = '';
        
        const response = await fetch('/api/auth/local-password/send-verification', {
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
          this.message = '驗證碼已發送，請查收您的電子郵件';
          this.step = 'verification';
          this.startCountdown();
        } else {
          this.error = data.error || '無法發送驗證碼';
        }
      } catch (error) {
        console.error('發送驗證碼錯誤:', error);
        this.error = '發送驗證碼時發生錯誤，請稍後再試';
      } finally {
        this.isLoading = false;
      }
    },
    
    // 啟動倒數計時
    startCountdown() {
      // 清除之前的計時器
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
      }
      
      this.countdown = 60; // 60秒倒數
      
      this.countdownTimer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.countdownTimer);
        }
      }, 1000);
    },
    
    // 重新發送驗證碼
    resendVerification() {
      this.sendVerification();
    },
    
    // 驗證驗證碼
    async verifyCode() {
      try {
        this.isLoading = true;
        this.error = '';
        this.message = '';
        
        if (!this.verificationCode || this.verificationCode.length !== 6) {
          this.error = '請輸入6位數驗證碼';
          this.isLoading = false;
          return;
        }
        
        const response = await fetch('/api/auth/local-password/verify-code', {
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
          this.message = '驗證成功';
          // 清除計時器
          if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
          }
          // 進入密碼設置階段
          setTimeout(() => {
            this.step = 'password';
            this.message = '';
          }, 1000);
        } else {
          this.error = data.error || '驗證碼錯誤';
        }
      } catch (error) {
        console.error('驗證驗證碼錯誤:', error);
        this.error = '驗證過程中發生錯誤，請稍後再試';
      } finally {
        this.isLoading = false;
      }
    },
    
    // 設置密碼
    async setPassword() {
      // 驗證密碼
      if (this.password !== this.confirmPassword) {
        this.error = '兩次輸入的密碼不一致';
        return;
      }
      
      if (this.password.length < 8 || this.password.length > 20) {
        this.error = '密碼長度必須在8-20個字元之間';
        return;
      }
      
      try {
        this.isLoading = true;
        this.error = '';
        this.message = '';
        
        const response = await fetch('/api/auth/local-password/set-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          this.message = '密碼設置成功，3秒後將跳轉到登入頁面';
          
          // 清除輸入內容
          this.password = '';
          this.confirmPassword = '';
          
          // 3秒後跳轉到登入頁面
          setTimeout(() => {
            this.$router.push({
              path: '/login',
              query: {
                message: '本地密碼設置成功，請使用新密碼登入'
              }
            });
          }, 3000);
        } else {
          this.error = data.error || '設置密碼失敗';
        }
      } catch (error) {
        console.error('設置密碼錯誤:', error);
        this.error = '設置密碼時發生錯誤，請稍後再試';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.password-setup-page {
  min-height: calc(100vh - 60px);  /* 減去header的高度 */
  background: url('/user_static/images/background-img.png') no-repeat center center/cover;
  padding: 2rem 0;
}

.card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.btn-primary {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
}

.btn-primary:hover {
  background-color: #ff5252;
  border-color: #ff5252;
}

.btn-link {
  color: #ff6b6b;
  text-decoration: none;
}

.btn-link:hover {
  color: #ff5252;
  text-decoration: underline;
}
</style> 