import axios, {AxiosInstance} from "axios";

class OpenApiRequest {
    service: AxiosInstance

    constructor() {
        this.service = axios.create({
            // 默认请求地址，根据环境的不同可在.env 文件中进行修改
            baseURL: '/open-api',
            // 设置接口访问超时时间
            timeout: 50000, // request timeout，
            // 跨域时候允许携带凭证
            withCredentials: true,
        })
    }


    /**
     * 发送Get请求
     * @param {String} url [请求的url地址]
     * @param {Object} params [请求时携带的参数]
     */
    get(url: string, params?: any) {
        return new Promise((resolve, reject) => {
            this.service.get(url, {
                params: params,
            }).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    }

}

export default OpenApiRequest