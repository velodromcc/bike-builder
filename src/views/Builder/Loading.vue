<template>
  <div class="layer pa-4">
    <v-row class="fill-height outline" align="center" justify="center" no-gutters>

      <!-- Spinner -->
      <v-sheet width="240" height="240" color="#f4f4f4"></v-sheet>

    </v-row>
      <div id="info-container" class="pa-6">
        <h2 v-if="title" class="headline mb-4">{{ title }}</h2>
        <div v-if="text" class="body-2" v-html="text"></div>
      </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: Number,
      title: String,
      text: String,
      loadText: String
    }
  }
</script>

<style>
  #info-container {
    position: absolute;
    max-width: 480px;
    top: 16px;
    left: 16px;
    right: 16px;
  }
  @media only screen and ( max-width: 600px ) {
    #info-container {
      max-width: none;
      top: auto;
      bottom: 16px;
    }
  }
</style>
