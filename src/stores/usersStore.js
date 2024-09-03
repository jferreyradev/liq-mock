import { defineStore } from 'pinia'

export const usersStore = defineStore('usersStore', {
    state: () => ({
        users: [],
        isPending: false,
        error: '',
        url: 'https://api-boletas-9jn3t0ca7a3j.deno.dev',
        //url: 'https://api-boletas.deno.dev',
        config:[]
    }),
    getters: {
        getusers: (state) => { return state.users },
        getconfig: (state) => {return state.config}
    },
    actions: {
        getUsers() {
            this.isPending = true
            fetch(`${this.url}/users`)
                .then((res) => res.json())
                .then((_data) => {
                    this.users = _data
                })
                .catch((err) => {
                    console.log(err)
                    this.error = err
                })
                .finally(() => this.isPending = false)
        },
        getConfig(){
            this.isPending = true
            fetch(`${this.url}/config`)
                .then((res) =>
                    res.json()
                )
                .then((_data) => {
                    console.log(_data)
                    this.config = _data[0]
                })
                .catch((err) => {
                    console.log(err)
                    this.error = err
                })
                .finally(() => this.isPending = false)
        },
        async setEstado(idus, estado) {
            this.isPending = true
            this.error = null
            try {
                const bodyIn = {
                    'IdUsuario': idus,
                    'Estado': estado
                }
                const requestOptions = {
                    method: `POST`, // POST, etc
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyIn)
                }
                const res = await fetch(`${this.url}/estadoUsuario`, requestOptions)
                console.log(res)
                this.result = res
            } catch (err) {
                this.error = err
                console.log(err)
            } finally {
                this.isPending = false
            }
        },
        async changePassword(idus, newPass) {
            this.loading = true
            this.error = null
      
            console.log(idus, newPass)
            try {
              const bodyIn = {
                'IdUsuario': idus,
                'Clave': btoa(newPass)
              }
              const requestOptions = {
                method: `POST`, // POST, etc
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyIn)
              }
              await fetch(`${this.url}/claveUsuario`, requestOptions)
              this.result = 'ok'
            } catch (err) {
              this.error = err
              console.log(err)
            } finally {
              this.loading = false
            }
          }
    },
})