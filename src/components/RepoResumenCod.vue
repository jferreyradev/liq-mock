<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'

const store = useFilterStore()

function useResLiqCod(getId) {
  return useFetch(() => `${store.URL_API}/view/resumenCodLiq?${getId()}`)
}

const { data, error, isPending } = useResLiqCod(() => store.filterString)

const props = defineProps(['fileName'])

const headers = [
  { title: 'Rep', key: 'IDREP', align: 'start' },
  { title: 'Codigo', key: 'CODIGO', align: 'end' },
  { title: 'Subcodigo', key: 'SUBCODIGO', align: 'start' },
  { title: 'Descripción', key: 'DESCRIPCION', align: 'start' },
  { title: 'Cantidad', key: 'CANTIDAD', align: 'end' },
  { title: 'Importe', key: 'IMPORTE', align: 'end' },
  { title: 'Tipo total', key: 'TIPOTOTAL', align: 'end' }
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
      REP : x.IDREP,
      CODIGO: x.CODIGO,
      SUBCODIGO: x.SUBCODIGO,
      DESCRIPCION: x.DESCRIPCION,
      CANTIDAD: x.CANTIDAD,
      IMPORTE: x.IMPORTE,
      TIPOTOTAL: x.TIPOTOTAL
    }
  })

  /* generate worksheet from state */
  const ws = utils.json_to_sheet(map1)
  ws['!cols'] = [{ wch: 10 },{ wch: 10 }, { wch: 10 }, { wch: 25 }, { wch: 10 }, { wch: 20 }, { wch: 10 }]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_ResumenCodLiq.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Resumen de códigos de liquidación" :subtitle="store.liqString">
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
            <td class="text-right">{{ item.IDREP }}</td>
            <td class="text-right ma-0 pa-0">{{ item.CODIGO }}</td>
            <td class="text-right">{{ item.SUBCODIGO }}</td>
            <td class="text-left">{{ item.DESCRIPCION }}</td>
            <td class="text-right">{{ item.CANTIDAD }}</td>
            <td class="text-right">{{ financial(item.IMPORTE) }}</td>
            <td class="text-right">{{ item.TIPOTOTAL }}</td>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
