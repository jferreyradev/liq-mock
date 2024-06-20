<script setup>
import { ref } from 'vue'
import { months, tipoCarga, tipoHoja, tipoLiq, getObjetList } from '@/utils/tipos'

const props = defineProps(['Hoja', 'cerrar', 'funcion'])
let hojaActual = props.Hoja

const fechaSplit = (vto) => {
  if (vto) {
    const d = vto.split('-')
    const f = {
      dia: d[2],
      mes: d[1],
      anio: d[0]
    }
    return f
  }
  return null
}

const fechaActual = new Date()
let mesActual = fechaActual.getMonth()
let anioActual = fechaActual.getFullYear()
let diaActual = fechaActual.getDate()
let fechaCreacionFormat =
  anioActual.toString() +
  '-' +
  (mesActual + 1).toString().padStart(2, '0') +
  '-' +
  diaActual.toString().padStart(2, '0')
const month = ref(months[fechaActual.getMonth()])
const year = ref(fechaActual.getFullYear())
const tipoCargaSelected = ref(tipoCarga[0])
const tipoHojaSelected = ref(tipoHoja[0])
const liqSelected = ref(tipoLiq[0])

if (hojaActual) {
  tipoCargaSelected.value = getObjetList(tipoCarga, hojaActual.TIPOCARGAID)
  liqSelected.value = getObjetList(tipoLiq, hojaActual.TIPOLIQUIDACIONID)
  tipoHojaSelected.value = getObjetList(tipoHoja, hojaActual.TIPOHOJAID)
  let periodo = fechaSplit(hojaActual.PERIODOID)
  month.value = months[periodo.mes - 1]
  year.value = periodo.anio
  fechaCreacionFormat = hojaActual.FECHACREACION.substring(0, 10)
} else {
  hojaActual = {
    ...hojaActual,
    ID: 0,
    GRUPOADICIONAL: 0,
    FECHACREACION: fechaCreacionFormat,
    ESTADOHOJAID: 0
  }
}

const mostrarAlert = ref(false)

async function grabaRegistro() {
  mostrarAlert.value = false
  const mes = months.indexOf(month.value) + 1
  const periodo =
    year.value.toString() + '-' + mes.toString().padStart(2, '0') + '-01' + 'T03:00:00.000Z'
  let fechaR = hojaActual.FECHACREACION
  if (hojaActual.ID != 0) {
    fechaR = fechaCreacionFormat
  }

  const registro = {
    Id: hojaActual.ID,
    TipoHojaId: tipoHojaSelected.value.value,
    PeriodoId: periodo,
    TipoCargaId: tipoCargaSelected.value.value,
    TipoLiquidacionId: liqSelected.value.value,
    GrupoAdicional: hojaActual.GRUPOADICIONAL,
    FechaCreacion: fechaR,
    EstadoHojaId: 2
  }

  let grabarOk = await props.funcion(registro)

  if (grabarOk) {
    props.cerrar()
  } else {
    mostrarAlert.value = true
  }
}
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>Hojas</v-card-title>
      <v-card-subtitle>Agregar Nueva</v-card-subtitle>
      <v-alert
        v-model="mostrarAlert"
        border="start"
        close-label="Close Alert"
        color="error"
        icon="$error"
        closable
      >
        No se pudieron grabar los datos
      </v-alert>
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
              <v-select
                label="Tipo Hoja"
                :items="tipoHoja"
                item-title="name"
                item-value="value"
                v-model="tipoHojaSelected"
                return-object
              >
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
              <v-select
                label="Tipo Carga"
                :items="tipoCarga"
                item-title="name"
                item-value="value"
                v-model="tipoCargaSelected"
                return-object
              >
              </v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                label="Tipo Liq"
                :items="tipoLiq"
                item-title="name"
                item-value="value"
                v-model="liqSelected"
                return-object
              >
              </v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="hojaActual.GRUPOADICIONAL"
                hide-details="auto"
                label="Grupo"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="fechaCreacionFormat"
                hide-details="auto"
                label="Fecha Creación"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="hojaActual.ESTADOHOJAID"
                hide-details="auto"
                label="Estado"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" elevation="3" outlined @click="grabaRegistro()">Grabar</v-btn>
        <v-btn color="error" elevation="3" outlined @click="cerrar()">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
