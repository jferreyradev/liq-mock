<script setup>
import { ref } from 'vue';
import PanelUsers from '@/components/PanelUsers.vue';

const dialog = ref(false)

const text = ref('')

const idliqitem = ref(null)

function handleSelect(id, objElement) {
    idliqitem.value = id
    text.value = 'Orden:' + objElement.orden + ' DNI:' + objElement.dni + ' Nombre:' + objElement.apellido + ' ' + objElement.nombre
}

</script>

<template>
    <v-container >
        <v-row justify="space-around" class="bg-primary">
            <h3>Administrador de usuarios</h3>
        </v-row>
        <v-row>
            
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
               <PanelUsers></PanelUsers>
        </v-row>

    </v-container>
</template>