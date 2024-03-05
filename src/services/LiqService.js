import { useFetch } from '@vueuse/core'

//const url_api = import.meta.env.VITE_APP_ROOT_API
const url_api = 'http://192.168.1.59:3005/api'

function getFilterString(param) {
  console.log(`TipoLiquidacionId=${param.tipoliq}&GrupoAdicionalId=${param.adi}&Periodo=${param.periodo}`)
  return `TipoLiquidacionId=${param.tipoliq}&GrupoAdicionalId=${param.adi}&Periodo=${param.periodo}`
}

export default {
  async getLiq(param) {
    //const { isFetching, error, data } = await useFetch(`${url_api}/view/liq?${getFilterString(param)}`).get().json()
    const { isFetching, error, data } = await useFetch(`${url_api}/view/liq?${param}`).get().json()
    return { isFetching, error, data }
  },
  async getLiqItem(param) {
    //const { isFetching, error, data } = await useFetch(`${url_api}/view/liqItem?${getFilterString(param)}`).get().json()
    const { isFetching, error, data } = await useFetch(`${url_api}/view/liqItem?${param}`).get().json()
    return { isFetching, error, data }
  },
  async getLiqRes(param) {
    const { isFetching, error, data } = await useFetch(`${url_api}/repo/resumenLiq?${getFilterString(param)}`).get().json()
    return { isFetching, error, data }
  },
  async getLiqBoletas(param) {
    const { isFetching, error, data } = await useFetch(`${url_api}/view/boletas?${getFilterString(param)}`).get().json()
    return { isFetching, error, data }
  },
  getURLLiqBoleta(idliq) {
    return `${url_api}/boleta?IdLiq=${idliq}`
  },
  async getResumenCod(param) {
    const { isFetching, error, data } = await useFetch(`${url_api}/view/resumenCodigo?${getFilterString(param)}&Codigo=153&SubCodigo=0`).get().json()
    return { isFetching, error, data }
  },
  async getNeto(param) {
    const { isFetching, error, data } = await useFetch(`${url_api}/view/neto?${getFilterString(param)}`).get().json()
    return { isFetching, error, data }
  },
  async getNetoFuncionarios(param) {
    const { isFetching, error, data } = await useFetch(`${url_api}/view/neto?${getFilterString(param)}&IdTe=6`).get().json()
    return { isFetching, error, data }
  },
  async getNetoPermanentes(param) {
    const { isFetching, error, data } = await useFetch(`${url_api}/view/netoPermanentes?${getFilterString(param)}`).get().json()
    return { isFetching, error, data }
  },
  async getNetoContratados(param) {
    const { isFetching, error, data } = await useFetch(`${url_api}/view/neto?${getFilterString(param)}&IdTe=1&IdSitRev=4`).get().json()
    return { isFetching, error, data }
  },
  async getRetenciones(param) {
    const { isFetching, error, data } = await useFetch(`${url_api}/view/retenciones?${getFilterString(param)}`).get().json()
    return { isFetching, error, data }
  },
  async getResumenCodLiq(param){
    const { isFetching, error, data } = await useFetch(`${url_api}/view/resumenCodLiq?${getFilterString(param)}`).get().json()
    return { isFetching, error, data }    
  },
  async getPeriodoActivo(){
    const { isFetching, error, data } = await useFetch(`${url_api}/view/periodo?Activo=1`).get().json()
    return { isFetching, error, data }    
  },
  async getResumenLiqFDO(param){
    const { isFetching, error, data } = await useFetch(`${url_api}/view/resumenFdo?${getFilterString(param)}`).get().json()
    return { isFetching, error, data }    
  },
}