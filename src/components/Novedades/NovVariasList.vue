<script setup>
import { ref } from 'vue'
import Confirmacion from './Confirmacion.vue'
import { leerDatos, ejecutarSP } from './llamadaAPI'
import botonTooltip from './botonTooltip.vue'
import { getVto, getFechaDMY, financial } from '@/utils/formatos'
import NovVariasVista from './NovVariasVista.vue'

const props = defineProps(['setHojaEdicion', 'hojaEditar'])

const hojaEditar = props.hojaEditar

// cerrar editar registros de Hoja
function handleCerrarEdicion() {
  props.setHojaEdicion(null)
}

const listaHeaders = [
  { title: 'Acciones', key: '', fixed: true },
  { title: 'Nro Rep.', key: 'IDREP' },
  { title: 'Boleta', key: 'ORDEN' },
  { title: 'Cód.', key: 'CODIGO' },
  { title: 'Subcód.', key: 'SUBCODIGO' },
  { title: 'P1', key: 'PARAM1' },
  { title: 'P2', key: 'PARAM2' },
  { title: 'Vencimiento', key: 'VENCIMIENTO' },
  { title: 'Importe', key: 'IMPORTE' },
  { title: 'Periodo', key: 'PERIODO' },
  { title: 'Fec. Grab.', key: 'FECHAGRABACION' },
  { title: 'Estado Reg.', key: 'ESTADOREGISTRO' }
]

// lectura de registros
let isPending = ref(false)
const data = ref(null)
const error = null

const lecturaListaRegs = ref(true)

async function leerListaRegs() {
  isPending.value = true
  const { datos, operacionOk } = await leerDatos('view/novVarias?HojaId=' + hojaEditar.ID)
  data.value = datos
  lecturaListaRegs.value = operacionOk
  isPending.value = false
}

leerListaRegs()

// alerta de grabación o error
const mostrarAlert = ref(false)
const alertMensaje = ref(null)
const alertTipo = ref(null)

// manejadores de altas, bajas y modificaciones

const itemMostrar = ref({
  HojaId: 0,
  Id: 0
})

function handleModif(itemid) {
  mostrarAlert.value = false
  let item = null
  if (itemid !== 0) item = data.value.find((e) => e.ID == itemid)
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

// funciones de agregado, modificación y eliminación
async function grabarSP(item, id) {
  let url = ''
  console.log(item)
  if (id == 0) {
    url = 'sp/NovVariasIns'
  } else {
    url = 'sp/NovVariasUpd'
  }
  //console.log(url, item)

  const { valorError, valorSalida } = await ejecutarSP(url, item)
  if (valorError == 0) {
    await leerListaRegs()
    alertMensaje.value = 'Se grabó la novedad Nº ' + valorSalida
    alertTipo.value = 'success'
    mostrarAlert.value = true
    return true
  }

  return false
}

async function eliminar(id) {
  muestraConfirmacion.value = false
  let item = {
    vIDNOV: id
  }
  let url = 'sp/NovVariasDel'

  const { valorError } = await ejecutarSP(url, item)
  if (valorError == 0) {
    await leerListaRegs()
    alertMensaje.value = 'Se eliminó la novedad Nº' + id
    alertTipo.value = 'success'
    mostrarAlert.value = true
    return true
  }
  return false
}
// -------------------------------------------------
</script>

<template>
  <v-container>
    <v-row>
      <p>
        <b>Hoja Nro:</b> {{ hojaEditar.ID }} - <b>Tipo:</b> {{ hojaEditar.TIPOHOJADESCRIPCION }}
      </p>
    </v-row>
  </v-container>
  <v-container>
    <v-container>
      <v-btn color="primary" prepend-icon="mdi-plus" elevation="3" @click="handleModif(null)"
        >Nuevo registro</v-btn
      >
      <v-btn color="primary" prepend-icon="mdi-close" elevation="3" @click="handleCerrarEdicion()"
        >Volver</v-btn
      >
    </v-container>
    <div v-if="isPending">loading...</div>
    <div v-else-if="!lecturaListaRegs">Sin datos para mostrar</div>
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
        :headers="listaHeaders"
        fixed-header
      >
        <template v-slot:item="{ item }">
          <tr class="pa-0 ma-0">
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
            <td class="text-right m-0 p-0">{{ item.IDREP }}</td>
            <td class="text-right m-0 p-0">{{ item.ORDEN }}</td>
            <td class="text-right m-0 p-0">{{ item.CODIGO }}</td>
            <td class="text-right m-0 p-0">{{ item.SUBCODIGO }}</td>
            <td class="text-right m-0 p-0">{{ item.PARAM1 }}</td>
            <td class="text-right m-0 p-0">{{ item.PARAM2 }}</td>
            <td class="text-center m-0 p-0">{{ getVto(item.VENCIMIENTO) }}</td>
            <td class="text-center m-0 p-0">{{ financial(item.IMPORTE) }}</td>
            <td class="text-center m-0 p-0">{{ getVto(item.PERIODO) }}</td>
            <td class="text-center m-0 p-0">{{ getFechaDMY(item.FECHAGRABACION) }}</td>
            <td class="text-center m-0 p-0">{{ item.ESTADOREGISTRO }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <div v-else-if="error">No se puede obtener los datos solicitados.</div>
  </v-container>

  <v-dialog v-model="muestraRegistro" max-width="80%" persistent="">
    <NovVariasVista
      :Registro="itemMostrar"
      :cerrar="cierraForm"
      :funcion="grabarSP"
      :hojaId="hojaEditar.ID"
    ></NovVariasVista>
  </v-dialog>

  <v-dialog v-model="muestraConfirmacion" max-width="80%" persistent="">
    <confirmacion
      :titulo="'Eliminar registro'"
      :mensaje="'Seguro que desea eliminar el registro?'"
      :cerrar="cierraConfirmacion"
      :aceptar="eliminar"
      :parametro="itemEliminar"
    ></confirmacion>
  </v-dialog>
</template>
