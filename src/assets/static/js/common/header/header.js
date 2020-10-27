var commonHead
$(function () {
  commonHead = new Vue({
    el: '#headCommon',
    data: {
      menus: [],
      userInfo: {},
      showChoseDept: false,
      employeeDepts: [],
      checkedDept: {}
    },
    mounted: function () {
      var self = this
      $.post('/rbac/ajax/menu/all').then(function (data) {
        Vue.set(self, 'menus', data)
      })
      $('.user-name').mouseover(function (event) {
        event.stopPropagation()
        $('.user-list').show()
        $(this).addClass('culon')
      })
      $(document).mouseout(function (event) {
        $('.user-list').hide()
        $('.user-name').removeClass('culon')
      })

      $.post('/rbac/ajax/user/current/info', {}).then(function (data) {
        if (data != null) {
          Vue.set(self, 'userInfo', data)
        }
      })
    },
    computed: {
      topMenus: function () {
        if (this.menus != null && this.menus.length > 0) {
          return this.menus.filter(function (menu) {
            return menu.parentCode == 0
          })
        } else {
          return []
        }
      },
      currentMenu: function () {
        var activeMenu = null
        var currentPath = window.location.pathname
        var targetMenu = null
        for (var i = 0; i < this.menus.length; i++) {
          // 地址一致
          if (currentPath == this.menus[i].uri || this.menus[i].uri == currentPath.substring(0, currentPath.lastIndexOf('/'))) {
            targetMenu = this.menus[i]
            break
          }
        }
        activeMenu = this.findTopMenu(targetMenu, this.menus)
        return activeMenu
      },
      topSecndMenus: function () {
        var self = this
        if (this.menus != null && this.menus.length > 0) {
          return self.menus.filter(function (menu) {
            var flag = false
            if (self.currentMenu != null) {
              flag = menu.parentCode == self.currentMenu.resCode
            }
            return flag
          })
        } else {
          return []
        }
      }
    },
    methods: {
      findTopMenu: function (menu, menus) {
        if (menu != null && menu.parentCode == 0) {
          return menu
        }
        var parentMenu = null
        if (menu != null && menu.parentCode != 0) {
          for (var i = 0; i < menus.length; i++) {
            if (menus[i].resCode == menu.parentCode) {
              parentMenu = menus[i]
              break
            }
          }
        }
        if (parentMenu != null) {
          return this.findTopMenu(parentMenu, menus)
        }
      },
      menuClass: function (menu) {
        var css = menu.resourceCss
        if (css == null) css = ''
        if (this.currentMenu != null) {
          if (menu.resCode == this.currentMenu.resCode) {
            css = css + ' state-active'
            Vue.set(menu, 'top', 'true')
          }
        }
        return css
      },
      menuSecndClass: function (menu) {
        var css = menu.resourceCss
        if (css == null) css = ''
        var currentPath = window.location.pathname
        var secndCode = null
        // 查找当前菜单
        for (var i = 0; i < this.menus.length; i++) {
          // 地址一致
          if (currentPath == this.menus[i].uri || this.menus[i].uri == currentPath.substring(0, currentPath.lastIndexOf('/'))) {
            if ((this.menus[i].resCode != menu.id && this.menus[i].parentCode == menu.resCode) || this.menus[i].resCode == menu.resCode) {
              secndCode = menu.resCode
              Vue.set(menu, 'secnd', 'true')
            }
          }
        }
        if (menu.resCode == secndCode) {
          css = css + ' current'
        }
        return css
      },
      choseDept: function () {
        this.showChoseDept = true
        this.checkedDept = {}
        // 查询员工所在部门
        var self = this
        Vue.set(self, 'employeeDepts', self.userInfo.depts)
      },
      closeDept: function () {
        this.showChoseDept = false
      },
      checkDept: function (dept) {
        // 清除所有
        this.checkedDept = dept
      },
      confirmDept: function () {
        var dept = this.checkedDept
        if (dept != null) {
          var employeeCode = dept.employeeCode
          // 保存登录组织
          $.http.$post('/rbac/ajax/user/change/dept', dept).then(function (data) {
            if (data != null) {
              layer.msg('切换成功', { icon: 1 })
              window.location.reload()
            }
          })
        } else {
          layer.msg('请选择部门', { icon: 5 })
        }
      }
    }
  })

  Vue.component('left-menu-a', {
    data: function () {
      return {}
    },
    template: '#left-menu-a-tpl',
    mounted: function () {
    },
    computed: {
      userInfo: function () {
        return commonHead.userInfo
      },
      photoSrc: function () {
        var srcStr = ''
        if (this.userInfo != null && this.userInfo.photoToken != null && this.userInfo.photoToken.length > 0) {
          srcStr = '/down/file?token=' + this.userInfo.photoToken
        } else {
          srcStr = '/images/photo.jpg'
        }
        return srcStr
      },
      leftLoad: function () {
        return commonHead.menus.length > 0
      },
      leftMenus: function () {
        if (commonHead != null && commonHead.menus != null && commonHead.menus.length > 0) {
          var menus = commonHead.menus
          // 筛选出当前选中的二级菜单
          var secndMenu = menus.filter(function (menu) {
            return menu.secnd == 'true'
          })
          return menus.filter(function (menuItem) {
            var flag = false
            if (secndMenu != null && secndMenu.length > 0) {
              flag = menuItem.parentCode == secndMenu[0].resCode
            }
            return flag
          })
        }
      }
    },
    methods: {
      menuClass: function (menu) {
        var css = menu.resourceCss
        if (css == null) css = ''
        var currentPath = window.location.pathname
        if (currentPath == menu.uri) {
          css = css + ' current'
        }
        return css
      },
      clickUser: function () {
        window.location.href = '/manage/setting/user'
      }
    }

  })
  var leftMenu = null
  if (document.getElementById('leftmenu') != null) {
    leftMenu = new Vue({
      el: '#leftmenu'
    })
  }
})
