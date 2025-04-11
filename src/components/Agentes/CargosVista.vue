<script setup>
import { ref } from 'vue'
import { getFechaToAPIFromDDMMYYYY, getFechaDMY } from '@/utils/formatos'
import { rules } from '@/utils/reglasValidacion'
import {
  reparticiones,
  tiposEmpleo,
  tipoLiq,
  tiposOS,
  estadosCargo,
  sitRev,
  getObjetList
} from '@/utils/tipos'

const props = defineProps(['Registro', 'cerrar', 'funcion'])
let registroOrigen = props.Registro
let registroActual = ref({})

const form = ref(null)
const formOK = ref(false)

const fechaBaja = ref(null)
const vtoEscalafon = ref(null)

const reparticionSelected = ref(reparticiones[0])
const tipoEmpleoSelected = ref(tiposEmpleo[0])
const tipoLiqSelected = ref(tipoLiq[0])
const tipoOSSelected = ref(tiposOS[0])
const estadoCargoSelected = ref(estadosCargo[0])
const sitRevSelect = ref(sitRev[0])

const registroVacio = ref({
  PERSONAID: 0,
  ORDEN: 0,
  AFILIADO: 0,
  ANTIGUEDAD: 0,
  CATEGORIA: 0,
  SALARIO: 0,
  ID: 0
})

if (registroOrigen) {
  registroActual.value = { ...registroOrigen }
  fechaBaja.value = getFechaDMY(registroActual.value.FECHABAJA)
  vtoEscalafon.value = getFechaDMY(registroActual.value.VTOESCALAFON)
  reparticionSelected.value = getObjetList(reparticiones, registroOrigen.REPARTICIONID)
  tipoEmpleoSelected.value = getObjetList(tiposEmpleo, registroOrigen.TIPOEMPLEOID)
  sitRevSelect.value = getObjetList(sitRev, registroOrigen.SITUACIONREVISTAID)
  estadoCargoSelected.value = getObjetList(reparticiones, registroOrigen.ESTADOCARGOID)
  tipoOSSelected.value = getObjetList(tiposOS, registroOrigen.TIPOOBRASOCIALID)
  tipoLiqSelected.value = getObjetList(tipoLiq, registroOrigen.TIPOLIQUIDACIONID)
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

  // si es esposa/o coloca valores predeterminados en campos de hijo

  //

  let fecBaja = ''
  if (fechaBaja.value !== null)
    if (fechaBaja.value.length > 0) fecBaja = getFechaToAPIFromDDMMYYYY(fechaBaja.value)

  let vtoEsc = ''
  if (vtoEscalafon.value !== null)
    if (vtoEscalafon.value.length > 0) vtoEsc = getFechaToAPIFromDDMMYYYY(vtoEscalafon.value)

  let registroGrabar = {
    vIDPERS: registroActual.value.PERSONAID,
    vIDREP: reparticionSelected.value.value,
    vORDEN: registroActual.value.ORDEN,
    vAFILIADO: registroActual.value.AFILIADO,
    vIDTIPOEMPLEO: tipoEmpleoSelected.value.value,
    vVTOESC: vtoEsc,
    vANTIGUEDAD: registroActual.value.APELLIDOYNOMBRE,
    vIDSITREV: sitRevSelect.value.value,
    vCATEGORIA: registroActual.value.CATEGORIA,
    vFECHABAJA: fecBaja,
    vIDESTADOCARGO: estadoCargoSelected.value.value,
    vIDTIPOOS: tipoOSSelected.value.value,
    vIDTIPOLIQ: tipoLiqSelected.value.value
  }
  if (registroActual.value.ID !== 0) {
    registroGrabar = {
      vID: registroActual.value.ID,
      ...registroGrabar
    }
  }

  console.log('se va a grabar el siguiente registro')
  console.log(JSON.stringify(registroGrabar))
  let resultado = await props.funcion(registroGrabar, registroActual.value.ID)

  if (resultado === null) {
    props.cerrar()
  } else {
    mensajeError.value = resultado
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
        <v-card-title>Carga Familiar</v-card-title>
        <v-card-subtitle>
          {{ registroActual.ID == 0 ? 'Agregar ' : 'Modificar' }}
        </v-card-subtitle>
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
          <v-container style="height: 60vh; overflow-y: scroll">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.DOCUMENTO"
                  hide-details="auto"
                  label="DNI"
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 8, 9)]"
                ></v-text-field>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="registroActual.APELLIDOYNOMBRE"
                  hide-details="auto"
                  label="Apellido"
                  lazy-validation
                  :rules="[(val) => rules.longitudEntre(val, 3, 100)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-select
                  label="Relación"
                  :items="tipoRelacionFamiliar"
                  item-title="name"
                  item-value="value"
                  v-model="relacionFamiliarSelected"
                  return-object
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row v-if="relacionFamiliarSelected.value == 2">
              <v-col cols="6">
                <v-select
                  label="Escolaridad"
                  :items="tipoEscolaridad"
                  item-title="name"
                  item-value="value"
                  v-model="escolaridadSelected"
                  return-object
                >
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="fechaNacimiento"
                  hide-details="auto"
                  label="Fec. Nac."
                  lazy-validation
                  :rules="[
                    ...rules.ddmmyyyy,
                    (val) =>
                      rules.longitudEntre(val, relacionFamiliarSelected.value == 2 ? 8 : 0, 10)
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="relacionFamiliarSelected.value == 2">
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.GRADO"
                  hide-details="auto"
                  label="Grado"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 1)]"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-checkbox
                  v-model="registroActual.DISCAPACITADO"
                  color="primary"
                  label="Discapacitado"
                  hide-details
                ></v-checkbox>
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
