<template>
  <div class="profile-page">
    <div class="container-fluid py-4">
      <div class="page-container">
        <!-- 使用側邊欄組件 -->
        <ProfileSidebar />

        <!-- 主內容區域 -->
        <div class="profile-container">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">收貨地址管理</h2>
            <button class="btn btn-primary" @click="showAddForm = true">
              <i class="fas fa-plus"></i> 新增地址
            </button>
          </div>
          
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

          <!-- 地址列表 -->
          <div v-if="!showAddForm && !showEditForm" class="address-list">
            <div v-if="isLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="addresses.length === 0" class="text-center py-4">
              <p class="text-muted">尚未新增任何地址</p>
            </div>
            <div v-else class="row g-4">
              <div v-for="addr in addresses" :key="addr.id" class="col-md-6">
                <div class="card h-100">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <h5 class="card-title">{{ addr.name }}</h5>
                      <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" @click="editAddress(addr)">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click="deleteAddress(addr.id)">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p class="card-text">
                      <i class="fas fa-phone me-2"></i>{{ addr.phone }}<br>
                      <i class="fas fa-map-marker-alt me-2"></i>
                      {{ addr.city }}{{ addr.district }}{{ addr.street }}
                    </p>
                    <div v-if="addr.isDefault" class="badge bg-primary">預設地址</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 新增/編輯地址表單 -->
          <div v-if="showAddForm || showEditForm" class="address-form">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3 class="mb-0">{{ showEditForm ? '編輯地址' : '新增地址' }}</h3>
              <button class="btn btn-outline-secondary" @click="cancelEdit">
                <i class="fas fa-times"></i> 取消
              </button>
            </div>

            <form 
              @submit.prevent="updateAddress" 
              id="addressForm" 
              :class="{ 'fade-in': !isLoading }"
              :style="{ visibility: isLoading ? 'hidden' : 'visible' }"
            >
              <!-- 收貨人資料 -->
              <div class="form-group mb-3">
                <label class="form-label">收貨人姓名 <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="address.name" 
                  placeholder="請輸入收貨人姓名"
                  required
                >
              </div>

              <div class="form-group mb-3">
                <label class="form-label">收貨人電話 <span class="text-danger">*</span></label>
                <input 
                  type="tel" 
                  class="form-control" 
                  v-model="address.phone"
                  @input="validatePhone"
                  :class="{'is-invalid': phoneError, 'is-valid': address.phone && !phoneError}"
                  placeholder="請輸入手機號碼"
                  required
                >
                <small v-if="!phoneError" class="form-text text-muted">請輸入09開頭的10位手機號碼</small>
                <div v-else class="invalid-feedback">{{ phoneError }}</div>
              </div>

              <!-- 地址資料 -->
              <div class="form-group mb-3">
                <label class="form-label">縣市 <span class="text-danger">*</span></label>
                <select 
                  class="form-control" 
                  v-model="address.city"
                  required
                >
                  <option value="">請選擇縣市</option>
                  <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                </select>
              </div>

              <div class="form-group mb-3">
                <label class="form-label">鄉鎮市區 <span class="text-danger">*</span></label>
                <select 
                  class="form-control" 
                  v-model="address.district"
                  required
                >
                  <option value="">請選擇鄉鎮市區</option>
                  <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
                </select>
              </div>

              <div class="form-group mb-3">
                <label class="form-label">詳細地址 <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="address.street" 
                  placeholder="請輸入詳細地址"
                  required
                >
              </div>

              <div class="form-group mb-3">
                <div class="form-check">
                  <input 
                    type="checkbox" 
                    class="form-check-input" 
                    id="defaultAddress" 
                    v-model="address.isDefault"
                  >
                  <label class="form-check-label" for="defaultAddress">設為預設地址</label>
                </div>
              </div>

              <div class="text-muted mb-3">
                <small>* 標示為必填欄位</small>
              </div>

              <div class="d-grid gap-2 mt-4">
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                  {{ isLoading ? '更新中...' : (showEditForm ? '更新地址' : '新增地址') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ProfileSidebar from '@/components/ProfileSidebar.vue';

export default {
  components: {
    ProfileSidebar
  },
  setup() {
    const authStore = useAuthStore();
    
    const success = ref(null);
    const error = ref(null);
    const isLoading = ref(false);
    const phoneError = ref(null);
    const showAddForm = ref(false);
    const showEditForm = ref(false);
    const addresses = ref([]);
    const editingId = ref(null);
    
    const address = reactive({
      name: '',
      phone: '',
      city: '',
      district: '',
      street: '',
      isDefault: false
    });

    // 縣市列表
    const cities = ref([
      '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '基隆市', '新竹市', '嘉義市',
      '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
      '台東縣', '澎湖縣', '金門縣', '連江縣'
    ]);

    // 鄉鎮市區對應表
    const districtsMap = {
      '台北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
      '新北市': ['板橋區', '新莊區', '中和區', '永和區', '土城區', '樹林區', '三峽區', '鶯歌區', '三重區', '蘆洲區', '五股區', '泰山區', '林口區', '八里區', '淡水區', '三芝區', '石門區', '金山區', '萬里區', '汐止區', '瑞芳區', '貢寮區', '平溪區', '雙溪區', '新店區', '深坑區', '石碇區', '坪林區', '烏來區'],
      '桃園市': ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大園區', '龜山區', '大溪區', '復興區', '觀音區', '新屋區', '龍潭區'],
      '台中市': ['中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區', '后里區', '石岡區', '東勢區', '和平區', '新社區', '潭子區', '大雅區', '神岡區', '大肚區', '沙鹿區', '龍井區', '梧棲區', '清水區', '大甲區', '外埔區', '大安區'],
      '台南市': ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'],
      '高雄市': ['新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '三民區', '楠梓區', '小港區', '左營區', '仁武區', '大社區', '岡山區', '路竹區', '阿蓮區', '田寮區', '燕巢區', '橋頭區', '梓官區', '彌陀區', '永安區', '湖內區', '鳳山區', '大寮區', '林園區', '鳥松區', '大樹區', '旗山區', '美濃區', '六龜區', '內門區', '杉林區', '甲仙區', '桃源區', '那瑪夏區', '茂林區', '茄萣區'],
      '基隆市': ['仁愛區', '信義區', '中正區', '中山區', '安樂區', '暖暖區', '七堵區'],
      '新竹市': ['東區', '北區', '香山區'],
      '嘉義市': ['東區', '西區'],
      '新竹縣': ['竹北市', '竹東鎮', '新埔鎮', '關西鎮', '湖口鄉', '新豐鄉', '峨眉鄉', '寶山鄉', '北埔鄉', '芎林鄉', '橫山鄉', '尖石鄉', '五峰鄉'],
      '苗栗縣': ['苗栗市', '頭份市', '竹南鎮', '後龍鎮', '通霄鎮', '苑裡鎮', '造橋鄉', '頭屋鄉', '公館鄉', '大湖鄉', '泰安鄉', '銅鑼鄉', '三義鄉', '西湖鄉', '卓蘭鎮', '獅潭鄉', '三灣鄉', '南庄鄉'],
      '彰化縣': ['彰化市', '員林市', '和美鎮', '鹿港鎮', '溪湖鎮', '二林鎮', '田中鎮', '北斗鎮', '花壇鄉', '芬園鄉', '大村鄉', '永靖鄉', '伸港鄉', '線西鄉', '福興鄉', '秀水鄉', '花壇鄉', '芬園鄉', '大村鄉', '埔鹽鄉', '埔心鄉', '永靖鄉', '社頭鄉', '二水鄉', '田尾鄉', '埤頭鄉', '芳苑鄉', '大城鄉', '竹塘鄉', '溪州鄉'],
      '南投縣': ['南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '名間鄉', '鹿谷鄉', '中寮鄉', '魚池鄉', '國姓鄉', '水里鄉', '信義鄉', '仁愛鄉'],
      '雲林縣': ['斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '土庫鎮', '北港鎮', '古坑鄉', '大埤鄉', '莿桐鄉', '林內鄉', '二崙鄉', '崙背鄉', '麥寮鄉', '東勢鄉', '褒忠鄉', '台西鄉', '元長鄉', '四湖鄉', '口湖鄉', '水林鄉'],
      '嘉義縣': ['太保市', '朴子市', '布袋鎮', '大林鎮', '民雄鄉', '溪口鄉', '新港鄉', '六腳鄉', '東石鄉', '義竹鄉', '鹿草鄉', '水上鄉', '中埔鄉', '竹崎鄉', '梅山鄉', '番路鄉', '大埔鄉', '阿里山鄉'],
      '屏東縣': ['屏東市', '潮州鎮', '東港鎮', '恆春鎮', '萬丹鄉', '長治鄉', '麟洛鄉', '九如鄉', '里港鄉', '鹽埔鄉', '高樹鄉', '萬巒鄉', '內埔鄉', '竹田鄉', '新埤鄉', '枋寮鄉', '新園鄉', '崁頂鄉', '林邊鄉', '南州鄉', '佳冬鄉', '琉球鄉', '車城鄉', '滿州鄉', '枋山鄉', '三地門鄉', '霧台鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉', '獅子鄉', '牡丹鄉'],
      '宜蘭縣': ['宜蘭市', '羅東鎮', '蘇澳鎮', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '冬山鄉', '五結鄉', '三星鄉', '大同鄉', '南澳鄉'],
      '花蓮縣': ['花蓮市', '鳳林鎮', '玉里鎮', '新城鄉', '吉安鄉', '壽豐鄉', '光復鄉', '豐濱鄉', '瑞穗鄉', '富里鄉', '秀林鄉', '萬榮鄉', '卓溪鄉'],
      '台東縣': ['台東市', '成功鎮', '關山鎮', '卑南鄉', '鹿野鄉', '池上鄉', '東河鄉', '長濱鄉', '太麻里鄉', '大武鄉', '綠島鄉', '海端鄉', '延平鄉', '金峰鄉', '達仁鄉', '蘭嶼鄉'],
      '澎湖縣': ['馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉'],
      '金門縣': ['金城鎮', '金湖鎮', '金沙鎮', '金寧鄉', '烈嶼鄉', '烏坵鄉'],
      '連江縣': ['南竿鄉', '北竿鄉', '莒光鄉', '東引鄉']
    };

    // 根據選擇的縣市動態獲取鄉鎮市區列表
    const districts = computed(() => {
      return address.city ? districtsMap[address.city] || [] : [];
    });

    // 當縣市改變時，重置鄉鎮市區的選擇
    watch(() => address.city, () => {
      address.district = '';
    });
    
    // 電話號碼格式驗證
    const validatePhone = () => {
      if (!address.phone) {
        phoneError.value = '請輸入手機號碼';
        return;
      }
      
      // 只允許數字輸入
      if (!/^\d*$/.test(address.phone)) {
        address.phone = address.phone.replace(/\D/g, '');
      }
      
      // 長度驗證
      if (address.phone.length > 0 && address.phone.length < 10) {
        phoneError.value = '手機號碼長度不足';
      } else if (address.phone.length > 10) {
        address.phone = address.phone.substring(0, 10);
      } else if (address.phone.length === 10 && !address.phone.startsWith('09')) {
        phoneError.value = '手機號碼必須以09開頭';
      } else {
        phoneError.value = null;
      }
    };

    // 重置表單
    const resetForm = () => {
      Object.assign(address, {
        name: '',
        phone: '',
        city: '',
        district: '',
        street: '',
        isDefault: false
      });
      editingId.value = null;
      showAddForm.value = false;
      showEditForm.value = false;
    };

    // 取消編輯
    const cancelEdit = () => {
      resetForm();
    };

    // 編輯地址
    const editAddress = (addr) => {
      Object.assign(address, addr);
      editingId.value = addr.id;
      showEditForm.value = true;
    };

    // 刪除地址
    const deleteAddress = async (id) => {
      if (!confirm('確定要刪除此地址嗎？')) return;
      
      try {
        isLoading.value = true;
        // TODO: 發送刪除請求到後端
        // const response = await fetch(`/api/member/address/${id}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${authStore.token}`
        //   }
        // });
        
        // if (!response.ok) {
        //   throw new Error('刪除失敗');
        // }
        
        // 從列表中移除
        addresses.value = addresses.value.filter(addr => addr.id !== id);
        success.value = '地址刪除成功';
      } catch (err) {
        console.error('刪除地址時發生錯誤:', err);
        error.value = '刪除失敗，請稍後再試';
      } finally {
        isLoading.value = false;
      }
    };

    // 更新地址
    const updateAddress = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        success.value = null;
        
        // 驗證手機號碼
        validatePhone();
        if (phoneError.value) {
          error.value = phoneError.value;
          return;
        }
        
        // TODO: 發送更新請求到後端
        // const url = editingId.value 
        //   ? `/api/member/address/${editingId.value}`
        //   : '/api/member/address';
        // const method = editingId.value ? 'PUT' : 'POST';
        
        // const response = await fetch(url, {
        //   method,
        //   headers: {
        //     'Authorization': `Bearer ${authStore.token}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(address)
        // });
        
        // if (!response.ok) {
        //   const data = await response.json();
        //   error.value = data.error || '更新失敗，請稍後再試';
        //   return;
        // }
        
        // const data = await response.json();
        
        // 更新列表
        if (editingId.value) {
          const index = addresses.value.findIndex(addr => addr.id === editingId.value);
          if (index !== -1) {
            addresses.value[index] = { ...address, id: editingId.value };
          }
        } else {
          // 模擬新增
          addresses.value.push({
            ...address,
            id: Date.now() // 臨時ID
          });
        }
        
        success.value = editingId.value ? '地址更新成功' : '地址新增成功';
        resetForm();
        
      } catch (err) {
        console.error('更新地址時發生錯誤:', err);
        error.value = '系統錯誤，請稍後再試';
      } finally {
        isLoading.value = false;
      }
    };
    
    // 獲取地址列表
    const fetchAddresses = async () => {
      try {
        isLoading.value = true;
        // TODO: 從後端獲取地址列表
        // const response = await fetch('/api/member/addresses', {
        //   headers: {
        //     'Authorization': `Bearer ${authStore.token}`
        //   }
        // });
        
        // if (response.ok) {
        //   const data = await response.json();
        //   addresses.value = data;
        // }
        
        // 模擬數據
        addresses.value = [
          {
            id: 1,
            name: '王小明',
            phone: '0912345678',
            city: '台北市',
            district: '大安區',
            street: '忠孝東路四段123號',
            isDefault: true
          }
        ];
      } catch (error) {
        console.error('獲取地址列表失敗:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    onMounted(() => {
      fetchAddresses();
    });

    return {
      address,
      success,
      error,
      isLoading,
      phoneError,
      cities,
      districts,
      addresses,
      showAddForm,
      showEditForm,
      validatePhone,
      updateAddress,
      editAddress,
      deleteAddress,
      cancelEdit
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
  min-width: 0;
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

/* 地址列表樣式 */
.address-list {
  margin-top: 1rem;
}

.card {
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-text {
  color: #666;
  margin-bottom: 0.5rem;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.8em;
}

/* 表單樣式 */
.address-form {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style> 