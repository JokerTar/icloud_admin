<template>
  <div v-if="!item.hidden" :class="formatActive" class="menu-item" @click="selectRoute">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(formatBasepath, item.path)">
        <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" />
        {{ onlyOneChild.meta.title }}
      </app-link>
    </template>

    <template v-else>
      <app-link v-if="item && item.meta" :to="resolvePath(basePath, item.path)">
        <item :icon="item.meta&&item.meta.icon" />
        {{ item.meta && item.meta.title }}
      </app-link>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from '../Sidebar/Item'
import AppLink from '../Sidebar/Link'

export default {
  name: 'MenuItem',
  components: {
    Item,
    AppLink
  },
  props: {
    item: {
      type: Object
    },
    basePath: {
      type: String
    },
    generation: {
      type: Number,
      default: 1
    }
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  computed: {
    formatBasepath() {
      if (this.generation === 1) {
        return this.onlyOneChild.path
      } else {
        return this.basePath
      }
    },
    formatActive() {
      let className = ''
      if (this.item.path !== '/' && this.$route.fullPath.includes(this.item.path)) {
        if (this.item.fullPath && this.$route.fullPath.includes(this.item.fullPath)) {
          className = `active-${this.generation}`
        } else if (!this.item.fullPath && this.$route.fullPath.includes(this.item.path)) {
          className = `active-${this.generation}`
        }
      } else if (this.item.redirect === '/dashboard' && this.$route.fullPath === '/dashboard') {
        className = `active-${this.generation}`
      } else {
        className = ` `
      }

      if (this.generation === 2) className = `${className} second-sidebar`
      if (this.generation === 1) className = `${className} first-sidebar`

      return className
    },
    ...mapGetters([
      'permission_routes'
    ])
  },
  watch: {
    // '$route'(n, o) {
    //   console.log(n, this.item)
    // }
  },
  methods: {
    selectRoute() {
      this.$emit('topRoute', this.item)
      if (!this.hasOneShowingChild(this.item.children, this.item)) {
        this.$emit('selectRoute', this.item)
      } else {
        this.$emit('selectRoute', null)
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

      if (this.generation === 2) {
        this.onlyOneChild = parent
        return false
      }

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
    resolvePath(basePath, routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(basePath)) {
        return basePath
      }

      return path.resolve(basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-item{
    display: inline-flex;
    font-size: 14px;
    cursor: pointer;
    &.first-sidebar{
      height: 58px;
      border-bottom: transparent solid 4px;
      .svg-icon{
        font-size: 18px;
        color: #cdd1e0;
      }
    }
    &.active-1 a{
      color: #333;
      border-bottom: #FC923F solid 3px;
      font-weight: bold;
      height: 60px;
      span{
        color: #ffffff;
      }
      .svg-icon{
        color: #FC923F;
      }
    }
    &.second-sidebar{
      color: #666;
    }
    &.active-2 a{
      height: 50px;
      color: #FC923F;
      border-bottom: #FC923F solid 3px;
    }
  }
</style>
