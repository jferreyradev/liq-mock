<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'
import { ref } from 'vue'

const store = useFilterStore()

function useResLiqCod153(getId) {
  return useFetch(() => `${store.URL_API}/view/resumenCodigo?${getId()}&Codigo=153`)
}

function useResLiqCod154(getId) {
  return useFetch(() => `${store.URL_API}/view/resumenCodigo?${getId()}&Codigo=154`)
}
/*
function obtieneDatos(cod153, cod154) {
  let arrayResultante = false
  if (cod153.data || cod154.data) {
    if (cod153.data) arrayResultante = arrayResultante.concat(cod153.data)
    if (cod154.data) arrayResultante = arrayResultante.concat(cod154.data)
  }
  return arrayResultante
}
const cod153 = useResLiqCod153(() => store.filterString)
const cod154 = useResLiqCod154(() => store.filterString)
*/
//const data = obtieneDatos(cod153, cod154)
const c153 = ref(useResLiqCod153(() => store.filterString))

const props = defineProps(['title', 'subtitle', 'fileName'])

const headers = [
  {
    title: 'REP',
    align: 'start',
    sortable: true,
    key: 'IDREP'
  },
  {
    title: 'DNI',
    align: 'start',
    sortable: true,
    key: 'DOCUMENTO'
  },
  { title: 'Apellido y nombre', key: 'APENOM' },
  { title: 'Código', key: 'CODIGO', align: 'center' },
  { title: 'Subcódigo', key: 'SUBCODIGO', align: 'center' },
  { title: 'Importe', key: 'IMPORTE', align: 'end' }
]

function handleDownload() {
  console.log('download')
  exportFile()
}

function exportFile() {
  const map1 = c153.value.data.value.map((x) => {
    return {
      REP: x.IDREP,
      DNI: x.DOCUMENTO,
      NOMBRE: x.APENOM,
      CODIGO: x.CODIGO,
      SUBCODIGO: x.SUBCODIGO,
      IMPORTE: x.IMPORTE
    }
  })

  /* generate worksheet from state */
  const ws = utils.json_to_sheet(map1)
  ws['!cols'] = [{ wch: 10 }, { wch: 10 }, { wch: 35 }, { wch: 15 }, { wch: 15 }, { wch: 20 }]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_PlanillasRetCPA.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Resumen de códigos de retención CPA" :subtitle="store.liqString">
      <v-btn color="primary" @click="handleDownload" :disabled="!c153.value.data">Descargar</v-btn>
    </RepoHeader>
    <v-row>
      <div v-if="c153.value.isPending">loading...</div>
      <v-data-table
        v-else-if="c153.value.data"
        class="text-caption"
        hover
        density="compact"
        :items="c153.value.data"
        :headers="headers"
      >
      </v-data-table>
      <div v-else-if="c153.value.error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
