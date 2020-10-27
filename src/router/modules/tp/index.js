import Layout from '@/layout'
import BillRouters from './bill/index'

export default [
  {
    path: '/tp',
    component: Layout,
    redirect: '/tp/bill',
    alwaysShow: true,
    name: 'tp',
    meta: {
      title: '票据',
      icon: 'guide'
    },
    children: [
      BillRouters
    ]
  }
]
