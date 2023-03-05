import {
    AccountClient,
    LoginClient,
    MxnzpClient,
    OpenApiClient,
    RolesClient,
    StaticClient,
    UserClient
} from '@/api/HttpClient'

export let userClient: UserClient = new UserClient()
export let roleClient: RolesClient = new RolesClient()
export let accountClient: AccountClient = new AccountClient()
export let staticClient: StaticClient = new StaticClient()
export let loginClient: LoginClient = new LoginClient()
export let mxnzpClient: MxnzpClient = new MxnzpClient()
export let openApiClient: OpenApiClient = new OpenApiClient()