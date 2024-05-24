<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'

const store = useFilterStore()

function useResLiqFdo(getId) {
  return useFetch(() => `${store.URL_API}/view/resumenPedidoFdo?${getId()}`)
}

const { data, error, isPending } = useResLiqFdo(() => store.filterString)

const props = defineProps(['title', 'subtitle', 'fileName'])

const headers = [
  { title: 'Descripcion', key: 'DESCRIPCION', align: 'start', sortable: false },
  { title: 'Funcionario', key: 'FUNCIONARIO', align: 'end', sortable: false },
  { title: 'Permanente', key: 'PERMANENTE', align: 'end', sortable: false },
  { title: 'Contratado', key: 'CONTRATADO', align: 'end', sortable: false }
]

function handleDownload() {
  console.log('download')
  exportFile()
}

function financial(x) {
  return Number.parseFloat(x).toFixed(2)
}

function exportFile() {
  const map1 = data.value.map((x) => {
    return {
      DESCRIPCION: x.DESCRIPCION,
      FUNCIONARIO: x.FUNCIONARIO,
      PERMANENTE: x.PERMANENTE,
      CONTRATADO: x.CONTRATADO
    }
  })

  /* generate worksheet from state */
  const ws = utils.json_to_sheet(map1)
  ws['!cols'] = [
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 }
  ]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_ResumenPedidoFDO.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Resumen de liquidación - Fondo" :subtitle="store.liqString">
      <v-btn color="primary" @click="handleDownload" :disabled="!data">Descargar</v-btn>
    </RepoHeader>
    <v-row>
      <div v-if="isPending">loading...</div>
      <v-data-table
        v-else-if="data"
        class="text-caption"
        hover
        density="compact"
        :items="data"
        :headers="headers"
      >
        <template v-slot:item="{ item }">
          <tr class="pa-0 ma-0">
            <td class="text-left">{{ item.DESCRIPCION }}</td>
            <td class="text-right">{{ financial(item.FUNCIONARIO) }}</td>
            <td class="text-right">{{ financial(item.PERMANENTE) }}</td>
            <td class="text-right">{{ financial(item.CONTRATADO) }}</td>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
