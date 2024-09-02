import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    isAuth: false
  }),
  getters: {
    isLoggin: (state) => {
      return state.isAuth
    },
    getUser: (state) => {
      return state.username
    }
  },
  actions: {
    login(user, pass) {
      if (user === 'demo' && pass === 'test') {
        this.isAuth = true
        this.username = user
      }
    },
    logout() {
      this.isAuth = false
    }
  }
})
