<template>
  <v-toolbar tag="header" color="bb-background" class="outline-bottom light--border" :height="height" elevation="0">

    <a v-if="logo" class="logo" target="_blank" :href="company.website">
      <img :src="logo"/>
    </a>

    <v-spacer/>

    <Btn
      :href="company.website"
      color="bb-primary"
      target="_blank"
      text
    >
      Return
      <v-icon right>mdi-exit-to-app</v-icon>
    </Btn>

  </v-toolbar>
</template>

<script>

  import { Btn } from '@/components';
  import { mapState } from 'vuex';

  export default {
    components: { Btn },
    props: {
      height: {
        type: [ Number, String ],
        default: 70
      }
    },
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
