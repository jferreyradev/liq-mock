<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'
import { financial, getVto, agregaTitulosExcel } from '@/utils/reportes.js'
import { computed } from 'vue'

const store = useFilterStore()

function useResLiqCod(getId) {
  return useFetch(
    () =>
      `${store.URL_API}/view/planillaRet?${getId()}&sort={"IdRep":"asc","Orden":"asc","Codigo":"asc","SubCodigo":"asc"}`
  )
}

const { data, error, isPending } = useResLiqCod(() => store.filterString)

const totImporte = computed(() => {
  var totImp = 0
  if (data.value) {
    data.value.forEach((x) => {
      totImp += x.IMPORTE
    })
  }

  return { totImp }
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
  { title: 'Código', key: 'CODIGO', sortable: false },
  { title: 'SubCod.', key: 'SUBCODIGO', sortable: false },
  { title: 'Descripción', key: 'DESCRIPCION', sortable: false },
  { title: 'Vto', key: 'VTO', sortable: false },
  { title: 'Importe', key: 'IMPORTE', sortable: false }
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
      x.CODIGO,
      x.SUBCODIGO,
      x.DESCRIPCION,
      getVto(x.VTO),
      x.IMPORTE
    ]
  })

  const titulosTabla = [
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
  const totalesTabla = [null, null, null, null, null, null, null, null, totImporte.value.totImp]
  map1.push(totalesTabla)
  const filtros = store.liqString
  const tituloReporte = 'Planilla Retenciones'
  agregaTitulosExcel(map1, tituloReporte, filtros, titulosTabla)
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
        <template v-slot:body.append>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th class="text-right">{{ financial(totImporte.totImp) }}</th>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
