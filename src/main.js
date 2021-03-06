import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import store from './store'
import Cookies from 'js-cookie'

import 'element-ui/lib/theme-chalk/index.css'
import '@riophae/vue-treeselect/dist/vue-treeselect.min.css'
import '@/styles/index.scss' // global css
import '@/components/SvgIcon' // icon
import '@/permission' // permission control
import '@/utils/btnPermission.js' // btn permission control

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
