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


