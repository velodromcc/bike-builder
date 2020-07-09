<template>
  <div class="layer pa-4">
    <v-row class="flex-column fill-height outline" align="center" justify="center" no-gutters>

      <Spinner width="286" height="182"/>
      Loading...

    </v-row>
  </div>
</template>

<script>

  import Spinner from '@/components/Spinner';

  export default {
    components: {
      Spinner
    }
  }
</script>
