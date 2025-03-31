<template>
    <div v-if="vendorStatus" :class="['sidebar', { 'collapsed': isCollapsed }]">
        <button class="toggle-btn" @click="toggleSidebar">
            {{ isCollapsed ? '☰' : '✖' }}
        </button>
        <nav v-if="!isCollapsed" class="sidebar-nav">
            <ul class="metismenu" id="menu">
                <!-- 店家菜单 -->
                <li>
                    <a class="has-arrow" href="javascript:void(0)" @click="toggleMenu('store')"
                        :aria-expanded="storeMenuOpen.toString()">
                        <i class="icon icon-single-04"></i><span class="nav-text">店家</span>
                    </a>
                    <ul v-if="storeMenuOpen" aria-expanded="false">
                        <li class="nav-item">
                            <RouterLink to="/vendor/admin/profile" class="nav-link active" aria-current="page">個人資訊
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/vendor/admin/certification" class="nav-link active" aria-current="page">
                                認證申請及記錄
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/vendor/admin/calender" class="nav-link active" aria-current="page">行事曆
                            </RouterLink>
                        </li>
                    </ul>
                </li>

                <!-- 活动菜单 -->
                <li>
                    <a class="has-arrow" aria-expanded="false" href="javascript:void(0)"
                        @click="toggleMenu('activity')">
                        <i class="icon icon-app-store"></i><span class="nav-text"
                            :aria-expanded="activityMenuOpen.toString()">活動</span>
                    </a>
                    <ul v-if="activityMenuOpen" aria-expanded="false">
                        <li class="nav-item">
                            <RouterLink to="/vendor/admin/activity" class="nav-link active" aria-current="page">活動列表
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/vendor/admin/activity/add" class="nav-link active" aria-current="page">新增活動
                            </RouterLink>
                        </li>
                    </ul>
                </li>

                <!-- 评论菜单 -->
                <li>
                    <a class="has-arrow" href="javascript:void(0)" @click="toggleMenu('reviews')"
                        :aria-expanded="reviewsMenuOpen.toString()">
                        <i class="icon icon-single-04"></i><span class="nav-text">評論</span>
                    </a>
                    <ul v-if="reviewsMenuOpen" aria-expanded="false">
                        <li class="nav-item">
                            <RouterLink to="/vendor/admin/reviews" class="nav-link active" aria-current="page">店家評論
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/vendor/admin/activity/reviews" class="nav-link active" aria-current="page">
                                活動評論</RouterLink>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { ref, defineEmits, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'; // 引入 Vue Router
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const userId = authStore.userId
const isCollapsed = ref(false);
const storeMenuOpen = ref(false);
const reviewsMenuOpen = ref(false);
const activityMenuOpen = ref(false);
const vendorStatus = ref(false); // 預設為 false
const route = useRouter(); // 初始化 router
const emit = defineEmits(['toggle-sidebar']);

const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
    emit('toggle-sidebar', isCollapsed.value);
};

const toggleMenu = (menu) => {
    if (menu === 'store') {
        storeMenuOpen.value = !storeMenuOpen.value;
    } else if (menu === 'reviews') {
        reviewsMenuOpen.value = !reviewsMenuOpen.value;
    } else if (menu === 'activity') {
        activityMenuOpen.value = !activityMenuOpen.value;
    }
};


watch(() => route.path, (newPath, oldPath) => {
    if (newPath !== oldPath) {
        location.reload(); // 路由变化时刷新页面
    }
});

onMounted(async () => {
    try {
        const response = await fetch(`http://localhost:8080/api/vendor_admin/status/${userId}`); // 假設你的 API 端點
        const data = await response.json();
        vendorStatus.value = data.status; // 假設 API 回傳 { status: true }

        if (vendorStatus.value) {

        } else {
            route.push('/vendor/admin/profile'); // 跳转到店家资讯页面
        }

    } catch (error) {
        console.error('獲取店家狀態失敗', error);
    }


});


</script>
<style scoped>
ul {
    list-style-type: none;
    /* 去除默认的点 */
}

.sidebar {
    width: 200px;
    height: 800px;
    max-height: 1000px;
    position: absolute;
    left: 0;
    color: rgb(10, 0, 0);
    transition: width 0.3s ease;
    padding-top: 20px;
    overflow-y: auto;
}

.collapsed {
    width: 60px;
}

html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

.sidebar-nav {
    padding: 10px;
}

.nav-item {
    padding: 15px 0;
}

.nav-link {
    color: rgb(7, 0, 0);
    text-decoration: none;
    display: block;
}

.nav-link:hover {
    background-color: #575757;
}

.toggle-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: rgb(5, 0, 0);
    font-size: 20px;
    cursor: pointer;
}
</style>