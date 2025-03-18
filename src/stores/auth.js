import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
    userRole: localStorage.getItem('userRole') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),
  actions: {
    setToken(token, userId, userRole, userData) {
      console.log('設置用戶信息:', {
        token,
        userId,
        userRole,
        userData
      });
      
      this.token = token;
      this.userId = userId;
      this.userRole = userRole;
      
      // 添加一個內部函數來更新用戶資料
      const updateWithApiData = async () => {
        if (!token || !userData || !userData.provider) return;
        
        console.log('檢測到第三方登入，嘗試從 API 獲取最新用戶資料');
        try {
          // 嘗試多個 API 獲取最新用戶資料
          let latestUserData = null;
          
          // 0. 檢查是否已有資料庫名稱緩存
          try {
            const cachedDbName = localStorage.getItem(`db_name_${userId}`);
            if (cachedDbName && cachedDbName !== 'null' && cachedDbName !== 'undefined' && cachedDbName !== userData.email) {
              console.log('使用已緩存的資料庫名稱:', cachedDbName);
              
              // 直接使用緩存的資料庫名稱
              userData.name = cachedDbName;
              userData.memberName = cachedDbName;
              
              // 重新保存到 localStorage
              const updatedData = {
                ...userData,
                userId: userId,
                userRole: userRole
              };
              
              localStorage.setItem('user', JSON.stringify(updatedData));
              this.user = updatedData;
              
              console.log('已使用緩存資料更新用戶:', updatedData);
              
              // 仍然繼續進行 API 調用以獲取最新資料，但不阻塞用戶體驗
            }
          } catch (e) {
            console.error('檢查緩存名稱時出錯:', e);
          }
          
          // 1. 首先嘗試使用 profile API
          const profileResponse = await fetch('/api/member/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log('從 profile API 獲取的用戶資料:', profileData);
            
            if (profileData && profileData.name && 
                profileData.name !== userData.email &&
                profileData.name !== 'null' && 
                profileData.name !== 'undefined') {
              
              latestUserData = profileData;
              
              // 緩存資料庫名稱以便下次使用
              localStorage.setItem(`db_name_${userId}`, profileData.name);
            }
          }
          
          // 2. 如果 profile API 失敗或未返回有效名稱，嘗試 userId API
          if (!latestUserData && userId) {
            const memberResponse = await fetch(`/api/member/${userId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (memberResponse.ok) {
              const memberData = await memberResponse.json();
              console.log('從 userId API 獲取的用戶資料:', memberData);
              
              if (memberData && memberData.name && 
                  memberData.name !== userData.email &&
                  memberData.name !== 'null' && 
                  memberData.name !== 'undefined') {
                
                latestUserData = memberData;
                
                // 緩存資料庫名稱以便下次使用
                localStorage.setItem(`db_name_${userId}`, memberData.name);
              }
            }
          }
          
          // 如果成功獲取了最新資料，立即更新
          if (latestUserData && latestUserData.name) {
            console.log('使用 API 返回的名稱更新用戶資料:', latestUserData.name);
            
            // 更新 name 和 memberName
            userData.name = latestUserData.name;
            userData.memberName = latestUserData.name;
            
            // 重新保存到 localStorage
            const updatedData = {
              ...userData,
              userId: userId,
              userRole: userRole
            };
            
            localStorage.setItem('user', JSON.stringify(updatedData));
            this.user = updatedData;
            
            // 發送事件通知名稱已更新
            window.dispatchEvent(new CustomEvent('user-info-updated', { 
              detail: { user: updatedData }
            }));
            
            console.log('已使用 API 資料更新用戶:', updatedData);
            return true;
          }
        } catch (error) {
          console.error('獲取 API 用戶資料失敗:', error);
        }
        return false;
      };
      
      // 正常處理用戶資料
      const completeUserData = {
        ...userData,
        userId: userId,
        userRole: userRole
      };
      
      Object.keys(completeUserData).forEach(key => {
        if (completeUserData[key] === undefined) {
          delete completeUserData[key];
        }
      });
      
      this.user = completeUserData;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('user', JSON.stringify(completeUserData));
      
      console.log('用戶信息已保存:', {
        token: this.token,
        userId: this.userId,
        userRole: this.userRole,
        user: this.user
      });
      
      // 對於第三方登入，立即嘗試從 API 獲取最新資料
      if (userData && userData.provider) {
        // 立即更新一次，然後再用延遲更新確保資料最新
        updateWithApiData().then(success => {
          if (!success) {
            // 如果立即更新失敗，使用較長的延遲再次嘗試
            setTimeout(() => updateWithApiData(), 1500);
          }
        });
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
    clearToken() {
      console.log('清除登入資料，但保留名稱緩存');
      
      // 獲取當前用戶 ID，可能用於識別其緩存
      const userId = localStorage.getItem('userId');
      
      // 清除基本登入資料，但不清除名稱緩存
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      
      // 重置 store 狀態
      this.token = null;
      this.user = null;
      this.userId = null;
      this.userRole = null;
      
      // 提示：保留名稱緩存
      console.log('已清除登入資料，但保留名稱緩存以供下次登入使用');
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
    
    isAuthenticated() {
      return !!this.token;
    }
  }
})
