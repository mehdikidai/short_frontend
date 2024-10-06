<template>
    <div class="box" v-kidai>
        <div class="link-card-icon-information">
            <div class="link-card__icon-container">
                <img
                    :src="
                        'https://www.google.com/s2/favicons?domain=' +
                        $getDomain(url.original_url) +
                        '&sz=64'
                    "
                    alt="favicon"
                />
            </div>
            <div class="link-card__info-container">
                <RouterLink :to="{ name: 'url', params: { id: url.id } }"
                    ><h3 class="h3">{{ url.title }}</h3></RouterLink
                >

                <a
                    :href="url.url_server + '/' + url.code"
                    class="link link_short"
                    target="_blank"
                    >{{ url.domain }}/{{ url.code }}</a
                >
                <a href="#" class="link long-url" target="_blank">{{
                    $sliceUrl(url.original_url)
                }}</a>
                <span class="date_url">
                    <Icon name="schedule" />
                    {{ $momentFromNow(url.created_at, $i18n.locale) }}</span
                >
            </div>
        </div>
        <div class="link-card__button-container">
            <button
                class="action"
                @click="$copyText(`${url.url_server}/${url.code}`)"
            >
                <Icon name="content_copy" />
            </button>
            <button
                class="action"
                @click="
                    showQr({
                        url: `${url.url_server}/${url.code}`,
                        color: qrcodeStore.color,
                        bgColor: qrcodeStore.bgColor,
                    })
                "
            >
                <Icon name="qr_code_2" />
            </button>
            <button class="action" @click="editUrl(url.id)">
                <Icon name="edit" />
            </button>
            <button
                class="action"
                @click="deleteurl(url.id)"
                v-if="showBtnDelete"
            >
                <Icon name="delete" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { useQrcodeStore } from "@/stores/qrcode";
import { useRouter } from "vue-router";
import { showQr } from "@/helper";

const qrcodeStore = useQrcodeStore();
const router = useRouter();

const emit = defineEmits(["deleteUrl"]);

defineProps({
    url: {
        type: Object,
        required: true,
    },
    showBtnDelete: {
        type: Boolean,
        default: true,
    },
});

const deleteurl = (id) => emit("deleteUrl", id);

const editUrl = (id) => router.push({ name: "editLink", params: { id: id } });
</script>

<style lang="scss" scoped>
@import "./../assets/scss/var";

.box {
    height: 170px;
    background: var(--white);
    border-radius: 12px;
    box-shadow: var(--box-shadow);
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 20px;
    border: var(--border);
    .link-card-icon-information {
        flex: 1;
        //background: blue;
        height: 100%;
        display: flex;
        flex-direction: row;
        gap: 20px;
        .link-card__icon-container {
            width: 22px;
            height: 22px;
            background: transparent;
            transform: translateY(5px);

            //clip-path: circle();
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                pointer-events: none;
            }
        }
        .link-card__info-container {
            flex: 1;
            //background: green;
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 5px;
            .h3 {
                font-size: 18px;
                color: var(--black);
                font-weight: 500;
                line-height: 30px;
                text-transform: capitalize;
            }
            a.link {
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1; /* number of lines to show */
                line-clamp: 1;
                -webkit-box-orient: vertical;
                &.long-url {
                    color: var(--black);
                    font-size: 14px;
                    opacity: 0.7;
                }
                &.link_short {
                    color: var(--main);
                }
            }
            span.date_url {
                font-size: 12px;
                color: var(--black);
                opacity: 0.5;
                margin-top: auto;
                display: flex;
                align-items: center;
                flex-direction: row;
                gap: 8px;
                i {
                    font-size: 16px;
                }
            }
        }
    }
    .link-card__button-container {
        //background: rgb(9, 255, 0);
        height: 26px;
        display: flex;
        gap: 8px;
        button.action {
            width: 24px;
            height: 24px;
            border: none;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: var(--border);
            transition: all 0.1s ease-in-out;
            &:active {
                box-shadow: 0 1px 2pxrgba (0, 0, 0, 0.4) 0;
                transform: translateY(3px);
                i {
                    opacity: 1;
                }
            }
            i {
                font-size: 16px;
                color: var(--black);
                opacity: 0.7;
            }
        }
    }
}

@include for-phone-only {
    .box {
        height: 200px;
        display: flex;
        flex-direction: column;
        padding: 20px 15px;
        .link-card-icon-information
            .link-card__info-container
            a.link.link_short {
            font-size: 14px;
        }
    }
}
</style>
