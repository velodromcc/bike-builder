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
      <div class="details-dialog-body">
        <v-row class="pa-1" no-gutters>

          <v-col v-for="( item, i ) in items" class="pa-1" :key="i" cols="12" sm="6" md="3">
            <v-card height="426" class="d-flex flex-column justify-end">

              <div class="grow rel" :class="{ 'pa-12': !( item.image.front || item.image.thumb )}">
                <div
                  class="detail-image"
                  :style="`background-image: url(${ item.image.front || item.image.thumb || item.image.src })`"
                />
                <div class="detail-price headline bb-primary--text">
                  {{ item.price }} €
                </div>
              </div>

              <div class="px-4 mb-2">
                <p class="caption mb-0">{{ item.type }}</p>
                <p class="headline bb-primary--text mb-0">{{ item.name }}</p>
                <p class="mb-0">
                  <Color class="mb-0" :value="item.color" small/>
                  <span class="caption">{{ item.colorName }}</span>
                </p>
              </div>

              <v-card-actions>

                <Btn class="body-1" color="bb-primary" tile dark @click="$emit( 'description', item.item )">
                  Description
                </Btn>

                <Btn v-if="item.url" tag="a" :href="item.url" target="_blank"
                class="body-1" color="bb-primary" tile outlined>
                  Buy online
                </Btn>

              </v-card-actions>

            </v-card>
          </v-col>

        </v-row>
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

        <div class="details-bottom-price text-right">
          <p class="caption mb-0">SRP</p>
          <p class="display-4 bb-primary--text mb-0">{{ price }} €</p>
        </div>

      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>

  import { Btn, Color } from '@/components';

  export default {
    components: { Btn, Color },
    props: {
      value: null,
      hideFormButton: Boolean,
      price: {
        type: Number,
        default: 0
      },
      items: {
        type: Array,
        default: () => []
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
