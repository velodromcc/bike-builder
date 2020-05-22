<template>
  <v-row class="pa-4" align="end" no-gutters>

    <Btn class="outline light--border" color="primary" width="48" height="48" icon>
      <v-icon v-text="'mdi-restore'"/>
    </Btn>

    <v-spacer/>

    <div class="text-right">
      <p class="caption mb-0">SRP</p>
      <p class="display-4 mb-0">400 €</p>
    </div>

  </v-row>
</template>

<script>
  import { Btn } from '@/components';
  export default {
    components: { Btn }
  }
</script>
