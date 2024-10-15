export const rules = {
  number: [
    (value) => {
      if (value === null) return true
      if (value?.length === 0) return true
      if (/^[0-9]+$/.test(value)) return true
      return 'Número entero inválido'
    }
  ],
  dni: [
    (value) => {
      if (value?.length > 6 && /^[0-9]+$/.test(value)) return true
      return 'El DNI debe tener al menos 7 digitos'
    }
  ],
  mmyyyy: [
    (value) => {
      if (value === null) return true
      if (value?.length == 0) return true
      if (value?.length > 5 && /^(0?[1-9]|1[0-2])\/\d{4}$/.test(value)) return true
      return 'el formato debe se MM/YYYY'
    }
  ],
  rango: (value, min, max) => {
    if (value >= min && value <= max) return true
    return 'el valor debe estar entre ' + min + ' y ' + max
  },
  longitudMax: (value, max) => {
    let valorString = value.toString()
    if (valorString.length <= max) return true
    return 'se aceptan hasta ' + max + ' caracteres'
  },
  longitudEntre: (value, min, max) => {
    let valorString = value.toString()

    if (valorString.length >= min && valorString.length <= max) return true
    return 'Se aceptra entre ' + min + ' y ' + max + ' caracteres'
  },
  longitudMin: (value, min) => {
    let valorString = value.toString()
    if (valorString.length >= min) return true
    return 'ingresar al menos ' + min + ' caracteres'
  },
  numDecimal: [
    (value) => {
      if (value === null) return true
      if (value?.length === 0) return true
      if (value?.length === 0) return true
      if (/^[0-9]+(\.[0-9]+)?$/.test(value)) return true
      return 'Número decimal inválido'
    }
  ]
}
