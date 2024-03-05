import { defineStore } from 'pinia'
import LiqService from '@/services/LiqService.js'

const {data} = await LiqService.getPeriodoActivo()

const nyear = data.value[0].PERIODO.split('-')[0]
const nmonth = data.value[0].PERIODO.split('-')[1]

export const useFilterStore = defineStore('filter', {
  state: () => ({
    tipoliq: 1, nroadi: 0, year: nyear, month: nmonth
  }),
  getters: {
    filterString: (state) => `TipoLiquidacionId=${state.tipoliq}&GrupoAdicionalId=${state.nroadi}&Periodo=01/${state.month}/${state.year}`,
  },
})
