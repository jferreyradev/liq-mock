<script setup>
import { ref } from 'vue'
import { getVto, financial } from '@/utils/formatos'
import { leerDatos, ejecutarSP } from './llamadaAPI'
import Confirmacion from './Confirmacion.vue'
import botonTooltip from './botonTooltip.vue'
import CargosConceptosVista from './CargosConceptosVista.vue'

const props = defineProps(['cerrar', 'cargoId'])
let cargoId = props.cargoId

const listaHeaders = [
  { title: '', key: '' },
  { title: 'Código', key: 'CODIGO', align: 'center' },
  { title: 'Sub. Cód.', key: 'SUBCODIGO', align: 'center' },
  { title: 'Param. 1', key: 'PARAMETRO1', align: 'center' },
  { title: 'Param. 2', key: 'PARAMETRO2', align: 'center' },
  { title: 'Vto.', key: 'VENCIMIENTO', align: 'center' },
  { title: 'Importe', key: 'IMPORTE', align: 'center' },
  { title: 'Período', key: 'PERIODO', align: 'center' },
  { title: 'Grupo Adic.', key: 'GRUPOADICIONALID', align: 'center' },
  { title: 'Es Ley', key: 'PENLEY', align: 'center' }
]

// lectura de registros
let isPending = ref(false)
const data = ref(null)
const lecturaListaRegs = ref(true)

async function leerListaRegs() {
  isPending.value = true
  //const { datos, operacionOk } = await leerDatos('view/novAltas?HojaId=' + hojaEditar.ID)
  const { datos, operacionOk } = await leerDatos('en/conceptoLiq?CargoId=' + cargoId)
  data.value = datos
  lecturaListaRegs.value = operacionOk
  isPending.value = false
}

//---------------- formularios modales de abm

// alerta de grabación o error
const mostrarAlert = ref(false)
const alertMensaje = ref(null)
const alertTipo = ref(null)

// manejadores de altas, bajas y modificaciones

const itemMostrar = ref({
  cargoId: 0,
  Id: 0
})

function handleModif(itemid) {
  mostrarAlert.value = false
  let item = null
  if (itemid != null) if (itemid !== 0) item = data.value.find((e) => e.ID == itemid)
  abrirModal(item)
  console.log('Se solicita apertura de modal con item')
  console.log(item)
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

//--------------------------------------------

leerListaRegs()
</script>

<template>
  <v-card>
    <v-card-title>Conceptos del cargo</v-card-title>
    <v-card-subtitle> Visualiza los conceptos a liquidar en el cargo </v-card-subtitle>
    <v-card-text>
      <v-container>
        <div v-if="isPending">loading...</div>
        <div v-else-if="!lecturaListaRegs">Sin datos para mostrar</div>
        <div v-else-if="data">
          <v-alert
            v-model="mostrarAlert"
            border="start"
            close-label="Close Alert"
            color="error"
            icon="$error"
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
                </td>
                <td class="text-right m-0 p-0">{{ item.CODIGO }}</td>
                <td class="text-right m-0 p-0">{{ item.SUBCODIGO }}</td>
                <td class="text-right m-0 p-0">{{ item.PARAMETRO1 }}</td>
                <td class="text-right m-0 p-0">{{ item.PARAMETRO2 }}</td>
                <td class="text-center m-0 p-0">{{ getVto(item.VENCIMIENTO) }}</td>
                <td class="text-right m-0 p-0">{{ financial(item.IMPORTE) }}</td>
                <td class="text-center m-0 p-0">{{ getVto(item.PERIODO) }}</td>
                <td class="text-center m-0 p-0">{{ item.GRUPOADICIONALID }}</td>
                <td class="text-center m-0 p-0">{{ item.PENLEY === 1 ? 'SI' : 'NO' }}</td>
              </tr>
            </template>
          </v-data-table>
          <v-dialog v-model="muestraConfirmacion" max-width="80%" persistent="">
            <confirmacion
              :titulo="'Eliminar registro'"
              :mensaje="'Seguro que desea eliminar el registro?'"
              :cerrar="cierraConfirmacion"
              :aceptar="eliminar"
              :parametro="itemEliminar"
            ></confirmacion>
          </v-dialog>
          <v-dialog v-model="muestraRegistro" max-width="80%" persistent="">
            <CargosConceptosVista
              :Registro="itemMostrar"
              :cerrar="cierraForm"
              :funcion="grabarSP"
              :cargoId="cargoId"
            ></CargosConceptosVista>
          </v-dialog>
        </div>
        <div v-else-if="error">No se puede obtener los datos solicitados.</div>
      </v-container>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="error" elevation="3" outlined @click="cerrar()">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>
