<script setup>
import { computed } from 'vue';

const props = defineProps(['items','subtitle'])

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

const res = computed(() => {
    let hcap = 0, hsap = 0, ticket = 0,
        desc = 0, descley = 0, asigfam = 0, patronales = 0
    props.items.forEach(el => {
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

function getNumberFormat(n) {
    return Intl.NumberFormat('es-AR',
        { style: 'currency', currency: 'ARS' }).format(n)
}


</script>

<template>
    <v-container>
        <v-card flat title="Detalle de la liquidacion" :subtitle="props.subtitle"
         class="bg-blue-accent-1">
          
            <v-table class="text-caption pa-0 ma-0 w-auto" hover density="compact" >
                    <thead>
                        <tr>
                            <th v-for="header in liqHeaders" :key="header.key" class="text-left m-0">
                                {{ header.title }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-for="item in props.items" :key="item.id" v-show="item.TIPOCONCEPTOID !== 5" :class="{
                            'bg-orange-lighten-3': item.TIPOCONCEPTOID === 6,
                            'bg-orange-lighten-4': item.TIPOCONCEPTOID === 3,
                            'bg-orange-lighten-5': item.TIPOCONCEPTOID === 4,
                            'bg-blue-lighten-5': item.TIPOCONCEPTOID === 1,
                        }">
                            <td class="text-right m-0 p-0">{{ item.CODIGO * 1000 + item.SUBCODIGO }}</td>
                            <td class="text-left m-0 p-0">{{ item.DESCRIPCION }}</td>
                            <td class="text-right m-0 p-0">{{ item.CANTIDAD }}</td>
                            <td class="text-center m-0 p-0">{{ item.VENCIMIENTO }}</td>
                            <td class="text-right m-0 p-0">{{ item.IMPORTE.toFixed(2) }}</td>
                        </tr>
                    </tbody>
                    <tfoot class="font-weight-bold">
                        <tr>
                            <td> Haberes </td>
                            <td> Descuentos </td>
                            <td>
                                Total
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {{ getNumberFormat(res.hcap + res.hsap + res.asigfam) }}
                            </td>
                            <td>
                                {{ getNumberFormat(res.desc + res.descley) }}
                            </td>                            
                            <td>
                                {{ getNumberFormat(res.hcap + res.hsap + res.asigfam -res.desc - res.descley) }}
                            </td>
                        </tr>
                    </tfoot>
                </v-table>

        </v-card>

    </v-container>
</template>

<style scoped></style>