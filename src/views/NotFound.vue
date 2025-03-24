<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content text-center">
        <h1 class="display-1">404</h1>
        <h2 class="mb-4">找不到頁面</h2>
        <p class="lead mb-5">抱歉，您要尋找的頁面不存在或已被移除。</p>
        <router-link to="/" class="btn btn-primary btn-lg">
          返回首頁
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('/user_static/images/background-img.png') no-repeat center center/cover;
}

.error-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2B4F76;
  font-size: 6rem;
  font-weight: bold;
}

h2 {
  color: #333;
  font-size: 2rem;
}

.lead {
  color: #666;
}

.btn-primary {
  background-color: #2B4F76;
  border-color: #2B4F76;
  padding: 0.75rem 2rem;
}

.btn-primary:hover {
  background-color: #1a3049;
  border-color: #1a3049;
}
</style>
