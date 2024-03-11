<script setup>
import { utils, writeFileXLSX } from "xlsx";
import { useFilterStore } from '@/stores/filterStore';
import { useFetch } from '@/composables/useFetch'

const store = useFilterStore()

function useResLiqCod(getId) {
  return useFetch(() => `${store.URL_API}/view/resumenCodigo?${getId()}&Codigo=153&SubCodigo=0`)
}

const { data, error, isPending } = useResLiqCod(() => store.filterString)

const props = defineProps(['fileName'])

const headers = [
    {
        title: 'DNI',
        align: 'start',
        sortable: true,
        key: 'DOCUMENTO',
    },
    { title: 'Apellido y nombre', key: 'APENOM' },
    { title: 'Importe', key: 'IMPORTE',align: 'end' }
]


function handleDownload() {
    console.log('download')
    exportFile()
}

function exportFile() {
    const map1 = data.value.map((x) => {
        return {
            'DNI': x.DOCUMENTO,
            'NOMBRE': x.APENOM,
            'IMPORTE': x.IMPORTE
        }
    });

    /* generate worksheet from state */
    const ws = utils.json_to_sheet(map1);
    ws["!cols"] = [{ wch: 10 }, { wch: 35 }, { wch: 20 }];
    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");

    /* export to XLSX */
    writeFileXLSX(wb, props.fileName || "exportacion.xlsx", { compression: true });
}

</script>


<template>
    <v-container>
        
        <v-data-table v-if="data" class="text-caption" hover density="compact"
         :items="data" :headers="headers">
        </v-data-table>
        <v-btn color="primary" @click="handleDownload">Descargar</v-btn>

    </v-container>
</template>