<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="headbar headbar-left">
      <div class="bar-item" @click="toggleSideBar">
        <svg-icon :icon-class="sidebar.opened ? 'shousuo' : 'zhankai'"/>
      </div>
      <breadcrumb class="breadcrumb-container"/>
    </div>
    <div class="headbar headbar-right">
      <div class="bar-item">
        <el-dropdown style="height: 46px">
          <span class="el-dropdown-link">
            <svg-icon icon-class="ren"/><font>李玉洋</font>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item divided>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-tooltip content="消息" effect="dark" placement="bottom">
        <div class="bar-item">
          <i class="el-icon-bell"><el-badge is-dot class="item"/></i>
        </div>
      </el-tooltip>
      <el-tooltip content="布局大小" effect="dark" placement="bottom">
        <div class="bar-item">
          <size-select />
        </div>
      </el-tooltip>
      <el-tooltip content="退出" effect="dark" placement="bottom">
        <div class="bar-item" @click="logout">
          <svg-icon icon-class="exit" style="font-size: 18px"/>
        </div>
      </el-tooltip>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import SizeSelect from '@/components/SizeSelect'

export default {
  components: {
    Breadcrumb,
    SizeSelect
  },
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
        location.reload()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $font-color1: #606266;
  $font-color2: #303133;
  .navbar {
    height: 55px;
    font-size: 18px;
    border-radius: 0px !important;
    box-shadow: 0 2px 4px rgba(0,21,41,.08);
    .headbar{
      padding: 0px 10px;
      .breadcrumb-container{
        float: left;
      }
      .bar-item{
        float: left;
        color: $font-color1;
        padding: 0px 8px;
        margin: 0px 8px;
        height: 53px;
        line-height: 53px;
        border-top: 2px solid transparent;
        -webkit-transition: all 0.3s;
        cursor:pointer;
        .el-dropdown{
          color: $font-color1;
        }
      }
      .bar-item:hover{
        color: $font-color2;
        border-top: 2px solid $font-color1;
      }
      font{
        padding-left: 5px;
        font-size: 14px;
      }
    }
    .headbar-left{
      float: left;
    }
    .headbar-right{
      float: right;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
  }
</style>

