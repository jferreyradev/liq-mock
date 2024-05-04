<script setup>
import RepoCod153 from '@/components/RepoCod153.vue'
import RepoResumenLiq from '@/components/RepoResumenLiq.vue'
import RepoResumenCod from '@/components/RepoResumenCod.vue'
import RepoResumenLiqFDO from '@/components/RepoResumenLiqFdo.vue'
import LiqInputPanel from '@/components/LiqInputPanel.vue'
import RepoApoPatronales from '@/components/RepoApoPatronales.vue'
import RepoPlanillaDetLiq from '@/components/RepoPlanillaDetLiq.vue'
import RepoPlanillaRet from '@/components/RepoPlanillaRet.vue'
import RepoPlanillaLey from '@/components/RepoPlanillaLey.vue'
import RepoPlanillaResSueldo from '@/components/RepoPlanillaResSueldo.vue'
import RepoPlanillaRetCargo from '@/components/RepoPlanillaRetCargo.vue'
import RepoPlanillaRetencionesCPA from '@/components/RepoPlanillaRetencionesCPA.vue'

import { ref } from 'vue'

const reportes = [
  //{ title: 'Resumen Liquidacion', value: 1 },
  { title: 'Detalle por concepto (153)', value: 2 },
  //{ title: 'Resumen de liquidación por codigos', value: 4 },
  { title: 'Resumen pedido FDO', value: 5 },
  { title: 'Resumen Aportes Patronales', value: 6 },
  { title: 'Planilla de Det. Liq.', value: 7 },
  { title: 'Planilla de Retenciones', value: 8 },
  { title: 'Planilla de Ley', value: 9 },
  { title: 'Resumen de Sueldos', value: 10 },
  { title: 'Retenciones de Cargo', value: 11 },
  { title: 'Retenciones de CPA', value: 12 }
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

      <RepoApoPatronales v-if="repo == 6"></RepoApoPatronales>

      <RepoPlanillaDetLiq v-if="repo == 7"></RepoPlanillaDetLiq>

      <RepoPlanillaRet v-if="repo == 8"></RepoPlanillaRet>

      <RepoPlanillaLey v-if="repo == 9"></RepoPlanillaLey>

      <RepoPlanillaResSueldo v-if="repo == 10"></RepoPlanillaResSueldo>

      <RepoPlanillaRetCargo v-if="repo == 11"></RepoPlanillaRetCargo>

      <RepoPlanillaRetencionesCPA v-if="repo == 12"></RepoPlanillaRetencionesCPA>
    </v-row>
  </v-container>
</template>
