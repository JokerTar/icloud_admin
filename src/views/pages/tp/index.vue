<template>
  <div>
    <!-- <router-view /> -->
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'Factoringyout',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>
