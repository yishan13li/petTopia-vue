// src/api/orderApi.js
import axios from 'axios';

// API 基本 URL
const URL = import.meta.env.VITE_API_URL;

//新增商品評論
export const createProductReview = async (productId, formData) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${URL}/shop/product/${productId}/review/create`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data', 
      }
    });

    return response;
  } catch (error) {
    console.error("提交評論時發生錯誤:", error);
    throw error;
  }
};

// 獲取該會員的所有商品評論，並支持分頁
export const getMemberReviews = async (memberId, page = 1, size = 10) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/shop/reviews/member/${memberId}`,
      params: {
        page: page,  // 分頁的頁碼，默認為 1
        size: size   // 每頁顯示的評論數量，默認為 10
      }
    });

    return response;  // 返回評論列表
  } catch (error) {
    throw error;  // 拋出錯誤，讓上層處理
  }
};

export const updateProductReview = async (formData) => {
  try {
    const reviewId = formData.get('reviewId');
    if (!reviewId) {
      throw new Error("缺少 reviewId，無法更新評論");
    }
    
    const response = await axios({
      method: 'PUT',
      url: `${URL}/shop/reviews/${reviewId}/update`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',  
      }
    });
    
    return response;
  } catch (error) {
    console.error("更新評論時發生錯誤:", error);
    throw error;
  }
};

// 獲取某個商品的平均評分
export const getAverageRating = async (productDetailId) => {
  try {
    const response = await axios.get(`${URL}/shop/products/${productDetailId}/reviews/avgRating`);
    console.log('API 回應資料:', response.data);
    return response.data; 
  } catch (error) {
    throw error;
  }
};

// 找某商品的總評論述
export const getReviewCount = async (productDetailId) => {
  try {
    const response = await axios.get(`${URL}/shop/products/${productDetailId}/reviews/count`);
    
    return response.data; 
  } catch (error) {
    throw error;
  }
};

// 找某商品的所有評論&分頁
export const getProductReviews = async (productDetailId, page = 1, size = 10) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/shop/reviews/product/${productDetailId}`,
      params: { page, size },  // 傳送分頁參數
    });

    return response.data;  // 返回評論資料，包括分頁信息
  } catch (error) {
    throw error;  // 拋出錯誤，讓上層處理
  }
};

//是否對該商品評論過
export const checkIfReviewed = async (productId, memberId) => {
  try {
    const response = await axios.get(`${URL}/shop/review/hasReviewed`, {
      params: { productId, memberId }
    });
    return response.data;
  } catch (error) {
    console.error("API 請求錯誤:", error);
    return { hasReviewed: false }; 
  }
};