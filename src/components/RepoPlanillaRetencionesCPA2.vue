<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'

const store = useFilterStore()

function useResLiqCod(getId) {
  console.log(`153 - > ${store.URL_API}/view/resumenCodigo?${getId()}&Codigo=153`)
  let cod153 = useFetch(() => `${store.URL_API}/view/resumenCodigo?${getId()}&Codigo=153`)

  console.log(`154 - > ${store.URL_API}/view/resumenCodigo?${getId()}&Codigo=154`)
  let cod154 = useFetch(() => `${store.URL_API}/view/resumenCodigo?${getId()}&Codigo=154`)

  console.log(`245 - > ${store.URL_API}/view/resumenCodigo?${getId()}&Codigo=245`)
  let cod245 = useFetch(() => `${store.URL_API}/view/resumenCodigo?${getId()}&Codigo=245`)

  let resultado = {}
  if (cod153.isPending || cod154.isPending || cod245.isPending) {
    resultado = { isPending: true, data: false, error: false }
    return resultado
  }
  let arrayResultante = []
  if (cod153.data || cod154.data || cod245.data) {
    if (cod153.data) arrayResultante = arrayResultante.concat(cod153.data)
    if (cod154.data) arrayResultante = arrayResultante.concat(cod154.data)
    if (cod245.data) arrayResultante = arrayResultante.concat(cod245.data)
    resultado = { isPending: false, data: arrayResultante, error: false }
    return resultado
  }
  resultado = { isPending: false, data: false, error: true }
  return resultado
  //cod153 = cod153.concat(cod154)
  //cod153 = cod153.concat(cod245)
  //let resultado = [].concat(cod153, cod154, cod245)
}

const { data, error, isPending } = useResLiqCod(() => store.filterString)

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
  const map1 = data.value.map((x) => {
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
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
