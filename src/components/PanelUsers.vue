<script setup>
import { onBeforeMount, onMounted, ref, toRefs } from 'vue'
import { usersStore } from '@/stores/usersStore.js'

const store = usersStore()

const { users, error, isPending } = toRefs(store)

const props = defineProps(['title', 'subtitle'])
const emit = defineEmits(['select'])

const search = ref()

const dialog = ref(false)

const overlay = ref(false)

const liqHeaders = [
  { title: 'Id', key: 'ID' },
  { title: 'Documento', key: 'DNI', sortable: true },
  { title: 'Usuario', key: 'USERNAME', sortable: true },
  { title: 'email', key: 'EMAIL' },
  { title: 'Estado', key: 'ESTADO' }
]

const currentItem = ref(null)
const currentOption = ref(null)
const text = ref('')


async function handleBlock(item) {

  text.value = `Esta opción bloqueará el usuario seleccionado. \n ¿Esta seguro realizar la operación?`

  dialog.value = true

  currentItem.value = item
  currentOption.value = 2

}

async function handleActivate(item) {

  text.value = `Esta opción habilitará el usuario seleccionado. \n ¿Esta seguro realizar la operación?`

  dialog.value = true

  currentItem.value = item
  currentOption.value = 1

}

async function handleReset(item) {

  text.value = `Esta opción restablecera la contraseña del agente con el DNI. \n ¿Esta seguro realizar la operación?`

  dialog.value = true

  currentItem.value = item
  currentOption.value = 3

}

async function handleConfirm() {
  console.log(currentItem.value)
  dialog.value = false
  overlay.value = true
  if (currentOption.value === 3){
    await store.changePassword(currentItem.value.ID, currentItem.value.DNI)
  }else{
    await store.setEstado(currentItem.value.ID, currentOption.value)
  }
  
  overlay.value = false
  if (!error.value) {
    currentItem.value.ESTADO = currentOption.value
  }
}

onBeforeMount(() => {
  store.getConfig()
})

onMounted(() => {
  store.getUsers()
})

</script>

<template>
  <v-container>
    <div v-if="isPending">loading...</div>
    <v-card flat v-else-if="users">
      <v-card-title class="d-flex align-center pe-2 bg-blue-accent-1">
        {{ props.title }}
        <v-spacer></v-spacer>
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" density="compact"
          label="Texto a buscar en toda la tabla" single-line flat hide-details variant="solo-filled">
        </v-text-field>
      </v-card-title>
      <v-card-subtitle class="d-flex align-center pe-2 bg-blue-accent-1">
        {{ props.subtitle }}
      </v-card-subtitle>
      <v-divider></v-divider>

      <v-data-table :headers="liqHeaders" :items="users" item-key="ID" items-per-page="20" :search="search" hover
        density="compact" class="elevation-1 text-caption pa-0 ma-0 w-auto">
        <template v-slot:item="{ item }">
          <tr>
            <td class="text-right ma-0 pa-0">{{ item.ID }}</td>
            <td class="text-right">{{ item.DNI }}</td>
            <td class="text-left">{{ item.USERNAME }}</td>
            <td class="text-left">{{ item.EMAIL }}</td>
            <td class="text-left" v-if="item.ESTADO === 1">{{ 'Activo' }}</td>
            <td class="text-left" v-if="item.ESTADO === 2">{{ 'Bloqueado' }}</td>
            <td>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                </template>

                <v-list>
                  <v-list-item @click="handleReset(item)">
                    Restablecer
                  </v-list-item>
                  <v-list-item v-if="item.ESTADO === 1" @click="handleBlock(item)">
                    Bloquear
                  </v-list-item>
                  <v-list-item v-if="item.ESTADO === 2" @click="handleActivate(item)">
                    Activar
                  </v-list-item>
                </v-list>
              </v-menu>

            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <div v-else-if="error">No se puede obtener los datos solicitados.</div>
    <v-dialog v-model="dialog" width="auto">
      <v-card max-width="400" prepend-icon="mdi-update" :text="text" title="Información">

        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="dialog = false">
            Cancelar
          </v-btn>

          <v-btn @click="handleConfirm()">
            Aceptar
          </v-btn>
        </template>

      </v-card>
    </v-dialog>
  </v-container>

  <v-overlay :model-value="overlay" persistent class="align-center justify-center">
        <v-progress-circular color="primary" size="64" indeterminate :active="isPending"></v-progress-circular>
    </v-overlay>

</template>

<style scoped></style>