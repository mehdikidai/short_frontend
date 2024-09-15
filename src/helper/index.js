import moment from "moment";
import { fr, ar } from "@/lang/moment";

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

export const downloadlQrCode = async (imageSrc) => {
    const name = `qrcode_${new Date().getTime()}.png`;
    const image = await fetch(imageSrc);
    console.log(image);

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
    const { color, url } = data;
    const imageSrc = `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=400x400&format=png&qzone=1&bgcolor=fff&color=${color}`;
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
