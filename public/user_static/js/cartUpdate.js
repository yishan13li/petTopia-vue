function updateQuantity(button, change) {
    // 獲取數量輸入框
    var input = button.closest('.product').querySelector('input');
    var currentQuantity = parseInt(input.value);

    // 更新數量
    var newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
        input.value = newQuantity;
    } else if (newQuantity === 0) {
        // 當數量變為 0，顯示刪除確認
        Swal.fire({
            title: '確定要刪除商品嗎?',
            text: "此操作將無法恢復",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '刪除',
            reverseButtons: true // 強制反轉按鈕順序
        }).then((result) => {
            if (result.isConfirmed) {
                // 處理刪除邏輯
                button.closest('.product').remove(); // 刪除該商品
                Swal.fire('已刪除!', '該商品已被刪除。', 'success');
            } else {
                input.value = 1; // 恢復數量
            }
        });
    }

}

// 監聽所有垃圾桶按鈕的點擊事件
document.addEventListener("click", function (event) {
    // 確保點擊的是垃圾桶按鈕
    if (event.target.closest(".trash-btn")) {
        Swal.fire({
            title: '確定要刪除商品嗎?',
            text: "此操作將無法恢復",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '刪除',
            reverseButtons: true // 強制反轉按鈕順序
        }).then((result) => {
            if (result.isConfirmed) {
                // 找到最近的 `.product` 並刪除
                event.target.closest(".product").remove();
                Swal.fire('已刪除', '該商品已被刪除。', 'success');
            }
        });
    }
});


// 防止用戶直接輸入非數字
function validateInput(input) {
    var value = input.value;
    if (isNaN(value) || value < 1) {
        input.value = 1;  // 當輸入不是數字或小於1時，強制改為1
    }
}