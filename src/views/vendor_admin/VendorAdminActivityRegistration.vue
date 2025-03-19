<template>
    <div class="container">
        <div class="charts"
            style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;">
            <!-- 評分圖表 -->
            <div class="chart-container" style="width: 400px; height: 400px;">
                <canvas id="genderChart" style="width: 100%; height: 100%;"></canvas>
            </div>
            <!-- 年齡圖表 -->
            <div class="chart-container" style="width: 400px; height: 400px;">
                <canvas id="ageChart" style="width: 100%; height: 100%;"></canvas>
            </div>
            <!-- 報名人數趨勢圖 -->
            <div class="chart-container" style="width: 400px; height: 400px;">
                <canvas id="registrationTrendChart" style="width: 100%; height: 100%;"></canvas>
            </div>

        </div>



        <div class="d-flex align-items-center gap-2">
            <select v-model="registerFilter" class="form-select w-auto">
                <option value="all">顯示全部</option>
                <option value="pending">顯示待審核</option>
                <option value="confirmed">顯示已確認</option>
                <option value="canceled">顯示已拒絕</option>
            </select>

            <button class="btn btn-primary allcheck"
                @click="openNotificationCardBatch(filteredPendingRegisters, 'confirm')">
                全部確認
            </button>

            <button class="btn btn-danger allcheck"
                @click="openNotificationCardBatch(filteredPendingRegisters, 'cancel')">
                全部拒絕
            </button>
        </div>

        <!-- 表格部分 -->
        <div class="table-container">
            <h3>報名會員 (報名人數: {{ totalRegistrations }} )</h3>
            <table id="reviewsTable" class="table table-bordered table-hover shadow-sm rounded">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>會員ID</th>
                        <th>會員姓名</th>
                        <th>性別</th>
                        <th>年齡</th>
                        <th>電話</th>
                        <th>mail</th>
                        <th>報名時間</th>
                        <th>報名狀態</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody v-if="filteredRegisters.length > 0">
                    <tr v-for="(register, index) in filteredRegisters" :key="register.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ register.member.id }}</td>
                        <td>{{ register.member.name }}</td>
                        <td>{{ register.member.gender == false ? '男性' : '女性' }}</td>
                        <td>{{ calculateAge(register.member.birthdate) }}</td>
                        <td>{{ register.member.phone }}</td>
                        <td>{{ register.member.user.email }}</td>
                        <td>{{ formatDate(register.registrationTime) }}</td>
                        <td>{{ getStatusLabel(register.status) }}</td>
                        <td>
                            <button class="btn btn-primary" v-if="register.status === 'pending'"
                                @click="openNotificationCard(register, 'confirm')">已確認</button>
                            <button class="btn btn-primary" v-if="register.status === 'pending'"
                                @click="openNotificationCard(register, 'cancel')">已拒絕</button>

                            <button class="btn btn-primary" v-if="register.status === 'confirmed'"
                                @click="deleteRegistration(register.id)">刪除</button>

                            <!-- 只有在取消状态下显示删除按钮 -->
                            <button class="btn btn-danger" v-if="register.status === 'canceled'"
                                @click="deleteRegistration(register.id)">刪除</button>



                        </td>
                    </tr>
                </tbody>

            </table>
            <!-- Bootstrap Modal -->
            <!-- <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmModalLabel">操作确认</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {{ modalMessage }}
                        </div>
                        <div class="modal-footer">
                            
                            <button type="button" class="btn btn-primary" @click="confirmAction">确定</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">拒絕</button>
                        </div>
                    </div>
                </div>
            </div> -->
            <!-- 通知 Card -->
            <div v-if="sendNotificationVisible" class="notification-card">
                <h4>報名通知</h4>
                <form @submit.prevent="selectedRegisters.length > 0 ? handleBatchSubmit() : handleSubmit()">
                    <div class="mb-3">
                        <label class="form-label">標題</label>
                        <input type="text" class="form-control" v-model="notificationTitle" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">內容</label>
                        <textarea class="form-control" v-model="notificationContent" required></textarea>
                    </div>
                    <button class="btn btn-primary" type="submit">發送</button> <!-- 修改为 type="submit" -->
                </form>
            </div>



        </div>
    </div>
</template>

