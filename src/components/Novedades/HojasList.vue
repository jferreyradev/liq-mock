<script setup>
import { hojasList } from './hojas'
import { ref } from 'vue'
import HojaVista from './HojaVista.vue'
import { getName, tipoCarga, tipoHoja, tipoLiq } from '@/utils/tipos'
import { estados } from '@/utils/tipos'
import botonTooltip from './botonTooltip.vue'

const hojasHeaders = [
  { title: 'Id.', key: 'ID' },
  { title: 'Tipo Hoja', key: 'TIPO_HOJA' },
  { title: 'Período', key: 'PERIODO' },
  { title: 'Tipo Carga', key: 'TIPO_CARGA' },
  { title: 'Tipo Liq', key: 'TIPO_LIQ' },
  { title: 'Grupo', key: 'GRUPO' },
  { title: 'Fec. Creac.', key: 'FECHA' },
  { title: 'Estado', key: 'ESTADO' },
  { title: 'Acciones', key: 'ACCIONES' }
]

const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
}

function handleModif(itemid) {
  let item = null
  if (itemid !== 0) item = data.value.find((e) => e.ID == itemid)
  abrirModal(item)
}

function grabar(item) {
  if (item.ID === 0) {
    const groups = data.value.map((item) => item.ID)
    let maxID = Math.max(...groups)
    item.ID = maxID + 1
    data.value.push(item)
  } else {
    const nuevaLista = data.value.map((it) => (item.ID == it.ID ? item : it))
    data.value = nuevaLista
  }
}

const isPending = false
const data = ref(hojasList)
const error = null

const itemMostrar = ref({
  Nro: 0,
  Tipo: 'Sin Tipo'
})

let muestra = ref(false)

function abrirModal(item) {
  itemMostrar.value = item
  muestra.value = true
}

function cierraForm() {
  muestra.value = false
}
</script>

<template>
  <v-container>
    <v-container>
      <v-btn color="primary" prepend-icon="mdi-plus" elevation="3" @click="handleModif(null)"
        >Nueva Hoja</v-btn
      >
    </v-container>
    <div v-if="isPending">loading...</div>
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
            <td class="text-right m-0 p-0">{{ item.ID }}</td>
            <td class="text-left m-0 p-0">{{ getName(tipoHoja, item.TIPO_HOJA) }}</td>
            <td class="text-center m-0 p-0">{{ getVto(item.PERIODO) }}</td>
            <td class="text-center m-0 p-0">{{ getName(tipoCarga, item.TIPO_CARGA) }}</td>
            <td class="text-center m-0 p-0">{{ getName(tipoLiq, item.TIPO_LIQ) }}</td>
            <td class="text-center m-0 p-0">{{ item.GRUPO }}</td>
            <td class="text-center m-0 p-0">{{ item.FECHA }}</td>
            <td class="text-center m-0 p-0">{{ getName(estados, item.ESTADO) }}</td>
            <td class="text-center m-0 p-0">
              <botonTooltip
                :icono="'mdi-pencil'"
                :toolMsg="'Editar'"
                :funcion="handleModif"
                :itemid="item.ID"
              ></botonTooltip>
              <botonTooltip
                :icono="'mdi-delete'"
                :toolMsg="'Eliminar'"
                :funcion="handleModif"
                :itemid="item.ID"
              ></botonTooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <div v-else-if="error">No se puede obtener los datos solicitados.</div>
  </v-container>

  <v-dialog v-model="muestra" max-width="80%" persistent="">
    <hoja-vista :Hoja="itemMostrar" :cerrar="cierraForm" :funcion="grabar"></hoja-vista>
  </v-dialog>
</template>
