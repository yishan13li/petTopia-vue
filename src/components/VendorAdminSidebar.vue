<template>
    <div class="sidebar">
        <nav class="sidebar-nav">
            <ul class="nav">
                <li class="nav-item">
                    <a href="#" class="nav-link">Home</a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">Profile</a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">Settings</a>
                </li>
                <!-- 其他項目 -->
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'Sidebar',
};
</script>

<style scoped>
.sidebar {
    width: 250px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #333;
    color: white;
    padding-top: 20px;
}

.sidebar-nav {
    list-style: none;
    padding: 0;
}

.nav-item {
    padding: 15px 0;
}

.nav-link {
    color: white;
    text-decoration: none;
    display: block;
}

.nav-link:hover {
    background-color: #575757;
}
</style>