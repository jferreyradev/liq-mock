<script setup>
import HojasList from '@/components/Novedades/HojasList.vue'
</script>

<template>
  <v-container>
    <v-row justify="space-around" class="bg-primary">
      <h3>Hojas</h3>
    </v-row>

    <v-row>
      <HojasList></HojasList>
    </v-row>
  </v-container>
</template>
