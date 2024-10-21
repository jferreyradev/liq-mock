<script setup>
import { ref } from 'vue';
import { leerDatos  } from './llamadaAPI'
import { financial } from '@/utils/formatos'

const props = defineProps(['periodo'])
console.log("periodo", props.periodo)
const d = props.periodo.split('/')
const periodoId = parseInt(d[1]) * 100 + parseInt(d[0])
console.log("PeriodoId", periodoId)


// lectura de registros
let isPending = ref(false)
const data = ref(null)
const error = null
const lecturaListaRegs = ref(true)
const registroDJ = ref(null)

async function leerListaRegs() {
  isPending.value = true
  const { datos, operacionOk } = await leerDatos(
    'djPrevResumenDJ?Id=' + periodoId
  )

  data.value = datos
  lecturaListaRegs.value = operacionOk
  isPending.value = false

  if (data.value !== null) {
    registroDJ.value = data.value[0]
  }
}

leerListaRegs();
</script>

<template>
  <v-container>
    <div v-if="isPending">loading...</div>
    <div v-else-if="!lecturaListaRegs">Sin datos para mostrar</div>
    <div v-else-if="data">
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left text-h6" colspan="2">Name</th>
            <th style="width: 30px;"></th>
            <th class="text-left text-h6" colspan="2">Calories</th>
          </tr>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Calories</th>
            <th></th>
            <th class="text-left">Name</th>
            <th class="text-left">Calories</th>
          </tr>
        </thead>
        <tbody>
            <tr>
            <td>Cant. Agentes</td>
            <td class="text-right">{{ registroDJ.CANTAGENTES }} </td>
            <td></td>
            <td>Cant. Agentes</td>
            <td class="text-right">{{ registroDJ.CANTAGENTES }} </td>
          </tr>
          <tr>
            <td>Haberes C/Aporte</td>
            <td class="text-right">{{ financial(registroDJ.HABCONAPORTE) }}</td>
            <td></td>
            <td>Rem. Total</td>
            <td class="text-right">{{ financial(registroDJ.REMTOTAL) }}</td>
          </tr>
            <tr>
            <td>Remuneración Actual</td>
            <td class="text-right">{{ financial(registroDJ.REMACTUAL)}} </td>
            <td></td>
            <td>Rem SS</td>
            <td class="text-right">{{ financial(registroDJ.REMSS) }}</td>
          </tr>
          <tr>
            <td>Remuneración Atrasada</td>
            <td class="text-right">{{ financial(registroDJ.REMATRASADA) }}</td>
            <td></td>
            <td>Rem 02</td>
            <td class="text-right">{{ financial(registroDJ.REM02) }}</td>
          </tr>
          <tr>
            <td>Remuneración Excedente</td>
            <td class="text-right">{{ financial(registroDJ.REMEXCEDENTE) }}</td>
            <td></td>
            <td>Rem 03</td>
            <td class="text-right">{{ financial(registroDJ.REM03) }}</td>
          </tr>
          <tr>
            <td>Aporte Jub.</td>
            <td class="text-right">{{ financial(registroDJ.APORTEJUBILATORIO) }}</td>
            <td></td>
            <td>Rem 04</td>
            <td class="text-right">{{ financial(registroDJ.REM04) }}</td>
          </tr>
          <tr>
            <td>Patronal Jub.</td>
            <td class="text-right">{{ financial(registroDJ.PATRONALJUBILATORIO) }}</td>
            <td></td>
            <td>Rem 05</td>
            <td class="text-right">{{ financial(registroDJ.REM05) }}</td>
          </tr>
          <tr>
            <td>Fecha de Proceso</td>
            <td class="text-right">{{ financial(registroDJ.FECHARESUMEN) }}</td>
            <td></td>
            <td>Rem 06</td>
            <td class="text-right">{{ financial(registroDJ.REM06) }}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>Rem 07</td>
            <td class="text-right">{{ financial(registroDJ.REM07) }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div v-else-if="error">No se puede obtener los datos solicitados.</div>
  </v-container>
</template>
