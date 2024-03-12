<script setup>
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

// access the `store` variable anywhere in the component ✨
const store = useUserStore()

const theme = useTheme()
const router = useRouter()

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
  { text: 'Panel', disabled: false, href: '/panel' },
  { text: 'Reportes', disabled: false, href: '/repo' },
  { text: 'Boletas',disabled: false, href: '/boletas' },
  { text: 'About',disabled: false, href: '/about' }
]

</script>

<template>
  <v-container>
    <v-layout>
      <!-- <v-system-bar color="deep-purple darken-3"></v-system-bar> -->
      <v-app-bar color="primary" prominent>
        <v-toolbar-title>Sistema de liquidación</v-toolbar-title>
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
  </v-container>
</template>

<!-- 
 <div>
        <AppNavbar title="Liquidación de sueldos" />       
          
      </div>
      <h2>Subtitulo</h2>



      <v-row>
          <header>
            <div class="header-bar">
              <h2>Subtitulo</h2>
              <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/panel">Panel</RouterLink>
                <RouterLink to="/repo">Reportes</RouterLink>
                <RouterLink to="/about">About</RouterLink>
                <RouterLink to="/login">Login</RouterLink>
              </nav>
            </div>
          </header>
        </v-row>

-->

<!--   <AppLayout>
    <template v-slot:topbar>
    
      <div class="header-bar">      
        <AppNavbar></AppNavbar>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/panel">Panel</RouterLink>
        <RouterLink to="/repo">Reportes</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
    </template>
    
    <template v-slot:content>
      <Suspense>
        <RouterView />
        <template v-slot:fallback>
          <p>Content not found. Contact your developer for more info.</p>
        </template>
      </Suspense>
    </template>
  </AppLayout>
 -->

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
