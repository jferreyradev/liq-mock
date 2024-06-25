<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'
import { financial, agregaTitulosExcel } from '@/utils/reportes.js'
import { computed } from 'vue'

const store = useFilterStore()

function useResLiqCod(getId) {
  console.log(`${store.URL_API}/view/resumenSueldosComp?${getId()}`)
  return useFetch(() => `${store.URL_API}/view/resumenSueldosComp?${getId()}`)
}

const { data, error, isPending } = useResLiqCod(() => store.filterString)

const totImporte = computed(() => {
  var totHabCA = 0
  var totHabCA2 = 0
  var totInasist = 0
  var totHabSA = 0
  var totHaberes = 0
  var totAsigFam = 0
  var totDescLey = 0
  var totDesVarios = 0
  var totNeto = 0
  var totLey = 0
  if (data.value) {
    data.value.forEach((x) => {
      totHabCA += x.HABCONAP
      totInasist += x.INASISTREM
      totHabCA2 += x.HABCONAP2
      totHabSA += x.HABSINAP
      totHaberes += x.TOTALHAB
      totAsigFam += x.ASIGNFAM
      totDescLey += x.DESCLEY
      totDesVarios += x.DESCVARIOS
      totNeto += x.NETO
      totLey += x.LEY7991
    })
  }

  return {
    totHabCA,
    totHabCA2,
    totInasist,
    totHabSA,
    totHaberes,
    totAsigFam,
    totDescLey,
    totDesVarios,
    totNeto,
    totLey
  }
})

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
    title: 'DNI',
    align: 'start',
    sortable: false,
    key: 'DOCUMENTO'
  },
  { title: 'Apellido y nombre', key: 'APENOM', sortable: false },
  { title: 'Mes Liq.', key: 'MESLIQ', sortable: false },
  { title: 'Categoría', key: 'CAT', sortable: false },
  { title: 'Hab. c/Ap.', key: 'HABCONAP', sortable: false },
  { title: 'Inasist. Rem.', key: 'INASISTREM', sortable: false },
  { title: 'Hab. c/Ap. neto', key: 'HABCONAP2', sortable: false },
  { title: 'Hab. S/Ap.', key: 'HABSINAP', sortable: false },
  { title: 'Tot. Hab.', key: 'TOTALHAB', sortable: false },
  { title: 'Asig. Fam.', key: 'ASIGNFAM', sortable: false },
  { title: 'Desc. Ley', key: 'DESCLEY', sortable: false },
  { title: 'Desc. Varios', key: 'DESCVARIOS', sortable: false },
  { title: 'Neto', key: 'NETO', sortable: false },
  { title: 'Ley 7991', key: 'LEY7991', sortable: false }
]

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
      x.INASISTREM,
      x.HABCONAP2,
      x.HABSINAP,
      x.TOTALHAB,
      x.ASIGNFAM,
      x.DESCLEY,
      x.DESCVARIOS,
      x.NETO,
      x.LEY7991
    ]
  })

  const titulosTabla = [
    'Rep',
    'Orden',
    'Documento',
    'Apellido y Nombre',
    'Mes Liq.',
    'categoría',
    'Hab. con Ap.',
    'Inasist. Rem.',
    'Hab. con Ap. neto',
    'Hab. sin Ap.',
    'Tot. Hab.',
    'Asign. Fam.',
    'Desc. de Ley',
    'Desc. varios',
    'Neto',
    'Ley 7991'
  ]
  const totalesTabla = [
    null,
    null,
    null,
    null,
    null,
    null,
    totImporte.value.totHabCA,
    totImporte.value.totInasist,
    totImporte.value.totHabCA2,
    totImporte.value.totHabSA,
    totImporte.value.totHaberes,
    totImporte.value.totAsigFam,
    totImporte.value.totDescLey,
    totImporte.value.totDesVarios,
    totImporte.value.totNeto,
    totImporte.value.totLey
  ]
  map1.push(totalesTabla)
  const filtros = store.liqString
  const tituloReporte = 'Resumen de Sueldos - Inasist - Ley'
  agregaTitulosExcel(map1, tituloReporte, filtros, titulosTabla)
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
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_ResumenSue_Inasist_Ley.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Resumen de Sueldos - Inasist. - Ley" :subtitle="store.liqString">
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
            <td class="text-right">{{ item.INASISTREM }}</td>
            <td class="text-right">{{ financial(item.HABCONAP2) }}</td>
            <td class="text-right">{{ financial(item.HABSINAP) }}</td>
            <td class="text-right">{{ financial(item.TOTALHAB) }}</td>
            <td class="text-right">{{ financial(item.ASIGNFAM) }}</td>
            <td class="text-right">{{ financial(item.DESCLEY) }}</td>
            <td class="text-right">{{ financial(item.DESCVARIOS) }}</td>
            <td class="text-right">{{ financial(item.NETO) }}</td>
            <td class="text-right">{{ financial(item.LEY7991) }}</td>
          </tr>
        </template>
        <template v-slot:body.append>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th class="text-right">{{ financial(totImporte.totHabCA) }}</th>
            <th class="text-right">{{ financial(totImporte.totInasist) }}</th>
            <th class="text-right">{{ financial(totImporte.totHabCA2) }}</th>
            <th class="text-right">{{ financial(totImporte.totHabSA) }}</th>
            <th class="text-right">{{ financial(totImporte.totHaberes) }}</th>
            <th class="text-right">{{ financial(totImporte.totAsigFam) }}</th>
            <th class="text-right">{{ financial(totImporte.totDescLey) }}</th>
            <th class="text-right">{{ financial(totImporte.totDesVarios) }}</th>
            <th class="text-right">{{ financial(totImporte.totNeto) }}</th>
            <th class="text-right">{{ financial(totImporte.totLey) }}</th>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
