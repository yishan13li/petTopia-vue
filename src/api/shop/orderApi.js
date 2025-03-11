// src/api/orderApi.js
import axios from 'axios';

// API 基本 URL
const URL = import.meta.env.VITE_API_URL;  

//取得訂單詳情By訂單ID
export const fetchOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(`${URL}/shop/orders/${orderId}`);
    return response.data;  // 返回訂單詳細資料
  } catch (error) {
    throw error;  // 拋出錯誤，讓上層處理
  }
};

// 取得訂單歷史列表
export const fetchOrderHistory = async (filters) => {
    try {
      const response = await axios.get(`${URL}/shop/orderHistory`, {
        params: {
          orderStatus: filters.orderStatus,
          startDate: filters.startDate || null,
          endDate: filters.endDate || null,
          keyword: filters.searchProduct || null,
          page: filters.page,
          size: filters.size
        }
      });
  
      if (response.status === 200) {
        return {
          orders: response.data.content,  // 返回訂單列表
          totalPages: Math.ceil(response.data.totalElements / filters.size),  // 計算總頁數
        };
      } else if (response.status === 204) {
        return {
          orders: [],
          totalPages: 1,
        };
      }
    } catch (error) {
      throw error; // 拋出錯誤，讓上層處理
    }
  };