<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'

const store = useFilterStore()

function useResLiqCod(getId) {
   return useFetch(() => `${store.URL_API}/view/resumenSueldos?${getId()}`)
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
    title: 'ORDEN',
    align: 'start',
    sortable: true,
    key: 'ORDEN'
  },
  {
    title: 'Documento',
    align: 'start',
    sortable: true,
    key: 'DOCUMENTO'
  },
  { title: 'Apellido y nombre', key: 'APENOM' },
  { title: 'Mes Liq.', key: 'MESLIQ' },
  { title: 'Categoría', key: 'CAT' },
  { title: 'Hab. c/Ap.', key: 'HABCONAP' },
  { title: 'Hab. S/Ap.', key: 'HABSINAP' },
  { title: 'Asig. Fam.', key: 'ASIGNFAM' },
  { title: 'Desc. Ley', key: 'DESCLEY' },
  { title: 'Desc. Varios', key: 'DESCVARIOS' },
  { title: 'Neto', key: 'NETO' }
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
    return {
      REP: x.IDREP,
      ORDEN: x.ORDEN,
      DNI: x.DOCUMENTO,
      NOMBRE: x.APENOM,
      MESLIQ: x.MESLIQ,
      CAT: x.CAT, 
      HAB_CON_AP: x.HABCONAP,
      HAB_SIN_AP: x.HABSINAP,
      ASIG_FAM: x.ASIGNFAM,
      DESC_LEY: x.DESCLEY,
      DESC_VARIOS: x.DESCVARIOS,
      NETO: x.NETO
    }
  })

  /* generate worksheet from state */
  const ws = utils.json_to_sheet(map1)
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
