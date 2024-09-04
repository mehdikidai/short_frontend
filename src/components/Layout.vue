<template>
    <div class="sidebar">
        <div class="logo">
            <Logo />
        </div>
        <ul>
            <li>
                <i class="material-symbols-rounded">home</i>
               
                <RouterLink to="/">Home</RouterLink>
            </li>
            <li>
                <i class="material-symbols-rounded">link</i
                ><RouterLink to="/about">Links</RouterLink>
            </li>
            <li>
                <i class="material-symbols-rounded">monitoring</i
                ><RouterLink to="/login">Analytics</RouterLink>
            </li>
            
            
        </ul>
        <div class="line"></div>
        <ul>
            <li>
                <i class="material-symbols-rounded">person</i
                ><RouterLink to="/login">Settings</RouterLink>
            </li>
            <li>
                <i class="material-symbols-rounded">tune</i
                ><RouterLink to="/login">Settings</RouterLink>
            </li>
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
import Logo from "./Logo.vue";
</script>

<style lang="scss" scoped>
.sidebar {
    width: 210px;
    background-color: #fafafa;
    background-color: var(--white);
    height: 100vh;
    .line{
        height: 1px;
        background: #e1e1e1;
        width: 70%;
        margin-left: 20px;
    }
}

.sidebar .logo {
    height: 70px;
    //background: red;
    display: flex;
    align-items: center;
    padding-inline: 20px;
}

.sidebar ul {
    list-style-type: none;
    padding-inline: 10px;
    margin-block: 40px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sidebar ul li {
    height: 36px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-inline: 10px;
    border-radius: 4px;
    transition: all 0.1s ease-in;
    &:hover {
        background: var(--main);
        
    }

    &:hover i,&:hover a{
        color: #fff;
    }

    i {
        color: #0a0c0b;
        font-size: 20px;
        transition: all 0.1s ease-in;
    }
}

.sidebar ul li a {
    color: var(--black);
    text-decoration: none;
    flex: 1;
    transition: all 0.1s ease-in;
}

.main-content {
    flex-grow: 1;
    padding: 0;
    background-color: var(--gray);
}

.header {
    background-color: #3498db;
    color: white;
    padding: 15px;
    height: 70px;
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
