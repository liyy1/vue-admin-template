<template>
  <div class="footer">
    <div class="links">
      <a href="https://pro.ant.design/" target="_blank">Pro 首页</a>
      <a href="https://ant.design/" target="_blank">Ant Design</a>
      <a href="https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/" target="_blank">Vue Antd</a>
    </div>
    <div class="copyright">
      Copyright
      <svg-icon icon-class="at"/>
      2019 <span>山东动脉智能科技股份有限公司</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100px;
    font-size: 13px;
    text-align: center;
    .links {
      margin-bottom: 12px;
      a {
        margin: 0px 20px;
        color: rgba(0, 0, 0, .45);
        &:hover {
          color: rgba(0, 0, 0, .65);
        }
      }
    }
    .copyright {
      color: rgba(0, 0, 0, .45);
    }
  }
</style>
