<template>
  <v-dialog v-model="show" max-width="1280">
    <v-card class="details-dialog" :class="{ 'is-small': isSmall }">
      <v-toolbar class="details-dialog-header outline-bottom light--border" elevation="0" height="70">

        <h3 class="headline bb-primary--text">Your build in detail</h3>

        <v-spacer/>

        <Btn color="bb-primary" @click="show = false" width="20" height="20" fab dark>
          <v-icon small v-text="'$close'"/>
        </Btn>

      </v-toolbar>
      <div class="details-dialog-body py-3 px-6">

        <DetailItems
          :items="items"
          @description="$emit('description',$event)"
          dense
        />

      </div>
      <v-toolbar class="details-dialog-footer outline-top light--border" elevation="0" height="70">

        <Btn
          v-if="!hideFormButton"
          color="bb-primary"
          :small="isSmall"
          outlined tile dark
          @click="$emit('form')"
        >
          {{ isSmall ? 'Contact us' : 'Contact us for a quote' }}
          <v-icon v-text="'$next'"/>
        </Btn>

        <v-spacer/>

        <Price
          class="details-bottom-price"
          align="right"
          :price="price"
          :offer="specialBuild && specialBuild.price"
        />

      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>

  import { Btn, Price } from '@/components';
  import DetailItems from './DetailItems';

  export default {
    components: { DetailItems, Price, Btn },
    props: {
      value: null,
      hideFormButton: Boolean,
      items: Array,
      specialBuild: Object,
      price: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        show: !!this.value
      }
    },
    computed: {
      isSmall() {
        return this.$vuetify.breakpoint.xs;
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
.details-dialog {
  position: relative;
  overflow: hidden;
  height: 80vh;
}
.details-dialog-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.details-dialog-body {
  position: absolute;
  top: 70px;
  bottom: 70px;
  left: 0;
  right: 0;
  overflow: auto;
  background-color: #f4f4f4;
}
.details-dialog-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.is-small .details-bottom-price > p {
  display: inline-block;
}
.is-small .details-bottom-price > p.display-4 {
  font-size: 22px !important;
  margin-left: 7px;
}
</style>
