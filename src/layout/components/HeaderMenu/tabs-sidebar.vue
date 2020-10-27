<template>
  <div class="tabs-sidebar">
    <div class="title">
      <span>查看详情</span>
      <div :class="{suspension: type==='suspension'}">
        <el-button type="primary" size="mini" @click="handleBack">返回</el-button>
      </div>
    </div>
    <div class="tab-menu">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="item.meta.title" :name="item.path" v-for="item in formatRoutes" :key="item.path" />
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isExternal } from '@/utils/validate'
import path from 'path'

export default {
  name: 'TabsSidebar',
  computed: {
    formatRoutes() {
      if (this.tabsSidebarRouters && this.tabsSidebarRouters.children) {
        return this.tabsSidebarRouters.children.filter(item => !item.hidden)
      } else {
        return []
      }
    },
    ...mapGetters([
      'tabsSidebarRouters',
      'tabsActiveName',
      'layoutUrl'
    ])
  },
  data() {
    return {
      activeName: '',
      height: 0,
      type: 'top' // top：常规顶部状态  suspension：悬浮页面顶部状态
    }
  },
  watch: {
    tabsActiveName(n) {
      if (n) {
        this.activeName = n
      }
    }
  },
  created() {
    const path = this.$route.fullPath.split('/')
    this.activeName = path[path.length - 1]
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const height = Math.floor(document.documentElement.scrollTop)
      this.height = height
      this.height = height
      if (height >= 92) {
        this.type = 'suspension'
      } else {
        this.type = 'top'
      }
    },
    handleClick(tab, e) {
      const route = this.formatRoutes[tab.index]
      let path = ''
      if (route && route.tabsSidebar && route.path) {
        const steps = route.tabsSidebar.split('/')
        if (steps.length >= 5 && route.children) {
          this.activeName = route.children[0].path

          path = this.resolvePath(route.tabsSidebar, this.activeName)
          if (this.$route.path === path) return
          this.$router.push(path)
        } else {
          this.activeName = route.path

          path = this.resolvePath(route.tabsSidebar, route.path)
          if (this.$route.path === path) return
          console.log(this.$route, this.layoutUrl)
          this.$router.push(path)
        }
      }
    },
    resolvePath(basePath, routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(basePath)) {
        return basePath
      }

      return path.resolve(basePath, routePath)
    },
    handleBack() {
      this.$root.$emit('tabsBack', 'tabsBack')
      //this.$router.back();
    }
  }
}
</script>

<style lang="scss" scoped>
  .tabs-sidebar{
    background-color: #ffffff;
    border: 1px solid #E4E7ED;
    border-bottom: none;
    margin: 15px 15px 0;
    .title{
      display: flex;
      justify-content: space-between;
      padding: 20px 25px 5px;
      span{
        display: inline-block;
        margin: 0;
        font-weight: normal;
        font-size: 26px;
        line-height: 1;
        color: #333;
      }
    }
    .tags{
      display: flex;
      justify-content: space-between;
      padding: 10px 25px;
      .item{
        height: 30px;
        line-height: 30px;
      }
    }
  }

  .suspension{
    position: fixed;
    background: rgba(0,0,0,.2);
    padding: 13px 15px;
    height: 55px;
    right: 0;
    left: 0;
    top: 0;
    display: flex;
    justify-content: flex-end;
    z-index: 99;
  }
</style>
