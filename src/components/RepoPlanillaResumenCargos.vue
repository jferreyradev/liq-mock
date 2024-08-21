<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { useFilterStore } from '@/stores/filterStore'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'
import {getFecha, getVto, agregaTitulosExcel } from '@/utils/reportes.js'

const store = useFilterStore()

function useResLiqCod(getId) {
  return useFetch(
    () =>
      `${store.URL_API}/view/resumenCargos?${getId()}`
  )
}

const { data, error, isPending } = useResLiqCod(() => store.filterString)

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
  {
    title: 'CUIL',
    align: 'start',
    sortable: false,
    key: 'PERSONACUIL'
  },
  { title: 'Apellido', key: 'APELLIDO', sortable: false },
  { title: 'Nombre', key: 'NOMBRE', sortable: false },
  { title: 'Nacimiento', key: 'FECHANAC', sortable: false },
  { title: 'Sexo', key: 'SEXO', sortable: false },
  { title: 'Categoria', key: 'CATEGORIA', sortable: false },
  { title: 'SitRev', key: 'SITUACIONREVISTAID', sortable: false },
  {title:'Titulo', key: 'TITULO', sortable:false},
  {title:'Titulo Esp', key: 'TITULOESPECIAL', sortable:false},
  { title: 'Antiguedad', key: 'ANTIGUEDAD', sortable: false },
  { title: 'Vto Esc.', key: 'VTOESCALAFON', sortable: false }
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
      x.PERSONACUIL,
      x.APELLIDO,
      x.NOMBRE,
      getFecha(x.FECHANAC),
      x.SEXO,
      x.CATEGORIA,
      x.SITUACIONREVISTAID,
      x.TITULO,
      x.TITULOESPECIAL,
      x.ANTIGUEDAD,
      getVto(x.VTOESCALAFON),
    ]
  })

  const titulosTabla = [
    'Rep',
    'Orden',
    'Documento',
    'Cuil',
    'Apellido','Nombre',
    'Nacimiento',
    'Sexo',
    'Categoria',
    'SitRev',
    'Titulo',
    'Titulo Esp.',
    'Antiguedad',
    'Vto. Esc.'
  ]
  
  const filtros = store.liqString
  const tituloReporte = 'Planilla resumen de cargos'
  agregaTitulosExcel(map1, tituloReporte, filtros, titulosTabla)
  const ws = utils.aoa_to_sheet(map1)

  ws['!cols'] = [
    { wch: 5 },
    { wch: 5 },
    { wch: 10 },
    { wch: 12 },
    { wch: 15 },
    { wch: 20 },
    { wch: 10 },
    { wch: 5 },
    { wch: 7 },
    { wch: 5 },
    { wch: 7 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 }
  ]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, props.fileName || `${store.liqCompactString}_ResumenCargos.xlsx`, {
    compression: true
  })
}
</script>

<template>
  <v-container>
    <RepoHeader title="Planilla resumen de cargos" :subtitle="store.liqString">
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
            <td class="text-right">{{ item.PERSONACUIL }}</td>
            <td class="text-left">{{ item.APELLIDO }}</td>
            <td class="text-left">{{ item.NOMBRE }}</td>
            <td class="text-right">{{ getFecha(item.FECHANAC) }}</td>
            <td class="text-right">{{ item.SEXO }}</td>
            <td class="text-left">{{ item.CATEGORIA }}</td>
            <td class="text-left">{{ item.SITUACIONREVISTAID }}</td>
            <td class="text-right">{{ item.TITULO}}</td>
            <td class="text-right">{{ item.TITULOESPECIAL }}</td>
            <td class="text-right">{{ item.ANTIGUEDAD }}</td>
            <td class="text-left">{{ getVto(item.VTOESCALAFON ) }}</td>
          </tr>
        </template>
      </v-data-table>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
