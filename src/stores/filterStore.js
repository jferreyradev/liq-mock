import { defineStore } from 'pinia'
import { useFetch } from '@/composables/useFetch';

function useConf() {
  return useFetch(() => `http://200.55.244.26:3005/api/view/periodo?Activo=1`)
}

const { data } = useConf()

console.log(data)

const liqMap = new Map([
  ['1', "Mensual"],
  ['5', "Adicional"],
  ['2', "1er SAC"],
  ['3', "2Do SAC"],
]);


const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export const useFilterStore = defineStore('filter', {
  state: () => ({
    tipoliq: 1, nroadi: 0, year: 0, month: 0,
    //URL_API: 'http://200.55.244.26:3005/api'
    URL_API: 'https://midliq-api--dev-trancas.deno.dev/api'
  }),
  getters: {
    filterString: (state) => `TipoLiquidacionId=${state.tipoliq}&GrupoAdicionalId=${state.nroadi}&Periodo=01/${state.month}/${state.year}`,
    periodoString: (state) => `${meses[state.month - 1]} - ${state.year}`,
    liqString: (state) => `${liqMap.get(state.tipoliq.toString())}-${state.nroadi}  ${meses[state.month - 1]}-${state.year}`,
    getURLAPI: (state) => `${state.URL_API}`,
    liqCompactString: (state) => `${state.year}${meses[state.month - 1].substring(0, 3)}${liqMap.get(state.tipoliq.toString()).substring(0, 1)}${state.nroadi}`
  },
  actions: {
    setPer() {
      fetch(`https://midliq-api--dev-trancas.deno.dev/api/view/periodo?Activo=1`)
        .then((res) => res.json())
        .then((_data) => {
          this.year = _data[0].PERIODO.split('-')[0]
          this.month = _data[0].PERIODO.split('-')[1]
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
})
