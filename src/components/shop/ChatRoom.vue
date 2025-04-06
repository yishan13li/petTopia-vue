<template>
    <div>
        <!-- 聊天按鈕 -->
        <button v-if="isHideChat" class="chat-button btn btn-primary" @click="isOpen = true">
            <i class="bi bi-chat-dots"></i>
        </button>

        <!-- 聊天室 -->
        <div v-if="isShowChat" class="chat-container">
            <!-- 標題列 -->
            <div class="chat-header">
                <span class="ms-2">聊天室</span>
                <button class="btn btn-dark btn-sm" @click="isOpen = false">
                    <i class="bi bi-chevron-down"></i>
                </button>
            </div>

            <div class="chat-content">
                <!-- 訊息區 -->
                <div class="chat-messages-container">
                    <div class="chat-messages" ref="chatContainerRef">
                        <!-- 所有訊息 -->
                        <div v-for="message in messages" :key="message.id" class="chat-message"
                            :class="{ 'sent': message.senderId == userId, 'received': message.senderId != userId }">
                            {{ message.content }}

                            <!-- 訊息預覽圖片區 -->
                            <div v-if="message.photos.length > 0" class="chat-image-preview">
                                <div class="image-preview-container">
                                    <div v-for="(image) in message.photos" class="preview-item">
                                        <img :src="'data:image/jpeg;base64,' + image" alt="預覽圖片" class="preview-img"
                                            @click="emitImage(image)" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 上傳圖片預覽區 -->
                    <div v-if="uploadImages.length > 0" class="chat-image-preview">
                        <div class="image-preview-container">
                            <div v-for="(image, index) in uploadImages" :key="index" class="preview-item">
                                <img :src="image" alt="預覽圖片" class="preview-img" />
                                <button class="btn btn-danger btn-sm remove-image" @click="removeImage(index)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm clear-images" @click="clearAllImages">刪除所有圖片</button>
                    </div>

                    <!-- 訊息輸入區 -->
                    <div class="chat-input">
                        <textarea v-model="newMessage" @keydown.enter.prevent="handleEnter" placeholder="輸入訊息..."
                            class="form-control"></textarea>
                        <input type="file" accept="image/*" @change="handleFileUpload" class="d-none" ref="fileInputRef"
                            multiple />
                        <button @click="triggerFileInput" class="btn btn-secondary me-2">圖片</button>
                        <button @click="sendMessage" class="btn btn-primary">送出</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import axios from 'axios';
import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';

import { useAuthStore } from '@/stores/auth';

const PATH = `${import.meta.env.VITE_API_URL}`;

const authStore = useAuthStore();
const user = authStore.user; // 使用者資訊
const userId = computed(() => authStore.userId); // 使用者ID
const saId = 23; //FIXME: 假設為saId

const isOpen = ref(false);  // 聊天室開關
const messages = ref([]);   // 所有聊天訊息
const newMessage = ref(''); // 新訊息(輸入中的訊息)
const uploadImages = ref([]); // 上傳的圖片
const fileInputRef = ref(null);    // 圖片上傳input元件
const chatContainerRef = ref(null);

const emit = defineEmits(['open-image']);
const emitImage = (image) => {
    emit('open-image', image);
};

onMounted(async () => {
    if (userId.value)
        fetchChatMessages();

    await nextTick();
    scrollToBottom();

})

