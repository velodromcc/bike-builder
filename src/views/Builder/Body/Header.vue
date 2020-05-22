<template>
  <v-toolbar tag="header" class="outline-bottom light--border" height="70" elevation="0">

    <h1 class="title">Logotype</h1>

    <v-spacer/>

    <nav>

      <Btn class="mr-2" color="primary" icon>
        <v-icon v-text="'mdi-chat-outline'"/>
      </Btn>

      <Btn color="primary" icon>
        <v-icon v-text="'mdi-share-variant'"/>
      </Btn>

    </nav>

  </v-toolbar>
</template>

<script>
  import { Btn } from '@/components';
  export default {
    components: { Btn }
  }
</script>
