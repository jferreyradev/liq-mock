//import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
  theme: {
    defaultTheme: 'light'
  }
})

//createApp(App).use(vuetify).mount('#app')

import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
