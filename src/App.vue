<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
import AppLayout from './layouts/AppLayout.vue'
</script>

<template>
  <header>
    <div class="header-bar">
      <!-- <HelloWorld msg="You did it!" /> -->
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/panel">Panel</RouterLink>
        <RouterLink to="/repo">Reportes</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>

  <AppLayout>
    <template v-slot:topbar>
      <AppNavbar title="Liquidación de sueldos" />
      <div class="header-bar">
        <!-- <HelloWorld msg="You did it!" /> -->
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
