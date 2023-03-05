import axios, {AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
import {ElMessage} from 'element-plus'
import {useUserStore} from '@/store/modules/user'
import {HttpConstants} from '@/api/HttpConstans'
import routers from "@/routers";

class HttpRequest {
    service: AxiosInstance

    constructor() {
        this.service = axios.create({
            // 默认请求地址，根据环境的不同可在.env 文件中进行修改
            baseURL: '/api',
            // 设置接口访问超时时间
            timeout: 50000, // request timeout，
            // 跨域时候允许携带凭证
            withCredentials: true,
        })

        //  request interceptor 接口请求拦截
        this.service.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                /**
                 * 用户登录之后获取服务端返回的token,后面每次请求都在请求头中带上token进行JWT校验
                 * token 存储在本地储存中（storage）、vuex、pinia
                 */
                const userStore = useUserStore()
                const token: string = userStore.token
                // 自定义请求头
                if (token) {
                    config.headers['Authorization'] = token
                }
                return config
            },
            (error: AxiosError) => {
                // 请求错误，这里可以用全局提示框进行提示
                return Promise.reject(error)
            },
        )

        //  response interceptor 接口响应拦截
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                // 直接返回res，当然你也可以只返回res.data
                // 系统如果有自定义code也可以在这里处理
                if (response.data.code === 'auth_token_not_found' ||
                    response.data.code === 'auth_expired') {
                    //可能是token过期，清除它
                    const userStore = useUserStore()
                    userStore.token = null;
                    //跳转到登录页面
                    routers.replace({
                        path: '/login'
                    });

                    return Promise.reject(response)
                }
                return Promise.resolve(response)
            },
            (error: AxiosError) => {
                return Promise.reject(error)
            },
        )
    }

    /**
     * @description 显示错误消息
     * opt 传入参数
     * err 错误信息
     * type 消息类型
     * duration 消息持续时间
     */
    showErrMessage(err, type: any = 'error', duration = 3000) {
        if (undefined === err || null === err) {
            return
        }
        ElMessage({
            message: err.data.message,
            type: type,
            duration: duration,
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
                resolve(res.data.data)
            }).catch((err) => {
                this.showErrMessage(err.data.data)
                reject(err.data.data)
            })
        })
    }

    /**
     * 发送POST请求
     * @param {String} url [请求的url地址]
     * @param {Object} params [请求时携带的参数]
     * @param config
     */
    post(url: string,
         params?: any,
         config = {
             headers: {
                 'Content-Type': 'application/json'
             }
         }) {
        return new Promise((resolve, reject) => {
            this.service.post(url, params, config).then((res) => {
                resolve(res.data)
            }).catch((err) => {
                if (undefined !== err && null !== err) {
                    reject(err.data)
                } else {
                    reject(err)
                }
            })
        })
    }

    /**
     * post方法，对应post请求
     * @param {String} url [请求的url地址]
     * @param {Object} params [请求时携带的参数]
     */
    put(url, params) {
        return new Promise((resolve, reject) => {
            this.service.put(url, params)
                .then((res) => {
                    resolve(res.data.data)
                }).catch((err) => {
                reject(err.data.data)
            })
        })
    }

    /**
     * 请求成功
     * @param rc
     * @returns {boolean}
     */
    isSuccess(rc) {
        return HttpConstants.SUCCESS === rc.data.code
    }
}

export default HttpRequest
