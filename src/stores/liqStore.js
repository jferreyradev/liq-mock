import { defineStore } from 'pinia'
import { useFilterStore } from '@/stores/filterStore.js'

const store = useFilterStore()

export const useLiqStore = defineStore('liq', {
  state: () => ({
    liqitems: [],
  }),
  getters: {
    getLiqItems: (state) => { return state.liqitems }
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
  },
})
