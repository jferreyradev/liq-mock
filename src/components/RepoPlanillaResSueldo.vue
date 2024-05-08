<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'

const store = useFilterStore()

function useResLiqCod(getId) {
  console.log(`${store.URL_API}/view/resumenSueldos?${getId()}`)
  return useFetch(() => `${store.URL_API}/view/resumenSueldos?${getId()}`)
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
  { title: 'Mes Liq.', key: 'MESLIQ', sortable: false },
  { title: 'Categoría', key: 'CAT', sortable: false },
  { title: 'Hab. c/Ap.', key: 'HABCONAP', sortable: false },
  { title: 'Hab. S/Ap.', key: 'HABSINAP', sortable: false },
  { title: 'Asig. Fam.', key: 'ASIGNFAM', sortable: false },
  { title: 'Desc. Ley', key: 'DESCLEY', sortable: false },
  { title: 'Desc. Varios', key: 'DESCVARIOS', sortable: false },
  { title: 'Neto', key: 'NETO', sortable: false }
]

function financial(x) {
  return Number.parseFloat(x).toFixed(2)
}

function handleDownload() {
  console.log('download')
  exportFile()
}

function exportFile() {
  const map1 = data.value.map((x) => {
    return [
      x.IDREP,
      x.ORDEN,
      x.DOCUMENTO,
      x.APENOM,
      x.MESLIQ,
      x.CAT,
      x.HABCONAP,
      x.HABSINAP,
      x.ASIGNFAM,
      x.DESCLEY,
      x.DESCVARIOS,
      x.NETO
    ]
  })

  const tituloTabla = [
    'Rep',
    'Orden',
    'Documento',
    'Apellido y Nombre',
    'Mes Liq.',
    'categoría',
    'Hab. con Ap.',
    'Hab. sin Ap.',
    'Asign. Fam.',
    'Desc. de Ley',
    'Desc. varios',
    'Neto'
  ]
  const tituloTablaFormato = tituloTabla.map((t) => ({
    v: t,
    s: { font: { bold: true, sz: 12 } } // sz: Tamaño de letra (14 por ejemplo)
  }))
  map1.unshift(tituloTablaFormato)

  const linea = ['']
  map1.unshift(linea)

  // agrega título secundario
  const tituloSec = ['', store.liqString]
  const tituloSecFormato = tituloSec.map((t) => ({
    v: t,
    s: { font: { bold: true, sz: 12 } } // sz: Tamaño de letra (14 por ejemplo)
  }))
  map1.unshift(tituloSecFormato)

  // Agrega Título Principal
  const tituloPpal = ['', 'Resumen de Sueldos']
  const tituloPpalFormato = tituloPpal.map((t) => ({
    v: t,
    s: { font: { bold: true, sz: 12 } } // sz: Tamaño de letra (14 por ejemplo)
  }))
  map1.unshift(tituloPpalFormato)
  /* generate worksheet from state */
  const ws = utils.aoa_to_sheet(map1)

  ws['!cols'] = [
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
    { wch: 35 },
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_ResumenSueldos.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Resumen de Sueldos" :subtitle="store.liqString">
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
            <td class="text-right">{{ item.MESLIQ }}</td>
            <td class="text-center">{{ item.CAT }}</td>
            <td class="text-right">{{ financial(item.HABCONAP) }}</td>
            <td class="text-right">{{ financial(item.HABSINAP) }}</td>
            <td class="text-right">{{ financial(item.ASIGNFAM) }}</td>
            <td class="text-right">{{ financial(item.DESCLEY) }}</td>
            <td class="text-right">{{ financial(item.DESCVARIOS) }}</td>
            <td class="text-right">{{ financial(item.NETO) }}</td>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
