// 儲存選擇的優惠券資訊
let selectedCoupon = {
    couponName: '',
    discountType: null, // true: 百分比折扣, false: 固定金額折扣
    discountValue: 0 // 優惠金額或折扣百分比
};

// 監聽優惠券按鈕點擊事件
const couponButtons = document.querySelectorAll('.coupon-btn');
const couponButton = document.getElementById('couponButton');
const modal = new bootstrap.Modal(document.getElementById('couponModal'));

couponButtons.forEach(button => {
    button.addEventListener('click', function () {
        // 取得優惠券的資料
        const couponName = this.getAttribute('data-coupon');
		const couponType = this.getAttribute('data-discount-type') === '1'; // 確保值為 true 或 false
        const couponValue = parseFloat(this.getAttribute('data-discount-value')); // 優惠券的折扣值，可能是固定金額或小數點百分比

        // 更新選中的優惠券資料
        selectedCoupon = {
            couponName: couponName,
            discountType: couponType,
            discountValue: couponValue
        };

        // 更新按鈕的文本為選中的優惠券名稱
        couponButton.textContent = couponName;

        // 更新顏色
        couponButton.style.backgroundColor = '#f4d8b1'; // 設置背景顏色
        couponButton.style.color = '';

        // 計算折扣
        updateTotal(); // 重新計算總金額

        // 關閉 modal
        modal.hide();
    });
});

// 監聽運費選擇
document.querySelectorAll('input[name="shipping"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        const shippingCost = parseFloat(this.getAttribute('data-shipping-cost')) || 0; // 取得選中的運費，默認為0
        document.querySelector('.shipping-cost').textContent = `$${shippingCost.toFixed(0)}`;

        updateTotal(); // 每次運費變動時重新計算總金額
    });
});

// 計算最終總金額
function updateTotal() {
    const productTotal = parseFloat(document.getElementById('productTotal').textContent.replace('$', '').trim()); // 商品總金額
    const shippingCost = parseFloat(document.querySelector('.shipping-cost').textContent.replace('$', '').trim()) || 0; // 運費，若為 NaN 設為 0

    let discountAmount = 0;


        if (selectedCoupon.discountType === true) {
            // 固定金額折扣
            discountAmount = selectedCoupon.discountValue;
			
        } else if (selectedCoupon.discountType === false) {
            // 百分比折扣 (discountValue 是小數點，像 0.2 表示 20% 折扣)
            discountAmount = productTotal * selectedCoupon.discountValue ;
			}
    

    // 確保折扣金額不會超過商品總金額
    discountAmount = Math.min(discountAmount, productTotal); // 如果折扣大於商品金額，將折扣限制為商品金額

    // 更新折扣顯示
    document.querySelector('.discount').textContent = `-$${discountAmount.toFixed(0)}`;

    // 計算最終總金額
    const finalTotal = productTotal + shippingCost - discountAmount; // 計算最終總金額
    document.querySelector('.final-total').textContent = `$${finalTotal.toFixed(0)}`; // 更新結帳總金額
}
