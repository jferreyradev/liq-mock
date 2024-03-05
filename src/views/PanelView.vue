<script setup>
import LiqInputPanel from '@/components/LiqInputPanel.vue';
import { ref } from 'vue';
import LiqItemCard from '@/components/LiqItemCard.vue';
import LiqTable from '@/components/LiqTable.vue';
import LiqService from '@/services/LiqService.js'
import { useFilterStore } from '@/stores/filterStore.js'

const store = useFilterStore();

const liq = ref([])
const liqitem = ref([])
const liqitemfilter = ref([])
const dialog = ref(false)

const text = ref('')

function handleSelect(id, items, objElement) {
    //console.log(items)
    liqitemfilter.value = items
    text.value = 'Orden:' + objElement.orden + ' DNI:' + objElement.dni + ' Nombre:' + objElement.apellido + objElement.nombre
}

function handleInput() {
    liq.value = []
    liqitem.value = []

    console.log('--- Paramtros')
    console.log(store.filterString )

    LiqService.getLiq(store.filterString).then((response) => {
        liq.value = response.data.value
        console.log(liq.value)
    })
        .catch((error) => {
            console.log(error)
            dialog.value = true
        })

    LiqService.getLiqItem(store.filterString).then((response) => {
        liqitem.value = response.data.value
    })
        .catch((error) => {
            console.log(error)
        })

}

</script>

<template>
    <v-container>
        <v-row justify="space-around" class="bg-primary">
            <h3>Panel principal</h3>
        </v-row>
        <v-row>
            <LiqInputPanel @submit="handleInput"></LiqInputPanel>
        </v-row>

        <v-dialog v-model="dialog" width="auto">
            <v-card>
                <v-card-text>
                    No existen datos para el filtro seleccionado.
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" block @click="dialog = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-row v-if="liq && liqitem">
            <v-col cols="5">
                <LiqTable :liq="liq" :liqitem="liqitem" @select="handleSelect"></LiqTable>
            </v-col>
            <v-col cols="7">
                <LiqItemCard :items="liqitemfilter" :subtitle="text">
                </LiqItemCard>
            </v-col>
        </v-row>

    </v-container>
</template>