<script setup>
import { defineComponent, onMounted, ref, nextTick, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { Modal } from 'bootstrap';
const route = useRoute();  // 取得當前路由資訊
import { Chart as ChartJS, LinearScale, BarController, BarElement, CategoryScale, Title, Tooltip, Legend, PieController, LineController } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import DataTable from 'datatables.net-dt'
import 'datatables.net-dt/css/dataTables.dataTables.css'
// 注册比例尺和其他必要的模块
ChartJS.register(LinearScale, BarController, BarElement, CategoryScale, PieController, LineController, Title, Tooltip, Legend);
const registers = ref([])
const registerFilter = ref('all')
let dataTable = null
let genderChart = null
let ageChart = null
let registrationTrendChart = null
const totalRegistrations = ref(0);
const sendNotificationVisible = ref(false)
const notificationTitle = ref('');
const notificationContent = ref('');
const selectedRegister = ref(null);
const selectedRegisters = ref([]); // 儲存所有待審核的報名資料
const operationType = ref(''); // 用于标识是"确认"操作还是"取消"操作
// 初始化 DataTables
const initializeDataTable = () => {
    nextTick(() => {
        if (dataTable) {
            dataTable.destroy()  // 销毁旧实例
        }
        dataTable = new DataTable('#reviewsTable', {
            pageLength: 5, // 每頁顯示 5 筆資料
            lengthMenu: [5, 10, 20, 50],
            searching: true, // 啟用搜尋
            ordering: true,  // 啟用排序
            responsive: true,
            language: {
                search: "搜尋：",
                lengthMenu: "顯示 _MENU_ 筆資料",
                info: "顯示第 _START_ 筆到第 _END_ 筆，共 _TOTAL_ 筆",
                zeroRecords: "沒有找到相關資料",
                processing: "處理中...",
                infoEmpty: "目前沒有資料",
                infoFiltered: "(從 _MAX_ 筆資料過濾)",
                paginate: { first: "第一頁", last: "最後一頁", next: "下一頁", previous: "上一頁" },
                emptyTable: "目前表格內沒有資料",
                loadingRecords: "載入中...",
                paginate: {
                    first: "首頁",
                    previous: "上一頁",
                    next: "下一頁",
                    last: "最後一頁"
                }
            }
        })
    })
}

// 📅 日期格式化函數
const formatDate = (dateString) => {
    let date = new Date(dateString);
    return date.toLocaleDateString("zh-TW") + " " + date.toLocaleTimeString("zh-TW", { hour: '2-digit', minute: '2-digit' });
};

// 🎯 過濾報名
const filteredRegisters = computed(() => {
    console.log("過濾後的報名:", registers.value);
    return (registers.value || []).filter(register => {
        if (registerFilter.value === "pending") {
            return register.status === "pending";
        } else if (registerFilter.value === "confirmed") {
            return register.status === "confirmed";
        } else if (registerFilter.value === "canceled") {
            return register.status === "canceled";
        }
        return true; // "all" 顯示全部
    });
});

const fetchRegistration = async () => {
    const activityId = route.params.id;
    axios.get(`http://localhost:8080/api/vendor_admin/activity/registration?activityId=${activityId}`, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            console.log('獲取的活動報名:', response.data);  // 應該是評論數組
            registers.value = response.data;
            console.log(registers.value);
            totalRegistrations.value = registers.value.length;
            nextTick(() => {
                updateGenderChart()
                updateAgeChart()
                updateRegistrationTrendChart();
                initializeDataTable();  // 重新初始化 DataTable
            });
            // 确保数据加载完成后再计算和更新图表
            // calculateOverallRating();  // 更新总评分
            // updateChart();             // 更新图表
            // updateReviews();
        })
        .catch(error => {
            console.error('獲取評論資料失敗:', error);
        });
}

