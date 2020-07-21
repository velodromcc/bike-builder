<template>
  <footer class="footer pa-4">

    <nav class="footer-left">

      <Btn class="footer-details body-1 mr-3" color="bb-secondary" @click="showDetails = true" height="40" tile outlined>
        <v-icon left v-text="'mdi-magnify'"/>
        Your build in detail
      </Btn>

      <Btn class="outline light--border mr-3" color="bb-primary" width="40" height="40" @click="$emit('reset')" icon>
        <v-icon v-text="'mdi-restore'"/>
      </Btn>

      <Btn class="outline light--border mr-3" color="bb-primary" width="40" height="40" @click="$emit('message')" icon>
        <v-icon v-text="'mdi-chat-outline'"/>
      </Btn>

      <Btn class="outline light--border" color="bb-primary" width="40" height="40" @click="$emit('share')" icon>
        <v-icon v-text="'mdi-share-variant'"/>
      </Btn>

    </nav>

    <div class="footer-right">

      <div class="footer-srp">
        <p class="caption bb-primary-light--text mb-0" style="line-height:1.4;">SRP</p>
        <p class="display-4 bb-primary--text mt-n1 mb-0">{{ price }} €</p>
      </div>

      <Btn class="footer-enquire body-1" color="bb-secondary" @click="$emit('form')" height="40" tile dark>
        <v-icon left v-text="'mdi-send'"/>
        Enquire about this build
      </Btn>

    </div>

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

            <v-col v-for="( info, i ) in infoItems" class="pa-1" :key="i" cols="12" sm="6" md="3">
              <v-card height="426" class="d-flex flex-column justify-end">

                <div class="grow rel pa-12">
                  <div class="detail-image" :style="info.image"/>
                  <div class="detail-price headline bb-primary--text">
                    {{ info.price }} €
                  </div>
                </div>

                <div class="px-4 mb-2">
                  <p class="caption bb-primary-light--text mb-0">{{ info.type }}</p>
                  <p class="headline bb-primary--text mb-0">{{ info.name }}</p>
                  <p class="mb-0">
                    <Color class="mb-0" :value="info.color" small/>
                    <span class="caption bb-primary--text">{{ info.colorName }}</span>
                  </p>
                </div>

                <v-card-actions>

                  <Btn class="body-1" color="bb-primary" tile dark @click="$emit( 'description', info.item )">
                    Descripción
                  </Btn>

                  <Btn v-if="info.url" tag="a" :href="info.url" target="_blank"
                  class="body-1" color="bb-primary" tile outlined>
                    Buy online
                  </Btn>

                </v-card-actions>

              </v-card>
            </v-col>

          </v-row>
        </div>
        <v-toolbar class="outline-top light--border shrink" elevation="0" height="70">

          <Btn v-if="!hideFormButton" class="outline shrink" color="bb-primary" @click="$emit('form')" text tile dark>
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

  </footer>
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
      },
      hideFormButton: Boolean
    },
    data() {
      return {
        showDetails: false
      }
    },
    computed: {
      infoItems() {
        return this.items.map(( a, item ) => {
          item = a.item.colors[ a.color ];
          return {
            type: a.item.step.title,
            name: a.item.name,
            item: a.item,
            price: item.price || item.color.price || 0,
            colorName: item.color.colorName,
            color: [ item.color.color, item.color.color2 ],
            image: this.image( a.item, a.color ),
            url: item.url
          }
        });
      },
      price() {
        return this.infoItems
          .reduce(( sum, a ) => sum + a.price, 0 );
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
  .footer-left { float: left; }
  .footer-right { float: right; }
  .footer-srp, .footer-enquire { float: left; }
  .footer-srp {
    text-align: right;
    margin-right: 16px;
  }
  .footer-srp > p.caption {
    line-height: 1.4;
    font-size: .6rem !important;
  }
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
  @media ( max-width: 1120px ) {
    .footer-left, .footer-right, .footer-srp, .footer-enquire {
      float: none;
    }
    .footer-left, .footer-right {
      max-width: 350px;
      margin: 0 auto;
    }
    .footer-srp {
      text-align: left;
      margin: 8px 0;
    }
    .footer-srp > p {
      display: inline-block;
    }
    .footer-srp > p.caption {
      font-size: 1rem !important;
      margin-right: 10px;
    }
    .footer-srp > p.display-4 {
      font-size: 1.5rem !important;
    }
    .footer-enquire {
      width: 100%;
    }
  }
  @media ( max-width: 390px ) {
    .footer {
      text-align: center;
    }
    .footer-details {
      width: 100%;
      margin-bottom: 8px;
    }
    .footer-srp {
      display: inline-block;
    }
  }
</style>
