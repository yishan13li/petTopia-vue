<template>
  <div class="profile-page">
    <div class="container-fluid py-4">
      <div class="page-container">
        <!-- 使用側邊欄組件 -->
        <ProfileSidebar />

        <!-- 主內容區域 -->
        <div class="profile-container">
          <div class="d-flex align-items-center mb-4">
            <h2 class="mb-0 me-3">我的優惠券</h2>
            <router-link to="/shop" class="btn btn-primary d-flex align-items-center">
              <Icon icon="mdi:shopping" class="me-2"></Icon>前往購物
            </router-link>
          </div>

          <!-- 載入中 -->
          <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">載入中...</span>
            </div>
          </div>

          <!-- 無優惠券 -->
          <div v-else-if="coupons.length === 0" class="text-center py-5">
            <i class="fas fa-ticket-alt fa-3x text-muted mb-3"></i>
            <p class="text-muted">目前沒有優惠券</p>
          </div>

          <!-- 優惠券列表 -->
          <div v-else class="coupon-list">
            <div v-for="coupon in coupons" :key="coupon.id" class="coupon-card" :class="{ 'expired': isExpired(coupon) }">
              <div class="coupon-content">
                <div class="coupon-header">
                  <h3 class="coupon-name">{{ coupon.name }}</h3>
                  <span class="coupon-status" :class="{ 'expired': isExpired(coupon) }">
                    {{ isExpired(coupon) ? '已過期' : '可使用' }}
                  </span>
                </div>
                <div class="coupon-amount">
                  <span class="amount">
                    {{ coupon.discountType ? `${(coupon.discountValue * 100).toFixed(0)}%` : `$${coupon.discountValue.toFixed(0)}` }}
                  </span>
                  <span class="discount-text">{{ coupon.discountType ? '折扣' : '折抵' }}</span>
                </div>
                <div class="coupon-details">
                  <p class="coupon-description">{{ coupon.description }}</p>
                  <div class="coupon-info">
                    <div class="info-item">
                      <i class="fas fa-calendar-alt"></i>
                      <span>有效期至：{{ formatDate(coupon.validEnd) }}</span>
                    </div>
                    <div class="info-item">
                      <i class="fas fa-shopping-cart"></i>
                      <span>最低消費：${{ coupon.minOrderValue.toFixed(0) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                class="use-coupon-btn" 
                :disabled="isExpired(coupon)"
                @click="useCoupon(coupon)"
              >
                使用優惠券
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { fetchCartCouponsForMember } from '@/api/shop/couponApi';
import ProfileSidebar from '@/components/ProfileSidebar.vue';
import { Icon } from '@iconify/vue';

export default {
  components: {
    ProfileSidebar,
    Icon
  },
  setup() {
    const authStore = useAuthStore();
    const coupons = ref([]);
    const isLoading = ref(true);

    // 獲取優惠券列表
    const fetchCoupons = async () => {
      try {
        isLoading.value = true;
        const { availableCoupons, expiredCoupons } = await fetchCartCouponsForMember({ 
          memberId: authStore.userId 
        });
        coupons.value = [...availableCoupons, ...expiredCoupons];
      } catch (error) {
        console.error('獲取優惠券失敗:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // 檢查優惠券是否過期
    const isExpired = (coupon) => {
      const now = new Date();
      const expiryDate = new Date(coupon.validEnd);
      return now > expiryDate || !coupon.status;
    };

    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    };

    // 使用優惠券
    const useCoupon = (coupon) => {
      // TODO: 實現使用優惠券的邏輯
      console.log('使用優惠券:', coupon);
    };

    onMounted(() => {
      fetchCoupons();
    });

    return {
      coupons,
      isLoading,
      isExpired,
      formatDate,
      useCoupon
    };
  }
};
</script>

<style scoped>
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
  flex: 1;
  min-width: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* 優惠券卡片樣式 */
.coupon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.coupon-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  border: 1px solid #e0e0e0;
}

.coupon-card:hover {
  transform: translateY(-5px);
}

.coupon-card.expired {
  opacity: 0.7;
  background: #f8f8f8;
}

.coupon-content {
  padding: 1.5rem;
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.coupon-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.coupon-status {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  background: #e8f5e9;
  color: #2e7d32;
}

.coupon-status.expired {
  background: #ffebee;
  color: #c62828;
}

.coupon-amount {
  display: flex;
  align-items: baseline;
  margin-bottom: 1rem;
}

.amount {
  font-size: 2rem;
  font-weight: 700;
  color: #ff6b6b;
  margin-right: 0.5rem;
}

.discount-text {
  font-size: 1rem;
  color: #666;
}

.coupon-description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.coupon-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.info-item i {
  color: #ff6b6b;
}

.use-coupon-btn {
  width: 100%;
  padding: 0.75rem;
  background: #ff6b6b;
  color: white;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.use-coupon-btn:hover:not(:disabled) {
  background: #ff5252;
}

.use-coupon-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
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
  .coupon-list {
    grid-template-columns: 1fr;
  }
}
</style> 