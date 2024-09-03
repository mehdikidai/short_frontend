<template>
    <div class="sidebar">
        <h2>Dashboard</h2>
        <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/about">About</RouterLink></li>
            <li><RouterLink to="/login">login</RouterLink></li>
        
        </ul>
    </div>

    <div class="main-content">
        <div class="header">
            <h2>Welcome to the Dashboard</h2>
        </div>

        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<style lang="scss" scoped>
.sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: white;
    height: 100vh;
    padding: 20px;
}

.sidebar h2 {
    text-align: center;
    margin-bottom: 20px;
}

.sidebar ul {
    list-style-type: none;
    padding: 0;
}

.sidebar ul li {
    margin: 20px 0;
}

.sidebar ul li a {
    color: white;
    text-decoration: none;
    display: block;
}


.main-content {
    flex-grow: 1;
    padding: 20px;
    background-color: #ecf0f1;
}

.header {
    background-color: #3498db;
    color: white;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
}

.content {
    display: flex;
    gap: 20px;
}

.card {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    flex: 1;
    text-align: center;
}

.card h3 {
    margin-top: 0;
}

.card p {
    color: #7f8c8d;
}
</style>
