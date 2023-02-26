import {AccountClient, RolesClient, StaticClient, UserClient} from '@/api/HttpClient'

export let userClient: UserClient = new UserClient()
export let roleClient: RolesClient = new RolesClient()
export let accountClient: AccountClient = new AccountClient()
export let staticClient: StaticClient = new StaticClient()