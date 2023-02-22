import {AccountClient, RolesClient, UserClient} from '@/api/HttpClient'

export let userClient: UserClient = new UserClient()
export let roleClient: RolesClient = new RolesClient()
export let accountClient: AccountClient = new AccountClient()
