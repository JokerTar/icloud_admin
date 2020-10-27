export default {
  path: 'bill',
  fullPath: '/tp/bill',
  component: () => import('@/views/pages/tp/index'),
  redirect: '/tp/bill/info',
  leftSidebar: '/tp/bill',
  name: 'bill',
  meta: {
    title: '票据'
  },
  children: [
    {
      path: 'info',
      fullPath: '/tp/bill/info',
      component: () => import('@/views/pages/tp/bill/info'),
      leftSidebar: '/tp/bill',
      name: 'billInfo',
      meta: {
        title: '票据信息'
      }
    },
    {
      path: 'info-view',
      fullPath: '/tp/bill/info-view',
      hidden: true,
      component: () => import('@/views/pages/tp/index'),
      redirect: '/tp/bill/info-view/index',
      tabsSidebar: '/tp/bill/info-view',
      name: 'info-view',
      meta: {
        title: '票据信息查看'
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/pages/tp/bill/info/view'),
          tabsSidebar: '/tp/bill/info-view',
          name: 'infoViewIndex',
          meta: {
            title: '基本信息'
          }
        }
      ]
    }
  ]
}
