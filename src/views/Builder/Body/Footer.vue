<template>
  <v-row class="pa-4" align="end" no-gutters>

    <Btn class="outline light--border" color="bb-primary" width="48" height="48" @click="$emit('reset')" icon>
      <v-icon v-text="'mdi-restore'"/>
    </Btn>

    <v-spacer/>

    <div class="text-right mr-4">
      <p class="caption bb-primary-light--text mb-0">SRP</p>
      <p class="display-4 bb-primary--text mb-0">{{ price }} €</p>
    </div>

    <Btn class="body-1" color="bb-primary" @click="showDetails = true" tile dark>
      Details
    </Btn>

    <v-dialog v-model="showDetails" max-width="1280">
      <v-card class="d-flex flex-column flex-nowrap" height="90vh">
        <v-toolbar class="outline-bottom light--border shrink" elevation="0" height="70">

          <h3 class="headline bb-primary--text">Your build in detail</h3>

          <v-spacer/>

          <Btn color="bb-primary" @click="showDetails = false" width="20" height="20" fab dark>
            <v-icon small v-text="'$close'"/>
          </Btn>

        </v-toolbar>
        <div class="grow rel">
          <v-row class="layer autoscroll pa-1" no-gutters>

            <v-col v-for="( comp, i ) in items" class="pa-1" :key="i" cols="12" sm="6" md="3">
              <v-card height="426" class="d-flex flex-column justify-end">

                <div class="grow rel pa-12">
                  <div class="detail-image" :style="image( comp.item, comp.color )"/>
                  <div class="detail-price headline bb-primary--text">
                    {{ getPrice( comp.item, comp.color ) }} €
                  </div>
                </div>

                <div class="px-4 mb-2">
                  <p class="caption bb-primary-light--text mb-0">{{ comp.item.step.title }}</p>
                  <p class="headline bb-primary--text mb-0">{{ comp.item.name }}</p>
                  <p class="mb-0">
                    <Color class="mb-0" :value="getColor( comp.item, comp.color )" small/>
                    <span class="caption bb-primary--text">{{ getColorName( comp.item, comp.color ) }}</span>
                  </p>
                </div>

                <v-card-actions>

                  <Btn class="body-1" color="bb-primary" tile dark @click="$emit( 'description', comp.item )">
                    Descripción
                  </Btn>

                  <Btn class="body-1" color="bb-primary" tile outlined @click="$emit( 'buy', comp.item )">
                    Buy online
                  </Btn>

                </v-card-actions>

              </v-card>
            </v-col>

          </v-row>
        </div>
        <v-toolbar class="outline-top light--border shrink" elevation="0" height="70">

          <Btn class="outline shrink" color="bb-primary" @click="$emit('buy')" text tile dark>
            Contact us for a quote
            <v-icon v-text="'$next'"/>
          </Btn>

          <v-spacer/>

          <div class="text-right">
            <p class="caption bb-primary-light--text mb-0">SRP</p>
            <p class="display-4 bb-primary--text mb-0">{{ price }} €</p>
          </div>

        </v-toolbar>
      </v-card>
    </v-dialog>

  </v-row>
</template>

<script>

  import { Btn, Color } from '@/components';
  import { itemImage } from '@/utils';

  export default {
    components: { Btn, Color },
    props: {
      items: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        showDetails: false
      }
    },
    computed: {
      price() {
        return this.items
          .map( a => a.item.colors[ a.color ])
          .reduce(( sum, item ) => sum + this.getPrice( item ), 0 );
      }
    },
    methods: {
      image( item, color ) {
        const src = itemImage( item, color );
        return `background-image: url(${ src })`;
      },
      getPrice( item, color ) {
        if ( color != null ) item = item.colors[ color ];
        return item.price || item.color.price || 0;
      },
      getColor( item, color ) {
        item = item.colors[ color ];
        return item.color ? [ item.color.color, item.color.color2 ] : null;
      },
      getColorName( item, color ) {
        item = item.colors[ color ];
        return item.color ? item.color.colorName : '';
      },
      close() {
        this.showDetails = false;
      }
    }
  }
</script>

<style>
  .detail-image {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: contain;
  }
  .detail-price {
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
