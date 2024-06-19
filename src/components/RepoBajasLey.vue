<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'
import { agregaTitulosExcel } from '@/utils/reportes.js'

const store = useFilterStore()

function useResLiqCod(getId) {
  console.log(`${store.URL_API}/view/bajasLey?${getId()}`)
  return useFetch(() => `${store.URL_API}/view/bajasLey?${getId()}`)
}

const { data, error, isPending } = useResLiqCod(() => store.filterString)


const props = defineProps(['fileName'])

const headers = [
  { title: 'Documento', key: 'DOCUMENTO', align: 'start', sortable: false },
  { title: 'Apellido y Nombre', key: 'APENOM', align: 'start', sortable: false },
  { title: 'Sexo', key: 'SEXO', align: 'start', sortable: false },
  { title: 'Fecha. Nac.', key: 'FECHANAC', align: 'start', sortable: false },
  { title: 'Edad', key: 'EDAD', align: 'end', sortable: false },
  { title: 'Periodo', key: 'PERIODO', align: 'start', sortable: false }
]

function handleDownload() {
  console.log('download')
  exportFile()
}

function exportFile() {
  const map1 = data.value.map((x) => {
    return [x.DOCUMENTO, x.APENOM, x.SEXO, x.FECHANAC, x.EDAD, x.PERIODO]
  })

  const titulosTabla = [
    'Documento',
    'Apellido y Nombre',
    'Sexo',
    'Fecha Nac.',
    'Edad',
    'Período'
  ]
  const filtros = store.liqString
  const tituloReporte = 'Bajas de Ley'
  agregaTitulosExcel(map1, tituloReporte, filtros, titulosTabla)
  const ws = utils.aoa_to_sheet(map1)
  ws['!cols'] = [
    { wch: 10 },
    { wch: 25 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 }
  ]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_BajasLey.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Bajas de Ley" :subtitle="store.liqString">
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
            <td class="text-right">{{ item.DOCUMENTO }}</td>
            <td class="text-right ma-0 pa-0">{{ item.APENOM }}</td>
            <td class="text-right">{{ item.SEXO }}</td>
            <td class="text-left">{{ item.FECHANAC }}</td>
            <td class="text-right">{{ item.EDAD }}</td>
            <td class="text-right">{{ item.PERIODO }}</td>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
