<script setup>
import { ref } from 'vue'
import HojaVista from './HojaVista.vue'
import Confirmacion from './Confirmacion.vue'
import { getName, tipoCarga, tipoHoja, tipoLiq } from '@/utils/tipos'
import { estados } from '@/utils/tipos'
import { leerDatos, grabarRegistro, eliminarRegistro, ejecutarSP } from './llamadaAPI'
import botonTooltip from './botonTooltip.vue'
import { getVto, getFechaDMY } from '@/utils/formatos'
import HojasListFilter from './HojasListFilter.vue'

const props = defineProps(['setHojaEdicion'])

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

// alerta de grabación o error
const mostrarAlert = ref(false)
const alertMensaje = ref(null)
const alertTipo = ref(null)

// manejadores de altas, bajas y modificaciones

const itemMostrar = ref({
  Nro: 0,
  Tipo: 'Sin Tipo'
})

function handleModif(itemid) {
  console.log(itemid)
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
async function grabar(item) {
  let resultado = false
  if (item.Id == 0) {
    resultado = await grabarRegistro('hoja', item, 'POST')
  } else {
    resultado = await grabarRegistro('hoja?Id=' + item.ID, item, 'PUT')
  }
  if (resultado.operacionOk) {
    await leerHojas()
    alertMensaje.value = 'Los datos se grabaron satisfactoriamente'
    alertTipo.value = 'success'
    mostrarAlert.value = true
    return true
  }
  return false
}

async function grabarSP(item) {
  let url = ''
  if (item.Id == 0) {
    url = 'sp/HojaIns'
  } else {
    url = 'sp/HojaIns'
  }
  const { valorError, valorSalida } = await ejecutarSP(url, item)
  console.log(item)
  if (valorError == 0) {
    await leerHojas()
    alertMensaje.value = 'Se grabó la hoja Nº ' + valorSalida
    alertTipo.value = 'success'
    mostrarAlert.value = true
    return true
  }
  return false
}

async function eliminar(id) {
  const resultado = await eliminarRegistro('hoja/' + id, 'DELETE')
  if (resultado.operacionOk) {
    await leerHojas()
    alertMensaje.value = 'Los datos se grabaron satisfactoriamente'
    alertTipo.value = 'success'
    mostrarAlert.value = true
  } else {
    alertMensaje.value = 'No se pudo eliminar el registro'
    alertTipo.value = 'error'
    mostrarAlert.value = true
  }
  muestraConfirmacion.value = false
}

// lectura de registros
let isPending = ref(false)
const data = ref(null)
const error = null

const lecturaHojas = ref(true)

async function leerHojas(filtro = null) {
  let url = 'hoja'
  if (filtro !== null) url = url + '?' + filtro
  console.log(url)
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

///////////////////////////
//  AGREGADO PARA PROBAR USO DE SP

async function agregarNovVarias() {
  let url = 'sp/NovVariasIns2'
  const registro = {
    vIDREP: 555,
    vORDEN: 999,
    vCOD: 123,
    vSUBCOD: 321,
    vP1: 0,
    vP2: 30,
    vVTO: '2024-09-30',
    vIMP: 555.33,
    vIDHOJANOV: 270,
    vPERIODO: '2024-08-01'
  }
  const { valorError, valorSalida } = await ejecutarSP(url, registro)
  console.log('El valor de error es: ' + valorError)
  console.log('El valor de salida es: ' + valorSalida)
}

//// FIN DE PRUEBA DE SP
</script>

<template>
  <v-container>
    <v-container>
      <HojasListFilter :filtrar="leerHojas"></HojasListFilter>

      <v-btn color="primary" prepend-icon="mdi-plus" elevation="3" @click="handleModif(null)"
        >Nueva Hoja</v-btn
      >
      <v-btn color="primary" prepend-icon="mdi-plus" elevation="3" @click="agregarNovVarias()"
        >Nueva Nov Varia</v-btn
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
              <botonTooltip
                :icono="'mdi-list-box-outline'"
                :toolMsg="'Editar Registros'"
                :funcion="handleEditarRegistros"
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

  <v-dialog v-model="muestraRegistro" max-width="80%" persistent="">
    <hoja-vista :Hoja="itemMostrar" :cerrar="cierraForm" :funcion="grabarSP"></hoja-vista>
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