const updateGenderChart = () => {
    const canvas = document.getElementById('genderChart');
    if (!canvas) {
        console.warn('找不到 genderChart canvas，等待 DOM 加载...');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (genderChart) genderChart.destroy();

    // 假设你的性别数据是布尔值 (true表示男性，false表示女性)
    // 可以根据你获取的 registers 数据计算男性和女性的比例
    let maleCount = 0;
    let femaleCount = 0;

    registers.value.forEach(register => {
        if (register.member.gender === false) { // 如果性别为男性
            maleCount++;
        } else if (register.member.gender === true) { // 如果性别为女性
            femaleCount++;
        }
    });

    const total = maleCount + femaleCount; // 总人数

    // 创建元饼图数据
    const genderData = {
        labels: ['男性', '女性'],
        datasets: [{
            data: [maleCount, femaleCount],
            backgroundColor: ['#36A2EB', '#FF6384'],  // 分别为男性和女性设置不同的颜色
            hoverBackgroundColor: ['#2c97f0', '#f45678'],
        }]
    };

    // 创建图表
    genderChart = new ChartJS(ctx, {
        type: 'pie', // 设置为饼图类型
        data: genderData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "性別分布圖",
                    font: {
                        size: 25  // 設定標題字體大小
                    }
                },
                legend: {
                    display: true,
                    position: 'top', // 设置图例位置
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}人`; // 格式化 tooltip
                        }
                    }
                },
                datalabels: {  // 这里是关键
                    color: '#fff', // 文字颜色
                    font: { size: 14, weight: 'bold' }, // 文字大小
                    formatter: (value, context) => {
                        const percentage = ((value / total) * 100).toFixed(1); // 计算百分比
                        return `${value}人 (${percentage}%)`; // 显示人数和百分比
                    }
                }
            }
        },
        plugins: [ChartDataLabels] // 添加插件以显示数据标签
    });
};

// 更新年齡分布圖表
const updateAgeChart = () => {
    const canvas = document.getElementById('ageChart');
    const ctx = canvas.getContext('2d');
    if (ageChart) ageChart.destroy();

    const ageRanges = {
        "18歲以下": 0,
        "18-24歲": 0,
        "25-34歲": 0,
        "35-44歲": 0,
        "45-54歲": 0,
        "55歲以上": 0
    };

    registers.value.forEach(register => {
        const age = calculateAge(register.member.birthdate);
        if (age < 18) ageRanges["18歲以下"]++;
        else if (age >= 18 && age <= 24) ageRanges["18-24歲"]++;
        else if (age >= 25 && age <= 34) ageRanges["25-34歲"]++;
        else if (age >= 35 && age <= 44) ageRanges["35-44歲"]++;
        else if (age >= 45 && age <= 54) ageRanges["45-54歲"]++;
        else if (age >= 55) ageRanges["55歲以上"]++;
    });

    const total = Object.values(ageRanges).reduce((sum, value) => sum + value, 0);

    const ageData = {
        labels: Object.keys(ageRanges),
        datasets: [{
            data: Object.values(ageRanges),
            backgroundColor: ['#B784A7', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#805c7d', '#f78b3f', '#ffd13d', '#36bcb8', '#298fbc', '#f23e72'],
        }]
    };

    ageChart = new ChartJS(ctx, {
        type: 'pie',
        data: ageData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "年齡分布圖",
                    font: {
                        size: 25  // 設定標題字體大小
                    }
                },
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}人`,
                    }
                },
                datalabels: {
                    color: '#fff',
                    font: { size: 14, weight: 'bold' },
                    formatter: (value, context) => {
                        const percentage = ((value / total) * 100).toFixed(1);
                        return value > 0 ? `${value}人 (${percentage}%)` : '';
                    }
                }
            }
        },
        plugins: [ChartDataLabels] // <-- 这里要添加插件
    });
};

const updateRegistrationTrendChart = () => {
    const canvas = document.getElementById('registrationTrendChart');
    const ctx = canvas.getContext('2d');
    if (registrationTrendChart) registrationTrendChart.destroy();

    // 整理報名時間數據
    const registrationCounts = [];
    const registrationDates = [];

    // 假設每個 register 都有 registrationTime 字段
    registers.value.forEach(register => {
        const registrationDate = new Date(register.registrationTime);
        const formattedDate = registrationDate.toLocaleDateString(); // 格式化為日期（去除時分秒）

        // 判斷是否已經存在這一天的報名數據
        const existingIndex = registrationDates.indexOf(formattedDate);
        if (existingIndex === -1) {
            registrationDates.push(formattedDate);
            registrationCounts.push(1);
        } else {
            registrationCounts[existingIndex] += 1;
        }
    });

    // 排序日期
    const sortedDatesAndCounts = registrationDates
        .map((date, index) => ({ date, count: registrationCounts[index] }))  // 將日期與數量配對
        .sort((a, b) => new Date(a.date) - new Date(b.date));  // 按日期排序

    // 提取排序後的日期和數量
    const sortedRegistrationDates = sortedDatesAndCounts.map(item => item.date);
    const sortedRegistrationCounts = sortedDatesAndCounts.map(item => item.count);

    // 圖表數據
    const trendData = {
        labels: sortedRegistrationDates,
        datasets: [{
            label: '報名人數',
            data: sortedRegistrationCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    // 創建報名人數趨勢圖
    registrationTrendChart = new ChartJS(ctx, {
        type: 'line', // 使用折線圖
        data: trendData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '報名人數趨勢',
                    font: {
                        size: 25  // 設定標題字體大小
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `報名人數: ${tooltipItem.raw}`; // 格式化 tooltip
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '報名日期'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '人數'
                    },
                    beginAtZero: true,  // 保證從 0 開始顯示
                    ticks: {
                        stepSize: 5,  // 設置每隔 5 顯示一個刻度
                        callback: function (value) {
                            return value;  // 顯示刻度的數字
                        }
                    }
                }
            }
        }
    });
};

// 計算年齡的函數
const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;  // 如果還沒過生日，減一歲
    }
    return age;
}

// 开启通知卡片，并设置操作类型
const openNotificationCard = (register, type) => {
    selectedRegister.value = register;
    operationType.value = type; // 设置操作类型，'confirm' 或 'cancel'
    sendNotificationVisible.value = true;
};

