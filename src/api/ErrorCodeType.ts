export const ErrorCodeType = function (code: string): string {
    let errMessage: string = "未知错误"
    switch (code) {
        case '400':
            errMessage = '请求失败！请您稍后重试'
            break
        case '401':
            errMessage = '未授权，请重新登录'
            break
        case '403':
            errMessage = '当前账号无权限访问！'
            break
        case '404':
            errMessage = '你所访问的资源不存在！'
            break
        case '405':
            errMessage = '请求方式错误！请您稍后重试'
            break
        case '408':
            errMessage = '请求超时！请您稍后重试'
            break
        case '500':
            errMessage = '服务器端出错'
            break
        case '501':
            errMessage = '网络未实现'
            break
        case '502':
            errMessage = '网络错误'
            break
        case '503':
            errMessage = '服务不可用'
            break
        case '504':
            errMessage = '网络超时'
            break
        case '505':
            errMessage = 'http版本不支持该请求'
            break
        case 'account_not_found':
            errMessage = '账号未注册'
            break
        case 'account_is_pre_active':
            errMessage = '账号未激活'
            break
        case 'account_is_delete':
            errMessage = '账号被删除'
            break
        case 'account_is_freeze':
            errMessage = '账号已被锁定'
            break
        case 'password_valid_failed':
            errMessage = '密码错误'
            break
        case 'no_access_permission':
            errMessage = '没有访问权限'
            break
        case 'remote_invoke_fail':
            errMessage = '远程调用失败'
            break
        case 'auth_expired':
            errMessage = '登录过期'
            break
        case 'auth_token_not_found':
            errMessage = '未登录'
            break
        case 'password_not_change':
            errMessage = '新老密码不能一致'
            break
        case 'phone_area_code_already_exists':
            errMessage = '地区码已经存在'
            break
        case 'delete_operation_not_permission':
            errMessage='无删除操作权限'
            break
        default:
            errMessage = `其他连接错误 --${code}`
    }
    return errMessage
}
