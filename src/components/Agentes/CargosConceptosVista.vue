<script setup>
import { ref } from 'vue'
import { getFechaToAPIFromDDMMYYYY, getFechaDMY } from '@/utils/formatos'
import { rules } from '@/utils/reglasValidacion'

const props = defineProps(['Registro', 'cerrar', 'funcion', 'cargoId'])
let registroOrigen = props.Registro
let cargoId = props.cargoId
let registroActual = ref({})

const form = ref(null)
const formOK = ref(false)

const vencimiento = ref(null)
const periodo = ref(null)

//const escolaridadSelected = ref(tipoEscolaridad[0])
//const relacionFamiliarSelected = ref(tipoRelacionFamiliar[0])

const registroVacio = ref({
  CODIGO: 0,
  SUBCODIGO: 0,
  PARAMETRO1: 0,
  PARAMETRO2: 0,
  IMPORTE: 0,
  GRUPOADICIONALID: 0,
  PENLEY: 0,
  ID: 0
})

if (registroOrigen) {
  registroActual.value = { ...registroOrigen }
  vencimiento.value = getFechaDMY(registroActual.value.VENCIMIENTO)
  periodo.value = getFechaDMY(registroActual.value.PERIODO)
  
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

  //

  let fecVencimiento = ''
  if (vencimiento.value !== null)
    if (vencimiento.value.length > 0)
      fecVencimiento = getFechaToAPIFromDDMMYYYY(vencimiento.value)

  let fecPeriodo = ''
  if (periodo.value !== null)
    if (periodo.value.length > 0)
      fecPeriodo = getFechaToAPIFromDDMMYYYY(periodo.value)

  
  let registroGrabar = {
    vCARGOID: cargoId,
    vCODIGO: registroActual.value.CODIGO,
    vSUBCODIGO: registroActual.value.SUBCODIGO,
    vPARAMETRO1: registroActual.value.PARAMETRO1,
    vPARAMETRO2: registroActual.value.PARAMETRO2,
    vVENCIMIENTO: fecVencimiento,
    vIMPORTE: registroActual.value.IMPORTE,
    vPERIODO: fecPeriodo,
    vGRUPOADICIONALID: registroActual.value.GRUPOADICIONALID,
    vPENLEY: registroActual.value.PENLEY,
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
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.CODIGO"
                  hide-details="auto"
                  label="Código"
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 4)]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.SUBCODIGO"
                  hide-details="auto"
                  label="Subcódigo"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 3)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.PARAMETRO1"
                  hide-details="auto"
                  label="Parámetro 1"
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 4)]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.PARAMETRO2"
                  hide-details="auto"
                  label="Parámetro 2"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 3)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="vencimiento"
                  hide-details="auto"
                  label="Fec. Vto."
                  lazy-validation
                  :rules=" [...rules.ddmmyyyy, 
                      (val) => rules.longitudEntre(val, relacionFamiliarSelected.value == 2 ? 8 : 0 , 10)]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.IMPORTE"
                  hide-details="auto"
                  label="Importe"
                  lazy-validation
                  :rules="[...rules.number]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="periodo"
                  hide-details="auto"
                  label="Período"
                  lazy-validation
                  :rules=" [...rules.ddmmyyyy, 
                      (val) => rules.longitudEntre(val,  8, 10)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.GRUPOADICIONALID"
                  hide-details="auto"
                  label="Grupo Adic."
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 2)]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.PENLEY"
                  hide-details="auto"
                  label="Es Ley"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 1)]"
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
