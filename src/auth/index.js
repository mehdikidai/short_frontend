export const isNotLogin = (to, from, next) => {
    const isNotAuthenticated = !localStorage.getItem("token");

    console.log(isNotAuthenticated);

    if (isNotAuthenticated) {
        return next();
    }
    return next('/')
};
