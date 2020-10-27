<template>
  <div class="side-tool">
    ss
  </div>
</template>

<script>
export default {
  name: 'SideTool',
  data() {
    return {}
  },
  created() {
    this.$store.commit('SET_SIDE_TOOL', true)
  },
  beforeCreate() {
    this.$store.commit('SET_SIDE_TOOL', true)
  }
}
</script>

<style scoped>

</style>
