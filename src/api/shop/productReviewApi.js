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


// 獲取該會員的所有商品評論
export const getMemberReviews = async (memberId) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/shop/reviews/member/${memberId}` 
    });

    return response;  // 返回評論列表
  } catch (error) {
    throw error;  // 拋出錯誤，讓上層處理
  }
};

export const updateProductReview = async (formData,deletePhotoIds) => {
  try {
    const reviewId = formData.get('reviewId');
    if (!reviewId) {
      throw new Error("缺少 reviewId，無法更新評論");
    }
    console.log([...formData]);  // 查看 FormData 的內容
    
    const response = await axios({
      method: 'PUT',
      url: `${URL}/shop/reviews/${reviewId}/update?deletePhotoIds=${deletePhotoIds.join(',')}`,
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
