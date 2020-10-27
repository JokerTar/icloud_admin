import RestModel from '@/api/restmodel'

class Model extends RestModel{

  /**
   * 获取当前登录人所有资源菜单
   * **/
  menu() {
    return this.fetchList({}, `/admin/user/res/menus`)
  }

  /**
   * 获取当前登录人所有资源菜单
   * **/
  menuBtns(menuCode) {
    return this.fetchList({ menuCode }, `/admin/user/res/menu/btns`)
  }
}

const sysApp = new Model()

export default sysApp
