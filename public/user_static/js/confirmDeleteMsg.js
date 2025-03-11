// 取消訂單
document.addEventListener("DOMContentLoaded", function () {
    const cancelButton = document.querySelector(".btn-danger");

    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            Swal.fire({
                title: '確定要取消這筆訂單嗎？',
                text: "此操作無法復原！",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // 顯示已取消的成功訊息並延遲重導向
                    Swal.fire(
                        '已取消',
                        '訂單已取消！',
                        'success'
                    ).then(() => {
                        // 延遲重導向，給使用者一些時間看到訊息
                        window.location.href = "order-history.html";
                    });
                }
            });
        });
    }
});
