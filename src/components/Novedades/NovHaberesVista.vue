<script setup>
import { ref } from 'vue'
import {  tipoCarga, tipoHoja, tipoLiq, getObjetList } from '@/utils/tipos'

const props = defineProps(['Registro', 'cerrar', 'funcion'])
let registroActual = props.Registro

//const fechaSplit = (vto) => {
//  if (vto) {
//    const d = vto.split('-')
//    const f = {
//      dia: d[2],
//      mes: d[1],
//      anio: d[0]
//    }
//    return f
//  }
//  return null
//}

//const fechaActual = new Date()
//let mesActual = fechaActual.getMonth()
//let anioActual = fechaActual.getFullYear()
//let diaActual = fechaActual.getDate()
//let fechaCreacionFormat =
//  anioActual.toString() +
//  '-' +
//  (mesActual + 1).toString().padStart(2, '0') +
//  '-' +
//  diaActual.toString().padStart(2, '0')
//const month = ref(months[fechaActual.getMonth()])
//const year = ref(fechaActual.getFullYear())
const tipoCargaSelected = ref(tipoCarga[0])
const tipoHojaSelected = ref(tipoHoja[0])
const liqSelected = ref(tipoLiq[0])

const registroVacio = {
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
  HOJAID: 0,
  ID: 0
}

if (registroActual) {
  tipoCargaSelected.value = getObjetList(tipoCarga, registroActual.TIPOCARGAID)
  liqSelected.value = getObjetList(tipoLiq, registroActual.TIPOLIQUIDACIONID)
  tipoHojaSelected.value = getObjetList(tipoHoja, registroActual.TIPOHOJAID)
  //let periodo = fechaSplit(registroActual.PERIODOID)
  //month.value = months[periodo.mes - 1]
  //year.value = periodo.anio
  //fechaCreacionFormat = registroActual.FECHAGRABACION.substring(0, 10)
} else {
  registroActual = registroVacio
}

const mostrarAlert = ref(false)

let mensajeError=ref('')
async function grabaRegistro() {
  mostrarAlert.value = false
  if (!validarRegistro()) {
    console.log('error')
    mostrarAlert.value = true
    return
  }
  //let fechaR = registroActual.FECHACREACION
  //if (registroActual.ID != 0) {
  //  fechaR = fechaCreacionFormat
  //}

  const registroGrabar = {
    NroRepararticion: registroActual.NROREPARTICION,
    NroBoleta: registroActual.NROBOLETA,
    NroAfiliado: registroActual.NROAFILIADO,
    Codigo: registroActual.CODIGO,
    SubCodigo: registroActual.SUBCODIGO,
    Clase: registroActual.CLASE,
    Dias: registroActual.DIAS,
    Vencimiento: registroActual.VENCIMIENTO,
    Importe: registroActual.IMPORTE,
    Documento: registroActual.DOCUMENTO,
    Apellido: registroActual.APELLIDO,
    Nombre: registroActual.NOMBRE,
    TipoEmplpeoId: registroActual.TIPOEMPLEOID,
    SituacionRevistaId: registroActual.SITUACIONREVISTAID,
    TipoObraSocialId: registroActual.TIPOOBRASOCIALID,
    PPP: registroActual.PPP,
    FechaGrabacion: registroActual.FECHAGRABACION,
    EstadoRegistro: registroActual.ESTADOREGISTRO,
    HojaId: registroActual.HOJAID,
    Id: registroActual.ID
  }

  let grabarOk = await props.funcion(registroGrabar)

  if (grabarOk) {
    props.cerrar()
  } else {
    mensajeError.value="No se pudieron grabar los datos"
    mostrarAlert.value = true
  }
} 

function validarRegistro(){
  console.log(typeof registroActual.CLASE)
  if ( isNaN(parseInt(registroActual.CLASE)) ) {
    mensajeError.value="Debe especificar un valor entre 0 y 999 para Claseaaa"
    return false;
  }
  registroActual.CLASE = parseInt(registroActual.CLASE)
  if (registroActual.CLASE < 0 || registroActual.CLASE>999 || !Number.isInteger(registroActual.CLASE)) {
    mensajeError.value="Debe especificar un valor entre 0 y 999 para Clase"
    return false;
  }
  return true
}
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>Novedades de Haberes</v-card-title>
      <v-card-subtitle>Agregar</v-card-subtitle>
      <v-alert
        v-model="mostrarAlert"
        border="start"
        close-label="Close Alert"
        color="error"
        icon="$error"
        closable
      >
        {{mensajeError}}
      </v-alert>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="2">
              <v-text-field
                v-model="registroActual.NROREPARTICION"
                hide-details="auto"
                label="Repartición"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.NROBOLETA"
                hide-details="auto"
                label="Nro. Boleta"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.NROAFILIADO"
                hide-details="auto"
                label="Afiliado"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="registroActual.CODIGO"
                hide-details="auto"
                label="Código"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="registroActual.SUBCODIGO"
                hide-details="auto"
                label="Sub. Cód."
                readonly=""
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.CLASE"
                hide-details="auto"
                label="Clase"
                
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.DIAS"
                hide-details="auto"
                label="Días"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.VENCIMIENTO"
                hide-details="auto"
                label="Vencimiento"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.IMPORTE"
                hide-details="auto"
                label="Importe"
                readonly=""
              ></v-text-field>
            </v-col>

          </v-row>

          <v-row>
            <v-col cols="2">
              <v-text-field
                v-model="registroActual.DOCUMENTO"
                hide-details="auto"
                label="Documento"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="registroActual.APELLIDO"
                hide-details="auto"
                label="Apellido"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="registroActual.NOMBRE"
                hide-details="auto"
                label="Nombre"
                readonly=""
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.TIPOEMPLEOID"
                hide-details="auto"
                label="Tipo Empleo"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.SITUACIONREVISTAID"
                hide-details="auto"
                label="Sit. Rev."
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.TIPOOBRASOCIALID"
                hide-details="auto"
                label="Tipo OS"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.PPP"
                hide-details="auto"
                label="PPP"
                readonly=""
              ></v-text-field>
            </v-col>

          </v-row>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.FECHAGRABACION"
                hide-details="auto"
                label="Grabación"
                readonly=""
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="registroActual.ESTADOREGISTRO"
                hide-details="auto"
                label="Estado"
                readonly=""
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
