<template>
  <div class="drawer-container">
    <div>
      <div class="drawer-item">
        <div class="title">导航模式</div>
        <template>
          <el-radio-group v-model="getSidebarMode" class="set-sidebar-mode" @change="changeSidebar">
            <el-radio :label="'vertical'">
              <svg-icon icon-class="sidemenu" class-name="sidemenu-icon" />
            </el-radio>

            <el-radio :label="'horizontal'">
              <svg-icon icon-class="topmenu" class-name="topmenu-icon" />
            </el-radio>

            <el-radio :label="'topbar'">
              <svg-icon icon-class="topmenu" class-name="topmenu-icon" />
            </el-radio>
          </el-radio-group>
        </template>
      </div>

      <el-divider />

      <div class="drawer-item">
        <span>Sidebar Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import ThemePicker from '@/components/ThemePicker'

export default {
  // components: { ThemePicker },
  data() {
    return {
      mode: ''
    }
  },
  computed: {
    getSidebarMode: {
      get() {
        return this.sidebarMode
      },
      set(v) {
        console.log('setSidebarMode', v)
        this.$store.dispatch('app/setSidebarMode', v)
        if (!this.sidebar.opened) {
          this.$store.dispatch('app/toggleSideBar')
        }
      }
    },
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    },
    ...mapGetters([
      'sidebarMode',
      'sidebar'
    ])
  },
  methods: {
    changeSidebar(v) {
      console.log(v)
    },
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}

.title{
  margin-bottom: 12px;
}
</style>

<style lang="scss">
  .set-sidebar-mode{
    display: flex;
    label{
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .el-radio__label{
      font-size: 38px !important;
    }
  }
</style>
