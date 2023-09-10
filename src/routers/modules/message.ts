/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const messageRouter = [{
    path: '/message',
    component: Layout,
    redirect: '/message/page',
    name: 'message',
    meta: {
        title: '消息推送',
        icon: 'Message',
    },
    children: [
        {
            path: 'template',
            component: () => import('@/views/message/template/index.vue'),
            name: 'template',
            meta: { title: '模板管理' , icon: 'MessageBox'}
        },
        {
            path: 'config',
            component: () => import('@/views/message/config/index.vue'),
            name: 'config',
            meta: { title: '推送配置' , icon: 'Tools'}
        },
        {
            path: 'record',
            component: () => import('@/views/message/record/index.vue'),
            name: 'record',
            meta: { title: '推送记录', icon: 'Promotion' }
        }
    ]
}]

export default messageRouter
