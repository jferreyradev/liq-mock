import { defineStore } from 'pinia'
//import { useApiConfig } from '@/composables/useUrls'
import { useEndPoints } from '@/composables/useEndPoints'

const { apiBase } = useEndPoints()

//const { apiBaseDev } = useApiConfig()

export const useLiqStore = defineStore('liq', {
  state: () => ({
    liqitems: [],
  }),
  getters: {
    getLiqItems: (state) => { return state.liqitems }
  },
  actions: {
    setLiqItems(idliq) {
      fetch(`${apiBase.value}/api/view/liqItem?LiquidacionId=${idliq}`)
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
