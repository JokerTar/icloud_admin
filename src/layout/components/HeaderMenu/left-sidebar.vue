<template>
  <div class="left-sidebar" :class="{'showIcon': isCollapse}">
    <div class="scope" :class="{'anition': isCollapse}" @click="toggleCollapse">
      <div v-show="!isCollapse" class="left-item">
        <img src="../../../assets/photo.jpg">
        <span>{{name}}</span>
      </div>
      <div class="right-item">
        <i v-show="!isCollapse" class="el-icon-s-fold" />
        <i v-show="isCollapse" class="el-icon-s-unfold" />
      </div>
    </div>
    <div v-show="!isCollapse" class="scope list" :class="{'anition': isCollapse}">
      <div
        v-for="item in formatRoutes"
        :key="item.code"
        class="item"
        :class="formatClass(item)"
        @click="handleSelect(item)"
      >
<!--        <app-link :to="resolvePath(item.leftSidebar, item.path)">-->
<!--          <span>{{ item.meta.title }}</span>-->
<!--        </app-link>-->
        <div @click="handleDetail(resolvePath(item.leftSidebar, item.path, item))">
          <span>{{ item.meta.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import { isExternal } from '@/utils/validate'
import AppLink from '../Sidebar/Link'

export default {
  name: 'LeftSidebar',
  components: {
    AppLink
  },
  data() {
    return {
      isCollapse: false,
      selected: {}
    }
  },
  computed: {
    formatRoutes() {
      if (this.leftSidebarRouters && this.leftSidebarRouters.children) {
        return this.leftSidebarRouters.children.filter(item => !item.hidden)
      } else {
        return []
      }
    },
    formatClass() {
      return (item) => {
        if (item.fullPath && this.$route.path === item.fullPath) {
          return 'active'
        } else if (!item.fullPath && this.$route.path.includes(item.path)) {
          return 'active'
        }
      }
    },
    basePath() {
      return this.leftSidebarRouters.path
    },
    ...mapGetters([
      'leftSidebarRouters',
      'name'
    ])
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      this.$store.dispatch('app/toggleCollapse', this.isCollapse)
    },
    handleDetail(path) {
      if (this.$route.path === path) return
      this.$router.push(path)
    },
    handleSelect(item) {
      this.selected = item
    },
    resolvePath(basePath, routePath, item) {
      if (!basePath) return

      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(basePath)) {
        return basePath
      }

      console.log(path.resolve(basePath, routePath))
      return path.resolve(basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>
  .left-sidebar{
    position: absolute;
    left: 0;
    top: 0;
    width: 250px;
    padding: 15px;
    z-index: 99;
    user-select:none;
    &.showIcon{
      width: 68px;
    }
    .scope{
      transition: width .4s;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #ffffff;
      padding: 8px;
      margin-bottom: 16px;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid #d8d8d8;
      .left-item{
        display: flex;
        align-items: center;
        img{
          width: 32px;
          height: 32px;
          margin-right: 4px;
        }
      }
      .right-item{
        height: 32px;
        line-height: 32px;
        font-size: 20px;
        color: #606266;
      }
      &.list{
        display: flex;
        flex-direction: column;
        padding: 0;
        .item{
          width: 100%;
          height: 42px;
          line-height: 42px;
          border-bottom: 1px solid #EBEEF5;
          text-align: left;
          font-size: 14px;
          color: #606266;
          font-weight: normal;
          span{
            margin-left: 20px;
          }
          a{
            display: block;
          }
          &:hover{
            color: #427fed;
          }
          &.active{
            background-color: #eeeeee;
            font-weight: bold;
            border-left: 2px solid #427fed;
          }
        }
      }
    }
  }
</style>
