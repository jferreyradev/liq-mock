<script setup>
import { ref } from 'vue'

const hojasHeaders = [
  { title: 'Id', key: 'Id' },
  { title: 'Apellido', key: 'Apellido' },
  { title: 'Nombre', key: 'Nombre' },
  { title: 'Valor', key: 'Valor' }
]

// lectura de registros
const data = ref(null)

data.value = [
  { Id: 1, Apellido: 'Diaz T', Nombre: 'Fernando', Valor: 76 },
  { Id: 2, Apellido: 'Perez', Nombre: 'Walter', Valor: 74 },
  { Id: 3, Apellido: 'Ferreyra', Nombre: 'José', Valor: 78 }
]

function LlamaGrabar() {
  data.value.forEach((e) => {
    console.log(e.Apellido, e.Valor)
  })
  //console.log(data.value)
}
</script>

<template>
  <v-container>
    <v-row>
      <v-btn color="primary" prepend-icon="mdi-plus" elevation="3" @click="LlamaGrabar()"
        >Grabar</v-btn
      >
    </v-row>
    <v-row>
      <div>
        <v-data-table
          class="text-caption"
          hover
          density="compact"
          :items="data"
          :headers="hojasHeaders"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.Id }}</td>
              <td>{{ item.Apellido }}</td>
              <td>{{ item.Nombre }}</td>
              <td>
                <v-text-field v-model="item.Valor" density="compact" variant="solo"></v-text-field>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-row>
  </v-container>
</template>
