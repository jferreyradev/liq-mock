<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
const props = defineProps(['title'])

</script>

<template>
  <v-app-bar color="blue">
    <v-app-bar-title>{{ props.title }}</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn @click="toggleTheme">Cambiar tema</v-btn>
  </v-app-bar>
</template>

<style></style>
