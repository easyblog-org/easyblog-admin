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
            path: 'dept',
            component: () => import('@/views/system/dept/index.vue'),
            name: 'dept',
            meta: { title: '部门管理' , icon: 'MenuIcon'}
        },
        {
            path: 'menu',
            component: () => import('@/views/system/menu/index.vue'),
            name: 'menu',
            meta: { title: '菜单管理',  icon: 'MenuIcon'}
        },
        {
            path: 'dictionary',
            component: () => import('@/views/system/dictionary/index.vue'),
            name: 'dictionary',
            meta: { title: '字典管理',  icon: 'MenuIcon'}
        },
    ]
}]

export default systemRouter
