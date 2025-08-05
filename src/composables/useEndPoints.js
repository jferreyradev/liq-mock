import { ref } from 'vue';

const endpoints = {
  desa: {
    boletas: 'https://api-boletas-9jn3t0ca7a3j.deno.dev', 
    base: 'https://midliq-api-hdprsd64qb7n.deno.dev',
    sp: 'https://josrferreyr-deno-api-su-79--desarrollo.deno.dev',
  },
  prod: {
    boletas:'https://midliq-api--dev-trancas.deno.dev/api',// "http://181.93.233.87:3005",
    base: 'https://midliq-api--dev-trancas.deno.dev/api' ,//"http://181.93.233.87:3005", 
    sp: 'https://midliq-api--dev-trancas.deno.dev/api',//"http://181.93.233.87:3005"
  }
}
//const apiBase = ref(endpoints.prod.base)
//const apiSp = ref(endpoints.prod.sp)

//const env = ref('prod')


const apiBoletas = ref(endpoints.prod.boletas)
const apiBase = ref(endpoints.prod.base)
const apiSp = ref(endpoints.prod.sp)
const env = ref('prod')

export function useEndPoints() {

  function setProd() {
    apiBase.value = endpoints.prod.base
    apiBoletas.value = endpoints.prod.boletas
    apiSp.value = endpoints.prod.sp
    env.value = 'Prod'
  }

  function setDesa() {
    apiBase.value = endpoints.desa.base
    apiBoletas.value = endpoints.desa.boletas
    apiSp.value = endpoints.desa.sp
    env.value = 'Desa'
  }

  return {
    apiBase, apiBoletas, apiSp, setDesa, setProd, env
  };
}