const scrollToBottom = () => {
    if (chatContainerRef.value) {
        chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
};

watch(() => userId.value, async (newUserId, oldUserId) => {
    await fetchChatMessages();
    scrollToBottom();
});

watch(messages, async () => {
    await nextTick();
    scrollToBottom();
}, { deep: true });

watch(chatContainerRef, (newRef) => {
    if (newRef) {
        scrollToBottom();
    }
}, { immediate: true });

// watch(messages, async (newMessages, oldMessages) => {
//     if (!chatContainerRef.value) return; // 確保 DOM 存在，避免 null 錯誤

//     const chatBox = chatContainerRef.value;
//     const isAtBottom = chatBox.scrollHeight - chatBox.scrollTop === chatBox.clientHeight;

//     await nextTick();

//     if (isAtBottom) {
//         chatBox.scrollTop = chatBox.scrollHeight; // 只有在滾動到底部時才自動滾動
//     }
// }, { deep: true });

const isHideChat = computed(() => !isOpen.value && userId.value);
const isShowChat = computed(() => isOpen.value && userId.value);

// ========================== websocket ==========================

const stompClient = new Client({
    brokerURL: "ws://localhost:8080/chat", // WebSocket 伺服器 URL
    connectHeaders: {},
    reconnectDelay: 5000, // 斷線重連
    webSocketFactory: () => new SockJS("http://localhost:8080/chat"), // 使用 SockJS 連線
});

stompClient.onConnect = () => {
    // 訂閱用戶的頻道
    stompClient.subscribe(`/topic/messages/${userId.value}`, (message) => {
        const msg = JSON.parse(message.body);

        messages.value.push(msg);

    });
};

stompClient.activate();

const sendMessage = async () => {
    if (newMessage.value.trim() === '') return; // 如果訊息為空則不發送

    let uploadedPhotoUrls = [];

    if (uploadImages.value.length > 0) {
        // 上傳每張圖片
        await axios({
            method: 'post',
            url: `${PATH}/chatRoom/api/uploadPhoto`,
            headers: { 'Content-Type': 'application/json' },
            data: {
                userId: userId.value,
                image: uploadImages.value
            }

        })
            .then(response => {
                // console.log('上傳圖片:', response.data.url);
                response.data.forEach(img => {
                    uploadedPhotoUrls.push(img.url);
                });
            })
            .catch(error => console.log("圖片上傳失敗", error));
    }

    const messageData = {
        senderId: Number(userId.value),
        receiverId: Number(saId),
        content: newMessage.value,
        sendTime: new Date(),
        photos: uploadedPhotoUrls,
    }

    if (stompClient.connected) {
        stompClient.publish({
            destination: "/app/send",
            body: JSON.stringify(messageData),
        });
    }

    newMessage.value = '';
    uploadImages.value = [];

};

// 獲取歷史聊天訊息
async function fetchChatMessages() {
    await axios({
        method: 'get',
        url: `${PATH}/chatRoom/api/getChatMessagesHistory`,
        params: {
            senderId: userId.value,
            receiverId: saId,
        }
    })
        .then(response => {
            messages.value = response.data.chatMessagesHistory;
            // console.log('歷史聊天訊息:', messages.value);
            scrollToBottom();
        })
        .catch(error => console.log(error));
}

// ==========================  ==========================

// 變更enter觸發事件
const handleEnter = (event) => {
    if (event.shiftKey) {
        // Shift + Enter 換行
        newMessage.value += '\n';
    } else {
        // 單獨按 Enter 則發送訊息
        sendMessage();
        event.preventDefault(); // 防止換行
    }
};

const triggerFileInput = () => {
    fileInputRef.value.click();
};

const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target.result;

                // 檢查圖片是否已存在
                if (!uploadImages.value.includes(base64Image)) {
                    uploadImages.value.push(base64Image);
                } else {
                    // console.log("圖片已存在，未重複加入");
                }
            };
            reader.readAsDataURL(file);
        });
    }
    // **關鍵：清空 input，確保能重新選擇相同檔案**
    event.target.value = "";
};

const removeImage = (index) => {
    uploadImages.value.splice(index, 1);
};

const clearAllImages = () => {
    uploadImages.value = [];
};


</script>

<style scoped>
.chat-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.chat-button i {
    color: black;
}

.chat-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 35%;
    height: 80%;
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: #E9CA94;
    color: black;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.chat-header button i {
    color: black;
}

.chat-content {
    display: flex;
    flex: 1;
    overflow: hidden;
    height: calc(100% - 50px);
    /* 減去標題欄的高度 */
}

.chat-list {
    width: 30%;
    border-right: 1px solid #ddd;
    overflow-y: auto;
    padding: 10px;
}

.chat-user {
    padding: 8px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
}

.chat-user:hover {
    background: #f0f0f0;
}

.chat-messages-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 10px;
}

.chat-messages {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* justify-content: flex-end; */
    overflow-y: auto;
    max-height: 100%;
}

.chat-messages {
    /*  \n 會自動轉換成換行 */
    white-space: pre-line;
}

.chat-message {
    display: inline-block;
    word-wrap: break-word;
    word-break: break-word;
    max-width: 70%;
    padding: 8px;
    margin-bottom: 5px;
    border-radius: 10px;
    background: #f1f1f1;
    word-wrap: break-word;
}

.sent {
    align-self: flex-end;
    background: #E9CA94;
    color: black;
}

.received {
    align-self: flex-start;
    background: #e5e5e5;
    color: black;
}

.chat-input {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #ddd;
}

.chat-input textarea {
    resize: none;
    min-height: 50px;
    max-height: 100px;
    width: 70%;
    margin-right: 10px;
}

.chat-input button {
    color: black;
}

.chat-image-preview {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
}

.image-preview-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.preview-item {
    position: relative;
}

.preview-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid #ccc;
    cursor: pointer;
}

.remove-image {
    position: absolute;
    top: -5px;
    right: -5px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    padding: 5px;
}

.clear-images {
    margin-top: 10px;
    background-color: #ff4d4f;
    color: white;
    border-radius: 5px;
}

.remove-image {
    width: 36px;
    /* 調整按鈕大小 */
    height: 36px;
    border-radius: 50%;
    /* 讓按鈕變成圓形 */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 0, 0, 0.8);
    /* 紅色背景，略帶透明 */
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
}

.remove-image:hover {
    background-color: red;
    /* 滑鼠移上去變深紅色 */
}

.remove-image i {
    color: white;
    /* 讓垃圾桶圖示變成白色 */
    font-size: 18px;
}
</style>