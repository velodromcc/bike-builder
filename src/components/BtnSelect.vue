<template>
  <v-card
    class="bike-item-select d-flex align-center"
    :class="{ active }"
    :color="active ? 'bb-primary' : 'white'"
    elevation="0"
    dark
  >
    <v-card
      class="py-1 px-2"
      :color="active ? 'bb-primary-dark' : 'bb-primary-light'"
      elevation="0"
      tile
    >
      <v-icon size="12">
        {{ active ? 'mdi-check' : 'mdi-cursor-default' }}
      </v-icon>
    </v-card>
    <div class="text-uppercase px-2" :class="{ 'bb-primary--text': !active }">
      {{ active ? 'Selected' : 'Select' }}
    </div>
  </v-card>
</template>

<script>
  export default {
    props: {
      active: null
    }
  }
</script>

<style>
.bike-item-select {
  overflow: hidden;
}
.bike-item-select.white:hover {
  background-color: var(--bb-primary-light) !important;
}
.bike-item-select.white:hover .v-card {
  background-color: var(--bb-primary) !important;
}
</style>
