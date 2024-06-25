import { defineStore } from 'pinia'

const liqMap = new Map([
  ['1', 'Mensual'],
  ['5', 'Adicional'],
  ['2', '1er SAC'],
  ['3', '2Do SAC']
])

const meses = [
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

export const useFilterStore = defineStore('filter', {
  state: () => ({
    tipoliq: 1,
    nroadi: 0,
    year: 0,
    month: 0,
    //URL_API: 'http://www.serverburru2.duckdns.org:3003/api',
    //URL_API: 'https://midliq-api-grq94rhtchph.deno.dev/api',
    URL_API: 'https://midliq-api-jr2sc3ef7gnx.deno.dev/api',
    serverConfig: {}
  }),
  getters: {
    filterString: (state) =>
      `TipoLiquidacionId=${state.tipoliq}&GrupoAdicionalId=${state.nroadi}&Periodo=01/${state.month}/${state.year}`,
    filterPeriodoString: (state) => `Periodo=01/${state.month}/${state.year}`,
    periodoString: (state) => `${meses[state.month - 1]} - ${state.year}`,
    liqString: (state) =>
      `${liqMap.get(state.tipoliq.toString())}-${state.nroadi}  ${meses[state.month - 1]}-${state.year}`,
    getURLAPI: (state) => `${state.URL_API}`,
    liqCompactString: (state) =>
      `${state.year}${meses[state.month - 1].substring(0, 3)}${liqMap.get(state.tipoliq.toString()).substring(0, 1)}${state.nroadi}`
  },
  actions: {
    setPer() {
      fetch(`${this.URL_API}/view/periodo?Activo=1`)
        .then((res) => res.json())
        .then((_data) => {
          this.year = _data[0].PERIODO.split('-')[0]
          this.month = _data[0].PERIODO.split('-')[1]
        })
        .catch((err) => {
          console.log(err)
        })
    },
    setConfig() {
      fetch(`${this.URL_API}/view/configServer`)
        .then((res) => res.json())
        .then((_data) => {
          this.serverConfig = _data[0]
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
})
