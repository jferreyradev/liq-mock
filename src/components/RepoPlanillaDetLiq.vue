<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'

const store = useFilterStore()

function useResLiqCod(getId) {
 
  return useFetch(() => `${store.URL_API}/view/planillaDetLiq?${getId()}`)
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
  { title: 'Código', key: 'CODIGO' },
  { title: 'SubCod.', key: 'SUBCODIGO' },
  { title: 'Descripción', key: 'DESCRIPCION' },
  { title: 'VTO', key: 'VTO' },
  { title: 'Importe', key: 'IMPORTE' },
  { title: 'Fecha Dev.', key: 'FECHADEV' }
]

function financial(x) {
  return Number.parseFloat(x).toFixed(2)
}

const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
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
      PATJUB: x.CODIGO,
      PATOS: x.SUBCODIGO,
      PATART: x.DESCRIPCION,
      VTO: getVto(x.VTO),
      IMPORTE: x.IMPORTE,
      FECHADEV: getVto(x.FECHADEV)
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
    { wch: 20 },
    { wch: 10 },
    { wch: 15 },
    { wch: 10 }
  ]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_PlanDetLiq.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Planilla de Detalle de Liquidación" :subtitle="store.liqString">
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
            <td class="text-right">{{ item.CODIGO }}</td>
            <td class="text-right">{{ item.SUBCODIGO }}</td>
            <td class="text-left">{{ item.DESCRIPCION }}</td>
            <td class="text-left">{{ getVto(item.VTO) }}</td>
            <td class="text-right">{{ financial(item.IMPORTE) }}</td>
            <td class="text-left">{{ getVto(item.FECHADEV) }}</td>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
