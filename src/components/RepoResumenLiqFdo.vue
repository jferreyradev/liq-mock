<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'
import { useEndPoints } from '@/composables/useEndPoints'

const { apiBase } = useEndPoints()

const store = useFilterStore()

function useResLiqFdo(getId) {
  return useFetch(() => `${apiBase.value}/api/view/resumenFdo?${getId()}`)
}

const { data, error, isPending } = useResLiqFdo(() => store.filterString)

const props = defineProps(['title', 'subtitle', 'fileName'])

const headers = [
  {
    title: 'Rep',
    align: 'end',
    sortable: true,
    key: 'IDREP'
  },
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
  { title: 'AsignacionFamiliar', key: 'ASIGNACIONFAMILIAR', align: 'end' },
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
    return [
      x.IDREP,
      x.ORDEN,
      x.PERSONADOCUMENTO,
      x.PERSONAAPELLIDO,
      x.PERSONANOMBRE,
      x.SUJETOAPORTE,
      x.ASIGNACIONFAMILIAR,
      x.NETO
    ]
  })

  const tituloTabla = [
    'Rep',
    'Orden',
    'Documento',
    'Apellido',
    'Nombre',
    'Sujeto a Aporte',
    'Asig. Familiar',
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
  const tituloPpal = ['', 'Resúmen de Liquidación - Fondo']
  const tituloPpalFormato = tituloPpal.map((t) => ({
    v: t,
    s: { font: { bold: true, sz: 12 } } // sz: Tamaño de letra (14 por ejemplo)
  }))
  map1.unshift(tituloPpalFormato)
  /* generate worksheet from state */
  const ws = utils.aoa_to_sheet(map1)

  ws['!cols'] = [
    { wch: 7 },
    { wch: 7 },
    { wch: 10 },
    { wch: 15 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 }
  ]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_ResumenLiqFDO.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Resumen de liquidación - Fondo" :subtitle="store.liqString">
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
            <td class="text-right ma-0 pa-0">{{ item.ORDEN }}</td>
            <td class="text-right">{{ item.PERSONADOCUMENTO }}</td>
            <td class="text-left">{{ item.PERSONAAPELLIDO }}</td>
            <td class="text-left">{{ item.PERSONANOMBRE }}</td>
            <td class="text-right">{{ financial(item.SUJETOAPORTE) }}</td>
            <td class="text-right">{{ financial(item.ASIGNACIONFAMILIAR) }}</td>
            <td class="text-right">{{ financial(item.NETO) }}</td>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
