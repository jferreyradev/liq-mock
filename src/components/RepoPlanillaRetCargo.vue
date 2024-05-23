<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'
import { agregaTitulosExcel } from '@/utils/reportes.js'

const store = useFilterStore()

function useResLiqCod(getId) {
  console.log(`${store.URL_API}/view/retencionesCargo?${getId()}`)
  return useFetch(
    () => `${store.URL_API}/view/retencionesCargo?${getId()}&sort={"IdRep":"asc","Orden":"asc"}`
  )
}

const { data, error, isPending } = useResLiqCod(() => store.filterString)

const props = defineProps(['title', 'subtitle', 'fileName'])

const headers = [
  {
    title: 'Rep',
    align: 'start',
    sortable: false,
    key: 'IDREP'
  },
  {
    title: 'Orden',
    align: 'start',
    sortable: false,
    key: 'ORDEN'
  },
  {
    title: 'Afiliado',
    align: 'start',
    sortable: false,
    key: 'AFILIADO'
  },
  { title: 'Categoría', key: 'CATEGORIA', sortable: false },
  { title: 'Sit. Rev.', key: 'SITREV', sortable: false },
  {
    title: 'DNI',
    align: 'start',
    sortable: false,
    key: 'DOCUMENTO'
  },
  { title: 'Apellido y nombre', key: 'APENOM', sortable: false }
]

function handleDownload() {
  console.log('download')
  exportFile()
}

function exportFile() {
  const map1 = data.value.map((x) => {
    return [x.IDREP, x.ORDEN, x.AFILIADO, x.CATEGORIA, x.SITREV, x.DOCUMENTO, x.APENOM]
  })

  const titulosTabla = [
    'Rep',
    'Orden',
    'Afiliado',
    'Categoría',
    'Sit. de Rev.',
    'Documento',
    'Apellido y Nombre'
  ]
  const filtros = store.liqString
  const tituloReporte = 'Retenciones de Cargo'
  agregaTitulosExcel(map1, tituloReporte, filtros, titulosTabla)
  const ws = utils.aoa_to_sheet(map1)

  ws['!cols'] = [
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
    { wch: 35 }
  ]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_RetencionesCargo.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Retenciones de Cargo" :subtitle="store.liqString">
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
            <td class="text-right">{{ item.AFILIADO }}</td>
            <td class="text-center">{{ item.CATEGORIA }}</td>
            <td class="text-center">{{ item.SITREV }}</td>
            <td class="text-right">{{ item.DOCUMENTO }}</td>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
