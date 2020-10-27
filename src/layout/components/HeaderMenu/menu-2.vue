<template>
  <div class="menu-2">
    <div v-for="item in route.children" :key="item.path" class="item">
      <menu-item :generation="2" :base-path="route.path" :item="item" @selectRoute="selectRoute" />
    </div>
  </div>
</template>

<script>
import menuItem from './menu-item'

export default {
  name: 'Menu2',
  components: {
    menuItem
  },
  props: {
    route: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    selectRoute(item) {
      this.$emit('selectRoute', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-2{
  display: flex;
  justify-content: center;
}
</style>
