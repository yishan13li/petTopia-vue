<template>
    <div class="container mt-5">
        <h2>活動評論管理</h2>

        <!-- 活動列表與評論區域 -->
        <div class="content-container">
            <!-- 活動列表 -->
            <div class="activities-table-container" :style="{ flex: activeReview ? 0.5 : 1 }">

                <table class="table table-bordered">
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import activityreviews from './activityreviews.vue'; // 引入子組件

const vendorId = 1; // 假設固定店家ID
const activities = ref([]);
const reviews = ref({});
const activeReviews = ref({});
const activeReview = ref(null); // 用於追蹤當前顯示評論的活動ID
const currentActivity = ref(null);
const currentActivityId = ref(null); // 當前打開評論的活動ID

const loadActivities = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/vendor_admin/activity/${vendorId}`, { headers: { 'Accept': 'application/json' } });
        activities.value = response.data;
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
};

// const loadReviews = async (activityId) => {
//     try {
//         const response = await axios.get(`http://localhost:8080/api/vendor_admin/activityreviews?vendorActivityId=${activityId}`, { headers: { 'Accept': 'application/json' } });
//         reviews.value[activityId] = response.data;
//     } catch (error) {
//         console.error('Error fetching reviews:', error);
//     }
// };

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

onMounted(() => {
    loadActivities();
});
</script>

<style scoped>
.content-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: space-between;
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
