<script setup>
import { ref } from 'vue'
import HojaVista from './HojaVista.vue'
import Confirmacion from './Confirmacion.vue'
import { getName, tipoCarga, tipoHoja, tipoLiq } from '@/utils/tipos'
import { estados } from '@/utils/tipos'
import { leerDatos, grabarRegistro, eliminarRegistro } from './llamadaAPI'
import botonTooltip from './botonTooltip.vue'

const hojasHeaders = [
  { title: 'Id.', key: 'ID' },
  { title: 'Tipo Hoja', key: 'TIPOHOJADESCRIPCION' },
  { title: 'Período', key: 'PERIODOID' },
  { title: 'Tipo Carga', key: 'TIPOCARGAID' },
  { title: 'Tipo Liq', key: 'TIPOLIQUIDACIONDESCRIPCION' },
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
    const d = vto.substring(0, 10).split('-')
    return `${d[2]}/${d[1]}/${d[0]}`
  }
  return null
}
function handleModif(itemid) {
  mostrarAlert.value = false
  let item = null
  if (itemid !== 0) item = data.value.find((e) => e.ID == itemid)
  abrirModal(item)
}

function handleEliminar(itemid) {
  mostrarAlert.value = false
  itemEliminar.value = itemid
  muestraConfirmacion.value = true
}

function grabar(item) {
  console.log('solicita grabar')
  console.log(item)
  if (item.Id == 0) {
    grabarRegistro('hoja', item, 'POST')
  } else {
    grabarRegistro('hoja?Id=' + item.ID, item, 'PUT')
  }
  mostrarAlert.value = true
}

function eliminar(id) {
  eliminarRegistro('hoja/' + id, 'DELETE')
}

let isPending = ref(false)
const data = ref(null)
const error = null

const itemMostrar = ref({
  Nro: 0,
  Tipo: 'Sin Tipo'
})

const itemEliminar = ref(0)

let muestra = ref(false)
let muestraConfirmacion = ref(false)

function abrirModal(item) {
  itemMostrar.value = item
  muestra.value = true
}

function cierraForm() {
  muestra.value = false
}

function cierraConfirmacion() {
  muestraConfirmacion.value = false
}

async function leerHojas() {
  isPending.value = true
  data.value = await leerDatos('hoja')
  console.log(data.value)
  isPending.value = false
}

const mostrarAlert = ref(false)
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
      <v-alert
        v-model="mostrarAlert"
        border="start"
        close-label="Close Alert"
        color="success"
        icon="$success"
        closable
      >
        Los datos se grabaron satisfactoriamente
      </v-alert>

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
            <td class="text-left m-0 p-0">{{ item.TIPOHOJADESCRIPCION }}</td>
            <td class="text-center m-0 p-0">{{ getVto(item.PERIODOID) }}</td>
            <td class="text-center m-0 p-0">{{ getName(tipoCarga, item.TIPOCARGAID) }}</td>
            <td class="text-left m-0 p-0">{{ item.TIPOLIQUIDACIONDESCRIPCION }}</td>
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
                :funcion="handleEliminar"
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

  <v-dialog v-model="muestraConfirmacion" max-width="80%" persistent="">
    <confirmacion
      :titulo="'Eliminar hoja'"
      :mensaje="'Seguro que desea eliminar le hoja?'"
      :cerrar="cierraConfirmacion"
      :aceptar="eliminar"
      :parametro="itemEliminar"
    ></confirmacion>
  </v-dialog>
</template>
