export function financial(x) {
  return Number.parseFloat(x).toFixed(2)
}

export const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
}

export const getFecha = (fecha) => {
  if (fecha) {
    const completa = fecha.substring(0, 10)
    const d = completa.split('-')
    return `${d[2]}/${d[1]}/${d[0]}`
  }
  return null
}

export function agregaTitulosExcel(mapa, tituloReporte, filtros, titulosTabla) {
  const tituloTablaFormato = titulosTabla.map((t) => ({
    v: t,
    s: { font: { bold: true, sz: 12 } } // sz: Tamaño de letra (14 por ejemplo)
  }))
  mapa.unshift(tituloTablaFormato)

  const linea = ['']
  mapa.unshift(linea)

  // agrega título secundario
  const tituloSec = ['', filtros]
  const tituloSecFormato = tituloSec.map((t) => ({
    v: t,
    s: { font: { bold: true, sz: 12 } } // sz: Tamaño de letra (14 por ejemplo)
  }))
  mapa.unshift(tituloSecFormato)

  // Agrega Título Principal
  const tituloPpal = ['', tituloReporte]
  const tituloPpalFormato = tituloPpal.map((t) => ({
    v: t,
    s: { font: { bold: true, sz: 12 } } // sz: Tamaño de letra (14 por ejemplo)
  }))
  mapa.unshift(tituloPpalFormato)
  /* generate worksheet from state */
}
