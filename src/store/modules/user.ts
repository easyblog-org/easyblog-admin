import {defineStore} from 'pinia'
import {loginClient, userClient} from "@/api";
import {ElMessage, ElNotification} from "element-plus";
import {decrypt, encrypt} from "@/utils/crypto";
import ua2obj from 'ua2obj'
import {ErrorCodeType} from "@/api/ErrorCodeType";
import router from "@/routers";

export const useUserStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: 'userState',
    // state: 返回对象的函数
    state: () => ({
        // 登录token
        token: null,
        // 登录用户信息
        userInfo: {},
        // 登录账户信息
        account: {},
        //用户头像
        headImageUrl: '',
        // 角色
        roles: localStorage.roles ? JSON.parse(localStorage.roles) : [],
    }),
    getters: {},
    // 可以同步 也可以异步
    actions: {
        // 登录
        login(loginForm: any) {
            const {username, password} = loginForm
            const userAgentObj = ua2obj();
            return new Promise((resolve, reject) => {
                loginClient.login({
                    email: loginForm.username,
                    password: encrypt(loginForm.password),
                    ip: decrypt(sessionStorage.getItem(encrypt("ip"))),
                    location: decrypt(sessionStorage.getItem(encrypt("location"))),
                    device: userAgentObj.deviceName,
                    operation_system: userAgentObj.osName + ' ' + userAgentObj.osVersion
                }).then((resp) => {
                    console.log(resp)
                    // @ts-ignore
                    if (resp.success) {
                        // @ts-ignore
                        this.token = encrypt(resp.data.token)
                        // @ts-ignore
                        this.initState(resp.data)
                        resolve(resp)
                    } else {
                        // @ts-ignore
                        const errorMsg = ErrorCodeType(resp.code);
                        ElMessage({
                            message: errorMsg,
                            type: 'warning',
                        })
                        reject(resp)
                    }
                })
            })
        },
        // 退出
        logout() {
            return new Promise((resolve, reject) => {
                loginClient.logout().then((resp) => {
                    // @ts-ignore
                    // 未报错 & 服务器返回成功
                    if (resp.success && resp.data) {
                        this.token = null
                        this.userInfo = {}
                        this.roles = []
                        this.account = {}
                        this.headImageUrl = ''
                    }
                    resolve(resp)
                })
            })
        },
        // 刷新数据
        refresh() {
            return new Promise((resolve, reject) => {
                loginClient.refresh({
                    user_id: this.userInfo.id,
                    account_id: this.account.id
                }).then((resp) => {
                    this.initState(resp)
                    // 刷新当前页面，使头像等信息立即生效
                    router.go(0)
                    resolve(resp)
                })
            })
        },
        initState(resp: any) {
            console.log(resp)
            if (undefined === resp || null === resp) resp
            this.userInfo = resp.user
            if (undefined === this.userInfo || null === this.userInfo) return
            this.account = this.userInfo.curr_account
            const headerImg = this.userInfo.user_current_images
            if (undefined !== headerImg && null !== headerImg) {
                this.headImageUrl = headerImg.header_img_url;
            }
        }
    },
    // 进行持久化存储
    persist: {
        // 本地存储的名称
        key: 'userState',
        //保存的位置
        storage: window.localStorage, //localstorage
    },
})
