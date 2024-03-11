<script setup>
import { ref } from 'vue'
import { useFilterStore } from '@/stores/filterStore.js'
import { useFetch } from '@/composables/useFetch';

const store = useFilterStore()

function useLiq(getId) {
  return useFetch(() => `${store.URL_API}/view/liq?${getId()}&sort={"Orden":"asc"}`)
}

const { data, error, isPending } = useLiq(() => store.filterString)

const props = defineProps(['title', 'subtitle'])
const emit = defineEmits(['select'])

const search = ref()

const liqHeaders = [
  { title: 'Orden', key: 'ORDEN' },
  { title: 'Documento', key: 'DOCUMENTO' },
  { title: 'Apellido', key: 'APELLIDO', sortable: true },
  { title: 'Nombre', key: 'NOMBRE' },
  { title: 'Fecha Dev.', key: 'FECHADEV' }
]

function handleClick(item) {
  emit('select', item.LIQUIDACIONID,  {
    apellido: item.APELLIDO,
    nombre: item.NOMBRE,
    orden: item.ORDEN,
    dni: item.DOCUMENTO
  })
}

const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
}
</script>

<template>
  <v-container>
    <div v-if="isPending">loading...</div>
    <v-card flat v-else-if="data">
      <v-card-title class="d-flex align-center pe-2 bg-blue-accent-1">
        {{ props.title }}
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          label="Texto a buscar en toda la tabla"
          single-line
          flat
          hide-details
          variant="solo-filled"
        >
        </v-text-field>
      </v-card-title>
      <v-card-subtitle class="d-flex align-center pe-2 bg-blue-accent-1">
        {{ props.subtitle }}
      </v-card-subtitle>
      <v-divider></v-divider>

      <v-data-table
        :headers="liqHeaders"
        :items="data"
        item-key="LIQUIDACIONID"
        items-per-page="20"
        :search="search"
        hover
        density="compact"
        class="elevation-1 text-caption pa-0 ma-0 w-auto"
      >
        <template v-slot:item="{ item }">
          <tr class="pa-0 ma-0" @click="handleClick(item)">
            <td class="text-right ma-0 pa-0">{{ item.ORDEN }}</td>
            <td class="text-right">{{ item.DOCUMENTO }}</td>
            <td class="text-left">{{ item.APELLIDO }}</td>
            <td class="text-left">{{ item.NOMBRE }}</td>
            <td class="text-center">{{ getVto(item.FECHADEV) }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <div v-else-if="error">No se puede obtener los datos solicitados: {{ error.message }}</div>
  </v-container>
</template>

<style scoped></style>
