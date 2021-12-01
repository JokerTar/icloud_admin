<template>
  <div id="app">
    <router-view  v-if="isRouterAlive" />feature
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
   data(){
    return{
      isRouterAlive:true
    }
  },
  methods: {
    reload (){
       this.isRouterAlive = false
       this.$nextTick(function(){
          this.isRouterAlive = true
       })
    }
  }
}
</script>

<style lang="scss">
  .hidden-header-menu{
    #header-menu{
      display: none;
    }
    .iframe-hidden-el{
      display: none;
    }
    .app-main{
      padding-bottom: 150px;
    }
    .suspension{
      display: none !important;
    }
  }
</style>
