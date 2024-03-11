<script setup>
import { utils, writeFileXLSX } from "xlsx";
import { useFilterStore } from '@/stores/filterStore';
import { useFetch } from '@/composables/useFetch'

const store = useFilterStore()

function useResLiqNeto(getId) {
  return useFetch(() => `${store.URL_API}/view/neto?${getId()}`)
}

const { data, error, isPending } = useResLiqNeto(() => store.filterString)

const props = defineProps(['fileName'])

const headers = [
    {
        title: 'Descripcion',
        align: 'start',
        sortable: true,
        key: 'title',
    },
    { title: 'Importe', key: 'importe',align: 'end' }
]


function handleDownload() {
    console.log('download')
    exportFile()
}

function exportFile() {
    console.log(data)
    const map1 = data.value.map((x) => {
        return {
            'Descripcion': x.title,
            'IMPORTE': x.importe
        }
    });

    /* generate worksheet from state */
    const ws = utils.json_to_sheet(map1);
    ws["!cols"] = [{ wch: 35 }, { wch: 15 }];
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