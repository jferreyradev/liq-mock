<script setup>
import RepoCod153 from '@/components/RepoCod153.vue'
import RepoResumenLiq from '@/components/RepoResumenLiq.vue'
import RepoResumenCod from '@/components/RepoResumenCod.vue'
import RepoResumenLiqFDO from '@/components/RepoResumenLiqFdo.vue'
import LiqInputPanel from '@/components/LiqInputPanel.vue'
import { ref } from 'vue'

const reportes = [
  { title: 'Resumen Liquidacion', value: 1},
  { title: 'Detalle por concepto (153)', value: 2 },
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
      <RepoResumenLiq v-if="repo === 1"></RepoResumenLiq>

      <RepoCod153 v-if="repo === 2"></RepoCod153>

      <RepoResumenCod v-if="repo === 4"></RepoResumenCod>

      <RepoResumenLiqFDO v-if="repo == 5"></RepoResumenLiqFDO>
    </v-row>
  </v-container>
</template>
