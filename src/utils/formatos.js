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

export const getFechaDMY = (vto) => {
  if (vto) {
    const d = vto.substring(0, 10).split('-')
    return `${d[2]}/${d[1]}/${d[0]}`
  }
  return null
}

export const getVtoActual = () => {
  const fecha = new Date()
  const mes = fecha.getMonth() + 1
  const anio = fecha.getFullYear()
  let resultado = mes + '/' + anio
  if (mes < 10) resultado = '0' + resultado
  return resultado
}

export const validaMMYYYY = (vto) => {
  if (vto.length < 6 || vto.length > 7) return 'Formato inválido'
  const d = vto.split('/')
  console.log(d)
  if (d.length < 2) return 'Formato inválido'
  if (d[0] < 1 || d[0] > 12) return 'Formato de Mes inválido'
  console.log(d[0])
  if (d[1] < 2020 || d[1] > 2060) return 'Formato de Año inválido'
  console.log(d[1])
  return null
}

export const getPeriodoFromMMYYYY = (periodo) => {
  const d = periodo.split('/')
  let fecha = '01/' + d[0] + '/' + d[1]
  return fecha
}

export const getFechaToAPIFromMMYYYY = (periodo) => {
  console.log(periodo)
  const d = periodo.split('/')
  let fecha = d[1] + '-' + d[0] + '-01'
  return fecha
}
