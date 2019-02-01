import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import customer from './modules/customer'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    customer
  },
  getters: {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    username: state => state.user.username,
    realname: state => state.user.realname,
    phone: state => state.user.phone,
    dept: state => state.user.dept,
    role: state => state.user.role,
    menus: state => state.user.menus,
    buttons: state => state.user.buttons
  }
})
