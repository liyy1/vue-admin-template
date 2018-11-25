<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="logo" align="center">
      <img src="@/assets/404_images/404.png" height="30px" width="auto">
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#20222A"
      text-color="#ccc"
      active-text-color="#5fb878"
      unique-opened="true"
      class="left-menu-container"
    >
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
