import { ref } from 'vue';

const endpoints = {
  desa: {
    boletas: 'https://api-boletas-9jn3t0ca7a3j.deno.dev',
    base: 'https://midliq-api-enncs681c25c.deno.dev'
  },
  prod: {
    boletas: 'https://api-boletas.deno.dev',
    base: 'https://midliq-api.deno.dev'
  }
}

const apiBoletas = ref(endpoints.prod.boletas)
const apiBase = ref(endpoints.prod.base)
const env = ref('Prod')

export function useEndPoints() {

  function setProd() {
    apiBase.value = endpoints.prod.base
    apiBoletas.value = endpoints.prod.boletas
    env.value = 'Prod'
  }

  function setDesa() {
    apiBase.value = endpoints.desa.base
    apiBoletas.value = endpoints.desa.boletas
    env.value = 'Desa'
  }

  return {
    apiBase, apiBoletas, setDesa, setProd, env
  };
}