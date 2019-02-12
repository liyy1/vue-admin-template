<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view/>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .app-main{
    min-height: calc(100vh - 100px);
    padding-top: 55px;
  }
</style>
