import { login, logout, getUserInfo } from '@/api/system/system'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    username: '',
    realname: '',
    phone: '',
    deptId: '',
    roleId: '',
    menus: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_REALNAME: (state, realname) => {
      state.realname = realname
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_DEPTID: (state, deptId) => {
      state.deptId = deptId
    },
    SET_ROLEID: (state, roleId) => {
      state.roleId = roleId
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    CLEAR_USER: (state) => {
      state.token = ''
      state.username = ''
      state.realname = ''
      state.phone = ''
      state.deptId = ''
      state.roleId = ''
      state.menus = []
    }
  },

  actions: {
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          commit('SET_TOKEN', response.data)
          setToken(response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.data
          commit('SET_USERNAME', data.user.username)
          commit('SET_REALNAME', data.user.realname)
          commit('SET_PHONE', data.user.phone)
          commit('SET_DEPTID', data.user.deptId)
          commit('SET_ROLEID', data.user.roleId)
          commit('SET_MENUS', data.menus)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('CLEAR_USER')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('CLEAR_USER')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
