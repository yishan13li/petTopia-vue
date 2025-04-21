<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-end" v-if="!showLoading">
        <div class="col-md-5">
          <div class="login-container">
            <h2 class="mb-4">會員登入</h2>

            <div v-if="success" class="alert alert-success">
              <span>{{ success }}</span>
            </div>

            <!-- 错误消息显示 -->
            <div v-if="error" class="alert alert-danger">
              <span>{{ error }}</span>
              <!-- 如果是第三方登入帳號，顯示相應的選項 -->
              <div v-if="showLocalPasswordSetup" class="mt-3">
                <p>您可以：</p>
                <ul>
                  <li>
                    <a v-if="provider === 'GOOGLE'" href="/oauth2/authorization/google" class="btn btn-danger btn-sm">
                      <img src="/user_static/icon/Google_icon.png" alt="Google" style="width: 20px; height: 20px; margin-right: 5px;"> 
                      使用 Google 登入
                    </a>
                    <a v-if="provider === 'FACEBOOK'" href="/oauth2/authorization/facebook" class="btn btn-primary btn-sm">
                      <img src="/user_static/icon/Facebook_icon.png" alt="Facebook" style="width: 20px; height: 20px; margin-right: 5px;"> 
                      使用 Facebook 登入
                    </a>
                  </li>
                  <li class="mt-2">
                    <router-link :to="`/local-password/setup?email=${userEmail}`" class="btn btn-outline-primary btn-sm">
                      設置本地密碼
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>

            <div id="messageArea" class="mb-3">
              <div v-if="param.isThirdPartyAccount" class="alert alert-info">
                <p>此帳號是使用 <strong>{{ param.provider }}</strong> 註冊的。</p>
                <p>您可以：</p>
                <ul>
                  <li>使用 <strong>{{ param.provider }}</strong> 登入</li>
                  <li><router-link :to="`/local-password/setup?email=${param.email}`">設置本地密碼</router-link> 以使用電子郵件登入</li>
                </ul>
              </div>
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">電子郵件</label>
                <input type="email" class="form-control" id="email" v-model="email" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">密碼</label>
                <input type="password" class="form-control" id="password" v-model="password" required>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block w-100 mb-3">登入</button>
              </div>

              <div class="divider"><span>或</span></div>
              
              <a href="/oauth2/authorization/google" class="social-btn">
                <img src="/user_static/icon/Google_icon.png" alt="Google"> 使用 Google 登入
              </a>
              
              <a href="/oauth2/authorization/facebook" class="social-btn">
                <img src="/user_static/icon/Facebook_icon.png" alt="Facebook"> 使用 Facebook 登入
              </a>
            </form>
            <div class="text-center mb-3">
              <router-link to="/register" class="text-decoration-none">
                還沒有帳號？立即註冊
              </router-link>
            </div>

            <!-- 當嘗試用密碼登入第三方帳號時顯示提示 -->
            <div v-if="showLocalPasswordSetup" class="alert alert-warning">
              <p><strong>提示：</strong>您的帳號是使用 {{ provider }} 註冊的，還未設置本地密碼。</p>
              <p>您可以選擇：</p>
              <div class="d-flex gap-2 mt-2">
                <button class="btn btn-primary" @click="redirectToLocalPasswordSetup">
                  設置本地密碼
                </button>
                <button class="btn btn-outline-primary" @click="loginWithProvider">
                  使用 {{ provider }} 登入
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 登入成功顯示 loading 動畫和提示 -->
    <div v-if="showLoading" class="preloader-wrapper active">
      <div class="preloader"></div>
      <div class="loading-message">
        <h4>{{ loadingMessage }}</h4>
        <p v-if="countdownSeconds > 0">{{ countdownSeconds }} 秒後轉至首頁...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';

