<script setup>
import { ref } from 'vue';
import { months, tipoCarga, tipoHoja, tipoLiq, getObjetList} from '@/utils/tipos';
const props = defineProps(['Hoja', 'cerrar'])
let hojaActual = props.Hoja


const month = ref(months[4])
const year = ref(2024)
const tipoCargaSelected = ref(tipoCarga[0])
const tipoHojaSelected = ref(tipoHoja[0])

const liqSelected = ref(tipoLiq[0])

if (hojaActual) {
  tipoCargaSelected.value = getObjetList(tipoCarga, hojaActual.TIPO_CARGA) 
}
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
                <v-select label="Tipo Hoja" :items="tipoHoja" item-title="name" item-value="value" v-model="tipoHojaSelected"
                    return-object>
                </v-select>
            </v-col>

            <v-col cols="2">
              <v-select label="Mes" :items="months" v-model="month"></v-select>
            </v-col>
            <v-col cols="2">
              <v-text-field label="Año" v-model="year" required type="number"></v-text-field>
            </v-col>
          </v-row>
          <v-row> 
            <v-col cols="4">
              <v-select label="Tipo Carga" :items="tipoCarga" item-title="name" item-value="value" v-model="tipoCargaSelected"
                    return-object>
                </v-select>
            </v-col>
            <v-col cols="4">
              <v-select label="Tipo Liq" :items="tipoLiq" item-title="name" item-value="value" v-model="liqSelected"
                    return-object>
                </v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="hojaActual.GRUPO"
                hide-details="auto"
                label="Grupo"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row> 
            <v-col cols="4">
              <v-text-field
                v-model="hojaActual.FECHA"
                hide-details="auto"
                label="Fecha"
              ></v-text-field>            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="hojaActual.ESTADO"
                hide-details="auto"
                label="Estado"
              ></v-text-field>
            </v-col>


          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class='d-flex justify-end'>
          <v-btn color="primary" elevation="3" outlined @click="cerrar()">Grabar</v-btn>
          <v-btn color="error" elevation="3" outlined @click="cerrar()">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
