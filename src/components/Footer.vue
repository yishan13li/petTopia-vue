<template>
    <footer class="bg-[#fffcf6] text-gray-700 border-t border-gray-300 text-center py-8">
        <div class="max-w-7xl mx-auto px-6">
            <br>

            <!-- 功能區（三個區塊並排） -->
            <div class="flex justify-between gap-8 text-sm">

                <!-- 追蹤我們 -->
                <div class="flex-1 text-left md:text-center" style="margin-top: -15px;">
                    <a href="/">
                        <img src="/user_static/images/petTopia.png" alt="logo" class=""
                            style="max-width: 200px; height: auto;" />
                    </a>

                    <p class="mt-3 text-xs text-gray-500">與我們一起打造毛孩的幸福生活！
                        <br>
                        高雄市前金區中正四路211號
                    </p>
                    <div class="flex justify-center space-x-6">
                        <a href="#" class="hover:text-pink-500" style="margin-right: 16px;">
                            <i class="fab fa-facebook" style="font-size: 1.75rem;"></i>
                        </a>
                        <a href="#" class="hover:text-pink-500" style="margin-right: 16px;">
                            <i class="fab fa-instagram" style="font-size: 1.75rem;"></i>
                        </a>
                        <a href="#" class="hover:text-pink-500">
                            <i class="fab fa-line" style="font-size: 1.75rem;"></i>
                        </a>
                    </div>

                </div>
                <!-- 商城服務 -->
                <div class="flex-1 text-left md:text-center">
                    <h4 class="font-semibold mb-2">商城服務</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:underline">會員中心</a></li>
                        <li><a href="#" class="hover:underline">寵物商城</a></li>
                    </ul>

                    <ul class="space-y-2">
                        <li><a href="#" class="hover:underline">商品評論</a></li>
                        <li><a href="#" class="hover:underline">客服聊天室</a></li>
                    </ul>
                </div>

                <!-- 友善服務 -->
                <div class="flex-1 text-left md:text-center">
                    <h4 class="font-semibold mb-2">友善服務</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:underline">店家評分</a></li>
                        <li><a href="#" class="hover:underline">活動評論</a></li>
                    </ul>
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:underline">活動報名</a></li>
                        <li><a href="#" class="hover:underline">店家/活動收藏</a></li>
                    </ul>
                </div>

                <!-- 店家專區 -->
                <div class="flex-1 text-left md:text-center">
                    <h4 class="font-semibold mb-2">店家專區</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:underline">店家/活動管理</a></li>
                        <li><a href="#" class="hover:underline">店家認證申請</a></li>
                    </ul>
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:underline">活動行事曆</a></li>
                        <li><a href="#" class="hover:underline">活動報名管理</a></li>
                    </ul>
                </div>
            </div>

            <!-- 底部版權 -->
            <div class="text-xs text-gray-500 border-t border-gray-200 pt-4">
                © 2025 PETTOPIA 寵物友善平台
            </div>

        </div>
    </footer>
</template>

<script setup>
</script>

<style scoped>
footer {
    background-color: #fffcf6;
    color: #4b4b4b;
}

footer .flex {
    display: flex;
    justify-content: space-between;
    gap: 8px;
}

footer .flex>div {
    flex: 1;
    text-align: center;
}

footer .text-center {
    text-align: center;
}

footer .py-8 {
    padding-top: 2rem;
    padding-bottom: 2rem;
}

footer ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
}

footer ul li {
    margin-bottom: 4px;
}

footer .flex.justify-center {
    display: flex;
    justify-content: center;
    gap: 8px;
}

footer .text-xs {
    font-size: 12px;
}

footer .space-x-4 {
    gap: 8px;
}

@media (max-width: 768px) {
    footer .flex {
        flex-direction: column;
        align-items: center;
    }
}
</style>
