<!-- src/App.vue -->
<template>
  <div>
    <component :is="currentHeader"></component>
    <main>
      <component :is="vendorAdminSidebar"></component>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import HeaderIndex from './components/HeaderIndex.vue';
import HeaderShop from './components/HeaderShop.vue';
import HeaderVendor from './components/HeaderVendor.vue';
import HeaderVendorAdmin from './components/HeaderVendorAdmin.vue';
import VendorAdminSidebar from './components/VendorAdminSidebar.vue';
const route = useRoute();

// 根據path 決定顯示哪一個 header
const vendorAdminSidebar = computed(() => {
  if (route.path.startsWith('/vendor/admin')) {
    return VendorAdminSidebar;  // 顯示 HeaderShop

  }
});

const currentHeader = computed(() => {
  if (route.path.startsWith('/shop')) {
    return HeaderShop;  // 顯示 HeaderShop

  } else if (route.path.startsWith('/vendor')) {
    return HeaderVendor;  // 顯示 HeaderVendor

  } else if (route.path.startsWith('/vendor/admin')) {
    return HeaderVendorAdmin;  // 顯示 HeaderVendorAdmin

  }
  return HeaderIndex;  // 顯示 HeaderIndex
});

</script>

<style></style>
