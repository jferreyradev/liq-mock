// Ejemplo implementando el metodo POST:
const urlAPI = 'http://www.serverburru2.duckdns.org:3005/api/'

export async function grabarRegistro(url = '', data = {}, metodo = 'POST') {
  const datos = JSON.stringify(data)
  console.log(datos)
  // Opciones por defecto estan marcadas con un *
  const response = await fetch(urlAPI + url, {
    method: metodo, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
  console.log(response)
  if (response.ok) return response.json()

  // parses JSON response into native JavaScript objects
}

export async function eliminarRegistro(url = '', metodo = 'DELETE') {
  // Opciones por defecto estan marcadas con un *
  const response = await fetch(urlAPI + url, {
    method: metodo, // *GET, POST, PUT, DELETE, etc.
    //mode: 'cors', // no-cors, *cors, same-origin
    //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin' // include, *same-origin, omit
    //headers: {
    //  'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
    //},
    //redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer'
  })
  console.log(response)
  if (response.ok) return response.json()

  // parses JSON response into native JavaScript objects
}

export async function leerDatos(url) {
  const response = await fetch(urlAPI + url).then((response) => response.json())

  return response
}
