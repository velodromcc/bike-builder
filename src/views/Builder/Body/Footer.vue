<template>
  <v-row class="pa-4" align="end" no-gutters>

    <Btn class="outline light--border" color="primary" width="48" height="48" @click="$emit('reset')" icon>
      <v-icon v-text="'mdi-restore'"/>
    </Btn>

    <v-spacer/>

    <div class="text-right mr-4">
      <p class="caption mb-0">SRP</p>
      <p class="display-4 mb-0">{{ price }} €</p>
    </div>

    <Btn class="body-1" color="primary" @click="showDetails = true" tile dark>
      Details
    </Btn>

    <v-dialog v-model="showDetails" max-width="1024">
      <v-card class="d-flex flex-column flex-nowrap" min-height="560">
        <v-toolbar class="outline-bottom light--border shrink" elevation="0" height="70">

          <h3 class="headline">Your build in detail</h3>

          <v-spacer/>

          <Btn color="primary" @click="showDetails = false" x-small fab>
            <v-icon v-text="'$close'"/>
          </Btn>

        </v-toolbar>
        <div class="grow rel">
          <v-row class="layer autoscroll pa-2 ma-0">

            <v-col v-for="( comp, i ) in items" :key="i" cols="6" sm="4" md="3">
              <v-card>

                <div class="pa-4">
                  <v-img
                    class="align-end"
                    height="200px"
                    :src="image( comp.item, comp.color )"
                    contain
                  />
                </div>

                <div class="px-4 mb-2">
                  <p class="caption mb-0">{{ comp.item.step.title }}</p>
                  <p class="headline mb-0">{{ comp.item.name }}</p>
                </div>

                <v-card-text
                  v-if="comp.item.excerpt"
                  class="body-1"
                  v-html="comp.item.excerpt"
                />

                <v-card-actions>

                  <Btn class="body-1" color="primary" tile dark @click="$emit( 'description', comp.item )">
                    Descripción
                  </Btn>

                  <Btn class="body-1" color="primary" tile outlined @click="$emit( 'buy', comp.item )">
                    Buy online
                  </Btn>

                </v-card-actions>

              </v-card>
            </v-col>

          </v-row>
        </div>
        <v-toolbar class="outline-top light--border shrink" elevation="0" height="70">

          <v-spacer/>

          <div class="text-right">
            <p class="caption mb-0">SRP</p>
            <p class="display-4 mb-0">{{ price }} €</p>
          </div>

        </v-toolbar>
      </v-card>
    </v-dialog>

  </v-row>
</template>

<script>

  import { Btn } from '@/components';
  import { itemImage } from '@/utils';

  export default {
    components: { Btn },
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
          .reduce(( sum, item ) => sum + ( item.price || item.color.price || 0 ), 0 );
      }
    },
    methods: {
      image: itemImage,
      close() {
        this.showDetails = false;
      }
    }
  }
</script>
