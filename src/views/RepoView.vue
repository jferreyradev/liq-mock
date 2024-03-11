<script setup>
import RepoCod153 from '@/components/RepoCod153.vue';
import RepoResumenLiq from '@/components/RepoResumenLiq.vue';
import RepoResumenNeto from '@/components/RepoResumenNeto.vue';
import RepoResumenCod from '@/components/RepoResumenCod.vue';
import RepoResumenLiqFDO from '@/components/RepoResumenLiqFdo.vue';

import LiqInputPanel from '@/components/LiqInputPanel.vue'
import { ref } from 'vue';

const reportes = [
  { title: 'Resumen Liquidacion', value: 1 },
  { title: 'Detalle por concepto (153)', value: 2 },
  { title: 'Resumen Neto', value: 3 },
  { title: 'Resumen de liquidación por codigos', value: 4 },
  { title: 'Resumen pedido FDO', value: 5 }
]
const repo = ref()
</script>

<template>
  <v-container>
    <v-row justify="space-around" class="bg-primary">
      <h3>Reportes</h3>
    </v-row>
    <v-row>
      <LiqInputPanel>
        <v-select
          label="Reporte"
          :items="reportes"
          item-title="title"
          item-value="value"
          v-model="repo"
        >
        </v-select>
      </LiqInputPanel>
    </v-row>

    <v-row>
      <RepoResumenLiq v-if="repo === 1" fileName='LiqResumen.xlsx'></RepoResumenLiq>

            <RepoCod153 v-if="repo === 2" fileName='LiqCod153.xlsx'></RepoCod153>

            <RepoResumenNeto v-if="repo === 3" fileName='LiqNeto.xlsx'></RepoResumenNeto>

            <RepoResumenCod v-if="repo === 4" fileName='LiqCod.xlsx'></RepoResumenCod>

            <RepoResumenLiqFDO v-if="repo == 5" fileName='LiqPedidoFDO.xlsx'></RepoResumenLiqFDO>

    </v-row>
  </v-container>
</template>
