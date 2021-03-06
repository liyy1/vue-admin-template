import $http from '@/utils/request'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    username: '',
    realname: '',
    phone: '',
    dept: '',
    role: '',
    buttons: []
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
    SET_DEPT: (state, dept) => {
      state.dept = dept
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons
    },
    CLEAR_USER: (state) => {
      state.token = ''
      state.username = ''
      state.realname = ''
      state.phone = ''
      state.dept = ''
      state.role = ''
      state.buttons = []
    }
  },

  actions: {
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        $http.post('/login', userInfo).then(response => {
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
        $http.get('/getUserInfo').then(response => {
          const data = response.data
          commit('SET_USERNAME', data.user.username)
          commit('SET_REALNAME', data.user.realname)
          commit('SET_PHONE', data.user.phone)
          commit('SET_DEPT', data.user.dept)
          commit('SET_ROLE', data.user.role)
          commit('SET_BUTTONS', data.buttons)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        $http.post('/logout', state.token).then(() => {
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
