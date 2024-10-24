<script setup>
import { ref } from 'vue'
import HojaVista from './HojaVista.vue'
import Confirmacion from './Confirmacion.vue'
import { getName, tipoCarga } from '@/utils/tipos'
import { estados } from '@/utils/tipos'
import { leerDatos, ejecutarSP } from './llamadaAPI'
import botonTooltip from './botonTooltip.vue'
import { getVto, getFechaDMY } from '@/utils/formatos'
import HojasListFilter from './HojasListFilter.vue'

const props = defineProps(['setHojaEdicion', 'filtros'])

const hojasHeaders = [
  { title: '', key: 'ACCIONES' },
  { title: 'Id.', key: 'ID' },
  { title: 'Tipo Hoja', key: 'TIPOHOJADESCRIPCION' },
  { title: 'Período', key: 'PERIODOID' },
  { title: 'Tipo Carga', key: 'TIPOCARGAID' },
  { title: 'Tipo Liq', key: 'TIPOLIQUIDACIONDESCRIPCION' },
  { title: 'Grupo', key: 'GRUPOADICIONAL' },
  { title: 'Fec. Creac.', key: 'FECHACREACION' },
  { title: 'Estado', key: 'ESTADOHOJAID' }
]

// alerta de grabación o error
const mostrarAlert = ref(false)
const alertMensaje = ref(null)
const alertTipo = ref(null)

// manejadores de búsqueda
//const filtroBusqueda = ref(null)
//const buscar = ref(false)

//function establecerFiltrar(filtro) {
//  filtroBusqueda.value = filtro
//  buscar.value = 1
//}

// manejadores de altas, bajas y modificaciones

const itemMostrar = ref({
  Nro: 0,
  Tipo: 'Sin Tipo'
})

function handleModif(itemid) {
  mostrarAlert.value = false
  let item = null
  if (itemid !== null) item = data.value.find((e) => e.ID == itemid)
  abrirModal(item)
}

const itemEliminar = ref(0)
let muestraConfirmacion = ref(false)

function handleEliminar(itemid) {
  mostrarAlert.value = false
  itemEliminar.value = itemid
  muestraConfirmacion.value = true
}
function cierraConfirmacion() {
  muestraConfirmacion.value = false
}

// apertura y cierre del formulario modal
let muestraRegistro = ref(false)

function abrirModal(item) {
  itemMostrar.value = item
  muestraRegistro.value = true
}

function cierraForm() {
  muestraRegistro.value = false
}

// llamadas a API de grabación y eliminación

async function grabarSP(item, id) {
  let url = ''
  if (id == 0) {
    url = 'sp/HojaIns'
  } else {
    url = 'sp/HojaUpd'
  }
  const { valorError, valorSalida } = await ejecutarSP(url, item)
  if (valorError == 0) {
    await leerHojas()
    alertMensaje.value = 'Se grabó la hoja Nº ' + valorSalida
    alertTipo.value = 'success'
    mostrarAlert.value = true
    return true
  }
  return false
}

async function CambiarEstadoHojaSP(id) {
  let item = {
    vIDHOJANOV: id,
    vIDESTADOHOJA: 7
  }
  let url = 'sp/HojaUpdEstado'

  const { valorError, errorMsg } = await ejecutarSP(url, item)
  if (valorError == 0) {
    await leerHojas()
    alertMensaje.value = 'Se actualizó el estado de la hoja Nº' + id
    alertTipo.value = 'success'
    mostrarAlert.value = true
  } else if (valorError <= 100) {
    alertMensaje.value = errorMsg
    alertTipo.value = 'error'
    mostrarAlert.value = true
  } else {
    console.log(errorMsg)
    alertMensaje.value = 'No se pudieron grabar los datos'
    alertTipo.value = 'error'
    mostrarAlert.value = true
  }
  cierraConfirmacion()
}

// lectura de registros
let isPending = ref(false)
const data = ref(null)
const error = null

const lecturaHojas = ref(true)

async function leerHojas(filtro = null) {
  let url = 'view/hojaNov'
  if (filtro !== null) url = url + '?' + filtro
  isPending.value = true
  const { datos, operacionOk } = await leerDatos(url)
  data.value = datos
  lecturaHojas.value = operacionOk
  isPending.value = false
}

// editar registros de Hoja
function handleEditarRegistros(itemid) {
  let item = data.value.find((e) => e.ID == itemid)
  props.setHojaEdicion(item)
}

if (props.filtros.getFiltroString() != null) leerHojas(props.filtros.getFiltroString())
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
    <v-container>
      <HojasListFilter :filtrar="leerHojas" :filtros="props.filtros"></HojasListFilter>

      <v-btn color="primary" prepend-icon="mdi-plus" elevation="3" @click="handleModif(null)"
        >Nueva Hoja</v-btn
      >
    </v-container>
    <div v-if="isPending">loading...</div>
    <div v-else-if="!lecturaHojas">Error al intentar recibir los datos</div>
    <div v-else-if="data">
      <v-alert
        v-model="mostrarAlert"
        border="start"
        close-label="Close Alert"
        :color="alertTipo"
        :icon="'$' + alertTipo"
        closable
      >
        {{ alertMensaje }}
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
            <td class="text-center m-0 p-0 sticky">
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
              <botonTooltip
                :icono="'mdi-list-box-outline'"
                :toolMsg="'Editar Registros'"
                :funcion="handleEditarRegistros"
                :itemid="item.ID"
              ></botonTooltip>
            </td>

            <td class="text-right m-0 p-0">{{ item.ID }}</td>
            <td class="text-left m-0 p-0">{{ item.TIPOHOJADESCRIPCION }}</td>
            <td class="text-center m-0 p-0">{{ getVto(item.PERIODOID) }}</td>
            <td class="text-center m-0 p-0">{{ getName(tipoCarga, item.TIPOCARGAID) }}</td>
            <td class="text-left m-0 p-0">{{ item.TIPOLIQUIDACIONDESCRIPCION }}</td>
            <td class="text-center m-0 p-0">{{ item.GRUPOADICIONAL }}</td>
            <td class="text-center m-0 p-0">{{ getFechaDMY(item.FECHACREACION) }}</td>
            <td class="text-center m-0 p-0">{{ getName(estados, item.ESTADOHOJAID) }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <div v-else>Sin datos para mostrar</div>
    <div v-if="error">No se puede obtener los datos solicitados.</div>
  </v-container>

  <v-dialog v-model="muestraRegistro" max-width="80%" persistent="">
    <hoja-vista :Hoja="itemMostrar" :cerrar="cierraForm" :funcion="grabarSP"></hoja-vista>
  </v-dialog>

  <v-dialog v-model="muestraConfirmacion" max-width="80%" persistent="">
    <confirmacion
      :titulo="'Anular Hoja'"
      :mensaje="'Seguro que desea anular la hoja?'"
      :cerrar="cierraConfirmacion"
      :aceptar="CambiarEstadoHojaSP"
      :parametro="itemEliminar"
    ></confirmacion>
  </v-dialog>
</template>
