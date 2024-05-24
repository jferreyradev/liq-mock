<script setup>
const props = defineProps(['Nro', 'Tipo', 'cerrar'])
</script>

<template>
  <v-container>
    <v-card>
      <h1>Titulo</h1>
      <p v-text="props.Nro"></p>
      <p v-text="props.Tipo"></p>
      <button @click="cerrar()">Cerrar</button>
    </v-card>
  </v-container>
</template>
