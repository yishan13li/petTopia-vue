<template>
  <div class="sidebar-menu">
    <div class="user-info">
      <img 
        :src="userAvatar" 
        :alt="userName" 
        class="sidebar-avatar"
        @error="handleAvatarError"
      >
      <p class="username">{{ userName }}</p>
    </div>

    <ul>
      <li class="main-item" :class="{ active: activeSection === 'account' }" @click="toggleSubMenu('account')">
        我的帳戶
        <span class="arrow" :class="{ rotate: showSubMenus.account }">▼</span>
      </li>
      <ul class="sub-items" :class="{ show: showSubMenus.account }">
        <li class="sub-item">
          <router-link :to="'/profile'" :class="{ active: activeSubItem === 'profile' }">個人檔案</router-link>
        </li>
        <li class="sub-item">
          <router-link :to="'/profile/password'" :class="{ active: activeSubItem === 'password' }">更改密碼</router-link>
        </li>
      </ul>
      <li class="main-item" :class="{ active: activeSection === 'shop' }" @click="toggleSubMenu('shop')">
        商城相關
        <span class="arrow" :class="{ rotate: showSubMenus.shop }">▼</span>
      </li>
      <ul class="sub-items" :class="{ show: showSubMenus.shop }">
        <li class="sub-item">
          <router-link :to="'/profile/coupons'" :class="{ active: activeSubItem === 'coupons' }">我的優惠券</router-link>
        </li>
        <li class="sub-item">
          <router-link :to="'/profile/address'" :class="{ active: activeSubItem === 'address' }">收貨地址</router-link>
        </li>
      </ul>
      <li class="main-item" :class="{ active: activeSection === 'activities' }" @click="toggleSubMenu('activities')">
        活動相關
        <span class="arrow" :class="{ rotate: showSubMenus.activities }">▼</span>
      </li>
      <ul class="sub-items" :class="{ show: showSubMenus.activities }">
        <li class="sub-item">
          <router-link :to="'/profile/management/vendor'" :class="{ active: activeSubItem === 'vendor' }">店家</router-link>
        </li>
        <li class="sub-item">
          <router-link :to="'/profile/management/activity'" :class="{ active: activeSubItem === 'activity' }">活動</router-link>
        </li>
      </ul>
      <!-- <li class="main-item" :class="{ active: activeSection === 'orders' }">
        <router-link :to="'/profile/orders'">購買清單</router-link>
      </li>
      <li class="main-item" :class="{ active: activeSection === 'refunds' }">
        <router-link :to="'/profile/refunds'">退款查詢</router-link>
      </li> -->
    </ul>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';

export default {
  name: 'ProfileSidebar',
  setup() {
    const authStore = useAuthStore();
    const route = useRoute();
    const showSubMenus = ref({ account: true, activities: true, shop: true });
    const activeSection = ref('account');
    const activeSubItem = ref('profile');

    // 獲取用戶名稱
    const userName = computed(() => {
      if (!authStore.user) return '用戶';
      return authStore.user.memberName || 
             authStore.user.name || 
             authStore.user.email || 
             '用戶';
    });

    // 獲取用戶頭像
    const userAvatar = computed(() => {
      if (!authStore.user) {
        return '/user_static/images/default-avatar.png';
      }
      
      if (authStore.user.provider) {
        return authStore.user.avatar || 
               authStore.user.picture || 
               '/user_static/images/default-avatar.png';
      }
      
      return authStore.avatarUrl || '/user_static/images/default-avatar.png';
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
            const url = URL.createObjectURL(blob);
            authStore.setAvatarUrl(url);
          } else {
            authStore.setAvatarUrl('/user_static/images/default-avatar.png');
          }
        } else {
          authStore.setAvatarUrl('/user_static/images/default-avatar.png');
        }
      } catch (error) {
        console.error('獲取頭像時發生錯誤:', error);
        authStore.setAvatarUrl('/user_static/images/default-avatar.png');
      }
    };

    // 頭像加載錯誤處理
    const handleAvatarError = () => {
      fetchAvatar();
    };

    // 切換子選單
    const toggleSubMenu = (section) => {
      showSubMenus.value[section] = !showSubMenus.value[section];
    };

    // 更新側邊欄狀態
    const updateSidebarState = () => {
      const path = route.path;
      
      if (path.includes('/profile/management/activity') || path.includes('/profile/management/vendor')) {
        activeSection.value = 'activities';
        if (path.includes('/profile/management/activity')) {
          activeSubItem.value = 'activity';
        } else if (path.includes('/profile/management/vendor')) {
          activeSubItem.value = 'vendor';
        }
      } else if (path.includes('/profile/coupons')) {
        activeSection.value = 'shop';
        activeSubItem.value = 'coupons';
      } else if (path.includes('/profile/address')) {
        activeSection.value = 'shop';
        activeSubItem.value = 'address';
      } else if (path.includes('/profile/orders')) {
        activeSection.value = 'orders';
      } else if (path.includes('/profile/refunds')) {
        activeSection.value = 'refunds';
      } else if (path.includes('/profile')) {
        activeSection.value = 'account';
        
        // 更新子選單狀態
        if (path === '/profile') {
          activeSubItem.value = 'profile';
        } else if (path === '/profile/address') {
          activeSubItem.value = 'address';
        } else if (path === '/profile/password') {
          activeSubItem.value = 'password';
        }
      }
    };

    // 監聽路由變化
    watch(() => route.path, () => {
      updateSidebarState();
    }, { immediate: true });

    // 監聽用戶資訊變化
    watch(() => authStore.user, () => {
      // 當用戶資訊更新時，重新獲取頭像
      if (authStore.user && !authStore.user.provider) {
        fetchAvatar();
      }
    }, { deep: true });

    onMounted(() => {
      fetchAvatar();
      updateSidebarState();
    });

    return {
      userName,
      userAvatar,
      showSubMenus,
      activeSection,
      activeSubItem,
      toggleSubMenu,
      handleAvatarError
    };
  }
};
</script>

<style scoped>
.sidebar-menu {
  width: 280px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.sidebar-menu .user-info {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.sidebar-menu .user-info .username {
  margin: 0.5rem 0;
  font-weight: 600;
}

.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.main-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.main-item a {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
}

.main-item:hover {
  background-color: #f0f0f0;
}

.main-item.active {
  background-color: #ff6b6b;
  color: white;
}

.main-item.active a {
  color: white;
}

.arrow {
  transition: transform 0.3s;
}

.arrow.rotate {
  transform: rotate(180deg);
}

.sub-items {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s;
  margin-left: 15px;
}

.sub-items.show {
  max-height: 200px;
}

.sub-item {
  padding: 8px 15px;
  margin-bottom: 3px;
  border-radius: 4px;
}

.sub-item a {
  text-decoration: none;
  color: #666;
  display: block;
  transition: color 0.3s;
}

.sub-item a:hover {
  color: #ff6b6b;
}

.sub-item a.active {
  color: #ff6b6b;
  font-weight: 500;
}

@media (max-width: 992px) {
  .sidebar-menu {
    width: 100%;
    margin-bottom: 1.5rem;
  }
}
</style> 