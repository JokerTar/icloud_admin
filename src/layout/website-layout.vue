<template>
  <div class="app-wrap">
    <header-menu />

    <div class="main-container" :class="{'full-main': !formatClass}">
      <left-sidebar v-show="formatClass" />
      <audit-sidebar v-show="isShowAudit" />
      <tabs-sidebar v-show="isShowTabs" />

      <app-main :class="{'showIcon': isCollapse}" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderMenu from './components/HeaderMenu/index'
import LeftSidebar from './components/HeaderMenu/left-sidebar'
import TabsSidebar from './components/HeaderMenu/tabs-sidebar'
import AuditSidebar from './components/HeaderMenu/audit-sidebar'
import AppMain from './components/AppMain'

export default {
  name: 'WebsiteLayout',
  components: {
    HeaderMenu,
    LeftSidebar,
    TabsSidebar,
    AuditSidebar,
    AppMain
  },
  data() {
    return {
    }
  },
  computed: {
    formatClass() {
      if (this.leftSidebarRouters && this.leftSidebarRouters.children) {
        return this.leftSidebarRouters.children.length
      } else {
        return false
      }
    },
    isShowTabs() {
      // 特殊情况 审批流程需要对tabsSideba进行控制
      // 查看审批流程 且 为业务单据 的时候显示
      // 与业务单据 同一级别的不同tabs下隐藏处理
      const fullPath = this.$route.fullPath
      if (fullPath.includes('/factoring/wf/audit-view')) {
        if (this.auditTabs === 'bill') {
          return false
        } else {
          return false
        }
      } else {
        if (this.tabsSidebarRouters && this.tabsSidebarRouters.children) {
          return this.tabsSidebarRouters.children.length
        } else {
          return false
        }
      }
    },
    isShowAudit() {
      if (this.$route.fullPath.includes('/factoring/audit/audit-view') || this.$route.fullPath.includes('/factoring/audit/audit-editor')) {
        return true
      } else {
        return false
      }
    },
    isShowHeaderMenu() {
      /**
       * layoutUrl 工作流所在路由地址
       * iframeUrl 工作流所在页面iframe地址
       * /factoring/wf/audit-view/basic-info 工作流路由地址
       * **/
      const auditUrl = '/factoring/wf/audit-view/basic-info'
      const path = this.$route.path
      if (path === auditUrl && this.layoutUrl === auditUrl) {
        return false
      } else {
        return true
      }
    },
    ...mapGetters([
      'leftSidebarRouters',
      'permission_routes',
      'tabsSidebarRouters',
      'auditSidebarRouters',
      'auditTabs',
      'iframeUrl',
      'layoutUrl',
      'isCollapse'
    ])
  },
  created() {
    console.log(this.$route)
  }
}
</script>

<style lang="scss" scoped>
  .app-wrap{
    position: relative;
    background-color: #E3E4E9;

    .main-container{
      .app-main{
        margin-left: 235px;
        width: inherit;
         &.showIcon{
          margin-left: 53px;
        }
      }
      &.full-main{
        .app-main{
          margin-left: 0;
        }
      }
    }
  }
</style>
