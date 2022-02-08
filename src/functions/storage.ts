import cookie from "js-cookie";

export const setCookie = (key: string, value: string) => {
    cookie.set(key, value, {
        expires: 365
    })
}

export const setSession = (key: string, value: string) => {
    cookie.set(key, value)
}

export const removeCookie = (key: string) => {
    cookie.remove(key)
}

export const getCookie = (key: string) => {
    return cookie.get(key)
}