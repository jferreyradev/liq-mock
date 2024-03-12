<script setup>
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useUserStore } from '@/stores/user';

const store = useUserStore()
const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
const props = defineProps(['title'])

const router = useRouter()

function handleLogout() {
		store.logout()    
    router('/login')
	}

</script>

<template>
  <v-app-bar color="blue">
    <v-app-bar-title>{{ props.title }}</v-app-bar-title>
    <v-spacer></v-spacer>
    <div>
      <h4>USUARIO</h4>

    </div>
    <div>
      
      <v-btn @click="handleLogout">logout</v-btn>
    </div>
    <v-btn @click="toggleTheme">Cambiar tema</v-btn>
  </v-app-bar>
</template>

<style></style>
