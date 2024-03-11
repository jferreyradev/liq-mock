<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFetch } from '@/composables/useFetch'
import { useFilterStore } from '@/stores/filterStore';

const store = useFilterStore()

function useResLiq(getId) {
  return useFetch(() => `${store.URL_API}/repo/resumenLiq?${getId()}`)
}

const { data, error, isPending } = useResLiq(() => store.filterString)

const props = defineProps(['fileName'])

const headers = [
  {
    title: 'Orden',
    align: 'end',
    sortable: true,
    key: 'ORDEN'
  },
  { title: 'DNI', key: 'PERSONADOCUMENTO', align: 'end' },
  { title: 'Apellido', key: 'PERSONAAPELLIDO', align: 'start' },
  { title: 'Nombre', key: 'PERSONANOMBRE', align: 'start' },
  { title: 'Sujeto a aporte', key: 'SUJETOAPORTE', align: 'end' },
  { title: 'Exento de aporte', key: 'EXCENTOAPORTE', align: 'end' },
  { title: 'Descuentos de ley', key: 'DESCUENTOSLEY', align: 'end' },
  { title: 'Descuentos varios', key: 'DESCUENTOSVARIOS', align: 'end' },
  { title: 'Neto', key: 'NETO', align: 'end' }
]

function handleDownload() {
  console.log('download')
  exportFile()
}

function financial(x) {
  return Number.parseFloat(x).toFixed(2)
}

function exportFile() {
  const map1 = data.value.map((x) => {
    return {
      ORDEN: x.ORDEN,
      DNI: x.PERSONADOCUMENTO,
      Apellido: x.PERSONAAPELLIDO,
      Nombre: x.PERSONANOMBRE,
      'Sujeto a aporte': x.SUJETOAPORTE,
      'Exento a aporte': x.EXCENTOAPORTE,
      'Descuentos de ley': x.DESCUENTOSLEY,
      'Descuentos varios': x.DESCUENTOSVARIOS,
      Neto: x.NETO
    }
  })

  /* generate worksheet from state */
  const ws = utils.json_to_sheet(map1)
  ws['!cols'] = [
    { wch: 7 },
    { wch: 11 },
    { wch: 15 },
    { wch: 20 },
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
  writeFileXLSX(wb, props.fileName || 'exportacion.xlsx', { compression: true })
}
</script>

<template>
  <v-container>
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
          <td class="text-right ma-0 pa-0">{{ item.ORDEN }}</td>
          <td class="text-right">{{ item.PERSONADOCUMENTO }}</td>
          <td class="text-left">{{ item.PERSONAAPELLIDO }}</td>
          <td class="text-left">{{ item.PERSONANOMBRE }}</td>
          <td class="text-right">{{ financial(item.SUJETOAPORTE) }}</td>
          <td class="text-right">{{ financial(item.EXCENTOAPORTE) }}</td>
          <td class="text-right">{{ financial(item.DESCUENTOSLEY) }}</td>
          <td class="text-right">{{ financial(item.DESCUENTOSVARIOS) }}</td>
          <td class="text-right">{{ financial(item.NETO) }}</td>
        </tr>
      </template>
    </v-data-table>
    <div v-else-if="error">Ocurrio algún error: {{ error.message }}</div>

    <v-btn color="primary" @click="handleDownload">Descargar</v-btn>
    
  </v-container>
</template>
