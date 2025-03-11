// swiper.js

var swiper = new Swiper('.main-swiper', {
    loop: true, // 保持循環
    autoplay: {
        delay: 3000, // 自動播放間隔
        disableOnInteraction: false, // 用戶點擊後仍然繼續播放
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true, // 讓使用者可以點擊圓圈換頁
        type: 'bullets', // 使用圓點作為指示器
        dynamicBullets: false, // 確保所有圓點都顯示
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
});

// **解決 pagination 不變動的問題**
swiper.on('slideChange', function () {
    let bullets = document.querySelectorAll('.swiper-pagination-bullet');
    bullets.forEach(bullet => bullet.classList.remove('swiper-pagination-bullet-active'));
    bullets[swiper.realIndex].classList.add('swiper-pagination-bullet-active');
});
