<template>
  <form id="ecpayForm" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post">
    <input type="hidden" value="3002607" name="MerchantID" />
    <input type="hidden" value="ecpay20230312153023" name="MerchantTradeNo" />
    <input type="hidden" value="2023/03/12 15:30:23" name="MerchantTradeDate" />
    <input type="hidden" value="aio" name="PaymentType" />
    <input type="hidden" value="30000" name="TotalAmount" />
    <input type="hidden" value="促銷方案" name="TradeDesc" />
    <input type="hidden" value="Apple iphone 15" name="ItemName" />
    <input type="hidden" value="https://www.ecpay.com.tw/receive.php" name="ReturnURL" />
    <input type="hidden" value="ALL" name="ChoosePayment" />
    <input type="hidden" value="6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840" name="CheckMacValue" />
    <input type="hidden" value="1" name="EncryptType" />
  </form>
</template>

<script setup>
// 用 setTimeout 確保 DOM 先渲染完成再抓取元素
setTimeout(() => {
  const form = document.getElementById("ecpayForm");
  if (form) form.submit();
}, 1000); // 延遲 1 秒後自動提交
</script>
