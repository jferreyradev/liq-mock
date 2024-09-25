<script setup>
import { ref } from 'vue'
import { useFilterStore } from '@/stores/filterStore.js'
import { useFetch } from '@/composables/useFetch'
import RepoHeader from './RepoHeader.vue'
import { useLiqStore } from '@/stores/liqStore.js'

const store = useFilterStore()

const liqStore = useLiqStore()

function useLiqBoletas(getId) {
  return useFetch(() => `${store.URL_API}/view/boletas?${getId()}`)
}

const { data, error, isPending } = useLiqBoletas(() => store.filterString)

const search = ref('')

const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
}

const headers = [
  {
    align: 'start',
    key: 'ORDEN',
    title: 'Nro. Boleta'
  },
  { key: 'DOCUMENTO', title: 'DNI' },
  { key: 'APELLIDO', title: 'Apellido' },
  { key: 'NOMBRE', title: 'Nombre' },
  { key: 'TIPOLIQUIDACIONDESCRIPCION', title: 'Liquidación' },
  { key: 'PERIODO', title: 'Emisión' },
  { key: 'FECHADEV', title: 'Devengado' },
  { key: 'LIQUIDACIONID', title: 'link descarga' }
]

function handleDownload(idliq) {
  //console.log(idliq)  
  liqStore.setLiqItems(idliq)
  console.log(liqStore.getLiqItems.value)
}

</script>

<template>
  <v-container>
    <RepoHeader title="Boletas disponibles para descarga" :subtitle="store.liqString">
    </RepoHeader>
    <v-row>
      <div v-if="isPending">loading...</div>

      <v-card v-else-if="data" flat>
        <template v-slot:text>
          <v-text-field
            v-model="search"
            label="Busqueda"
            prepend-inner-icon="mdi-magnify"
            single-line
            variant="outlined"
            hide-details
          ></v-text-field>
        </template>

        <v-data-table
          class="elevation-1 text-caption pa-0 ma-0 w-auto"
          :headers="headers"
          :items="data"
          :search="search"
          item-value="LIQUIDACIONID"
        >
          <template v-slot:item.PERIODO="{ value }">
            {{ getVto(value) }}
          </template>
          <template v-slot:item.FECHADEV="{ value }">
            {{ getVto(value) }}
          </template>

          <template v-slot:item.LIQUIDACIONID="{ value }">
            <a :href="store.URL_API + '/boleta?IdLiq=' + value" target="_blank" >descargar</a>
          </template>
        </v-data-table>
      </v-card>
      <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-row>
  </v-container>
</template>
