// src/api/orderApi.js
import axios from 'axios';

// API 基本 URL
const URL = import.meta.env.VITE_API_URL;

const fetchCoupons = async (endpoint, params = {}) => {
  try {
    if (Array.isArray(params.productIds)) {
      params.productIds = params.productIds.join(',');
    }
    const { data } = await axios.get(`${URL}${endpoint}`, { params });
    return data;  // 直接返回 API 的資料
  } catch (error) {
    console.error(`Error fetching coupons from ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

// 取得優惠券列表 (可用 & 未滿額)
export const fetchCouponsForMember = (params) => fetchCoupons('/shop/coupons', params);

// 購物車 - 取得優惠券列表 (可用 & 未滿額)
export const fetchCartCouponsForMember = (params) => fetchCoupons('/shop/cart/coupons', params);
