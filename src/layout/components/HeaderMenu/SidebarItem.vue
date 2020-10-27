<template>
  <div
    @click="handleChange"
    v-if="!item.hidden"
    class="sidebar-item"
    :class="formatActive"
    :style="{width: (item.iconType ? '45px' : '')}" >
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(item.path)">
        <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        <span>{{onlyOneChild.meta.title}}</span>
      </app-link>
    </template>

    <div v-else >
      <app-link v-if="generation === 'second-menu'" :to="resolvePath(item.path)"></app-link>
      <item v-else :icon="item.meta.icon||(item.meta&&item.meta.icon)" :title="item.meta.title" />
    </div>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from '../Sidebar/Item'
import AppLink from '../Sidebar/Link'
import FixiOSBug from '../Sidebar/FixiOSBug'

export default {
  name: 'SidebarItem2',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    index: {
      type: String,
      default: ''
    },
    generation: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  computed: {
    formatActive() {
      let className = ''
      if (this.item.path !== '/' && this.index.includes(this.item.path)) {
        className = `${this.generation}-active `
      } else if (this.index === this.item.redirect || this.index === '' && this.item.redirect === '/dashboard') {
        className = `${this.generation}-active 222`
      } else {
        className = ` `
      }

      if (this.generation === 'second-menu') className = `${className} second-sidebar`
      if (this.generation === 'first-menu') className = `${className} first-sidebar`

      return className
    }
  },
  methods: {
    handleChange() {
      if (this.item.children) {
        if (this.item.children.length === 1) {
          this.$emit('selectedRoute', null)
        } else if (this.item.children.length > 1) {
          this.$emit('selectedRoute', this.item)
        }

        if (this.item.children.length) {
          this.$router.push(this.resolvePath(this.item.children[0].path))
        }
      } else {
        this.$emit('selectedRoute', null)
      }
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }

      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>
  .svg-icon{
    margin-right: 6px;
  }

  .first-sidebar{
    border-bottom: #019fe8 solid 2px;
    font-size: 14px;
    font-weight: normal;
  }
  .second-sidebar{
    border-bottom: #ffffff solid 2px;
    font-size: 14px;
    color: #606266;
  }
  .sidebar-item.first-menu-active{
    color: #FC923F;
    border-bottom: #ffffff solid 4px;
    font-weight: bold;
    span{
      color: #ffffff;
    }
  }

  .sidebar-item.second-menu-active{
    color: #FC923F;
    border-bottom: #FC923F solid 2px;
    a{
      display: block;
    }
  }
</style>
