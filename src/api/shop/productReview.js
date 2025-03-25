// src/api/orderApi.js
import axios from 'axios';

// API 基本 URL
const URL = import.meta.env.VITE_API_URL;

//新增商品評論
export const createProductReview = async (memberId,productId,review) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${URL}/shop/product/${productId}/review/create?memberId=${memberId}`,
      data: {
        rating: review.rating,
        reviewDescription: review.reviewDescription
      }
      
    });

    return response;  
  } catch (error) {
    throw error;  
  }
};

// 獲取該會員的所有商品評論
export const getMemberReviews = async (memberId) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/shop/reviews/member/${memberId}` 
    });

    return response.data;  // 返回評論列表
  } catch (error) {
    throw error;  // 拋出錯誤，讓上層處理
  }
};
