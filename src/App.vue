<template>
  <v-app id="app">
    <Loading v-if="loading"/>
  </v-app>
</template>

<script>

  import Loading from '@/views/Loading';
  import { mapState } from 'vuex';

  export default {
    components: { Loading },
    computed: mapState([ 'loading' ])
  }
</script>

<style lang="scss">

  #app {

    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;

    .v-application--wrap {
      -webkit-backface-visibility: visible;
      backface-visibility: visible;
    }
  }

</style>
