<script setup>
const props = defineProps(['Hoja', 'cerrar'])
let hojaActual = props.Hoja
console.log(hojaActual)

const picker = new Date().toISOString().substring(0, 10)
console.log(picker)
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>Hojas</v-card-title>
      <v-card-subtitle>Agregar Nueva</v-card-subtitle>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="2">
              <v-text-field
                v-model="hojaActual.ID"
                hide-details="auto"
                label="Id"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="hojaActual.TIPO_HOJA"
                hide-details="auto"
                label="Tipo"
                clearable
              ></v-text-field
            ></v-col>

            <v-col cols="2">
              <v-text-field
                v-model="hojaActual.PERIODO"
                hide-details="auto"
                label="Tipo"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="hojaActual.PERIODO"
                hide-details="auto"
                label="Tipo"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row> </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <button @click="cerrar()">Cerrar</button>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
