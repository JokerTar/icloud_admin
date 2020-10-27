<template>
  <component :is="sidebarMode" />
</template>

<script>
import { mapGetters } from 'vuex'
import horizontal from './horizontal'
import vertical from './vertical'
import Topbar from '../HeaderMenu/index'

export default {
  name: 'Sidebar',
  components: { horizontal, vertical, Topbar },
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'sidebarMode'
    ])
  },
  created() {
  }
}
</script>