export default {
  components: {
    Icon
  },
  data() {
    return {
      email: '',
      password: '',
      success: null,
      error: null,
      countdown: 0,
      param: {},
      showLocalPasswordSetup: false,
      provider: '',
      userEmail: '',
      authStore: null,
      showLoading: false,
      loadingMessage: '登入成功！',
      countdownSeconds: 2,
      countdownTimer: null
    };
  },
  created() {
    // 初始化 auth store
    this.authStore = useAuthStore();
    
    // 從 URL 獲取參數
    const urlParams = new URLSearchParams(window.location.search);
    
    // 填充參數對象
    this.param = {
      oauth2Success: urlParams.get('oauth2Success') === 'true',
      isThirdPartyAccount: urlParams.get('isThirdPartyAccount') === 'true',
      provider: urlParams.get('provider'),
      email: urlParams.get('email'),
      message: urlParams.get('message'),
      error: urlParams.get('error')
    };
    
    // 檢查是否正在處理 OAuth2 回調
    if (window.location.search.includes('code=')) {
      this.handleOAuth2Callback();
    }
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const authStore = useAuthStore();
    
    console.log('Login組件掛載，檢查URL參數...');
    
    // 檢查是否有令牌返回
    const token = urlParams.get('token');
    if (token) {
      console.log('檢測到令牌，進行登入處理...');
      
      // 檢查是否是第三方登入
      const isOAuth2Login = urlParams.get('oauth2Success') === 'true';
      
      // 從 URL 參數中獲取用戶數據
      const userData = {
        name: urlParams.get('name') || urlParams.get('memberName'),
        memberName: urlParams.get('memberName') || urlParams.get('name'),
        email: urlParams.get('email'),
        avatar: urlParams.get('avatar'),
        picture: urlParams.get('picture'),
        provider: urlParams.get('provider'),
        userId: urlParams.get('userId'),
        userRole: urlParams.get('role')
      };
      
      console.log('從 URL 參數獲取的詳細用戶數據:', userData);
      
      // 如果是第三方登入，檢查並使用已存在的用戶名稱
      if (isOAuth2Login) {
        const userId = urlParams.get('userId');
        // 檢查是否有已保存的用戶名稱
        const savedName = localStorage.getItem(`db_name_${userId}`);
        if (savedName && savedName !== 'null' && savedName !== 'undefined') {
          console.log('使用已保存的用戶名稱:', savedName);
          userData.name = savedName;
          userData.memberName = savedName;
        }
      }
      
      // 存儲 token 和用戶數據
      authStore.setToken(token, userData.userId, userData.userRole, userData);
      
      // 同時保存到 localStorage，確保數據持久化
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // 如果有用戶ID和名稱，保存到專用緩存
      if (userData.userId && userData.name) {
        localStorage.setItem(`db_name_${userData.userId}`, userData.name);
        console.log('保存用戶名稱到緩存:', userData.name);
      }
      
      // 發送全局事件通知其他組件用戶信息已更新
      window.dispatchEvent(new CustomEvent('user-login', { 
        detail: { 
          user: userData,
          isNewLogin: true,
          isOAuth2Login
        }
      }));
      
      // 顯示 loading 動畫和成功提示
      this.loadingMessage = '登入成功！';
      this.showLoading = true;
      this.startCountdown();
      
      // 統一使用 Vue Router 進行導航
      setTimeout(() => {
        this.$router.push({
          path: '/',
          query: {
            oauth_success: isOAuth2Login ? 'true' : undefined,
            user_new_login: isOAuth2Login ? 'true' : undefined
          }
        });
      }, 1500);
    }
    
    // 檢查既有的 token 是否有效
    this.checkTokenValidity();
    
    // 處理 URL 參數中的訊息
    if (urlParams.get('registered') === 'true') {
      this.success = decodeURIComponent(urlParams.get('message') || '註冊成功，請登入');
    }
    
    if (urlParams.get('logout') === 'true') {
      // 登出時清除所有儲存的資訊
      authStore.clearToken();
      this.success = '登出成功';
    }

    if (urlParams.has('error')) {
      this.error = decodeURIComponent(urlParams.get('message') || '登入失敗');
    }
  },
  methods: {
    // 檢查 token 是否有效
    async checkTokenValidity() {
      const authStore = useAuthStore();
      if (!authStore.token) return;
      
      try {
        // 發送請求到後端驗證 token
        const response = await fetch('/api/auth/status', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        if (!response.ok) {
          // token 無效或過期，清除儲存的資訊
          authStore.clearToken();
        }
      } catch (error) {
        console.error('Token 驗證錯誤:', error);
      }
    },
    
    // 處理本地登入
    async handleLogin() {
      try {
        // 清除之前的錯誤和成功消息
        this.error = null;
        this.success = null;
        this.showLocalPasswordSetup = false;
        
        // 基本驗證
        if (!this.email || !this.password) {
          this.error = '請填寫所有必填欄位';
          return;
        }

        const loginData = {
          email: this.email.trim(),
          password: this.password
        };

        console.log('準備發送登入請求，郵箱:', loginData.email);

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (response.ok) {
          // 使用 Pinia store 存儲 token 和用戶信息
          this.authStore.setToken(
            data.token, 
            data.userId, 
            data.role,
            { 
              name: data.name, 
              email: data.email 
            }
          );

          // 顯示 loading 動畫和成功提示
          this.loadingMessage = '登入成功！';
          this.showLoading = true;
          this.startCountdown();
        } else {
          // 處理登入失敗
          this.error = data.error || '登入失敗，請檢查您的電子郵件和密碼';
          
          // 當檢測到是第三方帳號時
          if (data.isThirdPartyAccount && data.provider) {
            this.showLocalPasswordSetup = true;
            this.provider = data.provider;
            this.userEmail = data.email;
            console.log("第三方帳號", this.provider, this.userEmail);
            return;
          }
        }
      } catch (error) {
        console.error('登入過程中發生錯誤:', error);
        this.error = '系統錯誤，請稍後再試';
      }
    },
    
    // 第三方登入處理
    async redirectToOAuth2(provider) {
      // 存儲OAuth2相關信息
      this.storeOAuth2Info(provider);
      
      // 使用標準的 OAuth2 授權端點重定向
      window.location.href = `/oauth2/authorization/${provider}?client_name=${provider}`;
    },
    
    // 處理OAuth2回調
    async handleOAuth2Callback() {
      try {
        // 獲取 URL 參數
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');
        
        // 檢查是否有錯誤
        if (error) {
          this.error = `OAuth2 認證錯誤: ${decodeURIComponent(error)}`;
          console.error('OAuth2 回調錯誤:', error);
          return;
        }
        
        // 檢查必要參數
        if (!code) {
          this.error = '未收到有效的授權碼';
          console.error('OAuth2 回調缺少授權碼');
          return;
        }
        
        console.log(`接收到 OAuth2 回調 - 授權碼: ${code.substring(0, 10)}...`);
        
        // 從 localStorage 獲取提供者
        const provider = localStorage.getItem('oauth2_provider');
        if (!provider) {
          this.error = '未找到提供者信息，無法完成登入';
          console.error('OAuth2 回調缺少提供者信息');
          return;
        }
        
        console.log(`處理 ${provider} OAuth2 回調`);
        
        // 檢查時間戳以確保會話有效
        const timestamp = localStorage.getItem('oauth2_timestamp');
        if (timestamp) {
          const timeDiff = Date.now() - parseInt(timestamp);
          if (timeDiff > 15 * 60 * 1000) { // 15分鐘超時
            this.error = 'OAuth2 會話已過期，請重新嘗試登入';
            console.error('OAuth2 會話超時:', timeDiff / 1000, '秒');
            return;
          }
        }
        
        // 使用 auth store
        const authStore = useAuthStore();
        
        // 獲取用戶資訊
        const userInfo = {
          name: localStorage.getItem('oauth2_name') || '',
          email: localStorage.getItem('oauth2_email') || ''
        };
        
        console.log(`用戶信息 - 名稱: ${userInfo.name || '未提供'}, 郵箱: ${userInfo.email || '未提供'}`);
        
        // 顯示載入中動畫
        this.loadingMessage = '驗證中...';
        this.showLoading = true;
        
        // 從後端發送登入請求
        const response = await this.axios.post('/api/oauth2/login', {
          code,
          provider,
          name: state_obj.name,
          email: state_obj.email
        });

        const data = await response.data;
        console.log('OAuth2 登入響應:', data);

        if (data && data.token) {
          console.log('OAuth2 登入成功，返回的數據:', data);
          
          // 檢查緩存中是否已有該用戶的名稱
          const cachedName = localStorage.getItem(`db_name_${data.userId}`);
          const isValidCachedName = cachedName && cachedName !== 'null' && cachedName !== 'undefined' && cachedName.length > 0;
          
          if (isValidCachedName) {
            console.log(`發現緩存的用戶名稱: ${cachedName}，將使用此名稱`);
            
            // 更新數據中的名稱
            data.name = cachedName;
            data.memberName = cachedName;
            
            // 異步獲取最新名稱，但不等待結果
            this.fetchLatestNameFromApi(data.token, data.userId)
              .then(latestName => {
                if (latestName && latestName !== cachedName) {
                  console.log(`名稱已更新: ${cachedName} -> ${latestName}`);
                }
              })
              .catch(error => {
                console.error('異步獲取最新名稱失敗:', error);
              });
          } else {
            // 沒有有效的緩存名稱，立即嘗試獲取
            console.log('沒有找到緩存的用戶名稱，將直接從 API 獲取');
            
            const latestName = await this.fetchLatestNameFromApi(data.token, data.userId);
            
            if (latestName) {
              // 更新數據中的名稱
              data.name = latestName;
              data.memberName = latestName;
              console.log(`成功獲取並設置用戶名稱: ${latestName}`);
            } else {
              console.warn('未能從 API 獲取用戶名稱，檢查 localStorage 中的數據');
              
              // 嘗試從 localStorage 中獲取用戶數據
              const savedUserData = localStorage.getItem('userData');
              if (savedUserData) {
                try {
                  const parsedUserData = JSON.parse(savedUserData);
                  if (parsedUserData && parsedUserData.name && 
                      parsedUserData.name !== 'null' && 
                      parsedUserData.name !== 'undefined' && 
                      parsedUserData.name !== data.email) {
                    
                    console.log(`從 localStorage 中找到用戶名稱: ${parsedUserData.name}`);
                    data.name = parsedUserData.name;
                    data.memberName = parsedUserData.name;
                  }
                } catch (error) {
                  console.error('解析 localStorage 中的用戶數據失敗:', error);
                }
              }
            }
          }
          
          // 保存令牌和用戶數據
          this.authStore.setToken(data.token, data.userId, data.userRole, data);
          
          // 設置登入成功標誌
          this.oauthLoginSuccess = true;
          
          // 顯示 loading 動畫和成功提示
          this.loadingMessage = '登入成功！';
          this.showLoading = true;
          this.startCountdown();
          
          // 使用 Vue Router 進行導航
          setTimeout(() => {
            this.$router.push({
              path: '/',
              query: {
                oauth_success: 'true',
                user_new_login: 'true'
              }
            });
          }, 1500);
        } else {
          this.showErrorDialog('登入失敗', '登入過程中發生錯誤，未收到有效的用戶數據');
        }
      } catch (error) {
        this.showLoading = false;
        this.error = 'OAuth2 登入過程中發生錯誤';
        console.error('OAuth2 login error:', error);
      }
    },
    // 存儲OAuth2相關信息，用於回調處理
    storeOAuth2Info(provider) {
      // 存儲當前時間戳，用於驗證會話有效期
      localStorage.setItem('oauth2_timestamp', Date.now().toString());
      // 存儲提供者信息
      localStorage.setItem('oauth2_provider', provider);
      // 如果有用戶輸入的郵箱，也可以存儲
      if (this.email) {
        localStorage.setItem('oauth2_email', this.email);
      }
      console.log(`準備使用 ${provider} 登入...`);
    },
    // 跳轉到設置本地密碼頁面
    redirectToLocalPasswordSetup() {
      if (!this.userEmail) return;
      
      this.$router.push({
        path: '/local-password/setup',
        query: { email: this.userEmail }
      });
    },
    // 使用第三方提供商登入
    loginWithProvider() {
      if (this.provider === 'GOOGLE') {
        window.location.href = '/oauth2/authorization/google';
      }
      // 添加其他提供商的處理邏輯（如有需要）
    },
    // 新增開始倒數計時的方法
    startCountdown() {
      this.countdownSeconds = 2;
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
      }
      
      this.countdownTimer = setInterval(() => {
        if (this.countdownSeconds > 0) {
          this.countdownSeconds--;
        } else {
          clearInterval(this.countdownTimer);
          // 檢查是否從商家專區來的
          const fromVendorArea = this.$route.query.from === 'vendor';
          // 檢查是否正在切換到商家角色
          const switchingToVendor = this.$route.query.switch === 'vendor';
          
          if (fromVendorArea || switchingToVendor) {
            // 如果是從商家專區來的或正在切換到商家角色，導向到商家管理頁面
            this.$router.push('/vendor_admin/profile');
          } else {
            // 根據用戶角色決定導向頁面
            const userRole = this.authStore.userRole;
            if (userRole === 'VENDOR') {
              // 如果是商家角色，導向到商家管理頁面
              this.$router.push('/vendor_admin/profile');
            } else if (userRole === 'MEMBER' && this.$route.query.redirect === '/vendor_admin/profile') {
              // 如果是一般會員要切換到商家角色，添加 switch=vendor 參數
              this.$router.push('/login?switch=vendor');
            } else {
              this.$router.push(this.$route.query.redirect || '/');
            }
          }
        }
      }, 1000);
    },
    beforeUnmount() {
      // 組件銷毀前清除計時器
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
      }
    },
    // 從 API 獲取最新用戶名稱的方法
    async fetchLatestNameFromApi(token, userId) {
      console.log(`嘗試從 API 獲取用戶 ID ${userId} 的最新名稱，令牌: ${token ? token.substring(0, 10) + '...' : 'undefined'}`);
      
      if (!token || !userId) {
        console.warn('缺少令牌或用戶 ID，無法獲取用戶名稱');
        return null;
      }
      
      // 定義要嘗試的 API 端點
      const apiEndpoints = [
        '/api/member/profile',
        `/api/member/${userId}`,
        '/api/member/userInfo'
      ];
      
      // 檢查是否是郵箱格式
      const isEmailFormat = (text) => {
        if (!text) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(text);
      };
      
      // 嘗試從每個 API 獲取名稱
      for (const endpoint of apiEndpoints) {
        try {
          console.log(`嘗試從 ${endpoint} 獲取用戶名稱`);
          
          const response = await fetch(endpoint, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!response.ok) {
            console.warn(`API ${endpoint} 返回狀態碼 ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          console.log(`從 ${endpoint} 獲取的資料:`, data);
          
          // 檢查資料是否有效
          if (data && data.name && 
              data.name !== 'null' && 
              data.name !== 'undefined' && 
              !isEmailFormat(data.name)) {
            
            console.log(`找到有效的用戶名稱: ${data.name}`);
            
            // 緩存此用戶 ID 的名稱
            localStorage.setItem(`db_name_${userId}`, data.name);
            console.log(`已緩存用戶 ${userId} 的名稱: ${data.name}`);
            
            return data.name;
          }
        } catch (error) {
          console.error(`從 ${endpoint} 獲取用戶名稱失敗:`, error);
        }
      }
      
      console.warn('所有 API 嘗試都未能獲取有效的用戶名稱');
      return null;
    },
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&display=swap');

.login-page {
  min-height: calc(100vh - 60px);  /* 減去header的高度 */
  background: url('/user_static/images/background-img.png') no-repeat center center/cover;
  padding: 2rem 0;
}

/* 登入容器位置調整 */
.login-container {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

/* 社交按鈕樣式優化 */
.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  font-weight: 500;
  margin-bottom: 12px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  font-size: 15px;
}

.social-btn:hover {
  background-color: #f8f9fa;
  border-color: #ccc;
  text-decoration: none;
  color: #333;
}

.social-btn img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  object-fit: contain;
}

/* 調整登入按鈕的樣式 */
.btn-primary.btn-block {
  padding: 10px;
  font-weight: 500;
  font-size: 15px;
  background-color: #D4A373;
  border-color: #D4A373;
}

.btn-primary.btn-block:hover {
  background-color: #c49363;
  border-color: #c49363;
}

/* 分隔線樣式優化 */
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  margin: 16px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex-grow: 1;
  height: 1px;
  background-color: #ddd;
}

.divider span {
  color: #888;
  font-size: 0.875rem;
  padding: 0 12px;
  font-weight: normal;
  white-space: nowrap;
  background: white;
  z-index: 1;
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
