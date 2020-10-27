<template>
  <div class="sidebar-horizontal" :class="{'has-logo':showLogo}">
    <div class="left-menu">
      <logo v-if="showLogo" :collapse="isCollapse" />
    </div>
    <el-scrollbar class="sidebar-scrollbar" wrap-class="scrollbar-wrapper">
      <el-menu
        class="horizontal"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="horizontal"
      >
        <sidebar-item v-for="(route) in permissionRoutesLength" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <div class="right-menu">
      <navbar />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import Navbar from '../Navbar'

export default {
  components: { SidebarItem, Logo, Navbar },
  data() {
    return {
      list: []
    }
  },
  computed: {
    permissionRoutesLength() {
      if (this.permission_routes && this.permission_routes.length) {
        let list = []
        let hidden = true
        const MAX = 2

        list = this.permission_routes
          .filter(item => !item.hidden)
          .filter((item, index) => index >= MAX)

        if (list && list.length) {
          hidden = false
        }

        return this.permission_routes
          .filter(item => !item.hidden)
          .filter((item, index) => index < MAX)
          .concat({
            hidden,
            alwaysShow: true,
            iconType: true,
            name: '',
            path: '/err',
            meta: {
              title: '...'
            },
            children: list
          })
      } else {
        return this.permission_routes
      }
    },
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss">
  .sidebar-horizontal{
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    .el-scrollbar{
      height: 100%;
    }

    .scrollbar-wrapper{
      overflow: hidden;
      .el-submenu__title, .el-menu-item{
        height: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        >.svg-icon{
          flex: 0 0 14px;
          height: 64px;
          line-height: 64px;
        }
        >i{
          flex: 0 0 12px;
          height: 64px;
          line-height: 64px;
          position: initial;
        }
        >span{
          height: 64px;
          line-height: 64px;
        }
      }

      .svg-icon, .el-submenu__icon-arrow, .el-icon-arrow-down{
        margin: 0 10px;
      }
    }

    .sidebar-scrollbar{
    }

    .right-menu, .left-menu{
      min-width: 100px;
      height: 100%;
      min-height: 1px;
    }
    .left-menu{
    }
  }
  .horizontal{
    display: flex;
  }

  .el-menu.el-menu--horizontal{
    border: none;
  }
</style>
