<template>
  <v-toolbar tag="header" color="bb-background" class="outline-bottom light--border" height="70" elevation="0">

    <a v-if="logo" class="logo" target="_blank" :href="company.website">
      <img :src="logo"/>
    </a>

  </v-toolbar>
</template>

<script>

  import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState([ 'company' ]),
      logo() {
        const { logo, host } = this.company || {};
        if ( logo && host ) return 'http://' + host + logo;
        return null;
      }
    }
  }
</script>

<style>
  .logo > img {
    width: auto;
    height: 40px;
  }
</style>
