<template>
  <div class="layer pa-4">
    <v-row class="flex-column fill-height outline" align="center" justify="center" no-gutters>

      <v-alert type="error" class="mx-2" outlined>
        <p class="mb-0">
          It has been an error on load data, please try again later...
          <Btn tag="a" class="mx-2" color="error" @click="reload" dark>Reload</Btn>
        </p>
      </v-alert>

    </v-row>
  </div>
</template>

<script>
  import { Btn } from '@/components';
  export default {
    components: {
      Btn
    },
    methods: {
      reload() {
        window.location.reload();
      }
    }
  };
</script>
