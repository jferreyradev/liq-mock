<script setup>
import { onBeforeMount, onMounted, ref, toRefs } from 'vue'
import { usersStore } from '@/stores/usersStore.js'

const store = usersStore()

const { users , error, isPending } = toRefs(store)

const props = defineProps(['title', 'subtitle'])
const emit = defineEmits(['select'])

const search = ref()

const liqHeaders = [
  { title: 'Id', key: 'ID' },
  { title: 'Documento', key: 'DNI', sortable:true },
  { title: 'Usuario', key: 'USERNAME', sortable: true },
  { title: 'email', key: 'EMAIL' },
  { title: 'Estado', key: 'ESTADO' }
]

async function handleClick(item) {
  /*emit('select', item.LIQUIDACIONID,  {
    apellido: item.APELLIDO,
    nombre: item.NOMBRE,
    orden: item.ORDEN,
    dni: item.DOCUMENTO
  })*/
 console.log(item)
  //await store.setEstado(item.ID, 1)
}
onBeforeMount(()=>{
    store.getConfig()
})

onMounted(()=> {
    store.getUsers()
} )

</script>

<template>
  <v-container>
    <div v-if="isPending">loading...</div>
    <v-card flat v-else-if="users">
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
        :items="users"
        item-key="ID"
        items-per-page="20"
        :search="search"
        hover
        density="compact"
        class="elevation-1 text-caption pa-0 ma-0 w-auto"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td class="text-right ma-0 pa-0">{{ item.ID }}</td>
            <td class="text-right">{{ item.DNI }}</td>
            <td class="text-left">{{ item.USERNAME }}</td>
            <td class="text-left">{{ item.EMAIL }}</td>
            <td class="text-left">{{ item.ESTADO===1?'Activo':'Otro' }}
              <v-btn  prepend-icon="mdi-pencil"
          size="small" @click="handleClick(item)"></v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <div v-else-if="error">No se puede obtener los datos solicitados.</div>
  </v-container>
  <div>Config: {{ store.getconfig }}</div>
</template>

<style scoped></style>