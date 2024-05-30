<script setup>
import { ref } from 'vue';
const props = defineProps(['Hoja', 'cerrar'])
let hojaActual = props.Hoja
console.log(hojaActual)

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const month = ref(months[4])
const year = ref(2024)

// tipo de carga
const tipoCarga = [{
    name: 'Manual',
    value: '1'
}, {
    name: 'Disco',
    value: '2',
}, {
    name: 'Otro',
    value: '3'
}]

const tipoCargaSelected = ref(tipoCarga[0])

// tipo de hoja
const tipoHoja = [{
    name: 'Movimiento de Haberes',
    value: '1'
}, {
    name: 'Pensiones',
    value: '2',
}, {
    name: 'Deducciones',
    value: '3'
}]

const tipoHojaSelected = ref(tipoHoja[0])


const tipoLiq = [{
    name: 'Mensual',
    value: '1'
}, {
    name: 'Adicional',
    value: '5',
}, {
    name: '1er SAC',
    value: '2'
}, {
    name: '2Do SAC',
    value: '3'
}, {
    name: 'Otro tipo',
    value: '9',
    disabled: true
}]

const liqSelected = ref(tipoLiq[0])

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
              <v-select label="Tipo Liq" :items="liq" item-title="name" item-value="value" v-model="liqSelected"
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
