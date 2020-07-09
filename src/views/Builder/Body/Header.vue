<template>
  <v-toolbar tag="header" color="bb-background" class="outline-bottom light--border" height="70" elevation="0">

    <a v-if="logo" class="logo" target="_blank" :href="company.website">
      <img :src="logo"/>
    </a>

    <v-spacer/>

    <nav>

      <Btn class="mr-2" color="bb-primary" icon>
        <v-icon v-text="'mdi-chat-outline'"/>
      </Btn>

      <Btn color="bb-primary" icon>
        <v-icon v-text="'mdi-share-variant'"/>
      </Btn>

    </nav>

  </v-toolbar>
</template>

<script>

  import { Btn } from '@/components';
  import { mapState } from 'vuex';

  export default {
    components: { Btn },
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
