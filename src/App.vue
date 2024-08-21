<script setup>
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFilterStore } from '@/stores/filterStore.js'

const filterStore = useFilterStore();

// access the `store` variable anywhere in the component ✨
const store = useUserStore()

const theme = useTheme()
const router = useRouter()
const drawer = ref(false)

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

function handleLogout() {
  store.logout()
  //store.user.value=''
  router.push('/login')
}

import { ref } from 'vue'

const items = [
  {
    title: 'Panel de control de liquidaciones',
    value: '/panel'
  },
  { text: 'Reportes', disabled: false, href: '/repo' },
  { text: 'Boletas', disabled: false, href: '/boletas' },
  { text: 'About', disabled: false, href: '/about' }
]

</script>

<template>


  <v-layout class="rounded rounded-md d-flex flex-column mb-6 ">
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon v-if="store.isAuth" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Consultas - Municipalidad de Concepción</v-app-bar-title>
      <v-spacer></v-spacer>
       <v-btn @click="toggleTheme" icon="mdi mdi-theme-light-dark">
        <v-tooltip activator="parent" location="start">Cambiar tema</v-tooltip>
        <v-icon icon="mdi-theme-light-dark"></v-icon>
      </v-btn>
      <v-btn v-show="store.isAuth" class="bg-blue-darken-2" @click="handleLogout">
        <v-tooltip activator="parent" location="start">Salir</v-tooltip>
        <v-icon icon="mdi-logout"></v-icon>
      </v-btn>
     
      <div v-if="store.isAuth">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" prepend-icon="mdi-account" title="User Profile" v-bind="props"></v-btn> 
          </template>

          <v-list>
             <v-list-item title="Salir" @click="handleLogout()" />
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
      <v-list>
        <v-list-item title="Panel de control de liquidaciones" @click="() => router.push('/panel')" />
        <v-list-item title="Reportes" @click="() => router.push('/repo')" />
        <v-list-item title="Boletas" @click="() => router.push('/boletas')" />
        <v-list-item title="Salir" @click="handleLogout()" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <v-row justify="center">
          <RouterView />
        </v-row>
      </v-container>
    </v-main>
    <v-footer>
      <v-row justify="center" no-gutters>
        <v-col class="text-center ma-1" cols="6">
          {{ new Date().getFullYear() }} — <strong>Concepción - Tucumán</strong>
        </v-col>
      </v-row>
    </v-footer>

  </v-layout>

  <!-- 

  <v-container>
    <v-layout>
      <v-app-bar color="primary" prominent>
        <v-toolbar-title>Sistema de consultas de liquidaciones></v-toolbar-title>        
        <v-spacer></v-spacer>
       <div>
            <nav v-if="store.isAuth">
              <RouterLink class="text-body-1" to="/">Home</RouterLink>
              <RouterLink class="text-body-1" to="/panel">Panel</RouterLink>
              <RouterLink class="text-body-1" to="/repo">Reportes</RouterLink>
              <RouterLink class="text-body-1" to="/boletas">Boletas</RouterLink>
            </nav>         
        </div> 
        <v-spacer></v-spacer>
        <span>{{ store.getUser }}</span>
        <v-btn icon="mdi-logout" @click="handleLogout"></v-btn>

        <v-btn @click="toggleTheme">Cambiar tema</v-btn>
      </v-app-bar>
      
      <v-main class="d-flex align-center justify-center" style="min-height: 300px">
        <Suspense>
          <RouterView />
        </Suspense>
      </v-main>
    </v-layout>
  </v-container> -->

</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.header-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  --text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  text-decoration: underline;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
