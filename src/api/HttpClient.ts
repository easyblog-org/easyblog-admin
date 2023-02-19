import HttpRequest from '@/api/HttpRequest'

class Client {
    protected request: HttpRequest

    constructor() {
        this.request = new HttpRequest()
    }
}

export class UserClient extends Client {

    /**
     * 查询用户详情
     * @param params
     */
    details(params: any): Promise<any> {
        return this.request.get('/v1/in/user', params)
    }

    /**
     * 查询角色列表
     * @param params
     */
    list(params: any): Promise<any> {
        return this.request.get('/v1/in/user/list', params)
    }

    /**
     *  创建用户
     * @param params
     */
    create(params: any): Promise<any> {
        return this.request.post('/v1/in/user', params)
    }

    /**
     * 更新用户消息
     * @param code
     * @param params
     */
    update(code: string, params: any): Promise<any> {
        return this.request.put('/v1/in/user/' + code, params)
    }
}

export class RolesClient extends Client {

    /**
     * 查询角色详情
     * @param params
     */
    details(params: any): Promise<any> {
        return this.request.get('/v1/in/roles', params)
    }

    /**
     * 查询角色列表
     * @param params
     */
    list(params: any): Promise<any> {
        return this.request.get('/v1/in/roles/list', params)
    }

    /**
     * 创建角色
     * @param params
     */
    create(params: any): Promise<any> {
        return this.request.post('/v1/in/roles', params)
    }

    /**
     * 更新角色
     * @param code
     * @param params
     */
    update(code: string, params: any): Promise<any> {
        return this.request.put('/v1/in/roles/' + code, params)
    }
}
