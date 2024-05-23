<script setup>
import { hojasList } from './hojas'

const hojasHeaders = [
  { title: 'Id.', key: 'ID' },
  { title: 'Tipo Hoja', key: 'TIPO_HOJA' },
  { title: 'Período', key: 'PERIODO' },
  { title: 'Tipo Carga', key: 'TIPO_CARGA' },
  { title: 'Tipo Liq', key: 'TIPO_LIQ' },
  { title: 'Grupo', key: 'GRUPO' },
  { title: 'Fec. Creac.', key: 'FECHA' },
  { title: 'Estado', key: 'ESTADO' },
  { title: 'Acciones', key: 'ACCIONES' },
]

const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
}

function handleModif(item2) {
  console.log(item2)
}
const isPending = false
const data = hojasList
const error = null
</script>

<template>
  <v-container>
    <div v-if="isPending">loading...</div>

    <v-data-table
      v-else-if="data"
      class="text-caption"
      hover
      density="compact"
      :items="data"
      :headers="hojasHeaders"
    >
      <template v-slot:item="{ item }">
        <tr class="pa-0 ma-0">
          <td class="text-right m-0 p-0">{{ item.ID }}</td>
          <td class="text-left m-0 p-0">{{ item.TIPO_HOJA }}</td>
          <td class="text-center m-0 p-0">{{ getVto(item.PERIODO) }}</td>
          <td class="text-center m-0 p-0">{{ item.TIPO_CARGA }}</td>
          <td class="text-center m-0 p-0">{{ item.TIPO_LIQ }}</td>
          <td class="text-center m-0 p-0">{{ item.GRUPO }}</td>
          <td class="text-center m-0 p-0">{{ getVto(item.FECHA) }}</td>
          <td class="text-center m-0 p-0">{{ item.ESTADO }}</td>
          <td class="text-center m-0 p-0"> <v-btn @click="handleModif(item)">mod</v-btn> </td>
        </tr>
      </template>
    </v-data-table>
    <div v-else-if="error">No se puede obtener los datos solicitados.</div>
  </v-container>
</template>
