import { defineStore } from 'pinia'
//import { useApiConfig } from '@/composables/useUrls'
import { useEndPoints } from '@/composables/useEndPoints'

//const { apiBaseDev } = useApiConfig()

const { apiBase, apiBoletas, setDesa, setProd, env } = useEndPoints()

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
    //URL_API: apiBaseDev.value + '/api' ,
    serverConfig: {}
  }),
  getters: {
    filterString: (state) =>
      `TipoLiquidacionId=${state.tipoliq}&GrupoAdicionalId=${state.nroadi}&Periodo=01/${state.month}/${state.year}`,
    filterPeriodoString: (state) => `Periodo=01/${state.month}/${state.year}`,
    periodoString: (state) => `${meses[state.month - 1]} - ${state.year}`,
    liqString: (state) =>
      `${liqMap.get(state.tipoliq.toString())}-${state.nroadi}  ${meses[state.month - 1]}-${state.year}`,
    getURLAPI: () => `${apiBase.value}`,
    liqCompactString: (state) =>
      `${state.year}${meses[state.month - 1].substring(0, 3)}${liqMap.get(state.tipoliq.toString()).substring(0, 1)}${state.nroadi}`,
    server: (state)=> `${state.serverConfig.AMBIENTE}`
  },
  actions: {
    async init(){
      await this.setConfig()
      await this.setPer()      
    },
    setPer() {
      fetch(`${apiBase.value}/api/view/periodo?Activo=1`)
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
      fetch(`${apiBase.value}/api/view/configServer`)
        .then((res) => res.json())
        .then((_data) => {
          this.serverConfig = _data[0]
          console.log(this.serverConfig)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
})
