<script setup>
import HojasList from '@/components/Novedades/HojasList.vue'
import NovHaberesList from '@/components/Novedades/NovHaberesList.vue'
import NovVariasList from '@/components/Novedades/NovVariasList.vue'
import { ref } from 'vue'
const hojaEdicion = ref(null)
const titulo = ref('Hojas')

function setHojaEdicion(hoja) {
  hojaEdicion.value = hoja
  titulo.value = hoja ? 'Editar registros de Hoja: ' + hoja.ID : 'Hojas'
  console.log(hoja.TIPOHOJAID)
}
console.log(hojaEdicion)
</script>

<template>
  <v-container>
    <v-row justify="space-around" class="bg-primary">
      <h3>{{ titulo }}</h3>
    </v-row>

    <v-row>
      <HojasList v-if="hojaEdicion == null" :setHojaEdicion="setHojaEdicion"></HojasList>
      <NovHaberesList
        v-else-if="hojaEdicion.TIPOHOJAID == 1"
        :setHojaEdicion="setHojaEdicion"
        :hojaEditar="hojaEdicion"
      ></NovHaberesList>
      <NovVariasList
        v-else-if="hojaEdicion.TIPOHOJAID == 4"
        :setHojaEdicion="setHojaEdicion"
        :hojaEditar="hojaEdicion"
      ></NovVariasList>
    </v-row>
  </v-container>
</template>
