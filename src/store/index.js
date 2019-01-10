import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    tagsView
  },
  getters: {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    username: state => state.user.username,
    realname: state => state.user.realname,
    phone: state => state.user.phone,
    deptId: state => state.user.deptId,
    roleId: state => state.user.roleId,
    menus: state => state.user.menus
  }
})
