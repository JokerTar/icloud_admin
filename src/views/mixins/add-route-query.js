import { isPlainObject } from '@/utils'

export default {
  /**
   * 添加路由参数
   * 为关联的编辑和查看页面之间跳转保存参数
   * 编辑和查看页面路由默认在第四级
   * 默认会清空一二三级路由参数
   * **/
  beforeRouteLeave(to, from, next) {
    // 跳转三级路由，一般是列表页 清空参数
    if (to.path.split('/').length && to.path.split('/').length <= 4) {
      next()
    } else if (isPlainObject(to.query) && !isPlainObject(from.query)) {
      let param = ''
      // for (const key in from.query) {
      //   param += `${key}=${from.query[key]}&`
      // }
      const keys = Object.keys(from.query)
      keys.forEach((key, index) => {
        if (typeof from.query[key] === 'undefined') return
        if (keys.length !== (index + 1)) {
          param += `${key}=${from.query[key]}&`
        } else {
          param += `${key}=${from.query[key]}`
        }
      })
      next(`${to.path}?${param}`)
    } else {
      next()
    }
  },
  methods: {
    backToList(path) {
      this.$router.push(path)
    }
  }
}
