<script setup>
import { ref } from 'vue'
import { getFechaToAPIFromDDMMYYYY, getFechaDMY } from '@/utils/formatos'
import { rules } from '@/utils/reglasValidacion'
import { sexos, estadosCivil, tiposDoc, getObjetList } from '@/utils/tipos'

const props = defineProps(['Registro', 'cerrar', 'funcion', 'soloLectura'])
let registroOrigen = props.Registro
let registroActual = ref({})
const soloLectura = props.soloLectura

const form = ref(null)
const formOK = ref(false)

const fechaNacimiento = ref(null)
const fechaIngreso = ref(null)

const sexoSelected = ref(sexos[0])
const tipoDocSelected = ref(tiposDoc[0])
const estCivilSelected = ref(estadosCivil[0])

const registroVacio = ref({
  DOCUMENTO: 0,
  APELLIDO: null,
  NOMBRE: null,
  CUIL: 0,
  TELEFONO: null,
  EMAIL: null,
  DOMICILIOCALLE: null,
  DOMICILIONUMERO: null,
  PISO: null,
  DEPARTAMENTO: null,
  CBU: null,
  CUENTA: null
})

if (registroOrigen) {
  registroActual.value = { ...registroOrigen }
  fechaNacimiento.value = getFechaDMY(registroActual.value.FECHANACIMIENTO)
  fechaIngreso.value = getFechaDMY(registroActual.value.FECHAINGRESO)
  tipoDocSelected.value = getObjetList(tiposDoc, registroOrigen.TIPODOCUMENTOID)
  sexoSelected.value = getObjetList(sexos, registroOrigen.SEXO)
  estCivilSelected.value = getObjetList(estadosCivil, registroOrigen.ESTADOCIVILID)
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

  let fecNacimiento = ''
  if (fechaNacimiento.value !== null)
    if (fechaNacimiento.value.length > 0)
      fecNacimiento = getFechaToAPIFromDDMMYYYY(fechaNacimiento.value)

  let fecIngreso = ''
  if (fechaIngreso.value !== null)
    if (fechaIngreso.value.length > 0) fecIngreso = getFechaToAPIFromDDMMYYYY(fechaIngreso.value)

  let registroGrabar = {
    vDNI: registroActual.value.DOCUMENTO,
    vAPELLIDO: registroActual.value.APELLIDO,
    vCUIL: registroActual.value.CUIL,
    vSEXO: sexoSelected.value.value,
    vFECHANAC: fecNacimiento,
    vDOMICILIO: registroActual.value.DOMICILIOCALLE,
    vNRO: registroActual.value.DOMICILIONUMERO,
    vFECHAINGRESO: fecIngreso,
    vTELEFONO: registroActual.value.TELEFONO,
    vEMAIL: registroActual.value.EMAIL,
    vNOMBRE: registroActual.value.NOMBRE,
    vIDTIPODOC: tipoDocSelected.value.value,
    vIDTESTCIVIL: estCivilSelected.value.value,
    vLOCALIDAD_ID: registroActual.value.LOCALIDADID,
    vPISO: registroActual.value.PISO,
    vDPTO: registroActual.value.DEPARTAMENTO,
    vCUENTA: registroActual.value.CUENTA,
    vCBU: registroActual.value.CBU
  }
  if (registroActual.value.ID !== 0) {
    registroGrabar = {
      vIDPERS: registroActual.value.ID,
      ...registroGrabar
    }
  }

  //console.log(JSON.stringify(registroGrabar))
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
        <v-card-title>Detalle del Cargo</v-card-title>
        <v-card-subtitle>
          {{ registroActual.ID == 0 ? 'Agregar ' : 'Datos del Cargo' }}
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
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.APELLIDO"
                  hide-details="auto"
                  label="Apellido"
                  lazy-validation
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.NOMBRE"
                  hide-details="auto"
                  label="Nombre"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4">
                <v-select
                  label="Sexo"
                  :items="sexos"
                  item-title="name"
                  item-value="value"
                  v-model="sexoSelected"
                  return-object
                >
                </v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.CUIL"
                  hide-details="auto"
                  label="CUIL"
                  lazy-validation
                  :rules="[(val) => rules.longitudEntre(val, 11, 11), rules.number]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="fechaNacimiento"
                  hide-details="auto"
                  label="Fecha Nac."
                  lazy-validation
                  :rules="[...rules.ddmmyyyy]"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.TELEFONO"
                  hide-details="auto"
                  label="Teléfono"
                  lazy-validation
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.EMAIL"
                  hide-details="auto"
                  label="EMAIL"
                  lazy-validation
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="fechaIngreso"
                  hide-details="auto"
                  label="Fecha Ing."
                  lazy-validation
                  :rules="[...rules.ddmmyyyy]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="registroActual.DOMICILIOCALLE"
                  hide-details="auto"
                  label="Calle"
                  lazy-validation
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="registroActual.DOMICILIONUMERO"
                  hide-details="auto"
                  label="Número"
                  lazy-validation
                  :rules="[...rules.number]"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="registroActual.PISO"
                  hide-details="auto"
                  label="Piso"
                  lazy-validation
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="registroActual.DEPARTAMENTO"
                  hide-details="auto"
                  label="Dpto"
                  lazy-validation
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="6">
                <v-select
                  label="Reparticion"
                  :items="reparticiones"
                  item-title="name"
                  item-value="value"
                  v-model="reparticionSelected"
                  return-object
                  :readonly="soloLectura"
                >
                </v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.ORDEN"
                  hide-details="auto"
                  label="Orden"
                  lazy-validation
                  :rules="[(val) => rules.longitudEntre(val, 1, 7), rules.number]"
                  :readonly="soloLectura"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="registroActual.AFILIADO"
                  hide-details="auto"
                  label="Afiliado"
                  lazy-validation
                  :rules="[(val) => rules.longitudEntre(val, 1, 7), rules.number]"
                  :readonly="soloLectura"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-select
                  label="Tipo Empleo"
                  :items="tiposEmpleo"
                  item-title="name"
                  item-value="value"
                  v-model="tipoEmpleoSelected"
                  return-object
                  :readonly="soloLectura"
                >
                </v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="vtoEscalafon"
                  hide-details="auto"
                  label="Vto. Escalafón"
                  lazy-validation
                  :rules="[...rules.ddmmyyyy]"
                  :readonly="soloLectura"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.ANTIGUEDAD"
                  hide-details="auto"
                  label="Antigüedad"
                  lazy-validation
                  :rules="[(val) => rules.longitudEntre(val, 1, 2), rules.number]"
                  :readonly="soloLectura"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-select
                  label="Sit. Revista"
                  :items="sitRev"
                  item-title="name"
                  item-value="value"
                  v-model="sitRevSelect"
                  return-object
                  :readonly="soloLectura"
                >
                </v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="registroActual.CATEGORIA"
                  hide-details="auto"
                  label="Categoría"
                  lazy-validation
                  :rules="[(val) => rules.longitudEntre(val, 1, 2), rules.number]"
                  :readonly="soloLectura"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="fechaBaja"
                  hide-details="auto"
                  label="Fecha Baja"
                  lazy-validation
                  :rules="[...rules.ddmmyyyy]"
                  :readonly="soloLectura"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-select
                  label="Estado Cargo"
                  :items="estadosCargo"
                  item-title="name"
                  item-value="value"
                  v-model="estadoCargoSelected"
                  return-object
                  :readonly="soloLectura"
                >
                </v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  label="Tipo OS"
                  :items="tiposOS"
                  item-title="name"
                  item-value="value"
                  v-model="tipoOSSelected"
                  return-object
                  :readonly="soloLectura"
                >
                </v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  label="Tipo Liq."
                  :items="tipoLiq"
                  item-title="name"
                  item-value="value"
                  v-model="tipoLiqSelected"
                  return-object
                  :readonly="soloLectura"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-checkbox
                  v-model="salario"
                  color="primary"
                  label="Salario"
                  hide-details
                  readonly
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn
            v-if="!soloLectura"
            color="primary"
            elevation="3"
            outlined
            value="grabar"
            @click="grabaRegistro()"
            >Grabar</v-btn
          >
          <v-btn color="error" elevation="3" outlined @click="cerrar()">Cerrar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>
