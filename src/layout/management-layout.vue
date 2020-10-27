<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar />

    <div class="main-container" :class="modecontainer">
      <div :class="{'fixed-header':fixedHeader}">
        <template v-if="sidebarMode === 'vertical'">
          <navbar />
        </template>
        <!--        <tags-view v-if="needTagsView" />-->
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Sidebar } from './components'
import Navbar from './components/Navbar'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ManagementLayout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    RightPanel
  },
  mixins: [ResizeMixin],
  computed: {
    modecontainer() {
      if (this.sidebarMode === 'horizontal') {
        return 'horizontal-container'
      } else if (this.sidebarMode === 'vertical') {
        return 'vertical-container'
      } else {
        return ''
      }
    },
    ...mapGetters([
      'sidebarMode'
    ]),
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      if (this.sidebarMode !== 'vertical') return ''

      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
