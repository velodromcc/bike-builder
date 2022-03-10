<template>
  <v-toolbar
    tag="header"
    color="bb-background"
    class="builder-header outline-bottom light--border"
    elevation="0"
  >

    <Btn
      v-if="menu.length"
      class="btn-menu ml-0 mr-5"
      color="bb-primary"
      width="30" height="30"
      @click="$emit('click:menu')"
      :ripple="false"
      tile icon
    >
      <v-icon size="30">mdi-menu</v-icon>
    </Btn>

    <div class="grow">
      <Logo/>
    </div>

    <template v-if="menu.length">

      <v-divider vertical/>

      <template v-for="(item,i) in menu">
        <a class="btn-item-menu" :key="i" :href="item.href||'#'">
          {{ item.text }}
        </a>
      </template>

      <v-divider vertical/>

    </template>

    <Btn
      v-if="accountLink"
      class="btn-account ml-4 mr-0"
      color="bb-primary"
      width="30" height="30"
      :href="accountLink"
      :ripple="false"
      tile icon
    >
      <v-icon size="30">$account</v-icon>
    </Btn>

  </v-toolbar>
</template>

<script>

  import { toArray } from '@/utils';
  import { Btn, Logo } from '@/components';

  export default {
    components: { Btn, Logo },
    props: {
      items: Array,
      accountLink: String
    },
    computed: {
      menu() {
        return toArray( this.items );
      }
    }
  }
</script>

<style>
  .builder-header {
    position: absolute;
    width: 100%;
    height: 76px !important;
    top: 0;
    left: 0;
  }
  .builder-body, .builder-nav {
    top: 76px;
  }
  .builder-header > div {
    height: 100% !important;
    padding: 0 3.175%;
  }
  .builder-header .btn-item-menu {
    text-decoration: none;
    display: inline-block;
    padding: 0 16px;
    text-transform: uppercase;
  }
  @media (min-width: 1200px) {
    .builder-header .btn-menu {
      display: none;
    }
  }
  @media (max-width: 1199px) {
    .builder-header .v-divider, .builder-header .btn-item-menu {
      display: none;
    }
  }
  @media (max-width: 992px) {
    .builder-header {
      height: 50px !important;
    }
    .builder-body, .builder-nav {
      top: 50px;
    }
    .builder-header > div {
      padding: 0 10px;
    }
    .builder-header > div > .grow {
      text-align: center;
    }
  }
</style>
