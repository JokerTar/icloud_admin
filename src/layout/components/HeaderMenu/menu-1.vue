<template>
  <div class="menu-1">
    <div v-for="route in formatRoutes" :key="route.path" class="item">
      <menu-item :base-path="formatRoutes.path" :item="route" @topRoute="selectRoute" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import menuItem from './menu-item'

export default {
  name: 'Menu1',
  components: {
    menuItem
  },
  data() {
    return {}
  },
  computed: {
    formatRoutes() {
      return this.permission_routes.filter(item => !item.hidden)
    },
    ...mapGetters([
      'permission_routes'
    ])
  },
  methods: {
    selectRoute(item) {
      // this.$emit('selectRoute', item)

      let secondRoute = item

      if (!secondRoute) {
        secondRoute = this.permission_routes.filter(item => {
          return item.path !== '/' && this.$route.path.includes(item.path)
        })[0]
      } else if (item.path === '/') {
        secondRoute = {}
      }

      this.$store.dispatch('permission/addSelectRoute', secondRoute)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-1{
  display: inline-flex;
}
</style>
