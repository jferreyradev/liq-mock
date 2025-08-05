<script setup>
import RepoHeader from './RepoHeader.vue'
import { useFilterStore } from '@/stores/filterStore'
import { useEndPoints } from '@/composables/useEndPoints'
import { useFetch } from '@/composables/useFetch'
import { financial,agregaTitulosExcel} from '@/utils/reportes.js'

import { utils, writeFileXLSX } from 'xlsx'

const { apiBase } = useEndPoints()

const store = useFilterStore()

function useResumenIPSST(getId) {
  return useFetch(() => `${apiBase.value}/api/view/resumenIPSST?${getId()}`)
}

const { data, error, isPending } = useResumenIPSST(() => store.filterString)


const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
}

const headers = [
  {
    title: 'Fecha dev',
    align: 'start',
    key: 'FECHADEV'
  },
  {
    title: 'Codigo',
    align: 'end',
    key: 'CODIGO'
  },
  {
    title: 'Sub Cod',
    align: 'end',
    key: 'SUBCOD'
  },
  {
    title: 'Desc Boleta',
    align: 'start',
    key: 'DESCBOLETA'
  },
  {
    title: 'Importe',
    align: 'end',
    key: 'IMPORTE'
  }
]



function exportFile() {
  const map1 = data.value.map((x) => {
    return [
      getVto(x.FECHADEV),
      x.CODIGO,
      x.SUBCOD,
      x.DESCBOLETA,
      x.IMPORTE
    ]
  })

  const titulosTabla = [
    'Fecha dev',
    'Codigo',
    'Sub Codigo',
    'Desc Boleta',
    'Importe'
  ]
  const filtros = store.liqString
  const tituloReporte = 'Resumen archivo IPSST'
  agregaTitulosExcel(map1, tituloReporte, filtros, titulosTabla)
  const ws = utils.aoa_to_sheet(map1)

  ws['!cols'] = [
    { wch: 15 },
    { wch: 10 },
    { wch: 10 },
    { wch: 25 },
    { wch: 15 }
  ]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, `${store.liqCompactString}_ResumenIPSST.xlsx`, {
    compression: true
  })
}
</script>

<template>
 <v-container>
   <RepoHeader title="Resumen IPSST" :subtitle="store.liqString">
      <v-btn color="primary" :disabled="!data" @click="exportFile" >Descargar</v-btn>
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
            <td class="text-right">{{ getVto(item.FECHADEV) }}</td>
            <td class="text-right">{{ item.CODIGO }}</td>
            <td class="text-right">{{ item.SUBCOD }}</td>
            <td class="text-left">{{ item.DESCBOLETA }}</td>
            <td class="text-right">{{ financial(item.IMPORTE) }}</td>
          </tr>
        </template>
      </v-data-table>      
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>

  </v-container> 
</template>