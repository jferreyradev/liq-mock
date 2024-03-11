import { defineStore } from 'pinia'
import LiqService from '@/services/LiqService.js'

const liqMap = new Map([
  ['1', "Mensual"],
  ['5', "Adicional"],
  ['2', "1er SAC"],
  ['3', "2Do SAC"],
]);


const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const {data} = await LiqService.getPeriodoActivo()

const nyear = data.value[0].PERIODO.split('-')[0]
const nmonth = data.value[0].PERIODO.split('-')[1]

export const useFilterStore = defineStore('filter', {
  state: () => ({
    tipoliq: 1, nroadi: 0, year: nyear, month: nmonth
  }),
  getters: {
    filterString: (state) => `TipoLiquidacionId=${state.tipoliq}&GrupoAdicionalId=${state.nroadi}&Periodo=01/${state.month}/${state.year}`,
    periodoString:(state)=>`${meses[state.month-1]} - ${state.year}`,
    liqString: (state) => `${liqMap.get(state.tipoliq.toString())}-${state.nroadi}  ${meses[state.month-1]}-${state.year}`
  },
})