// src/api/orderApi.js
import axios from 'axios';

// API 基本 URL
const URL = import.meta.env.VITE_API_URL;

//取得優惠券列表(可用&未滿額)
export const fetchCouponsForMember = async (params = {}) => {
  try {
    const response = await axios.get(`${URL}/shop/coupons`, { params });
    const { availableCoupons: available, notMeetCoupons: notMeet, selectedCoupon: cartSelectedCoupon } = response.data;
    return { availableCoupons: available, notMeetCoupons: notMeet, selectedCoupon: cartSelectedCoupon };  // 返回獲取的優惠券資料
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;  // 如果發生錯誤，拋出錯誤以便在組件中捕獲
  }
};
