<script setup>
import { computed } from 'vue'
import { useFilterStore } from '@/stores/filterStore.js'
import { useFetch } from '@/composables/useFetch'

const store = useFilterStore()

const props = defineProps(['id', 'subtitle'])

function useLiqItem(getId) {
  return useFetch(() => `${store.URL_API}/view/liqItem?LiquidacionId=${getId()}&sort={"Codigo":"asc","SubCodigo":"asc"}`)
}

const { data, error, isPending } = useLiqItem(() => props.id )

const liqHeaders = [
  { title: 'Codigo.', key: 'CODIGO' },
  { title: 'Descripcion', key: 'DESCRIPCION' },
  { title: 'Cant', key: 'CANTIDAD' },
  { title: 'VTO', key: 'VENCIMIENTO' },
  { title: 'Importe', key: 'IMPORTE' }
]

const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
}

//const items = ref([])

const getItems = () => {
  //let items = data.filter((x) => x.LIQUIDACIONID === 3360)

  data.value.sort((a, b) => {
    if (a.CODIGO * 1000 + a.SUBCODIGO > b.CODIGO * 1000 + b.SUBCODIGO) {
      return 1
    }
    if (a.CODIGO * 1000 + a.SUBCODIGO < b.CODIGO * 1000 + b.SUBCODIGO) {
      return -1
    }
    return 0
  })
}

function getNumberFormat(n) {
  return Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)
}

const res = computed(() => {
    let hcap = 0, hsap = 0, ticket = 0,
        desc = 0, descley = 0, asigfam = 0, patronales = 0
    data.value.forEach(el => {
        switch (el.TIPOCONCEPTOID) {
            case 1:
                hcap = hcap + el.IMPORTETICKET
                break;
            case 2:
                hsap = hsap + el.IMPORTETICKET
                break;
            case 3:
                descley = descley + el.IMPORTETICKET
                break;
            case 4:
                asigfam = asigfam + el.IMPORTETICKET
                break;
            case 5:
                patronales = patronales + el.IMPORTETICKET
                break;
            case 7:
                ticket = ticket + el.IMPORTETICKET
                break;
            case 6:
                desc = desc + el.IMPORTETICKET
                break;
            default:
                break;
        }

    });

    return { hcap, hsap, ticket, descley, desc, asigfam }
})

</script>

<template>
  <v-container>
    <div v-if="isPending">loading...</div>
    <v-card
      v-else-if="data"
      flat
      title="Detalle de la liquidacion"
      :subtitle="props.subtitle"
      class="bg-blue-accent-1"
    >
      <v-table class="compact text-caption pa-0 ma-0 w-auto" hover density="compact">
        <thead>
          <tr>
            <th v-for="header in liqHeaders" :key="header.key" class="text-left m-0">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in data"
            :key="item.id"
            v-show="item.TIPOCONCEPTOID !== 5"
            :class="{
              'bg-orange-lighten-3': item.TIPOCONCEPTOID === 6,
              'bg-orange-lighten-4': item.TIPOCONCEPTOID === 3,
              'bg-orange-lighten-5': item.TIPOCONCEPTOID === 4,
              'bg-blue-lighten-5': item.TIPOCONCEPTOID === 1
            }"
          >
            <td class="text-right m-0 p-0">{{ item.CODIGO * 1000 + item.SUBCODIGO }}</td>
            <td class="text-left m-0 p-0">{{ item.DESCRIPCION }}</td>
            <td class="text-right m-0 p-0">{{ item.CANTIDAD }}</td>
            <td class="text-center m-0 p-0">{{ item.VENCIMIENTO }}</td>
            <td class="text-right m-0 p-0">{{ item.IMPORTE.toFixed(2) }}</td>
          </tr>
        </tbody>
        <tfoot class="font-weight-bold">
          <tr>
            <td>Haberes</td>
            <td>Descuentos</td>
            <td>Total</td>
          </tr>
           <tr>
            <td>
              {{ getNumberFormat(res.hcap + res.hsap + res.asigfam) }}
            </td>
            <td>
              {{ getNumberFormat(res.desc + res.descley) }}
            </td>
            <td>
              {{ getNumberFormat(res.hcap + res.hsap + res.asigfam - res.desc - res.descley) }}
            </td>
          </tr>
        </tfoot>
      </v-table>
    </v-card>
    <div v-else-if="error">Ocurrio algún error: {{ error.message }}</div>
  </v-container>
</template>

<style scoped></style>
