<script setup>
import { ref } from 'vue';
//import LiqService from '@/services/LiqService.js'
import { useFilterStore } from '@/stores/filterStore.js'
//import { storeToRefs } from 'pinia'

const store = useFilterStore();

// storeToRefs lets todoList keep reactivity:
//const { todoList } = storeToRefs(store)

const emit = defineEmits(['submit'])

const liq = [{
    name: 'Mensual',
    value: '1'
}, {
    name: 'Adicional',
    value: '5',
}, {
    name: '1er SAC',
    value: '2'
}, {
    name: '2Do SAC',
    value: '3'
}, {
    name: 'Otro tipo',
    value: '9',
    disabled: true
}]

const liqSelected = ref({
    name: 'Mensual',
    value: '1'
})
const nroAdi = ref(0)

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const month = ref(months[store.month-1])
const year = ref(store.year)

const handleClick = () => {

    console.log(store.filterString )

    store.tipoliq = liqSelected.value.value
    store.nroadi = nroAdi.value
    store.month = months.indexOf(month.value) + 1
    store.year = year

    console.log(store.filterString )

    emit('submit')
}

</script>

<template>
    <v-container>
        <v-row class="pa-0 ma-0">
            <v-col align-self="center">
                <v-select label="Liquidación" :items="liq" item-title="name" item-value="value" v-model="liqSelected"
                    return-object>
                </v-select>
            </v-col>
            <v-col>
                <v-text-field label="Nro. Adicional" v-model="nroAdi" required></v-text-field>
            </v-col>
            <v-col>
                <v-select label="Mes" :items="months" v-model="month"></v-select>
            </v-col>
            <v-col>
                <v-text-field label="Año" v-model="year" required type="number"></v-text-field>
            </v-col>
            <v-col>
                <slot></slot>
            </v-col>
            <v-col align-self="center">
                <v-btn color="primary" @click="handleClick">
                    enviar
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>