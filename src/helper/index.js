import axios from "axios";
import moment from "moment";

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

export const momentFromNow = (d) => {
    return moment(d).fromNow();
};

export const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.log(err);
    }
};

export const downloadlQrCode = async (qr) => {
    
    const name = `qrcode_${new Date().getTime()}.png`;

    const imageSrc = `http://api.qrserver.com/v1/create-qr-code/?data=${qr}&size=400x400&format=png&qzone=1&bgcolor=fff`;
    const image = await fetch(imageSrc);
    console.log(image);

    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const link = document.createElement("a");
    link.classList.add('hidden_img_qr')
    link.href = imageURL;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
