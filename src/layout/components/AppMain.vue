<template>
  <section id="app-main" class="app-main" :class="{'show-side-tool': showSideTool}" >
<!--    <transition name="fade-transform" mode="out-in">-->
<!--      <keep-alive :include="cachedViews">-->
<!--        <router-view :key="key" />-->
<!--      </keep-alive>-->
<!--    </transition>-->
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>

  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    ...mapGetters([
      'showSideTool',
      'isCollapse'
    ])
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #E3E4E9;
  padding: 15px;
  &.show-side-tool{
    padding: 15px 50px 15px 15px;
  }
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
