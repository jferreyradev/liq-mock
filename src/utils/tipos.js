// meses
export const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]

// tipo de carga
export const tipoCarga = [
  {
    name: 'Manual',
    value: 1
  },
  {
    name: 'Disco',
    value: 0
  },
  {
    name: 'Otro',
    value: 3
  }
]

// tipo de hoja
export const tipoHoja = [
  {
    name: 'Movimiento de Haberes',
    value: 1
  },
  {
    name: 'Pensiones',
    value: 2
  },
  {
    name: 'Deducciones',
    value: 3
  },
  {
    name: 'Nov. varias',
    value: 4
  }
]

// tipo de liquidacion
export const tipoLiq = [
  {
    name: 'Mensual',
    value: 1
  },
  {
    name: 'Adicional',
    value: 5
  },
  {
    name: '1er SAC',
    value: 2
  },
  {
    name: '2do SAC',
    value: 3
  }
]

// tipo de liquidacion
export const estados = [
  {
    name: 'Cargada',
    value: 1
  },
  {
    name: 'Anulada',
    value: 5
  },
  {
    name: 'Verificada',
    value: 2
  },
  {
    name: 'Transformada',
    value: 3
  },
  {
    name: 'Otro estado',
    value: 4
  }
]

export function getName(lista, id) {
  const found = lista.find((element) => element.value === id)
  return found ? found.name : 'sin definir'
}

export function getObjetList(lista, id) {
  const found = lista.find((element) => element.value === id)
  return found ? found : null
}
