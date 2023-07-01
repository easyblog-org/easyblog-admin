/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const articleRouter = [{
    path: '/article',
    component: Layout,
    redirect: '/article/page',
    name: 'article',
    meta: {
        title: '创作管理',
        icon: 'EditPen',
    },
    children: [
        {
            path: 'article',
            component: () => import('@/views/article/article/index.vue'),
            name: 'article',
            meta: { title: '文章管理' , icon: 'Document'}
        },
        {
            path: 'category',
            component: () => import('@/views/article/category/index.vue'),
            name: 'category',
            meta: { title: '文章分类' , icon: 'Collection'}
        }
    ]
}]

export default articleRouter
