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
  localStorage.removeItem('user')
  store.user.value=''
  router.push('/login')
}

import { ref } from 'vue'

const items = [
  { title: 'Panel', value: '/panel'  },
  { title: 'Reportes', value: '/repo'},
  { title: 'About', value: '/about'}
]

const drawer = ref(false)

</script>

<template>
  <v-container>
    <v-layout>
      <!-- <v-system-bar color="deep-purple darken-3"></v-system-bar> -->
      <v-app-bar color="primary" prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Sistema de liquidación</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-spacer></v-spacer>
        <v-btn icon="mdi-logout" @click="handleLogout"></v-btn>

        <v-btn @click="toggleTheme">Cambiar tema</v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" temporary>
        <v-list :lines="false" density="compact" nav>
          <v-list-item v-for="(item, i) in items" :key="i" :value="item.title" color="primary">
            <RouterLink :to="item.value">{{ item.title }}</RouterLink>
            <template v-slot:prepend>
              <h3>{{ i }}</h3>
            </template>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

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
