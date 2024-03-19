import { defineStore } from 'pinia'
import { useFilterStore } from '@/stores/filterStore.js'

const store = useFilterStore()

export const useLiqStore = defineStore('liq', {
    state: () => ({
        liqitems: [],
        boletaDet: [],
        boletaCabPie: []
    }),
    getters: {
        getLiqItems: (state) => {
            state.liqitems.sort((a, b) => {
                if (a.CODIGO * 1000 + a.SUBCODIGO > b.CODIGO * 1000 + b.SUBCODIGO) {
                    return 1
                }
                if (a.CODIGO * 1000 + a.SUBCODIGO < b.CODIGO * 1000 + b.SUBCODIGO) {
                    return -1
                }
                return 0
            })

            return state.liqitems
        }
    },
    actions: {
        setLiqItems(idliq) {
            fetch(`${store.getURLAPI}/view/liqItem?LiquidacionId=${idliq}`)
                .then((res) => res.json())
                .then((_data) => {
                    this.liqitems = _data
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        setBoleta(idliq) {
            fetch(`${store.getURLAPI}/view/boletaDetalle?IdLiq=${idliq}`)
                .then((res) => res.json())
                .then((_data) => {
                    this.boletaDet = _data
                })
                .catch((err) => {
                    console.log(err)
                })
            fetch(`${store.getURLAPI}/view/boletaCabPie?IdLiq=${idliq}`)
                .then((res) => res.json())
                .then((_data) => {
                    this.boletaCabPie = _data
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
})



