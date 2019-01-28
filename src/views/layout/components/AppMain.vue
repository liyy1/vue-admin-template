<template>
  <section id="app-main" class="app-main">
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
    /*50 = navbar height 50px */
    height: calc(100vh - 50px);
    width: 100%;
    overflow-y: auto;
    padding: 15px;
    background-color: #f4f4f5;
  }
</style>
