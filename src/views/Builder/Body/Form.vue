<template>
  <v-dialog v-model="show" max-width="1024">
    <v-card class="d-flex flex-column flex-nowrap" height="90vh">
      <v-toolbar class="outline-bottom light--border shrink" elevation="0" height="70">

        <v-spacer/>

        <Btn class="btn-close" color="bb-primary" @click="show = false" width="20" height="20" fab dark>
          <v-icon small v-text="'$close'"/>
        </Btn>

      </v-toolbar>
      <v-row class="grow rel" no-gutters>
        <div class="layer autoscroll pa-4">



        </div>
      </v-row>
      <v-toolbar class="outline-top light--border shrink" elevation="0" height="70">



      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>

  import { Btn } from '@/components';

  export default {
    components: { Btn },
    props: {
      value: null,
      items: Array
    },
    data() {
      return {
        show: this.value
      }
    },
    watch: {
      value( value ) {
        this.show = value
      },
      show() {
        this.$emit( 'input', this.show );
      }
    }
  }
</script>
