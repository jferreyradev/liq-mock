import { watchEffect, ref } from 'vue'

export function useFetch(getUrl) {
    const data = ref(null)
    const error = ref(null)
    const isPending = ref(true)
  
    watchEffect(() => {
      isPending.value = true
      data.value = null
      error.value = null
  
      console.log('fetch ', getUrl())
  
      fetch(getUrl())
        .then((res) => res.json())
        .then((_data) => {
          data.value = _data
          isPending.value = false
        })
        .catch((err) => {
          error.value = err
          isPending.value = false
        })
    })
    return {
      data,
      error,
      isPending
    }
  }