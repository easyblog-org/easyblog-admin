/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [{
    path: '/system',
    component: Layout,
    redirect: '/system/page',
    name: 'system',
    meta: {
        title: '系统管理',
        icon: 'Setting',
    },
    children: [
        {
            path: 'menu',
            component: () => import('@/views/system/menu/index.vue'),
            name: 'menu',
            meta: { title: '菜单管理',  icon: 'MenuIcon'}
        },
        {
            path: 'phone-area',
            component: () => import('@/views/system/phone-area/index.vue'),
            name: 'phone-area',
            meta: { title: '冠码管理',  icon: 'LocationInformation'}
        },
    ]
}]

export default systemRouter
