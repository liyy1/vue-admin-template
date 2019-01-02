import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    tagsView
  },
  getters: {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews
  }
})
