import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const isPending = ref(true)

  console.log('fetch ', url)

  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      data.value = json
      isPending.value = false
    })
    .catch((err) => {
      error.value = err
      isPending.value = false
    })

  return {
    data,
    error,
    isPending
  }
}
