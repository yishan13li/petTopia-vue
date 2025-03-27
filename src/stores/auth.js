import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
    userRole: localStorage.getItem('userRole') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    avatarUrl: null,  // 新增：存儲頭像 URL
  }),
  
  getters: {
    // 新增 getter 來獲取 member id
    memberId: (state) => {
      // 如果是商家角色，從 user 物件中獲取 memberId
      if (state.userRole === 'VENDOR' && state.user && state.user.memberId) {
        return state.user.memberId;
      }
      // 如果不是商家角色，直接返回 userId
      return state.userId;
    },
    
    // 檢查是否已登入
    isAuthenticated: (state) => !!state.token && !!state.userId,
    
    // 獲取完整的用戶資訊
    userInfo: (state) => state.user
  },
  
  actions: {
    setToken(token, userId, userRole, userData) {
      // 先清除舊的資料
      this.clearToken();
      
      // 驗證必要資料
      if (!token || !userId) {
        console.error('缺少必要的認證資料');
        return;
      }
      
      // 設置新的認證資料
      this.token = token;
      this.userId = userId;  // 這就是 member id
      this.userRole = userRole;
      
      // 確保用戶資料包含 member id
      const completeUserData = {
        ...userData,
        userId: userId,  // 確保 userId 同步
        userRole: userRole
      };
      
      this.user = completeUserData;
      
      // 儲存到 localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('user', JSON.stringify(completeUserData));
      
      // 發送事件通知用戶資料已更新
      window.dispatchEvent(new CustomEvent('user-info-updated', {
        detail: { user: completeUserData }
      }));
      
      console.log('用戶資料已更新:', {
        token: this.token,
        memberId: this.userId,
        userRole: this.userRole,
        user: this.user
      });
    },
    
    // 清除認證資料
    clearToken() {
      this.token = null;
      this.userId = null;
      this.userRole = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      
      // 發送事件通知用戶已登出
      window.dispatchEvent(new CustomEvent('user-logout'));
      
      // 發送事件通知用戶資料已更新
      window.dispatchEvent(new CustomEvent('user-info-updated', {
        detail: { user: null }
      }));
    },
    
    // 初始化用戶資料
    async initialize() {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        // 從 API 獲取最新用戶資料
        const response = await fetch('/api/member/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          this.setToken(
            token,
            userData.userId,
            userData.userRole,
            userData
          );
        } else {
          this.clearToken();
        }
      } catch (error) {
        console.error('初始化用戶資料失敗:', error);
        this.clearToken();
      }
    },
    setUser(userData) {
      console.log('更新用戶資訊:', userData);
      
      // 讀取當前本地存儲的用戶信息，檢查是否有已更新的姓名
      let currentStoredUser = null;
      try {
        const storedUserStr = localStorage.getItem('user');
        if (storedUserStr) {
          currentStoredUser = JSON.parse(storedUserStr);
        }
      } catch (e) {
        console.error('讀取本地用戶信息失敗:', e);
      }
      
      const updatedUserData = {
        ...userData,
        userId: this.userId || userData.userId,
        userRole: this.userRole || userData.userRole
      };
      
      // ===== 強化第三方登入用戶名稱處理邏輯 =====
      
      // 處理名稱優先級：
      // 1. 如果 userData 中的名稱不是郵箱，優先使用
      // 2. 如果本地有存儲的名稱且不是郵箱，使用本地存儲的
      // 3. 如果有 OAuth2 返回的名稱，使用它
      // 4. 最後才使用郵箱
      
      // 檢查是否是第三方登入
      if (updatedUserData.provider) {
        console.log('處理第三方登入用戶名稱:', {
          提供的名稱: updatedUserData.name,
          提供的memberName: updatedUserData.memberName,
          郵箱: updatedUserData.email,
          本地存儲名稱: currentStoredUser?.name
        });
        
        // 情況1: 傳入的 userData 名稱與郵箱相同
        if (updatedUserData.name === updatedUserData.email || !updatedUserData.name) {
          // 檢查本地存儲是否有用戶更新過的名稱
          if (currentStoredUser && 
              currentStoredUser.name && 
              currentStoredUser.name !== currentStoredUser.email &&
              currentStoredUser.name !== 'null' && 
              currentStoredUser.name !== 'undefined') {
            console.log('使用本地存儲的更新名稱:', currentStoredUser.name);
            updatedUserData.name = currentStoredUser.name;
            updatedUserData.memberName = currentStoredUser.name;
          }
        }
        
        // 打印最終決定使用的名稱
        console.log('最終使用的用戶名稱:', {
          name: updatedUserData.name,
          memberName: updatedUserData.memberName,
          來源: updatedUserData.name !== updatedUserData.email ? '非郵箱名稱' : '郵箱作為名稱'
        });
      }
      
      // 確保 name 和 memberName 包含有效值
      if (!updatedUserData.memberName && updatedUserData.name) {
        updatedUserData.memberName = updatedUserData.name;
      }
      if (!updatedUserData.name && updatedUserData.memberName) {
        updatedUserData.name = updatedUserData.memberName;
      }
      
      // 移除 undefined 屬性
      Object.keys(updatedUserData).forEach(key => {
        if (updatedUserData[key] === undefined) {
          delete updatedUserData[key];
        }
      });
      
      this.user = updatedUserData;
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      console.log('用戶資訊已更新:', this.user);
    },
    
    // 完全清除所有資料（包括名稱緩存）的方法，慎用
    clearAllData() {
      console.log('清除全部資料，包括名稱緩存');
      
      // 獲取所有 localStorage 鍵
      const keys = Object.keys(localStorage);
      
      // 清除所有與名稱緩存相關的資料
      const nameCacheKeys = keys.filter(key => key.startsWith('db_name_'));
      nameCacheKeys.forEach(key => {
        console.log(`清除名稱緩存: ${key}`);
        localStorage.removeItem(key);
      });
      
      // 調用常規清除方法
      this.clearToken();
      
      console.log('已完全清除所有資料');
    },
    setAvatarUrl(url) {
      this.avatarUrl = url;
    },
    clearAvatarUrl() {
      this.avatarUrl = null;
    },
  }
})
