<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'

const store = useFilterStore()

function useResLiqCod(getId) {
  return useFetch(() => `${store.URL_API}/view/planillaRet?${getId()}`)
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
  { title: 'Importe', key: 'IMPORTE' }
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
    return [
      x.IDREP,
      x.ORDEN,
      x.DOCUMENTO,
      x.APENOM,
      x.CODIGO,
      x.SUBCODIGO,
      x.DESCRIPCION,
      getVto(x.VTO),
      x.IMPORTE
    ]
  })

  const tituloTabla = [
    'Rep',
    'Orden',
    'Documento',
    'Apellido y Nombre',
    'Código',
    'Subcódigo',
    'Descripción',
    'Vencimiento',
    'Importe'
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
  const tituloPpal = ['', 'Planilla Retenciones']
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
    { wch: 20 },
    { wch: 10 },
    { wch: 15 }
  ]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_PlanillaRet.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Planilla de Retenciones" :subtitle="store.liqString">
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
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
