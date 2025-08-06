<script setup>
import RepoHeader from './RepoHeader.vue'
import { useFilterStore} from '@/stores/filterStore'
import { useEndPoints } from '@/composables/useEndPoints'
import { useFetch } from '@/composables/useFetch'
import { financial,agregaTitulosExcel} from '@/utils/reportes.js'
import { utils, writeFileXLSX } from 'xlsx'
import { ref } from 'vue'
//<v-btn color="primary" :disabled="!data" @click="exportFile" >Descargar</v-btn>

const { apiBase } = useEndPoints()

const store = useFilterStore()

const preview = ref(false)

function useResumenAcred(getId) {
  return useFetch(() => `${apiBase.value}/api/view/detalleAcred?${getId()}`)
}

//const { data, error, isPending } = useResumenIPSST(() => store.filterString)

const { data, error, isPending } = useResumenAcred(() => store.filterStringLey )


const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
}

const headers = [

{
    title: 'Adicional',
    align: 'start',
    key: 'GRUPOADICIONALID'
  },
  {
    title: 'Periodo',
    align: 'start',
    key: 'PERIODO'
  },
  {
    title: 'Fecha dev',
    align: 'start',
    key: 'FECHADEV'
  },
  {
    title: 'Liquidacion Id',
    align: 'start',
    key: 'LIQUIDACIONID'
  },
  {
    title: 'Documento',
    align: 'start',
    key: 'DOCUMENTO'
  },
  {
    title: 'Apellido',
    align: 'start',
    key: 'APELLIDO'
  },
  {
    title: 'Nombre',
    align: 'start',
    key: 'NOMBRE'
  },
  {
    title: 'Reparticion',
    align: 'start',
    key: 'REPARTICIONID'
  }, 
  {
    title: 'Orden',
    align: 'start',
    key: 'ORDEN'
  },
  {
    title: 'Afiliado',
    align: 'start',
    key: 'AFILIADO'
  },
  {
    title: 'CUIL',
    align: 'start',
    key: 'CUIL'
  },
  {
    title: 'CBU',
    align: 'start',
    key: 'CBU'
  },
  {
    title: 'Haberes',
    align: 'start',
    key: 'HABERES'
  },

  {
    title: 'Retenciones',
    align: 'start',
    key: 'RETENCIONES'
  },

  {
    title: 'Neto',
    align: 'start',
    key: 'NETO'
  },
  {
    title: 'Uni Org',
    align: 'end',
    key: 'UNIORG'
  },
  {
    title: 'Bloqueo',
    align: 'start',
    key: 'BLOQ'
  },
  {
    title: 'Es Ley',
    align: 'start',
    key: 'ESLEY'    
  }
]



function exportFile() {
  const map1 = data.value.map((x) => {
    return [
      getVto(x.PERIODO),
      getVto(x.FECHADEV),
      x.IMPORTE,
      x.CANTIDAD,
      x.BLOQ,
      x.ESLEY,
      
    ]
  })

  const titulosTabla = [
    'Adicional',
    'Periodo',
    'Fecha dev',
    'LiquidacionId',
    'Documento',
    'Apellido',
    'Nombre',
    'Reparticion',
    'Orden',
    'Afiliado',
    'CUIL',
    'CBU',
    'Haberes',
    'Retenciones',
    'Neto',
    'Uni Org',    
    'Bloqueo',
    'Es Ley'
  ]
  const filtros = store.liqString
  const tituloReporte = 'Detalle Acreditaciones'
  agregaTitulosExcel(map1, tituloReporte, filtros, titulosTabla)
  const ws = utils.aoa_to_sheet(map1)

  ws['!cols'] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 25 },
    { wch: 25 },
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 }
  ]
  /* create workbook and append worksheet */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')

  /* export to XLSX */
  writeFileXLSX(wb, `${store.liqCompactString}_Detalle_Acreditaciones.xlsx`, {
    compression: true
  })
}
</script>

<template>
 <v-container>
   <RepoHeader title="Detalle Acreditaciones" :subtitle="store.liqString">
    <v-btn color="primary" :disabled="!data" @click="preview = !preview">Previsualizar</v-btn>
    <v-btn color="primary" :disabled="!data" @click="printData" >Descargar</v-btn>
    </RepoHeader>

    <v-row v-if="preview">
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
            <td class="text-right">{{ item.GRUPOADICIONALID }}</td>
            <td class="text-right">{{ getVto(item.PERIODO) }}</td>
            <td class="text-left">{{ getVto(item.FECHADEV) }}</td>            
            <td class="text-right">{{ item.LIQUIDACIONID}}</td>
            <td class="text-left">{{ item.DOCUMENTO}}</td>
            <td class="text-left">{{ item.APELLIDO}}</td>
            <td class="text-right">{{ item.NOMBRE }}</td>
            <td class="text-left">{{ item.REPARTICIONID}}</td>
            <td class="text-left">{{ item.ORDEN}}</td>
            <td class="text-right">{{ item.AFILIADO}}</td>
            <td class="text-left">{{ item.CUIL}}</td>            
            <td class="text-left">{{ item.CBU}}</td>
            <td class="text-right">{{ financial(item.HABERES) }}</td>            
            <td class="text-right">{{ item.RETENCIONES }}</td>
            <td class="text-right">{{ financial(item.NETO) }}</td>
            <td class="text-right">{{ item.UNIORG}}</td>
            <td class="text-right">{{ item.BLOQ }}</td>
            <td class="text-left">{{ item.ESLEY }}</td>            
          </tr>
        </template>
      </v-data-table>      
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>

  </v-container> 
</template>