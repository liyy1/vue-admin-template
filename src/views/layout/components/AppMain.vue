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
    height: 100%;
    padding-top: 55px;
  }
</style>
