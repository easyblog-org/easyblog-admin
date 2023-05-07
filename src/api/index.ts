import {
    AccountClient, HeaderImageClient,
    LoginClient, MessagePushRuleClient, MessageTemplateClient,
    MxnzpClient,
    OpenApiClient, PhoneAreaClient,
    RolesClient,
    StaticClient,
    UserClient
} from '@/api/HttpClient'

export let userClient: UserClient = new UserClient()
export let roleClient: RolesClient = new RolesClient()
export let accountClient: AccountClient = new AccountClient()
export let staticClient: StaticClient = new StaticClient()
export let loginClient: LoginClient = new LoginClient()
export let headerClient: HeaderImageClient = new HeaderImageClient()
export let phoneAreaClient: PhoneAreaClient = new PhoneAreaClient()
export let messageTemplateClient: MessageTemplateClient = new MessageTemplateClient()
export let messagePushRuleClient: MessagePushRuleClient = new MessagePushRuleClient()
export let mxnzpClient: MxnzpClient = new MxnzpClient()
export let openApiClient: OpenApiClient = new OpenApiClient()