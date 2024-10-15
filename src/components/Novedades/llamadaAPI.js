// Ejemplo implementando el metodo POST:

import { useEndPoints } from '@/composables/useEndPoints'

const { apiBase } = useEndPoints()

// const urlAPI = 'http://www.serverburru2.duckdns.org:3005/api/'

const urlAPI = apiBase.value + '/api/';

export async function grabarRegistro(url = '', data = {}, metodo = 'POST') {
  let estado = 0
  let operacionOk = false
  let errmsg = ''
  let datos = null

  try {
    const response = await fetch(urlAPI + url, {
      method: metodo, // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    estado = response.status
    operacionOk = response.ok
    if (response.ok) {
      datos = await response.json()
    } else {
      errmsg = 'Error al intentar grabar el registro'
    }
  } catch (error) {
    estado = 999
    operacionOk = false
    errmsg = 'Error en la Red'
    datos = null
  }
  return { estado, operacionOk, errmsg, datos }
}

export async function eliminarRegistro(url = '', metodo = 'DELETE') {
  let estado = 0
  let operacionOk = false
  let errmsg = ''
  let datos = null
  // Opciones por defecto estan marcadas con un *
  try {
    const response = await fetch(urlAPI + url, {
      method: metodo, // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, *cors, same-origin
      //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: 'same-origin' // include, *same-origin, omit
      //headers: {
      //  'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
      //},
      //redirect: 'follow', // manual, *follow, error
      //referrerPolicy: 'no-referrer'
    })
    estado = response.status
    operacionOk = response.ok
    console.log(response)
    if (response.ok) {
      datos = await response.json()
    } else {
      errmsg = 'Error al intentar eliminar el registro'
    }
  } catch (error) {
    estado = 999
    operacionOk = false
    errmsg = 'Error en la Red'
    datos = null
  }
  return { estado, operacionOk, errmsg, datos }
}

export async function leerDatos(url) {
  let estado = 0
  let operacionOk = false
  let errmsg = ''
  let datos = null
  console.log(urlAPI + url)
  let response = null
  try {
    response = await fetch(urlAPI + url)
    estado = response.status

    if (response.ok) {
      datos = await response.json()
    }
    operacionOk = response.ok
    if (response.status == 404) operacionOk = true
  } catch (error) {
    estado = 999
    operacionOk = false
    errmsg = 'Error en la Red'
    datos = null
  }
  return { estado, operacionOk, errmsg, datos }
}

export async function ejecutarSP(url = '', data = {}, metodo = 'POST') {
  let estado = 0
  let operacionOk = false
  let errmsg = ''
  let valorError = -1
  let valorSalida = 0
  let errorMsg = ''

  try {
    const response = await fetch(urlAPI + url, {
      method: metodo, // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    estado = response.status
    operacionOk = response.ok
    if (response.ok) {
      let datos = await response.json()
      valorError = datos.out.ValorError
      valorSalida = datos.out.ValorSalida
      errorMsg = datos.out.vErrorMsg
    } else {
      errmsg = 'Error al intentar grabar el registro'
    }
  } catch (error) {
    estado = 999
    operacionOk = false
    errmsg = 'Error en la Red'
  }

  return { estado, operacionOk, errmsg, valorError, valorSalida, errorMsg }
}
