import {RolesClient, UserClient} from '@/api/HttpClient'

export let userClient: UserClient = new UserClient()
export let roleClient: RolesClient = new RolesClient()