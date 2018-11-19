<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div style="font-size: 18px">
      <svg-icon icon-class="size"/>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="size==='medium'" command="medium">Medium</el-dropdown-item>
      <el-dropdown-item :disabled="size==='small'" command="small">Small</el-dropdown-item>
      <el-dropdown-item :disabled="size==='mini'" command="mini">Mini</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    size() {
      return this.$store.getters.size
    }
  },
  methods: {
    handleSetSize(size) {
      this.$ELEMENT.size = size
      this.$store.dispatch('setSize', size)
      this.refreshView()
      this.$message({
        message: '调整布局大小成功',
        type: 'success'
      })
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('delAllCachedViews', this.$route)

      const { fullPath } = this.$route
      console.log(fullPath)
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }

}
</script>

