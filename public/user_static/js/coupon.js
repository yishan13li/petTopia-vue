let isCouponsFetched = false;  // 用來記錄是否已經發送過請求

// 儲存選擇的優惠券資訊
let selectedCoupon = {
    couponId: null,
    couponName: '',
    discountType: null, // true: 百分比折扣, false: 固定金額折扣
    discountValue: 0 // 優惠金額或折扣百分比
};

// 監聽優惠券按鈕點擊事件
const couponButton = document.getElementById('couponButton');
const modal = new bootstrap.Modal(document.getElementById('couponModal'));

// 只有在點擊「選擇優惠券」按鈕時才發送請求
couponButton.addEventListener('click', function () {
    // 如果已經請求過優惠券，則不再發送請求
    if (isCouponsFetched) {
        return; // 直接退出，不發送請求
    }

    isCouponsFetched = true;  // 設置為已經請求過

    axios.get('/shop/coupons')
        .then(response => {
            const { availableCoupons, notMeetCoupons } = response.data;

            // 確保優惠券列表顯示正確
            const availableCouponsList = document.getElementById('availableCouponsList');
            const notMeetCouponsList = document.getElementById('notMeetCouponsList');

            // 清空現有的優惠券列表
            availableCouponsList.innerHTML = '';
            notMeetCouponsList.innerHTML = '';

            // 填充可用優惠券
            availableCoupons.forEach(coupon => {
                const couponButtonHTML = `
                    <button type="button" name="couponSelect" class="list-group-item list-group-item-action coupon-btn text-dark" style="border: 1px solid rgb(192, 192, 192); margin-bottom: 3px; border-radius: 5px;"
                    data-coupon-id=${coupon.id}    
                    data-coupon="${coupon.name}" data-coupon-id="${coupon.id}" 
                        data-discount-type="${coupon.discountType ? 0 : 1}" 
                        data-discount-value="${coupon.discountValue}">
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                            <span>${coupon.name}</span>
                            <span>${coupon.discountType ? '－' + (coupon.discountValue * 100).toFixed(0) + '%' : '－$' + coupon.discountValue.toFixed(0)}</span>
                        </div>
                    </button>
                `;
                availableCouponsList.insertAdjacentHTML('beforeend', couponButtonHTML);
            });

            // 填充未滿額的優惠券
            notMeetCoupons.forEach(coupon => {
                const couponButtonHTML = `
                    <button type="button" class="list-group-item list-group-item-action coupon-btn disabled text-body-secondary" style="margin-bottom: 3px; border-radius: 5px;"
                        data-coupon="${coupon.name}" data-coupon-id="${coupon.id}">
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; color: rgb(158, 158, 158);">
                            <span>${coupon.name}</span>
                            <span>需滿額 $${coupon.minOrderValue.toFixed(0)}</span>
                        </div>
                    </button>
                `;
                notMeetCouponsList.insertAdjacentHTML('beforeend', couponButtonHTML);
            });

            // 重新綁定優惠券按鈕的點擊事件
            const couponButtons = document.querySelectorAll('.coupon-btn');
            couponButtons.forEach(button => {
                button.addEventListener('click', function () {
                    // 取得優惠券的資料
                    const couponId = this.getAttribute('data-coupon-id');
                    const couponName = this.getAttribute('data-coupon');
                    const couponType = this.getAttribute('data-discount-type') === '1'; // 确保值为 true 或 false
                    const couponValue = parseFloat(this.getAttribute('data-discount-value')); // 优惠券的折扣值，可能是固定金额或小数点百分比

                    // 更新選中的優惠券資料
                    selectedCoupon = {
                        couponId: couponId,
                        couponName: couponName,
                        discountType: couponType,
                        discountValue: couponValue
                    };

                    // 更新按鈕的文本為選中的優惠券名稱
                    couponButton.textContent = couponName;

                    // 更新顏色
                    couponButton.style.backgroundColor = '#f4d8b1'; // 设置背景颜色
                    couponButton.style.color = '';

					updateTotal();
					
                    // 關閉 modal
                    modal.hide();
                });
            });
        })
        .catch(error => {
            console.error('Error fetching coupons:', error);
        });
});


// 計算最終總金額
function updateTotal() {
    const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('$', '').trim()); // 商品總金額
    const shippingCost = parseFloat(document.querySelector('.shipping-cost').textContent.replace('$', '').trim()) || 0; // 運費，若為 NaN 設為 0

    let discountAmount = 0;

    if (selectedCoupon.discountType === true) {
        // 固定金額折扣
        discountAmount = selectedCoupon.discountValue;
    } else if (selectedCoupon.discountType === false) {
        // 百分比折扣 (discountValue 是小數點，像 0.2 表示 20% 折扣)
        discountAmount = subtotal * selectedCoupon.discountValue; // 使用 subtotal 而非 productTotal
    }

    // 確保折扣金額不會超過商品總金額
    discountAmount = Math.min(discountAmount, subtotal); // 如果折扣大於商品金額，將折扣限制為商品金額

    // 更新折扣顯示
    document.querySelector('.discount').textContent = `-$${discountAmount.toFixed(0)}`;

    // 計算最終總金額
    const finalTotal = subtotal + shippingCost - discountAmount; // 計算最終總金額
    document.querySelector('.final-total').textContent = `$${finalTotal.toFixed(0)}`; // 更新結帳總金額
}

