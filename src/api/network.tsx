export const get = (url: string) => fetch(url, { credentials: "include" });
export const post = (url: string, payload: string | FormData ) => write("POST", url, payload);
export const patch = (url: string, payload: string | FormData ) => write("PATCH", url, payload);
export const put = (url: string, payload: string | FormData ) => write("PUT", url, payload);
export const del = (url: string, payload: string | FormData ) => write("DELETE", url, payload);

const write = (method: string, url: string, payload: string | FormData) => {
    return fetch(url, {
        method: method, 
        body: payload,
        headers: {
            "Content-Type": `${payload instanceof FormData ? "multipart/form-data" : "application/json"}`
        },
        credentials: "include",
    })
}
