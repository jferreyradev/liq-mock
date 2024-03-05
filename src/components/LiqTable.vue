<script setup>
import { ref } from 'vue'

const props = defineProps(['liq','liqitem'])
const emit = defineEmits(['select'])

const search = ref()

const liqHeaders = [
    { title: 'Orden', key: 'ORDEN' },
    { title: 'Documento', key: 'DOCUMENTO' },
    { title: 'Apellido', key: 'APELLIDO', sortable: true },
    { title: 'Nombre', key: 'NOMBRE' },
    { title: 'Fecha Dev.', key: 'FECHADEV' },
]

function handleClick(item) {
    console.log(item.LIQUIDACIONID)

    let items = props.liqitem.filter(x => x.LIQUIDACIONID === item.LIQUIDACIONID);

    items.sort((a, b) => {
        if (a.CODIGO * 1000 + a.SUBCODIGO > b.CODIGO * 1000 + b.SUBCODIGO) {
            return 1;
        }
        if (a.CODIGO * 1000 + a.SUBCODIGO < b.CODIGO * 1000 + b.SUBCODIGO) {
            return -1;
        }
        return 0;
    });

    emit('select', item.LIQUIDACIONID, items, 
        {'apellido':item.APELLIDO, 'nombre':item.NOMBRE,
        'orden':item.ORDEN, 'dni':item.DOCUMENTO})
}

const getVto = (vto) => {
    if (vto) {
        const d = vto.split('-')
        return `${d[1]}/${d[0]}`
    }
    return null
}
</script>

<template>
    <v-container>
        <v-card flat>
            <v-card-title class="d-flex align-center pe-2 bg-blue-accent-1">
                Liquidaciones
                <v-spacer></v-spacer>
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" 
                    density="compact"
                    label="Texto a buscar en toda la tabla" 
                    single-line flat hide-details
                    variant="solo-filled">
                </v-text-field>
            </v-card-title>

            <v-divider></v-divider>

            <v-data-table :headers="liqHeaders" :items="props.liq" 
                            item-key="LIQUIDACIONID" items-per-page="15" :search="search"
                            hover density="compact"
                class="elevation-1 text-caption pa-0 ma-0 w-auto">
                <template v-slot:item="{ item }">
                    <tr class="pa-0 ma-0" @click="handleClick(item)">
                        <td class="text-right ma-0 pa-0 " >{{ item.ORDEN }}</td>
                        <td class="text-right">{{ item.DOCUMENTO }}</td>
                        <td class="text-left">{{ item.APELLIDO }}</td>
                        <td class="text-left">{{ item.NOMBRE }}</td>
                        <td class="text-center">{{ getVto(item.FECHADEV) }}</td>
                    </tr>
                </template>

            </v-data-table>

        </v-card>
    </v-container>
</template>


<style scoped>

</style>