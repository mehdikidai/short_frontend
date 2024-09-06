<script setup>
import Layout from "@/components/Layout.vue";
</script>

<template>
    <Layout>
        <div class="boxs">
            <div class="box">
                <div class="icon">
                    <i class="material-symbols-rounded">favorite</i>
                </div>
                <div class="content">
                    <h2>Lorem, ipsum.</h2>
                    <h3>100</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
            <div class="box">
                <div class="icon">
                    <i class="material-symbols-rounded">sentiment_satisfied</i>
                </div>
                <div class="content">
                    <h2>Lorem, ipsum.</h2>
                    <h3>300</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
            <div class="box">
                <div class="icon">
                    <i class="material-symbols-rounded">local_fire_department</i>
                </div>
                <div class="content">
                    <h2>Lorem, ipsum.</h2>
                    <h3>1500</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
            <div class="box">
                <div class="icon">
                    <i class="material-symbols-rounded">qr_code_2</i>
                </div>
                <div class="content">
                    <h2>Lorem, ipsum.</h2>
                    <h3>5500</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
        </div>
        
    </Layout>
</template>

<style lang="scss" scoped>
.boxs {
    min-height: 100px;
    //background: red;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    .box {
        flex: 1 1 360px;
        background: var(--white);
        height: 150px;
        border-radius: 12px;
        display: flex;
        align-items: stretch;
        padding: 20px;
        gap: 20px;
        .icon {
            width: 40px;
            height: 40px;
            background: var(--gray);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            i {
                color: var(--main);
                font-size: 30px;
            }
        }
        .content {
            flex: 1;
            //background: blue;
            display: flex;
            flex-direction: column;
            gap: 2px;
            h2 {
                font-size: 18px;
                font-weight: 500;
                line-height: 36px;
                color: var(--black);
                opacity: 0.8;
            }
            h3 {
                color: var(--black);
                font-size: 24px;
                font-weight: 600;
            }
            span {
                font-size: 14px;
                color: var(--black);
                opacity: 0.3;
                margin-top: auto;
            }
        }
    }
}
</style>
