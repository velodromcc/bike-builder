<template>
  <v-row class="pa-4" align="end" no-gutters>

    <Btn class="outline light--border" color="primary" width="48" height="48" @click="$emit('reset')" icon>
      <v-icon v-text="'mdi-restore'"/>
    </Btn>

    <v-spacer/>

    <div class="text-right mr-4">
      <p class="caption mb-0">SRP</p>
      <p class="display-4 mb-0">400 €</p>
    </div>

    <Btn class="body-1" color="primary" @click="$emit('details')" tile dark>
      Details
    </Btn>

  </v-row>
</template>

<script>
  import { Btn } from '@/components';
  export default {
    components: { Btn }
  }
</script>
