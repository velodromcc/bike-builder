<template>
  <a v-if="logo" class="logo" :href="company.website">
    <img :src="logo"/>
  </a>
</template>

<script>
  import { CONSTANTS } from '@/utils';
  import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState([ 'company' ]),
      logo() {
        const { logo } = this.company || {};
        if ( logo ) return CONSTANTS.imageBase + logo;
        return null;
      }
    }
  }
</script>

<style>
  .logo > img {
    width: auto;
    max-height: 40px;
  }
</style>
