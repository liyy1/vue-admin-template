<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="headbar headbar-left">
      <div class="bar-item" @click="toggleSideBar">
        <svg-icon :icon-class="sidebar.opened ? 'shousuo' : 'zhankai'"/>
      </div>
    </div>
    <div class="headbar headbar-right">
      <div class="bar-item">
        <el-dropdown style="height: 46px">
          <span class="el-dropdown-link">
            <svg-icon icon-class="ren"/><font>李玉洋</font><i class="el-icon-arrow-down el-icon--right"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item divided>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="bar-item">
        <i class="el-icon-bell"><el-badge is-dot class="item"/></i>
      </div>
      <div class="bar-item">
        <i class="el-icon-share"/>
      </div>
      <div class="bar-item" @click="logout">
        <svg-icon icon-class="exit"/>
      </div>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$font-color1: #606266;
$font-color2: #303133;
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .headbar{
    .bar-item{
      float: left;
      color: $font-color1;
      padding: 0px 5px;
      margin: 0px 10px;
      height: 48px;
      border-top: 2px solid transparent;
      -webkit-transition: all 0.3s;
      cursor:pointer;
      .el-dropdown{
        color: $font-color1;
      }
    }
    .bar-item:hover{
      color: $font-color2;
      border-top: 2px solid #303030;
    }
    font{
      padding-left: 5px;
      font-size: 14px;
    }
  }
  .headbar-left{
    float: left;
    font-size: 18px;
  }
  .headbar-right{
    float: right;
    padding-right: 5px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
}
</style>

