<script setup>
import LiqInputPanel from '@/components/LiqInputPanel.vue'
import ArchIPSST from '@/components/ArchIPSST.vue'
import ResumenIPSST from '@/components/ResumenIPSST.vue'
</script>

<template>
  <v-container>
    <v-row justify="space-around" class="bg-primary">
      <h3>Archivos</h3>
    </v-row>
    <v-row>
      <LiqInputPanel :tipoliq=false :nroadi=false ></LiqInputPanel>
    </v-row>
    <v-row>
      <ResumenIPSST></ResumenIPSST>
    </v-row>
    <v-row>
      <ArchIPSST></ArchIPSST>
    </v-row>
  </v-container>
</template>
