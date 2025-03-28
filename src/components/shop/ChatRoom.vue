<template>
    <div>
        <!-- 聊天按鈕 -->
        <button v-if="!isOpen" class="chat-button btn btn-primary" @click="isOpen = true">
            <i class="bi bi-chat-dots"></i>
        </button>

        <!-- 聊天室 -->
        <div v-else class="chat-container">
            <!-- 標題列 -->
            <div class="chat-header">
                <span>聊天室</span>
                <button class="btn btn-light btn-sm" @click="isOpen = false">
                    <i class="bi bi-chevron-down"></i>
                </button>
            </div>

            <div class="chat-content">
                <!-- 聊天對象列表 -->
                <div class="chat-list">
                    <div v-for="user in users" :key="user.id" class="chat-user" @click="selectUser(user)">
                        {{ user.name }}
                    </div>
                </div>

                <!-- 訊息區 -->
                <div class="chat-messages-container">
                    <div class="chat-messages">
                        <div v-for="message in messages" :key="message.id" class="chat-message"
                            :class="{ 'sent': message.sent }">
                            {{ message.text }}
                        </div>
                    </div>

                    <!-- 預覽圖片區 -->
                    <div v-if="uploadedImages.length > 0" class="chat-image-preview">
                        <div class="image-preview-container">
                            <div v-for="(image, index) in uploadedImages" :key="index" class="preview-item">
                                <img :src="image" alt="預覽圖片" class="preview-img" />
                                <button class="btn btn-danger btn-sm remove-image"
                                    @click="removeImage(index)">X</button>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm clear-images" @click="clearAllImages">刪除所有圖片</button>
                    </div>

                    <!-- 訊息輸入區 -->
                    <div class="chat-input">
                        <textarea v-model="newMessage" @keyup.enter="sendMessage" placeholder="輸入訊息..."
                            class="form-control"></textarea>
                        <input type="file" @change="handleFileUpload" class="d-none" ref="fileInput" multiple />
                        <button @click="triggerFileInput" class="btn btn-secondary me-2">圖片</button>
                        <button @click="sendMessage" class="btn btn-primary">送出</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
const users = ref([
    { id: 1, name: '使用者A' },
    { id: 2, name: '使用者B' }
]);
const messages = ref([]);
const newMessage = ref('');
const uploadedImages = ref([]);
const fileInput = ref(null);

const selectUser = (user) => {
    console.log('選擇聊天對象:', user);
};

const sendMessage = () => {
    if (newMessage.value.trim() === '') return;
    messages.value.push({ id: Date.now(), text: newMessage.value, sent: true });
    newMessage.value = '';
};

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImages.value.push(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }
};

const removeImage = (index) => {
    uploadedImages.value.splice(index, 1);
};

const clearAllImages = () => {
    uploadedImages.value = [];
};
</script>

<style scoped>
.chat-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.chat-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50%;
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
    background: #007bff;
    color: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.chat-content {
    display: flex;
    flex: 1;
    overflow: hidden;
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
    overflow-y: auto;
}

.chat-messages {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.chat-message {
    max-width: 70%;
    padding: 8px;
    margin-bottom: 5px;
    border-radius: 5px;
    background: #f1f1f1;
    word-wrap: break-word;
}

.sent {
    align-self: flex-end;
    background: #007bff;
    color: white;
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

.chat-image-preview {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
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
</style>