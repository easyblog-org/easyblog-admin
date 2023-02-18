/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const userRouter = [{
    path: '/user',
    component: Layout,
    redirect: '/user/page',
    name: 'user',
    meta: {
        title: '用戶管理',
        icon: 'UserFilled',
    },
    children: [
        {
            path: 'user',
            component: () => import('@/views/user/user/index.vue'),
            name: 'user',
            meta: { title: '用户管理' , icon: 'MenuIcon'}
        },
        {
            path: 'role',
            component: () => import('@/views/user/role/index.vue'),
            name: 'role',
            meta: { title: '角色管理', icon: 'MenuIcon' }
        }
    ]
}]

export default userRouter
