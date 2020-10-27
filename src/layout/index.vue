<template>
  <component :is="currentRole" />
</template>

<script>
import ManagementLayout from './management-layout'
import WebsiteLayout from './website-layout'

export default {
  name: 'Layout',
  components: {
    ManagementLayout,
    WebsiteLayout
  },
  data() {
    return {
      currentRole: 'WebsiteLayout'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
