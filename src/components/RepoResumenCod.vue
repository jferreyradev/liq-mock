<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'
import { financial, agregaTitulosExcel } from '@/utils/reportes.js'
import { computed } from 'vue'

const store = useFilterStore()

function useResLiqCod(getId) {
  console.log(`${store.URL_API}/view/resumenCodLiq?${getId()}`)
  return useFetch(() => `${store.URL_API}/view/resumenCodLiq?${getId()}`)
}

const { data, error, isPending } = useResLiqCod(() => store.filterString)

const totImporte = computed(() => {
  var totImp = 0
  if (data.value) {
    data.value.forEach((x) => {
      totImp += x.IMPORTE
    })
  }
  //totImp = totImp.toFixed(2)
  return { totImp }
})

const props = defineProps(['fileName'])

const headers = [
  { title: 'Rep', key: 'IDREP', align: 'start', sortable: false },
  { title: 'Codigo', key: 'CODIGO', align: 'end', sortable: false },
  { title: 'Subcodigo', key: 'SUBCODIGO', align: 'start', sortable: false },
  { title: 'Descripción', key: 'DESCRIPCION', align: 'start', sortable: false },
  { title: 'Cantidad', key: 'CANTIDAD', align: 'end', sortable: false },
  { title: 'Importe', key: 'IMPORTE', align: 'end', sortable: false },
  { title: 'Tipo total', key: 'TIPOTOTAL', align: 'end', sortable: false }
]

function handleDownload() {
  console.log('download')
  exportFile()
}

function exportFile() {
  const map1 = data.value.map((x) => {
    return [x.IDREP, x.CODIGO, x.SUBCODIGO, x.DESCRIPCION, x.CANTIDAD, x.IMPORTE, x.TIPOTOTAL]
  })

  const titulosTabla = [
    'Rep',
    'Codigo',
    'Subcódigo',
    'Descripción',
    'Cantidad',
    'Importe',
    'TipoTotal'
  ]
  const totalesTabla = [null, null, null, null, null, totImporte.value.totImp, null]
  map1.push(totalesTabla)
  const filtros = store.liqString
  const tituloReporte = 'Resúmen de códigos por liquidación'
  agregaTitulosExcel(map1, tituloReporte, filtros, titulosTabla)
  const ws = utils.aoa_to_sheet(map1)
  ws['!cols'] = [
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 25 },
    { wch: 10 },
    { wch: 20 },
    { wch: 10 }
  ]
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
        <template v-slot:body.append>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th class="text-right">{{ financial(totImporte.totImp) }}</th>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
