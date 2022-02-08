import { getCookie } from "./storage";

interface RequestOptions {
    method?: "GET" | "POST" | "DELETE" | "PUT",
    data?: {
        [key: string]: string | string[] | File
    }
}
type RequestResponse = {
    type: "error";
    errors: string[];
} | {
    type: "success";
    [key: string]: any;
}

export const API_URL = "http://localhost:8000"
export const CDN_URL = "http://localhost:8000/cdn"

export const request = async (url: string, options?: RequestOptions): Promise<RequestResponse> => {
    let data = options?.data ? new FormData() : undefined
    if (options?.data) Object.keys(options.data).map(key => {
        if (!options?.data) return
        let d = options.data[key]
        if (typeof d === "string" && !d.length) return
        if (Array.isArray(d)) {
            d.map((e, i) => data?.append(`${key}[]`, e))
        } else data?.append(key, d)
    })

    let response = await fetch(`${API_URL}${url}`, {
        method: options?.method ?? "GET",
        body: data,
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    }).then(res => res.json()).catch(() => null)

    if (!response) return {type: "error", errors: ["Unknown error."]}
    return response
}

export const getCdnUrl = (url: string) => `${CDN_URL}/${url.replace(/^\//, "")}`

export const getToken = () => {
    return getCookie("jwt") ?? ""
}