import moment from "moment";
import { fr, ar } from "@/lang/moment";
import swal from "sweetalert";

export const sliceUrl = function (text) {
    if (text.length > 30) {
        return `${text.slice(0, 32)} ...`;
    }
    return text;
};

export const getDomain = function (urlString) {
    const url = new URL(urlString);
    return url.hostname;
};

export const momentFromNow = (d, l = "en") => {
    moment.updateLocale("ar", ar);
    moment.updateLocale("fr", fr);

    moment.locale(l);

    return moment(d).fromNow();
};

export const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.log(err);
    }
};

export function makeId(length = 16) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    return result;
}

export const downloadlQrCode = async (imageSrc) => {
    const name = `qrcode_${makeId()}.png`;
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const link = document.createElement("a");
    link.classList.add("hidden_img_qr");
    link.href = imageURL;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const showQr = async (data) => {
    const { color, bgColor, url } = data;
    const imageSrc = `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=400x400&format=png&qzone=2&bgcolor=${bgColor}&color=${color}`;
    const res = await swal({
        icon: imageSrc,
        className: "swl_qe",
        buttons: {
            a: {
                text: "download",
                value: true,
                className: "download",
            },
            b: {
                text: "cancel",
                value: false,
                className: "cancel",
            },
        },
        closeOnClickOutside: false,
    });

    if (res) downloadlQrCode(imageSrc);
};

export const useSwalDelete = async (data = {}) => {
    const {
        title = "Are you sure?",
        text = "Do you really want to delete this item?",
        cancelText = "Cancel",
        deleteText = "Delete",
    } = data;

    const resDelete = await swal({
        title,
        text,
        buttons: {
            cancel: {
                text: cancelText,
                value: false,
                visible: true,
            },
            delete: {
                text: deleteText,
                value: true,
            },
        },
    });

    return resDelete;
};

export const getFlag = (name) => {
    switch (name) {
        case "en":
            return `flag:gb-4x3`;
        case "fr":
            return `flag:fr-4x3`;
        case "ar":
            return `flag:ma-4x3`;
        case "es":
            return `flag:es-4x3`;
        case "de":
            return `flag:de-4x3`;
        default:
            return `flag:eu-4x3`;
    }
};

export const getColorBrowser = (browserName) => {
    switch (browserName.toLowerCase()) {
        case "firefox":
            return "#ff7421";
        case "chrome":
            return "#1ba261";

        case "opera":
            return "#f11c30";

        case "safari":
            return "#0076e1";

        case "edge":
            return "#0078d7";
        default:
            return "red";
    }
};

export const calculatePercentage = (total, browsers) => {
    const totalSum = browsers.map((e) => e.total).reduce((a, b) => a + b, 0);
    return Math.floor((total / totalSum) * 100);
};
