
import { ref } from 'vue';

export function useApiConfig() {
  const apiBoletas = ref('https://api-boletas.deno.dev')
  const apiBoletasDev = ref('https://api-boletas-9jn3t0ca7a3j.deno.dev')
  //const baseUrlSp = 'https://midliq-api-we3b884fccey.deno.dev'
  const apiBaseDev = ref('https://midliq-api-enncs681c25c.deno.dev')
  const apiBase = ref('https://midliq-api.deno.dev')

  return {
    apiBase,
    apiBaseDev,
    apiBoletas,
    apiBoletasDev
  };
}