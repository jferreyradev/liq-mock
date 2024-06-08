<script setup>

import { ref } from 'vue'
import HojaVista from './HojaVista.vue'
import { getName, tipoCarga, tipoHoja, tipoLiq } from '@/utils/tipos'
import { estados } from '@/utils/tipos'
import { leerDatos } from './llamadaAPI'
import botonTooltip from './botonTooltip.vue'

const hojasHeaders = [
  { title: 'Id.', key: 'ID' },
  { title: 'Tipo Hoja', key: 'TIPOHOJAID' },
  { title: 'Período', key: 'PERIODOID' },
  { title: 'Tipo Carga', key: 'TIPOCARGAID' },
  { title: 'Tipo Liq', key: 'TIPOLIQUIDACIONID' },
  { title: 'Grupo', key: 'GRUPOADICIONAL' },
  { title: 'Fec. Creac.', key: 'FECHACREACION' },
  { title: 'Estado', key: 'ESTADOHOJAID' },
  { title: 'Acciones', key: 'ACCIONES' }
]

const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
}

const getFechaDMY = (vto) => {
  if (vto) {
    const d = vto.substring(0,10).split('-')
    console.log(d)
    return `${d[2]}/${d[1]}/${d[0]}`
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

let isPending = ref(false)
const data = ref(null)
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


async function leerHojas() {
  isPending.value = true
  data.value = await leerDatos('http://www.serverburru2.duckdns.org:3005/api/hoja')
  isPending.value = false
}

</script>

<template>
  <v-container>
    <v-container>
      <v-btn color="primary" prepend-icon="mdi-plus" elevation="3" @click="handleModif(null)"
        >Nueva Hoja</v-btn
      >
      <v-btn color="primary" prepend-icon="mdi-plus" elevation="3" @click="leerHojas()"
        >Leer hojas</v-btn
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
            <td class="text-left m-0 p-0">{{ getName(tipoHoja, item.TIPOHOJAID) }}</td>
            <td class="text-center m-0 p-0">{{ getVto(item.PERIODOID) }}</td>
            <td class="text-center m-0 p-0">{{ getName(tipoCarga, item.TIPOCARGAID) }}</td>
            <td class="text-center m-0 p-0">{{ getName(tipoLiq, item.TIPOLIQUIDACIONID) }}</td>
            <td class="text-center m-0 p-0">{{ item.GRUPOADICIONAL }}</td>
            <td class="text-center m-0 p-0">{{ getFechaDMY(item.FECHACREACION) }}</td>
            <td class="text-center m-0 p-0">{{ getName(estados, item.ESTADOHOJAID) }}</td>
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
    <div v-else>Sin datos para mostrar</div>
    <div v-if="error">No se puede obtener los datos solicitados.</div>
  </v-container>

  <v-dialog v-model="muestra" max-width="80%" persistent="">
    <hoja-vista :Hoja="itemMostrar" :cerrar="cierraForm" :funcion="grabar"></hoja-vista>
  </v-dialog>
</template>
