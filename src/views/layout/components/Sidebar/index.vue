<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="logo" align="center">
      <span v-if="isCollapse">项</span>
      <span v-else>Project Manager</span>
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :unique-opened="true"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#20222A"
      text-color="#ccc"
      active-text-color="#5fb878"
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
