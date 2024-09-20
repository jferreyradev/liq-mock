
import { ref } from 'vue';

const urls = ref(
    [
        {
            id:1,
            desc: 'URL base de prod',
            ep:'https://midliq-api.deno.dev',
            activo : 1
         },
         {
            id:2,
            desc: 'URL base de Desa',
            ep:'https://midliq-api-ntkqw5163wgn.deno.dev',
            activo : 1
         },
         {
            id:3,
            desc: 'URL Boletas de prod',
            ep:'https://api-boletas.deno.dev',
            activo : 1
         },
         {
            id:4,
            desc: 'URL Boletas de Desa',
            ep:'https://api-boletas-9jn3t0ca7a3j.deno.dev',
            activo : 1
         },
         
    ]
)

export function useApiConfig() {
  const apiBoletas = ref('https://api-boletas.deno.dev')
  const apiBoletasDev = ref('https://api-boletas-9jn3t0ca7a3j.deno.dev')
  //const baseUrlSp = 'https://midliq-api-we3b884fccey.deno.dev'
  const apiBaseDev = ref('https://midliq-api-7g0abd0mn8x4.deno.dev')
  const apiBase = ref('https://midliq-api.deno.dev')

  return {
    apiBase,
    apiBaseDev,
    apiBoletas,
    apiBoletasDev
  };
}