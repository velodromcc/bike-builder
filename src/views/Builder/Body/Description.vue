<template>
  <v-dialog v-model="show" content-class="dialog-extra" max-width="1024">
    <v-toolbar color="transparent" elevation="0" width="100%" height="60" absolute>

      <Btn v-if="backButton" color="bb-primary" @click="$emit('back')" text>
        <v-icon left>mdi-arrow-left</v-icon>
        Return
      </Btn>

      <v-spacer/>

      <Btn color="bb-primary" @click="show = false" width="20" height="20" fab dark>
        <v-icon small v-text="'$close'"/>
      </Btn>

    </v-toolbar>
    <v-card v-if="item" class="autoscroll" min-height="250" max-height="90vh">
      <v-row class="ma-0">
        <v-col class="pa-10" cols="12" md="6" style="min-height:250px">

          <v-img :src="image.front || image.src" height="100%" contain/>

        </v-col>
        <v-col class="pa-10" cols="12" md="6">

          <span class="caption">{{ item.step.title }}</span>
          <h3 class="display-4 bb-primary--text mb-4">{{ item.name }}</h3>
          <div v-html="item.description"/>

        </v-col>
      </v-row>
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
  .dialog-extra {
    position: relative;
    overflow: hidden;
  }
</style>
