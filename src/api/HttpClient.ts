import HttpRequest from '@/api/HttpRequest'
import MxnzpRequest from "@/api/MxnzpRequest";
import OpenApiRequest from "@/api/OpenApiRequest";

class Client {
    protected request: HttpRequest
    protected mxnzpRequest: MxnzpRequest
    protected openApiRequest: OpenApiRequest

    constructor() {
        this.request = new HttpRequest()
        this.mxnzpRequest = new MxnzpRequest()
        this.openApiRequest = new OpenApiRequest()
    }
}

/**
 * 用户管理 相关接口
 */
export class UserClient extends Client {

    /**
     * 查询用户详情
     * @param params
     */
    details(params: any): Promise<any> {
        return this.request.get('/v1/user', params)
    }

    /**
     * 查询角色列表
     * @param params
     */
    list(params: any): Promise<any> {
        return this.request.get('/v1/user/list', params)
    }

    /**
     *  创建用户
     * @param params
     */
    create(params: any): Promise<any> {
        return this.request.post('/v1/user', params)
    }

    /**
     * 更新用户消息
     * @param code
     * @param params
     */
    update(code: string, params: any): Promise<any> {
        return this.request.put('/v1/user/' + code, params)
    }
}

/**
 * 角色管理 相关接口
 */
export class RolesClient extends Client {

    /**
     * 查询角色详情
     * @param params
     */
    details(params: any): Promise<any> {
        return this.request.get('/v1/roles', params)
    }

    /**
     * 查询角色列表（分页）
     * @param params
     */
    list(params: any): Promise<any> {
        return this.request.get('/v1/roles/list', params)
    }

    /**
     * 查询角色列表（有效的全量数据）
     * @param params
     */
    listAll(params: any): Promise<any> {
        return this.request.get('/v1/roles/all', params)
    }

    /**
     * 创建角色
     * @param params
     */
    create(params: any): Promise<any> {
        return this.request.post('/v1/roles', params)
    }

    /**
     * 更新角色
     * @param code
     * @param params
     */
    update(code: string, params: any): Promise<any> {
        return this.request.put('/v1/roles/' + code, params)
    }
}

/**
 * 账户管理 相关接口
 */
export class AccountClient extends Client {

    /**
     * 查询账户详情
     * @param params
     */
    details(params: any): Promise<any> {
        return this.request.get('/v1/account', params)
    }

    /**
     * 查询账户列表
     * @param params
     */
    list(params: any): Promise<any> {
        return this.request.get('/v1/account/list', params)
    }

    /**
     * 创建账户
     * @param params
     */
    create(params: any): Promise<any> {
        return this.request.post('/v1/account', params)
    }

    /**
     * 更新账户信息
     * @param accountId
     * @param params
     */
    update(accountId: string, params: any): Promise<any> {
        return this.request.put('/v1/account/' + accountId, params)
    }

    /**
     * 以账号类型更新账号信息
     * @param userId        用户id
     * @param identityType  账号类型
     * @param identifier    账号
     * @param credential    密码
     */
    updateByIdentityType(userId: number, identityType: number, identifier?: string, credential?: string) {
        return this.request.put('/v1/account/' + userId + '/' + identityType, {
            identifier: identifier,
            credential: credential
        })
    }
}

/**
 * 静态常量Client
 */
export class StaticClient extends Client {
    /**
     * 加载所有账号类型
     */
    getAllIdentityType() {
        return this.request.get('/v1/static/identity_types')
    }

}

export class LoginClient extends Client {

    /**
     * Admin登录
     * @param params
     */
    login(params: any) {
        return this.request.post('/v1/auth/login', params)
    }

    /**
     * Admin退出登录
     * @param params
     */
    logout() {
        return this.request.post('/v1/auth/logout')
    }
}


export class MxnzpClient extends Client {

    /**
     * 获取客户端ip地址
     */
    getIpInfo() {
        return this.mxnzpRequest.get('/api/ip/self?app_id=mabkjelflpmmiouq&app_secret=TzJHYkFDYmxDUXp5N1BrZXR4d2QwZz09')
    }

}

export class OpenApiClient extends Client {

    /**
     * 根据客户端ip地址获取客户端物理地址
     */
    getIpLocation(ip: string) {
        return this.openApiRequest.get('/ip/ipNewV3', {
            ip: ip,
            key: '79618bdd93337d909b3425e083f593c1'
        })
    }

}
