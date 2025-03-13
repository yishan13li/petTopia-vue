<template>
  <form id="ecpayForm" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post">
    <input type="hidden" value="3002607" name="merchantId" />
    <input type="hidden" value="PetTopia46" name="merchantTradeNo" />
    <input type="hidden" value="2025/03/14 00:24:31" name="merchantTradeDate" />
    <input type="hidden" value="aio" name="paymentType" />
    <input type="hidden" value="208" name="totalAmount" />
    <input type="hidden" value="petTopia商品付款" name="tradeDesc" />
    <input type="hidden" value="貓咪逗趣自動旋轉球" name="itemName" />
    <input type="hidden" value="http://localhost:8080/shop/payment/ecpay/callback" name="returnURL" />
    <input type="hidden" value="Credit" name="choosePayment" />
    <input type="hidden" value="406959AFB856D4D70E3C054812AF5EB7E0C5679EE1EE6891357F8B7E550C1CBE" name="checkMacValue" />
    <input type="hidden" value="1" name="encryptType" />
  </form>
</template>

<script setup>
// 用 setTimeout 確保 DOM 先渲染完成再抓取元素
setTimeout(() => {
  const form = document.getElementById("ecpayForm");
  if (form) form.submit();
}, 1000); // 延遲 1 秒後自動提交
</script>
