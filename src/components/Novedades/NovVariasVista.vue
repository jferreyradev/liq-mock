<script setup>
import { ref } from 'vue'
import { getVto, getVtoActual, getFechaToAPIFromMMYYYY, getDecimalToAPI } from '@/utils/formatos'
import { rules } from '@/utils/reglasValidacion'
import { financial } from '@/utils/reportes'

const props = defineProps(['Registro', 'cerrar', 'funcion', 'hojaId'])
let registroOrigen = props.Registro
let hojaId = props.hojaId
let registroActual = ref({})

const form = ref(null)
const formOK = ref(false)

const vencimiento = ref(null)
const periodo = ref(getVtoActual())

const registroVacio = ref({
  IDREP: 0,
  ORDEN: 0,
  CODIGO: 0,
  SUBCODIGO: 0,
  PARAM1: 0,
  PARAM2: 0,
  VENCIMIENTO: vencimiento,
  IMPORTE: null,
  PERIODO: periodo,
  FECHAGRABACION: null,
  ESTADOREGISTRO: 0,
  HOJAID: hojaId,
  ID: 0
})

if (registroOrigen) {
  registroActual.value = { ...registroOrigen }
  vencimiento.value = getVto(registroOrigen.VENCIMIENTO)
  periodo.value = getVto(registroOrigen.PERIODO)
  registroActual.value.IMPORTE = financial(registroOrigen.IMPORTE)
} else {
  registroActual.value = registroVacio.value
}

const mostrarAlert = ref(false)

let mensajeError = ref('')

async function grabaRegistro() {
  const isValid = await form.value.validate()

  if (!isValid) {
    return
  }
  if (formOK.value === false) {
    return
  }
  mostrarAlert.value = false
  if (!validarRegistro()) {
    mostrarAlert.value = true
    return
  }

  let vto = ''
  if (vencimiento.value != null) {
    if (vencimiento.value.length > 0) vto = getFechaToAPIFromMMYYYY(vencimiento.value)
  }
  let registroGrabar = {
    vIDREP: registroActual.value.IDREP,
    vORDEN: registroActual.value.ORDEN,
    vCOD: registroActual.value.CODIGO,
    vSUBCOD: registroActual.value.SUBCODIGO,
    vP1: registroActual.value.PARAM1,
    vP2: registroActual.value.PARAM2,
    vVTO: vto,
    vIMP: getDecimalToAPI(registroActual.value.IMPORTE),
    vIDHOJANOV: hojaId,
    vPERIODO: getFechaToAPIFromMMYYYY(periodo.value)
  }
  if (registroActual.value.ID !== 0) {
    registroGrabar = {
      vIDNOV: registroActual.value.ID,
      ...registroGrabar,
      vIDESTADOREG: registroActual.value.ESTADOREGISTRO,
      vFECHAGRAB: registroActual.value.FECHAGRABACION
    }
  }

  console.log(registroGrabar)
  let grabarOk = await props.funcion(registroGrabar, registroActual.value.ID)

  if (grabarOk) {
    props.cerrar()
  } else {
    mensajeError.value = 'No se pudieron grabar los datos'
    mostrarAlert.value = true
  }
}

function validarRegistro() {
  return true
}
</script>

<template>
  <v-container>
    <v-card>
      <v-form ref="form" v-model="formOK">
        <v-card-title>Novedades Varias</v-card-title>
        <v-card-subtitle>Agregar en Hoja Nº {{ hojaId }}</v-card-subtitle>
        <v-alert
          v-model="mostrarAlert"
          border="start"
          close-label="Close Alert"
          color="error"
          icon="$error"
          closable
        >
          {{ mensajeError }}
        </v-alert>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="2">
                <v-text-field
                  v-model="registroActual.IDREP"
                  hide-details="auto"
                  label="Repartición"
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 7)]"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.ORDEN"
                  hide-details="auto"
                  label="Nro. Boleta"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 7)]"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="registroActual.CODIGO"
                  hide-details="auto"
                  label="Código"
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 4)]"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="registroActual.SUBCODIGO"
                  hide-details="auto"
                  label="Sub. Cód."
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 3)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.PARAM1"
                  hide-details="auto"
                  label="P1"
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 3)]"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.PARAM2"
                  hide-details="auto"
                  label="P2"
                  :rules="[
                    ...rules.number,
                    (val) => rules.longitudEntre(val, 1, 2),
                    (val) => rules.rango(val, 0, 99)
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="vencimiento"
                  hide-details="auto"
                  label="Vencimiento"
                  :rules="rules.mmyyyy"
                >
                </v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.IMPORTE"
                  hide-details="auto"
                  label="Importe"
                  :rules="[...rules.numDecimal, (val) => rules.longitudMin(val, 1)]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="primary" elevation="3" outlined value="grabar" @click="grabaRegistro()"
            >Grabar</v-btn
          >
          <v-btn color="error" elevation="3" outlined @click="cerrar()">Cancelar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>
