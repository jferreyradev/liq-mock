<script setup>
import { ref } from 'vue'
import { getVto } from '@/utils/formatos'
import { rules } from '@/utils/reglasValidacion'

const props = defineProps(['Registro', 'cerrar', 'funcion', 'hojaId'])
let registroOrigen = props.Registro
let hojaId = props.hojaId
let registroActual = ref({})

const formOK = ref(false)

const registroVacio = ref({
  NROREPARTICION: 0,
  NROBOLETA: 0,
  NROAFILIADO: 0,
  CODIGO: 0,
  SUBCODIGO: 0,
  CLASE: 0,
  DIAS: 0,
  VENCIMIENTO: null,
  IMPORTE: 0,
  DOCUMENTO: 0,
  APELLIDO: '',
  NOMBRE: '',
  TIPOEMPLEOID: 0,
  SITUACIONREVISTAID: 0,
  TIPOOBRASOCIALID: 0,
  PPP: 0,
  FECHAGRABACION: null,
  ESTADOREGISTRO: 0,
  HOJAID: hojaId,
  ID: 0
})
const vencimiento = ref(null)

if (registroOrigen) {
  registroActual.value = { ...registroOrigen }
  vencimiento.value = getVto(registroOrigen.VENCIMIENTO)
} else {
  registroActual.value = registroVacio.value
}

const mostrarAlert = ref(false)

let mensajeError = ref('')

async function grabaRegistro() {
  if (formOK.value === false) {
    return
  }
  mostrarAlert.value = false
  if (!validarRegistro()) {
    mostrarAlert.value = true
    return
  }

  const registroGrabar = {
    NroReparticion: registroActual.value.NROREPARTICION,
    NroBoleta: registroActual.value.NROBOLETA,
    NroAfiliado: registroActual.value.NROAFILIADO,
    Codigo: registroActual.value.CODIGO,
    Subcodigo: registroActual.value.SUBCODIGO,
    Clase: registroActual.value.CLASE,
    Dias: registroActual.value.DIAS,
    Vencimiento: registroActual.value.VENCIMIENTO,
    Importe: registroActual.value.IMPORTE,
    Documento: registroActual.value.DOCUMENTO,
    Apellido: registroActual.value.APELLIDO,
    Nombre: registroActual.value.NOMBRE,
    TipoEmpleoId: registroActual.value.TIPOEMPLEOID,
    SituacionRevistaId: registroActual.value.SITUACIONREVISTAID,
    TipoObraSocialId: registroActual.value.TIPOOBRASOCIALID,
    PPP: registroActual.value.PPP,
    FechaGrabacion: registroActual.value.FECHAGRABACION,
    EstadoRegistro: registroActual.value.ESTADOREGISTRO,
    HojaId: registroActual.value.HOJAID,
    Id: registroActual.value.ID
  }
  console.log(registroGrabar)
  let grabarOk = await props.funcion(registroGrabar)

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
        <v-card-title>Novedades de Haberes</v-card-title>
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
                  v-model="registroActual.NROREPARTICION"
                  hide-details="auto"
                  label="Repartición"
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 3)]"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.NROBOLETA"
                  hide-details="auto"
                  label="Nro. Boleta"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 7)]"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.NROAFILIADO"
                  hide-details="auto"
                  label="Afiliado"
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
                  v-model="registroActual.CLASE"
                  hide-details="auto"
                  label="Clase"
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 3)]"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.DIAS"
                  hide-details="auto"
                  label="Días"
                  :rules="[
                    ...rules.number,
                    (val) => rules.longitudEntre(val, 1, 2),
                    (val) => rules.rango(val, 0, 30)
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
                  :rules="rules.numDecimal"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <v-text-field
                  v-model="registroActual.DOCUMENTO"
                  hide-details="auto"
                  label="Documento"
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 9)]"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="registroActual.APELLIDO"
                  hide-details="auto"
                  label="Apellido"
                  :rules="[(val) => rules.longitudEntre(val, 3, 60)]"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="registroActual.NOMBRE"
                  hide-details="auto"
                  label="Nombre"
                  :rules="[(val) => rules.longitudEntre(val, 3, 60)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.TIPOEMPLEOID"
                  hide-details="auto"
                  label="Tipo Empleo"
                  :rules="[
                    ...rules.number,
                    (val) => rules.longitudEntre(val, 1, 1),
                    (val) => rules.rango(val, 1, 9)
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.SITUACIONREVISTAID"
                  hide-details="auto"
                  label="Sit. Rev."
                  :rules="[
                    ...rules.number,
                    (val) => rules.longitudEntre(val, 1, 1),
                    (val) => rules.rango(val, 1, 9)
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.TIPOOBRASOCIALID"
                  hide-details="auto"
                  label="Tipo OS"
                  :rules="[
                    ...rules.number,
                    (val) => rules.longitudEntre(val, 1, 1),
                    (val) => rules.rango(val, 1, 9)
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.PPP"
                  hide-details="auto"
                  label="PPP"
                  :rules="[
                    ...rules.number,
                    (val) => rules.longitudEntre(val, 1, 1),
                    (val) => rules.rango(val, 1, 9)
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.FECHAGRABACION"
                  hide-details="auto"
                  label="Grabación"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.ESTADOREGISTRO"
                  hide-details="auto"
                  label="Estado"
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
