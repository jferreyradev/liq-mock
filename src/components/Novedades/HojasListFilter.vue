<script setup>
import { ref } from 'vue'
import { months, tipoCarga, tipoHoja, tipoLiq, getObjetList } from '@/utils/tipos'
import { getPeriodoFromMMYYYY } from '@/utils/formatos'
import { rules } from '@/utils/reglasValidacion'

const props = defineProps(['filtrar', 'establecerFiltrar'])

const tipoLiqFilter = [
  {
    name: 'Todas',
    value: -1
  },
  ...tipoLiq
]

const tipoHojaFilter = [
  {
    name: 'Todas',
    value: -1
  },
  ...tipoHoja
]

const tipoCargaFilter = [
  {
    name: 'Todas',
    value: -1
  },
  ...tipoCarga
]

const tipoCargaSelected = ref(tipoCargaFilter[0])
const tipoHojaSelected = ref(tipoHojaFilter[0])
const liqSelected = ref(tipoLiqFilter[0])

function ObtieneFiltro() {
  let filtro = ''
  let expresion = ''
  if (formOK.value === false) return
  if (periodo.value !== null)
    if (periodo.value.length > 0) filtro = 'PeriodoId=' + getPeriodoFromMMYYYY(periodo.value)

  if (liqSelected.value.value !== -1) {
    expresion = `TipoLiquidacionId=${liqSelected.value.value}`
    filtro = filtro.length == 0 ? expresion : filtro + '&' + expresion
  }
  if (tipoCargaSelected.value.value !== -1) {
    expresion = `TipoCargaId=${tipoCargaSelected.value.value}`
    filtro = filtro.length == 0 ? expresion : filtro + '&' + expresion
  }
  if (tipoHojaSelected.value.value !== -1) {
    expresion = `TipoHojaId=${tipoHojaSelected.value.value}`
    filtro = filtro.length == 0 ? expresion : filtro + '&' + expresion
  }
  console.log(filtro)
  return filtro
}

function filtar() {
  let filtro = ObtieneFiltro()
  props.establecerFiltrar(filtro)
  props.filtrar(filtro)
}
const formOK = ref(null)
const periodo = ref(null)
</script>

<template>
  <v-container>
    <v-form v-model="formOK">
      <v-row>
        <v-col cols="2">
          <v-text-field
            v-model="periodo"
            hide-details="auto"
            label="Período"
            :rules="rules.mmyyyy"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-select
            label="Tipo Liq"
            :items="tipoLiqFilter"
            item-title="name"
            item-value="value"
            v-model="liqSelected"
            return-object
          >
          </v-select>
        </v-col>
        <v-col cols="2">
          <v-select
            label="Tipo Hoja"
            :items="tipoHojaFilter"
            item-title="name"
            item-value="value"
            v-model="tipoHojaSelected"
            return-object
          >
          </v-select>
        </v-col>
        <v-col cols="2">
          <v-select
            label="Tipo Carga"
            :items="tipoCargaFilter"
            item-title="name"
            item-value="value"
            v-model="tipoCargaSelected"
            return-object
          >
          </v-select>
        </v-col>

        <v-col cols="2">
          <v-btn color="primary" elevation="3" outlined value="filtrar" @click="filtar()"
            >Buscar</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
