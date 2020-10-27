<template>
  <div id="header-menu" class="header-menu" ref="header-menu">
    <!-- path:{{path}} - layoutUrl:{{layoutUrl}} --- {{isShowHeaderMenu}} -->
    <div class="first-menu">
      <div class="left-menu">
        <img src="../../../assets/logo_h.png" alt="" style="height: 40px;">
      </div>

      <menu1 />

      <div class="right-menu" style="width: 190px;">
        <navbar />
      </div>
    </div>
    <div v-if="showMenu" class="second-menu">
      <menu2 :route="secondRoute" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import menu1 from './menu-1'
import menu2 from './menu-2'
import Navbar from '../Navbar'

export default {
  name: 'Headermenu',
  components: {
    menu1,
    menu2,
    Navbar
  },
  data() {
    return {
      showMenu: false,
      path: this.$route.path,
      auditUrl: '/factoring/wf/audit-view/basic-info'
    }
  },
  computed: {
    isShowHeaderMenu() {
      if ((this.layoutUrl === this.auditUrl && this.path === this.auditUrl)) {
        return true
      } else {
        return false
      }
    },
    ...mapGetters([
      'permission_routes',
      'layoutUrl',
      'secondRoute'
    ])
  },
  watch: {
    secondRoute: {
      handler(n) {
        if (n && n.children) {
          this.showMenu = true
        } else {
          this.showMenu = false
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.header-menu{
  display: flex;
  flex-direction: column;
  .first-menu{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #F4F6FC;
    color: #666;
    padding: 0 20px;
    position: relative;
    z-index: 99;
  }

  .second-menu{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    position: relative;
    z-index: 9;
    box-shadow: 0 2px 4px 0 rgba(7, 17, 27, 0.1);
  }
}
</style>

<style lang="scss">
  .first-menu{
    .menu-1{
      height: 60px;
      line-height: 60px;
    }
    .menu-item{
      padding:0 20px;
      a{
        display: block;
        color: #666;
        padding: 0 10px;
      }
    }
  }

  .second-menu{
    .menu-item{
      padding:0 15px;
      color: #606266;
    }
    a{
      color: #666;
    }
  }
</style>
