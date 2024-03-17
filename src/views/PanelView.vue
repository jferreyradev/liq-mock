<script setup>
import LiqInputPanel from '@/components/LiqInputPanel.vue';
import { ref } from 'vue';
import { useFilterStore } from '@/stores/filterStore.js'
import LiquidacionTable from '@/components/LiquidacionTable.vue';
import LiquidacionItemTable from '@/components/LiquidacionItemTable.vue';

const store = useFilterStore();

const dialog = ref(false)

const text = ref('')

const idliqitem = ref(null)

function handleSelect(id, objElement) {
    idliqitem.value = id
    text.value = 'Orden:' + objElement.orden + ' DNI:' + objElement.dni + ' Nombre:' + objElement.apellido + objElement.nombre
}

</script>

<template>
    <v-container >
        <v-row justify="space-around" class="bg-primary">
            <h3>Panel principal</h3>
        </v-row>
        <v-row>
            <LiqInputPanel></LiqInputPanel>
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
        <v-row>
            <v-col class="px-0">
                <LiquidacionTable @select="handleSelect" title="Liquidaciones" :subtitle="store.liqString"></LiquidacionTable>
            </v-col>
            <v-col class="px-0" >
                <LiquidacionItemTable v-if="idliqitem" :id="idliqitem" :subtitle="text">
                </LiquidacionItemTable>
            </v-col>            
        </v-row>

    </v-container>
</template>