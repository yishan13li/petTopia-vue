<template>
    <div id="main-wrapper">
        <div>
            <div class="content-body">
                <div class="container">
                    <!-- 認證申請表單 -->
                    <h2>申請認證</h2>
                    <form @submit.prevent="submitForm" id="certification_form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>選擇認證標語:</label>
                                <select name="certification_tag_id" class="form-control" id="certification_tag_id"
                                    v-model="certificationTagId" required>
                                    <option value="" disabled selected>請選擇認證標語</option>
                                    <!-- 透過 v-for 動態生成認證標語選項 -->
                                    <option v-for="tag in certificationTags" :key="tag.id" :value="tag.id">
                                        {{ tag.tagName }}</option>
                                </select>
                            </div>


                        </div>

                        <div style="text-align: right;">
                            <button type="submit" class="btn btn-outline-primary" id="sendBtn">提交申請</button>
                        </div>
                    </form>
                    <hr>

                    <!-- 申請認證紀錄表格 -->
                    <h2>認證申請紀錄</h2>
                    <div style="display: flex; align-items: center;">
                        <label for="status" style="margin-right: 10px;">認證狀態:</label>
                        <select v-model="filterStatus" id="status" class="form-control" style="max-width: 150px;">
                            <option value="已認證">已認證</option>
                            <option value="申請中">申請中</option>
                            <option value="未通過">未通過</option>
                        </select>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>認證標語</th>
                                <th>認證狀態</th>
                                <th>申請時間</th>
                                <th>審核時間</th>
                                <th>原因</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(record, index) in filteredRecords" :key="index">
                                <td>{{ record.tag_name }}</td>
                                <td>{{ record.certification_status }}</td>
                                <td>{{ new Date(record.request_date).toLocaleString() }}</td>
                                <td>{{ record.approved_date ? new Date(record.approved_date).toLocaleString() : '未審核' }}
                                </td>
                                <td>{{ record.reason }}</td>
                                <td>
                                    <button v-if="record.certification_status === '申請中'" class="btn btn-danger btn-sm"
                                        @click="deleteCertification(record.certificationId)">取消申請</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
const authStore = useAuthStore()
const userId = authStore.userId

const vendorId = ref(userId);  // 假設登入者的 vendor_id 是 1
const certificationTagId = ref('');
const reason = ref('');
const certificationTags = ref([]);
const certificationRecords = ref([]);
const filterStatus = ref('已認證');  // 默认为申請中
// 提交表單


const submitForm = () => {
    // 检查该店家是否已经申请过该认证标语
    axios.get(`http://localhost:8080/api/vendor_admin/certification/exists/${vendorId.value}/${certificationTagId.value}`)
        .then(response => {
            if (response.data.exists) {
                Swal.fire({
                    icon: 'info',
                    title: '您已經申請過囉',
                    text: '請等待審核結果',
                    confirmButtonText: 'OK'
                });
            } else {
                // 如果没有申请过该认证标语，则可以提交
                const formdata = new FormData();
                formdata.append("vendorId", vendorId.value);
                formdata.append("tagId", certificationTagId.value);

                axios.post('http://localhost:8080/api/vendor_admin/certification/add', formdata)
                    .then(response => {
                        Swal.fire({
                            icon: 'success',
                            title: '申請成功',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            window.location.reload(); // 重新加载页面
                        });

                    })
                    .catch(error => {
                        Swal.fire({
                            icon: 'error',
                            title: '申請失敗',
                            text: '請稍後再試。',
                            confirmButtonText: 'OK'
                        });
                    });
            }
        })
        .catch(error => {
            console.error("檢查重複申請失敗：", error);
            Swal.fire({
                icon: 'error',
                title: '檢查重複申請失敗',
                text: '請稍後再試。',
                confirmButtonText: 'OK'
            });
        });
};

const deleteCertification = (recordId) => {
    Swal.fire({
        title: '確定要取消申請嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '確定',
        cancelButtonText: '取消'
    }).then(result => {
        if (result.isConfirmed) {
            axios.delete(`http://localhost:8080/api/vendor_admin/certification/delete/${recordId}`)
                .then(response => {
                    Swal.fire({
                        icon: 'success',
                        title: '取消申請成功',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        fetchCertification(); // 删除成功后重新加载认证申请记录
                    });
                })
                .catch(error => {
                    console.error("取消申請成功失敗：", error);
                    Swal.fire({
                        icon: 'error',
                        title: '取消申請成功失敗',
                        text: '請稍後再試。',
                        confirmButtonText: 'OK'
                    });
                });
        }
    });
};
const fetchCertification = () => {
    // 獲取申請紀錄
    axios.get(`http://localhost:8080/api/vendor_admin/certification/${vendorId.value}`)
        .then(response => {
            console.log(response.data);
            certificationRecords.value = response.data.map(record => ({
                ...record,
                tag_name: record.tag.tag.tagName || '未知標語',
                certification_status: record.certificationStatus || '未審核',
                reason: record.reason || '無原因',
                request_date: record.requestDate || '未提供',
                approved_date: record.approvedDate || null,
                certificationId: record.id
            }));
        })
        .catch(error => {
            console.error("獲取認證申請紀錄失敗：", error);
        });
};

// 使用 filterStatus 來過濾認證紀錄
const filteredRecords = computed(() => {
    return certificationRecords.value.filter(record => {
        return record.certification_status === filterStatus.value;
    });
});

// 獲取認證標語列表
onMounted(() => {

    axios.get('http://localhost:8080/api/certification_type/all')
        .then(response => {
            console.log(response.data);
            certificationTags.value = response.data;
        })
        .catch(error => {
            console.error("獲取認證標語失敗：", error);
        });
    fetchCertification();

});
</script>

<style scoped>
.container {
    max-width: 70%;
    margin: auto;
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
}

input,
textarea,
select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
}

button:hover {
    background-color: #0056b3;
}

table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f8f8f8;
    font-weight: bold;
}

tr:hover {
    background-color: #f1f1f1;
}
</style>
