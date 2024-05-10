<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'
import {financial, agregaTitulosExcel} from '@/utils/reportes.js'

const store = useFilterStore()

function useResLiqCod(getId) {
  return useFetch(() => `${store.URL_API}/view/aportesPat?${getId()}`)
}

const { data, error, isPending } = useResLiqCod(() => store.filterString)

const props = defineProps(['title', 'subtitle', 'fileName'])

const headers = [
  {
    title: 'REP',
    align: 'start',
    sortable: false,
    key: 'IDREP'
  },
  {
    title: 'ORDEN',
    align: 'start',
    sortable: false,
    key: 'ORDEN'
  },
  {
    title: 'Documento',
    align: 'start',
    sortable: false,
    key: 'DOCUMENTO'
  },
  { title: 'Apellido y nombre', key: 'APENOM', sortable: false },
  { title: 'Pat. Jub.', key: 'PATJUB', sortable: false },
  { title: 'Pat. OS', key: 'PATOS', sortable: false },
  { title: 'Pat. ART', key: 'PATART', sortable: false }
]


function handleDownload() {
  console.log('download')
  exportFile()
}

function exportFile() {
  const map1 = data.value.map((x) => [
    x.IDREP,
    x.ORDEN,
    x.DOCUMENTO,
    x.APENOM,
    x.PATJUB,
    x.PATOS,
    x.PATART
  ])
  const titulosTabla = [
    'Rep',
    'Orden',
    'Documento',
    'Apellido y Nombre',
    'Pat. Jub',
    'Pat. OS',
    'Pat. ART'
  ]
  const filtros = store.liqString
  const tituloReporte = 'Aportes Patronales'
  agregaTitulosExcel(map1,tituloReporte, filtros, titulosTabla) 
  const ws = utils.aoa_to_sheet(map1)
  
  ws['!cols'] = [
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
    { wch: 35 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ]

  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_ResumenPatJub.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Resumen de Aportes Patromales" :subtitle="store.liqString">
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
            <td class="text-right">{{ item.ORDEN }}</td>
            <td class="text-right">{{ item.DOCUMENTO }}</td>
            <td class="text-left">{{ item.APENOM }}</td>
            <td class="text-right">{{ financial(item.PATJUB) }}</td>
            <td class="text-right">{{ financial(item.PATOS) }}</td>
            <td class="text-right">{{ financial(item.PATART) }}</td>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
