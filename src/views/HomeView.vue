<script setup>
/*import { useFetch } from '@/composables/useSimplieFetch';
import { useEndPoints } from '@/composables/useEndPoints';
import { useStore } from '@/composables/useStore';

const endPoint = useEndPoints()

console.log(endPoint.apiBase.value+'/api/view/serverConfig')

const {data,error,isPending} =  useFetch(endPoint.apiBase.value +'/api/view/configServer' )

function setData() {
  const json = data[0]
  useStore().setGlobalState(data)
}

setData()
*/
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <h1>Pagina Principal</h1>
    <h3>Bienvenido al sistema para consultar liquidaciones</h3>
    <h4>Puede navegar con el panel desplegable a su izquierda.</h4>
    <!-- <div v-if="data">
      {{ data[0] }}
    </div>
    <div v-if="data">
      {{ useStore().globalState }}
    </div>
    <div v-if="error"> {{ error }}</div> -->
  </main>
</template>
