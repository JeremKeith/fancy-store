import axios from "axios";
import { Toast } from "vant";
import store from "../store";
const http = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "" : "https://www.fancystore.cn/api/",
    timeout: 20000 // request timeout
});
// http request 拦截器
http.interceptors.request.use(
    config => {
        config.headers["userId"] = localStorage.getItem("userId");
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// http response 拦截器
http.interceptors.response.use(
    response => {
        console.log("response", response);
        if (response.data.code == -1) {
            store.commit("SET_RESET");
            Toast({
                message: response.data.msg,
                position: "bottom"
            });
        }
        return response;
    },
    error => {
        Toast({
            message: `${error.response.status}:${error.response.data}`,
            position: "bottom"
        });
        console.log("请求出错", error);
        return Promise.reject(error);
    }
);

export default http;
