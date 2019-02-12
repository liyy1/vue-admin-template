<template>
  <el-card shadow="never" class="search-box">
    <el-form ref="searchForm" :label-width="labelWidth" label-position="left" size="mini" >
      <slot/>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'SearchBox',
  props: {
    data: {
      type: Object,
      default: null
    },
    labelWidth: {
      type: String,
      default: '100px'
    }
  },
  data() {
    return {
      tags: []
    }
  },
  computed: {
    selected: ''
  }
}
</script>

<style lang="scss">
  .search-box {
    margin-bottom: 15px;
    .el-card__body{
      padding-top: 8px;
      padding-bottom: 10px;
      .el-form-item {
        padding-top: 8px;
        margin-bottom: 8px;
      }
    }
  }
</style>
