// stores/userStore.js o stores/userStore.ts
import { defineStore } from 'pinia'
//import { useApiConfig } from '@/composables/useUrls'
import { useEndPoints } from '@/composables/useEndPoints'

//const { apiBaseDev } = useApiConfig()

const { apiBase, apiBoletas} = useEndPoints()

//const { apiBase, apiBaseDev, apiBoletas, apiBoletasDev } = useApiConfig()

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: null, // Estado inicial del usuario
        pers: null,
        loading: false,
        result: '',
        error: null,
        success: false,
        auth: false,
        allowSign: false,
        rol: null
    }),
    getters: {
        isRegistred: (state) => !!state.user,
        isAuthenticated: (state) => !!state.auth,
        isValid: (state) => !!state.pers,
        userName: (state) => state.user?.name || '',
        checkPassword(state) {
            return (pass) => (atob(state.user?.PASSWORD) || '') === pass
        },
    },
    actions: {
        async login(dni, pass) {
            await this.fetchUser(dni)
            if (this.user) {
                if (atob(this.user?.PASSWORD) === pass) this.auth = true
            }
        },
        async loginUserName(userName, pass) {
            await this.fetchUserName(userName)
            if (this.user) {
                if (atob(this.user?.PASSWORD) === pass) {
                    this.auth = true
                    //await this.fetchRol()
                }
            }
        },
        async verifyRegister(dni, orden) {
            await this.fetchUser(dni)
            if (!this.user) {
                await this.fetchPersCargo(dni)
                if (this.pers?.ORDEN == orden) this.allowSign = true
            }
        },
        async getData(dni) {
            this.fetchUser(dni)
        },
        async fetchUser(dni) {
            this.loading = true
            this.error = null
            this.success = false
            this.user = null
            this.auth = false
            try {
                console.log('try user', dni, `${apiBoletas.value}/user/${dni}`)

                const response = await fetch(`${apiBoletas.value}/user/${dni}`) // Cambia la URL a la de tu API
                if (!response.ok) {
                    throw new Error('Error fetching user')
                }
                const data = await response.json()
                this.user = data[0]
                this.success = true
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },
        async fetchUserName(userName) {
            this.loading = true
            this.error = null
            this.success = false
            this.user = null
            this.auth = false
            try {
                console.log(`${apiBase.value}/api/view/users?UserName=${userName}`)
                const response = await fetch(`${apiBase.value}/api/view/users?UserName=${userName}`) // Cambia la URL a la de tu API
                if (!response.ok) {
                    throw new Error('Error fetching user')
                }
                const data = await response.json()
                this.user = data[0]
                this.success = true
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },
        async fetchUserEmail(email) {
            this.loading = true
            this.error = null
            this.success = false
            this.user = null
            this.auth = false
            try {
                const response = await fetch(`${apiBase.value}/api/view/users?email=${email}`) // Cambia la URL a la de tu API
                if (!response.ok) {
                    throw new Error('Error fetching user')
                }
                const data = await response.json()
                this.user = data[0]
                this.success = true
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },
        async fetchRol() {
            this.loading = true
            this.error = null
            this.success = false
            try {
                console.log(`${apiBase.value}/api/view/frontMenuRol?IdRol=${this.user.ROL}`)
                const response = await fetch(`${apiBase.value}/api/view/frontMenuRol?IdRol=${this.user.ROL}`) // Cambia la URL a la de tu API
                if (!response.ok) {
                    throw new Error('Error fetching user')
                }
                const data = await response.json()
                this.rol = data
                this.success = true
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        setPers(pers) {
            this.pers = pers
            this.success = true
        },
        setUser(user) {
            this.user = user
            this.success = true
        },
        clearUser() {
            this.user = null
            this.success = true
        },
        clearPers() {
            this.pers = null
            this.success = true
        },

        async fetchPers(dni) {
            this.loading = true
            this.error = null
            this.success = false
            this.pers = null
            this.allowSign = false
            try {
                console.log('try pers', dni, `${apiBoletas.value}/persona/${dni}`)

                const response = await fetch(`${apiBoletas.value}/persona/${dni}`)

                if (!response.ok) {
                    throw new Error('Error fetching user')
                }
                const data = await response.json()
                this.pers = data[0]
                this.success = true
                console.log('------ Persona')
                console.log(this.pers)
            } catch (error) {
                this.error = error.message
                console.log(error.message)
            } finally {
                this.loading = false
            }
        },

        async fetchPersCargo(dni) {
            this.loading = true
            this.error = null
            this.success = false
            this.pers = null
            this.allowSign = false
            try {
                console.log('try pers', dni, `${apiBoletas.value}/personacargo/${dni}`)

                const response = await fetch(`${apiBoletas.value}/personacargo/${dni}`)

                if (!response.ok) {
                    throw new Error('Error fetching user')
                }
                const data = await response.json()
                this.pers = data[0]
                this.success = true
                console.log('------ Persona')
                console.log(this.pers)
            } catch (error) {
                this.error = error.message
                console.log(error.message)
            } finally {
                this.loading = false
            }
        },

        async register(bodyIn) {
            this.loading = true
            this.error = null
            bodyIn.Clave = btoa(bodyIn.Clave)
            console.log(bodyIn)
            try {
                const requestOptions = {
                    method: `POST`, // POST, etc
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyIn)
                }
                await fetch(`${apiBoletas.value}/user`, requestOptions)
            } catch (err) {
                this.error = err
                console.log(err)
            } finally {
                this.loading = false
            }
        },

        async changePassword(newPass) {
            this.loading = true
            this.error = null

            console.log(this.user.ID, newPass)
            try {
                const bodyIn = {
                    'IdUsuario': this.user.ID,
                    'Clave': btoa(newPass)
                }
                const requestOptions = {
                    method: `POST`, // POST, etc
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyIn)
                }
                await fetch(`${apiBoletas.value}/claveUsuario`, requestOptions)
                this.result = 'ok'
            } catch (err) {
                this.error = err
                console.log(err)
            } finally {
                this.loading = false
            }
        }
    }
})