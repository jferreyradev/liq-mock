<script setup>
import { ref } from 'vue';
import { useFilterStore } from '@/stores/filterStore.js'
import { useFetch } from '@/composables/useFetch';

const store = useFilterStore()

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
        title: 'Nro. Boleta',
    },
    { key: 'DOCUMENTO', title: 'DNI' },
    { key: 'APELLIDO', title: 'Apellido' },
    { key: 'NOMBRE', title: 'Nombre' },
    { key: 'TIPOLIQUIDACIONDESCRIPCION', title: 'Liquidación' },
    { key: 'PERIODO', title: 'Emisión' },
    { key: 'FECHADEV', title: 'Devengado' },
    { key: 'LIQUIDACIONID', title: 'link descarga' },
]

</script>

<template>
    <v-container>
        <div v-if="isPending">loading...</div>
    
        <v-card v-else-if="data" flat title="Boletas disponibles">
            <template v-slot:text>
                <v-text-field v-model="search" label="Busqueda" prepend-inner-icon="mdi-magnify" single-line
                    variant="outlined" hide-details></v-text-field>
            </template>

            <v-data-table class="elevation-1 text-caption pa-0 ma-0 w-auto" :headers="headers" :items="data"
                :search="search" item-value="LIQUIDACIONID">

                <template v-slot:item.PERIODO="{ value }">
                    {{ getVto(value) }}
                </template>
                <template v-slot:item.FECHADEV="{ value }">
                    {{ getVto(value) }}
                </template>

                <template v-slot:item.LIQUIDACIONID="{ value }">
                    <a :href= "store.URL_API + '/boleta?IdLiq=' + value">descargar</a>
                </template>
            </v-data-table>
        </v-card>
        <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    </v-container>
</template>