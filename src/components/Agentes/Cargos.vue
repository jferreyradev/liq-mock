<script setup>
import { ref } from 'vue'
//import Confirmacion from './Confirmacion.vue'
import { leerDatos } from './llamadaAPI'
import botonTooltip from './botonTooltip.vue'
import { getFechaDMY } from '@/utils/formatos'

const props = defineProps(['setPersonaEdicion'])

const hojasHeaders = [
  { title: '', key: 'ACCIONES' },
  { title: 'DNI', key: 'DOCUMENTO' },
  { title: 'Apellido', key: 'APELLIDO' },
  { title: 'Nombre', key: 'NOMBRE' },
  { title: 'CUIL', key: 'PERSONACUIL' },
  { title: 'Fec. Ingreso', key: 'FECHAINGRESO' },
  { title: 'Cobra Ley', key: 'COBRALEY' }
]

//function abrirModal(item) {
//itemMostrar.value = item
//muestraRegistro.value = true
//}

//function cierraForm() {
//muestraRegistro.value = false
//}

// llamadas a API de grabación y eliminación

// lectura de registros
let isPending = ref(false)
const data = ref(null)
const error = null

const lecturaRegistros = ref(true)

async function leerRegistros(filtro = null) {
  let url = 'view/personaLista'
  if (filtro !== null) url = url + '?' + filtro

  isPending.value = true
  const { datos, operacionOk } = await leerDatos(url)
  data.value = datos
  lecturaRegistros.value = operacionOk
  isPending.value = false
}

function editarCargaFamiliar(itemid) {
  let item = data.value.find((e) => e.PERSONAID == itemid)
  props.setPersonaEdicion(item, 1)
}

leerRegistros()
</script>

<style>
.sticky {
  position: sticky !important;
  left: 0 !important;
  min-width: 130px !important;
  z-index: 10 !important;
}
</style>

<template>
  <v-container>
    <h1>Agentes</h1>
  </v-container>

  <div v-if="isPending">loading...</div>
  <div v-else-if="!lecturaRegistros">Error al intentar recibir los datos</div>
  <div v-else-if="data">
    <v-data-table
      class="text-caption"
      hover
      density="compact"
      :items="data"
      :headers="hojasHeaders"
    >
      <template v-slot:item="{ item }">
        <tr class="pa-0 ma-0">
          <td class="text-center m-0 p-0 sticky">
            <botonTooltip
              :icono="'mdi-list-box-outline'"
              :toolMsg="'Familiares'"
              :funcion="editarCargaFamiliar"
              :itemid="item.PERSONAID"
            ></botonTooltip>
          </td>

          <td class="text-right m-0 p-0">{{ item.DOCUMENTO }}</td>
          <td class="text-left m-0 p-0">{{ item.APELLIDO }}</td>
          <td class="text-left m-0 p-0">{{ item.NOMBRE }}</td>
          <td class="text-right m-0 p-0">{{ item.PERSONACUIL }}</td>
          <td class="text-left m-0 p-0">{{ getFechaDMY(item.FECHAINGRESO) }}</td>
          <td class="text-center m-0 p-0">{{ item.COBRALEY == 1 ? 'SI' : 'NO' }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
  <div v-else>Sin datos para mostrar</div>
  <div v-if="error">No se puede obtener los datos solicitados.</div>
</template>
