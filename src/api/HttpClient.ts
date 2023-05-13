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
     * 加载所有账号类型枚举
     */
    getAllIdentityType() {
        return this.request.get('/v1/static/identity_types')
    }

    /**
     * 查询所有大洲枚举
     */
    getAllContinent() {
        return this.request.get('/v1/static/continents')
    }


    /**
     * 查询消息模板类型枚举
     * @param params
     */
    getAllMsgType(): Promise<any> {
        return this.request.get('/v1/static/msg-type')

    }

    /**
     * 查询消息夜间屏蔽类型枚举
     * @param params
     */
    getAllMsgShieldType(): Promise<any> {
        return this.request.get('/v1/static/msg-shield-type')

    }

    /**
     * 查询消息类型
     * @param params
     */
    getAllMsgConfigType(): Promise<any> {
        return this.request.get('/v1/static/msg-config-type')
    }

    /**
     * 查询消息推送渠道
     */
    getAllMsgPushChannel(): Promise<any> {
        return this.request.get('/v1/static/msg-push-channel')
    }

    /**
     * 查询消息取值类型
     */
    getAllMsgTemplateConfigValueType(): Promise<any> {
        return this.request.get('/v1/static/msg-template-value-type')
    }

    /**
     * 加载所有账号类型枚举
     */
    getAllMessagePushStatus(): Promise<any> {
        return this.request.get('/v1/static/msg-push-status')
    }
}

export class LoginClient extends Client {

    /**
     * Admin登录
     * @param params
     */
    login(params: any): Promise<any> {
        return this.request.post('/v1/auth/login', params)
    }

    /**
     * Admin退出登录
     * @param params
     */
    logout(): Promise<any> {
        return this.request.post('/v1/auth/logout')
    }

    /**
     * 刷新登录信息
     */
    refresh(params: any): Promise<any> {
        return this.request.get('/v1/auth/refresh', params)
    }

    /**
     * 修改密码
     * @param params
     */
    modifyPassword(params: any) {
        return this.request.post('/v1/auth/modify-pwd', params)
    }

    /**
     * 查询登录日志
     * @param params
     */
    loginLogs(params: any): Promise<any> {
        return this.request.get('/v1/auth/logs', params)
    }
}

export class HeaderImageClient extends Client {
    /**
     * 保存头像
     * @param params
     */
    save(params: any): Promise<any> {
        return this.request.post('/v1/header-image', params)
    }

    /**
     * 查询头像详情
     * @param params
     */
    details(params: any): Promise<any> {
        return this.request.get('/v1/header-image', params)
    }
}

export class PhoneAreaClient extends Client {
    /**
     * 创建phone area
     * @param params
     */
    create(params: any): Promise<any> {
        return this.request.post('/v1/phone-area', params);
    }

    /**
     * 创建phone area
     * @param phone_area_code
     * @param params
     */
    update(phone_area_code: number, params: any): Promise<any> {
        return this.request.put(`/v1/phone-area/${phone_area_code}`, params);
    }

    /**
     * 查询phone area code map
     * @param params
     */
    queryPhoneAreaCodeMap(params: any): Promise<any> {
        return this.request.get('/v1/phone-area/tree', params)
    }

    /**
     * 删除phone area code
     * @param params
     */
    deleteByIds(params: any): Promise<any> {
        return this.request.delete('/v1/phone-area', params)

    }
}


export class MessageTemplateClient extends Client {
    /**
     * 创建消息模板
     * @param params
     */
    create(params: any): Promise<any> {
        return this.request.post('/v1/template', params);
    }

    /**
     * 更新消息模板
     * @param template_code
     * @param params
     */
    update(template_code: string, params: any): Promise<any> {
        return this.request.put(`/v1/template/${template_code}`, params);
    }

    /**
     * 查询消息模板
     * @param params
     */
    details(params: any): Promise<any> {
        return this.request.get('/v1/template', params)
    }

    /**
     * 查询消息模板列表
     * @param params
     */
    list(params: any): Promise<any> {
        return this.request.get('/v1/template/list', params)

    }
}


export class MessagePushRuleClient extends Client {
    /**
     * 创建消息推送规则
     * @param params
     */
    create(params: any): Promise<any> {
        return this.request.post('/v1/message-rule-config', params);
    }

    /**
     * 更新消息推送规则
     * @param template_code
     * @param params
     */
    update(template_code: string, params: any): Promise<any> {
        return this.request.put(`/v1/message-rule-config/${template_code}`, params);
    }

    /**
     * 查询消息推送规则
     * @param params
     */
    details(params: any): Promise<any> {
        return this.request.get('/v1/message-rule-config', params)
    }

    /**
     * 查询消息推送规则列表
     * @param params
     */
    list(params: any): Promise<any> {
        return this.request.get('/v1/message-rule-config/list', params)

    }

    /**
     * 查询级联列表
     * @param params
     */
    cascader(template_code: string): Promise<any> {
        return this.request.get('/v1/message-rule-config/cascader', {
            "template_code": template_code
        })

    }
}

export class MessagePushRecordClient extends Client {
    /**
     * 创建推送消息
     * @param params
     */
    create(params: any): Promise<any> {
        return this.request.post('/v1/message', params);
    }

    /**
     * 更新推送消息信息
     * @param template_code
     * @param params
     */
    update(id: number, params: any): Promise<any> {
        return this.request.put(`/v1/message/${id}`, params);
    }

    /**
     * 查询推送消息记录详情
     * @param params
     */
    details(params: any): Promise<any> {
        return this.request.get('/v1/message', params)
    }

    /**
     * 查询消息推送记录列表
     * @param params
     */
    list(params: any): Promise<any> {
        return this.request.get('/v1/message/list', params)

    }
}


/**=======================================================================================================
 *  三方接口
 *=======================================================================================================*/
export class MxnzpClient extends Client {

    /**
     * 获取客户端ip地址
     */
    getIpInfo(): Promise<any> {
        return this.mxnzpRequest.get('/api/ip/self?app_id=mabkjelflpmmiouq&app_secret=TzJHYkFDYmxDUXp5N1BrZXR4d2QwZz09')
    }

}

export class OpenApiClient extends Client {

    /**
     * 根据客户端ip地址获取客户端物理地址
     */
    getIpLocation(ip: string): Promise<any> {
        return this.openApiRequest.get('/ip/ipNewV3', {
            ip: ip,
            key: '79618bdd93337d909b3425e083f593c1'
        })
    }

}