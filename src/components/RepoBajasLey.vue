<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'
import { agregaTitulosExcel, getVto, getFecha } from '@/utils/reportes.js'

const store = useFilterStore()

function useResLiqCod(getId) {
  console.log(`${store.URL_API}/view/bajasLey?${getId()}`)
  return useFetch(() => `${store.URL_API}/view/bajasLey?${getId()}`)
}

const { data, error, isPending } = useResLiqCod(() => store.filterPeriodoString)

const props = defineProps(['fileName'])

const headers = [
  { title: 'Documento', key: 'DOCUMENTO', align: 'center', sortable: false },
  { title: 'Apellido y Nombre', key: 'APENOM', align: 'start', sortable: false },
  { title: 'Sexo', key: 'SEXO', align: 'center', sortable: false },
  { title: 'Fecha. Nac.', key: 'FECHANAC', align: 'center', sortable: false },
  { title: 'Edad', key: 'EDAD', align: 'center', sortable: false },
  { title: 'Periodo', key: 'PERIODO', align: 'center', sortable: false }
]

function handleDownload() {
  console.log('download')
  exportFile()
}

function exportFile() {
  const map1 = data.value.map((x) => {
    return [x.DOCUMENTO, x.APENOM, x.SEXO, getFecha(x.FECHANAC), x.EDAD, getVto(x.PERIODO)]
  })

  const titulosTabla = ['Documento', 'Apellido y Nombre', 'Sexo', 'Fecha Nac.', 'Edad', 'Período']
  const filtros = store.periodoString
  const tituloReporte = 'Bajas de Ley'
  agregaTitulosExcel(map1, tituloReporte, filtros, titulosTabla)
  const ws = utils.aoa_to_sheet(map1)
  ws['!cols'] = [{ wch: 10 }, { wch: 25 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }]
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
    <RepoHeader title="Bajas de Ley" :subtitle="store.periodoString">
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
            <td class="text-center">{{ item.DOCUMENTO }}</td>
            <td class="text-left ma-0 pa-0">{{ item.APENOM }}</td>
            <td class="text-center">{{ item.SEXO }}</td>
            <td class="text-denter">{{ getFecha(item.FECHANAC) }}</td>
            <td class="text-center">{{ item.EDAD }}</td>
            <td class="text-center">{{ getVto(item.PERIODO) }}</td>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
