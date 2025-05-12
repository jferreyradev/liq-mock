<script setup>
import { ref } from 'vue'
import { getVto, financial } from '@/utils/formatos'
import { leerDatos } from './llamadaAPI'


//import botonTooltip from './botonTooltip.vue'

const props = defineProps(['cerrar', 'cargoId'])
let cargoId = props.cargoId

const listaHeaders = [
  //{ title: '', key: '' },
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

const mostrarAlert = ref(false)

//let mensajeError = ref('')

/*async function grabaRegistro(idCargo) {
  let registroGrabar = {
    vIDCARGO: idCargo,
    vASIGNA: 1
  }

  console.log('se va a grabar el siguiente registro')
  console.log(JSON.stringify(registroGrabar))
  let resultado = await props.funcion(registroGrabar)

  if (resultado === null) {
    props.cerrar()
  } else {
    mensajeError.value = resultado
    mostrarAlert.value = true
  }
}
*/
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
        </div>
        <div v-else-if="error">No se puede obtener los datos solicitados.</div>
      </v-container>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="error" elevation="3" outlined @click="cerrar()">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>