// 统一处理提交
const handleSubmit = async () => {
    if (!notificationTitle.value || !notificationContent.value) {
        alert('標題或內容不得為空');
        return;
    }

    if (!selectedRegister.value) return;

    try {
        if (operationType.value === 'confirm') {
            // 执行确认操作
            await axios.put(`http://localhost:8080/api/vendor_admin/registration/confirmById/${selectedRegister.value.id}`);
            selectedRegister.value.status = "confirmed";
        } else if (operationType.value === 'cancel') {
            // 执行取消操作
            await axios.put(`http://localhost:8080/api/vendor_admin/registration/cancelById/${selectedRegister.value.id}`);
            selectedRegister.value.status = "canceled";
        }

        // 发送通知
        await axios.post(`http://localhost:8080/api/vendor_admin/registration/notification/${selectedRegister.value.member.id}`, null, {
            params: {
                title: notificationTitle.value,   // 通知标题
                content: notificationContent.value  // 通知内容
            }
        });

        sendNotificationVisible.value = false; // 关闭通知卡片
    } catch (error) {
        console.error("發送通知失敗", error);
    }
};

const filteredPendingRegisters = computed(() => {
    return registers.value.filter(register => register.status === 'pending');
});

// 批量操作：開啟通知卡片
const openNotificationCardBatch = (registers, type) => {
    selectedRegisters.value = registers;
    operationType.value = type; // 'confirm' 或 'cancel'
    sendNotificationVisible.value = true;
};

// 批量操作：確認或取消註冊並發送通知
const handleBatchSubmit = async () => {
    if (!notificationTitle.value || !notificationContent.value) {
        alert('標題或內容不得為空');
        return;
    }

    if (!selectedRegisters.value || selectedRegisters.value.length === 0) return;

    try {
        const requests = selectedRegisters.value.map(async (register) => {
            if (operationType.value === 'confirm') {
                await axios.put(`http://localhost:8080/api/vendor_admin/registration/confirmById/${register.id}`);
                register.status = "confirmed";
            } else if (operationType.value === 'cancel') {
                await axios.put(`http://localhost:8080/api/vendor_admin/registration/cancelById/${register.id}`);
                register.status = "canceled";
            }

            // 發送通知
            return axios.post(`http://localhost:8080/api/vendor_admin/registration/notification/${register.member.id}`, null, {
                params: {
                    title: notificationTitle.value,
                    content: notificationContent.value
                }
            });
        });

        await Promise.all(requests); // 等待所有請求完成

        sendNotificationVisible.value = false; // 關閉通知卡片
    } catch (error) {
        console.error("批量發送通知失敗", error);
    }
};

const deleteRegistration = async (registerId) => {
    // showModal("确定要刪除该报名吗？", async () => {
    try {
        axios.delete(`http://localhost:8080/api/vendor_admin/registration/deleteById/${registerId}`)
            .then(() => {
                // 先销毁 DataTable（如果已初始化）
                if (dataTable) {
                    dataTable.destroy();
                    dataTable = null;  // 确保 DataTable 变量重置
                }

                // 从本地数据中删除该项
                registers.value = registers.value.filter(register => register.id !== registerId);

                // 等待 Vue DOM 更新后再重新初始化 DataTable
                nextTick(() => {
                    initializeDataTable();
                    updateGenderChart()
                    updateAgeChart()
                });
                alert("刪除成功")
            })
            .catch(() => {
                alert("刪除評論失敗")
            })
    } catch (error) {
        console.error("刪除失败:", error);
    }
    // 这里可以根据需要，重新拉取数据，更新界面

    // });
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'pending':
            return '待審核';
        case 'confirmed':
            return '已確認';
        case 'canceled':
            return '已拒絕';
    }
}

onMounted(async () => {
    await fetchRegistration()
    nextTick(() => {
        setTimeout(() => {
            initializeDataTable();  // 稍微延迟初始化 DataTable
        }, 300);  // 延迟 100 毫秒再初始化
    });
})
</script>

<style scoped>
.btn {
    color: black;
}

.container {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.charts {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.chart {
    width: 45%;
}

.table-container {
    margin-top: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table th,
table td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
}

th {
    background-color: #F4D8B1 !important;
}

table th {
    background-color: #f4f4f4;
}

table tbody tr:hover {
    background-color: #f0f0f0;
}

.form-select {
    width: 200px;
}

.allcheck {
    width: 200px;
}

.notification-card {

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 30px;
    /* 增加内边距，使卡片内容更大 */
    border-radius: 15px;
    /* 加大圆角 */
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    /* 增加阴影效果 */
    z-index: 1000;

    /* 设置宽度 */
    height: auto;
    /* 自动高度 */
    font-size: 18px;
    /* 增加字体大小 */

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    z-index: 1050;



    overflow: hidden;
}
</style>
