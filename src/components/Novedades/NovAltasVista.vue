<script setup>
import { ref } from 'vue'
import { getVto, getVtoActual, getFechaToAPIFromMMYYYY } from '@/utils/formatos'
import { rules } from '@/utils/reglasValidacion'
import { sexos, getObjetList } from '@/utils/tipos'

const props = defineProps(['Registro', 'cerrar', 'funcion', 'hojaId'])
let registroOrigen = props.Registro
let hojaId = props.hojaId
let registroActual = ref({})

const form = ref(null)
const formOK = ref(false)

const vencimiento = ref(getVtoActual())
const periodo = ref(getVtoActual())

const sexoSelected = ref(sexos[0])

const registroVacio = ref({
  IDREP: 0,
  ORDEN: 0,
  AFILIADO: 0,
  DNI: 0,
  CUIL: 0,
  APELLIDO: '',
  NOMBRE: '',
  SEXO: '',
  TE: 0,
  CC: 0,
  CAT: 0,
  ANTIG: 0,
  VTO: vencimiento,
  TITULO: 0,
  DIFCAT: 0,
  AJUB: false,
  PERIODO: periodo,
  FECHAGRABACION: null,
  ESTADOREGISTRO: 0,
  HOJAID: hojaId,
  ID: 0
})

if (registroOrigen) {
  registroActual.value = { ...registroOrigen }
  registroActual.value.AJUB = registroOrigen.AJUB == 1
  vencimiento.value = getVto(registroOrigen.VTO)
  periodo.value = getVto(registroOrigen.PERIODO)
  sexoSelected.value = getObjetList(sexos, registroOrigen.SEXO)
  
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

  let registroGrabar = {
    vREP: registroActual.value.IDREP,
    vORD: registroActual.value.ORDEN,
    vAFI: registroActual.value.AFILIADO,
    vDNI: registroActual.value.DNI,
    vCUIL: registroActual.value.CUIL,
    vAPE: registroActual.value.APELLIDO,
    vNOM: registroActual.value.NOMBRE,
    vSEXO: sexoSelected.value.value,
    vTE: registroActual.value.TE,
    vCC: registroActual.value.CC,
    vCAT: registroActual.value.CAT,
    vANTIG: registroActual.value.ANTIG,
    vVTO: getFechaToAPIFromMMYYYY(vencimiento.value),
    vTITULO: registroActual.value.TITULO,
    vDIF_CAT: registroActual.value.DIFCAT,
    vAJUB: registroActual.value.AJUB ? 1 : 0,
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
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.IDREP"
                  hide-details="auto"
                  label="Repartición"
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 7)]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.ORDEN"
                  hide-details="auto"
                  label="Nro. Boleta"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 7)]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.AFILIADO"
                  hide-details="auto"
                  label="Afiliado"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 7)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.APELLIDO"
                  hide-details="auto"
                  label="Apellido"
                  lazy-validation
                  :rules="[(val) => rules.longitudEntre(val, 3, 100)]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.NOMBRE"
                  hide-details="auto"
                  label="Nombre"
                  lazy-validation
                  :rules="[(val) => rules.longitudEntre(val, 3, 100)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.DNI"
                  hide-details="auto"
                  label="DNI"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 9)]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.CUIL"
                  hide-details="auto"
                  label="CUIL"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 11, 11)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-select
                  label="Tipo Liq"
                  :items="sexos"
                  item-title="name"
                  item-value="value"
                  v-model="sexoSelected"
                  return-object
                >
                </v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.TE"
                  hide-details="auto"
                  label="Tipo Emp."
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 2)]"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.CC"
                  hide-details="auto"
                  label="Sit. Rev."
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 2)]"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.CAT"
                  hide-details="auto"
                  label="categoría"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 2)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.ANTIG"
                  hide-details="auto"
                  label="Antig."
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 2)]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="vencimiento"
                  hide-details="auto"
                  label="Vencimiento"
                  :rules="rules.mmyyyy"
                >
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.TITULO"
                  hide-details="auto"
                  label="Título"
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 3)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.DIFCAT"
                  hide-details="auto"
                  label="Dif. Cat."
                  lazy-validation
                  :rules="[...rules.number, (val) => rules.longitudEntre(val, 1, 2)]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  v-model="registroActual.AJUB"
                  color="primary"
                  label="Ap. Jub"
                  value="primary"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="periodo" hide-details="auto" label="Período"></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="registroActual.ID != 0">
              <v-col cols="4">
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
