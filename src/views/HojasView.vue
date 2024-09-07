<script setup>
import HojasList from '@/components/Novedades/HojasList.vue'
import NovHaberesList from '@/components/Novedades/NovHaberesList.vue'
import NovVariasList from '@/components/Novedades/NovVariasList.vue'
import { ref } from 'vue'
const hojaEdicion = ref(null)
const titulo = ref('Listado de hojas')
const tipoHoja = ref(-1)

function setHojaEdicion(hoja) {
  hojaEdicion.value = hoja
  if (hoja !== null) {
    titulo.value = 'Editar registros de Hoja: ' + hoja.ID
    tipoHoja.value = hoja.TIPOHOJAID
  } else {
    titulo.value = 'Listado de hojas'
    tipoHoja.value = -1
  }
}

let filtroString = null
let filtroCampos = null
let filtros = {
  setFiltrosCampos: (pFiltroString, pFiltroCampos) => {
    filtroString = pFiltroString
    filtroCampos = pFiltroCampos
  },
  getFiltroString: () => filtroString,
  getFiltroCampos: () => filtroCampos
}
</script>

<template>
  <v-container>
    <v-row justify="space-around" class="bg-primary">
      <h3>{{ titulo }}</h3>
    </v-row>

    <v-row>
      <HojasList
        v-if="tipoHoja == -1"
        :setHojaEdicion="setHojaEdicion"
        :filtros="filtros"
      ></HojasList>
      <NovHaberesList
        v-else-if="tipoHoja == 1"
        :setHojaEdicion="setHojaEdicion"
        :hojaEditar="hojaEdicion"
      ></NovHaberesList>
      <NovVariasList
        v-else-if="tipoHoja == 4"
        :setHojaEdicion="setHojaEdicion"
        :hojaEditar="hojaEdicion"
      ></NovVariasList>
    </v-row>
  </v-container>
</template>
