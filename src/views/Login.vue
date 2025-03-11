<template>
  <section id="login" class="login-section">
    <div class="container">
      <div class="row my-3 py-3">
        <div class="offset-md-2 col-md-8 my-3">
          <h2 class="display-3 fw-normal text-center">
            Welcome Back! <span class="text-primary">Login to your account</span>
          </h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label">Email Address</label>
              <input type="email" class="form-control form-control-lg" v-model="email" id="email"
                placeholder="Enter Your Email Address" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control form-control-lg" v-model="password" id="password"
                placeholder="Enter Your Password" required>
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-dark btn-lg rounded-1">Login Now</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// API路徑
const URL = import.meta.env.VITE_API_URL;

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    const response = await axios.post(
      `${URL}/login`,
      {
        email: email.value,
        password: password.value
      },
      { withCredentials: true } // ✅ 確保攜帶 session
    );

    if (response.status === 200) {
      console.log('Login successful');
      router.push('/shop/');  // 成功後跳轉到首頁
    }
  } catch (error) {
    console.error('Login error:', error);
    alert("Login failed. Please try again.");
  }
};
</script>
