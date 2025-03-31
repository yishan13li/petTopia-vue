<template>

    <div class="container">
        <h2>活動評論管理</h2>

        <!-- 活動列表與評論區域 -->
        <div class="content-container">
            <!-- 活動列表 -->
            <div class="activities-table-container" :style="{ flex: activeReview ? 0.5 : 1 }">

                <table id="reviewsTable" class="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>活動名稱</th>
                            <th>活動描述</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(activity, index) in activities" :key="activity.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ activity.name }}</td>
                            <td>{{ activity.description }}</td>
                            <td>
                                <button class="btn btn-primary" @click="toggleReviews(activity.id)">
                                    {{ activeReviews[activity.id] ? '隱藏評論' : '查看評論' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 傳遞 activity 資料到子組件 -->
            <activityreviews v-if="activeReview" :activity="currentActivity" :reviews="reviews"
                @toggle-reviews="toggleReviews" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import activityreviews from './activityreviews.vue'; // 引入子組件
import VendorAdminSidebar from '@/components/VendorAdminSidebar.vue';
import DataTable from 'datatables.net-dt'
import 'datatables.net-dt/css/dataTables.dataTables.css'
const activities = ref([]);
const reviews = ref({});
const activeReviews = ref({});
const activeReview = ref(null); // 用於追蹤當前顯示評論的活動ID
const currentActivity = ref(null);
const currentActivityId = ref(null); // 當前打開評論的活動ID
let dataTable = null
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const userId = authStore.userId

// 初始化 DataTables
const initializeDataTable = () => {
    nextTick(() => {
        if (dataTable) {
            dataTable.destroy()  // 销毁旧实例
        }
        dataTable = new DataTable('#reviewsTable', {
            pageLength: 5, // 每頁顯示 5 筆資料
            lengthMenu: [5, 10],
            searching: true, // 啟用搜尋
            ordering: true,  // 啟用排序
            responsive: true,
            language: {
                search: "搜尋：",
                info: "顯示第 _START_ 筆到第 _END_ 筆，共 _TOTAL_ 筆",
                processing: '處理中...',
                lengthMenu: '顯示 _MENU_ 筆資料',
                zeroRecords: '沒有找到相關資料',
                infoEmpty: '目前沒有資料',
                infoFiltered: '(從 _MAX_ 筆資料過濾)',
                paginate: { first: '第一頁', last: '最後一頁', next: '下一頁', previous: '上一頁' },
                emptyTable: '目前表格內沒有資料',
                loadingRecords: '載入中...',
            }
        })
    })
}

const loadActivities = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/vendor_admin/activity/${userId}`, { headers: { 'Accept': 'application/json' } });
        activities.value = response.data;
        initializeDataTable()
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
};

const loadReviews = async (activityId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/vendor_admin/activityreviews?vendorActivityId=${activityId}`, { headers: { 'Accept': 'application/json' } });
        reviews.value[activityId] = response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};

const toggleReviews = (activityId) => {
    if (activeReview.value === activityId) {
        // 如果點擊的是當前顯示評論的活動，則隱藏評論
        activeReviews.value[activityId] = false;
        activeReview.value = null; // 隱藏評論
    } else {
        // 先隱藏之前顯示的評論並且將按鈕文字變回「查看評論」
        if (activeReview.value !== null) {
            activeReviews.value[activeReview.value] = false; // 隱藏之前顯示的評論
        }

        // 顯示當前選擇的活動評論並且將按鈕文字變為「隱藏評論」
        activeReviews.value[activityId] = true;
        activeReview.value = activityId; // 更新為當前活動ID
        currentActivity.value = activities.value.find(activity => activity.id === activityId);

        // 如果該活動的評論尚未加載，則加載評論
        if (!reviews.value[activityId]) {
            loadReviews(activityId);
        }
    }
};

onMounted(async () => {
    await loadActivities();
    initializeDataTable()
});
</script>

<style scoped>
.container {
    width: 70%;
    transition: margin-left 0.3s ease;
    margin-left: 250px;
    /* 預設 sidebar 展開時 */
    padding: 20px;
}

.content-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: space-between;
}

th {
    background-color: #F4D8B1 !important;
}

.activities-table-container {
    flex: 1.5;
    min-width: 600px;
    /* 確保表格不會縮得太小 */
    transition: flex 0.3s ease;
}

.activities-table-container table {
    width: 100%;
}
</style>
