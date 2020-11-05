<template>
  <v-dialog v-model="show" max-width="1024">
    <v-card v-if="item" class="d-flex flex-column flex-nowrap" height="90vh">
      <v-toolbar class="shrink" elevation="0" height="60">

        <Btn v-if="backButton" color="bb-primary" @click="$emit('back')" text>
          <v-icon left>mdi-arrow-left</v-icon>
          Return
        </Btn>

        <v-spacer/>

        <Btn color="bb-primary" @click="show = false" width="20" height="20" fab dark>
          <v-icon small v-text="'$close'"/>
        </Btn>

      </v-toolbar>
      <div class="grow rel">
        <v-row class="layer autoscroll ma-0">
          <v-col class="pa-10 fill-height" cols="12" md="6">

            <v-img :src="image.front || image.thumb || image.src" height="100%" contain/>

          </v-col>
          <v-col class="pa-10 info-column" cols="12" md="6">

            <span class="caption">{{ item.step.title }}</span>
            <h3 class="display-4 bb-primary--text mb-4">{{ item.name }}</h3>
            <div v-html="item.description"/>

          </v-col>
        </v-row>
      </div>

    </v-card>
  </v-dialog>
</template>

<script>

  import { Btn } from '@/components';

  export default {
    components: { Btn },
    props: {
      value: null,
      item: Object,
      image: Object,
      backButton: Boolean
    },
    data() {
      return {
        show: !!this.value
      }
    },
    watch: {
      value( value ) {
        this.show = !!value;
      },
      show() {
        this.$emit( 'input', this.show );
      }
    }
  }
</script>

<style>
  .info-column {
    height: 100%;
    overflow: auto;
  }
  @media ( max-width: 966px ) {
    .info-column {
      height: auto;
      overflow: visible;
    }
  }
</style>
