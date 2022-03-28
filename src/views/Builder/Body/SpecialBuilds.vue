<template>
  <v-dialog
    v-model="show"
    content-class="dialog-special-builds"
    max-width="1024"
    :fullscreen="isMobile"
  >
    <v-toolbar color="transparent" elevation="0" width="100%" height="60" absolute>

      <v-spacer/>

      <Btn color="bb-primary" @click="show = false" width="20" height="20" fab dark>
        <v-icon small v-text="'$close'"/>
      </Btn>

    </v-toolbar>
    <v-card
      class="autoscroll"
      min-height="250"
      :max-height="isMobile ? null : '90vh'"
      :height="isMobile ? '100%' : null"
    >
      <div class="pa-4">

        <h3 class="bb-primary--text mb-6">
          Special Builds of the Frameset
        </h3>

        <v-card
          v-for="( item, index ) in computedItems"
          :key="index"
          :ripple="false"
          @click="$emit( 'select', item )"
          class="mb-3"
        >
          <div class="d-flex">

            <v-img
              :src="item.thumbnail"
              style="flex: 0 0 120px"
              width="120"
              height="120"
              contain
            />

            <v-divider vertical/>

            <div class="special-build-info">

              <h4 class="bb-primary--text mb-1">
                {{ item.name }}
              </h4>

              <div v-html="item.description"/>

              <div class="mt-2">
                <span class="caption">Price:</span> <strong>{{ item.price }} €</strong>
              </div>

              <BtnSelect
                v-if="!isSmallScreen"
                class="body-1"
                :active="selected && item.query === selected.query"
              />

              <Btn
                v-else
                class="bike-item-select"
                :color="selected && item.query === selected.query ? 'bb-primary' : 'grey lighten-2'"
                width="24" height="24"
                fab dark
              >
                <v-icon small>
                  {{ selected && item.query === selected.query ? 'mdi-check' : 'mdi-cursor-default' }}
                </v-icon>
              </Btn>

              <Btn
                v-if="!unique"
                class="btn-show-details body-1"
                color="bb-secondary"
                @click.stop="open = open !== index ? index : -1"
                :text="!isSmallScreen"
                :icon="isSmallScreen"
              >
                {{ isSmallScreen ? '' : 'Details' }}
                <v-icon :right="!isSmallScreen">
                  {{ open === index ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
              </Btn>

            </div>
          </div>
          <v-expand-transition>
            <div v-if="open === index">
              <div
                class="description-special-details outline-top light--border"
                v-for="(subitem,e) in item.details"
                :key="e"
              >

                <div
                  class="description-special-image outline light--border"
                  :style="`background-image:url(${subitem.image.front || subitem.image.thumb || subitem.image.src})`"
                />

                <div>
                  <span class="caption">{{ subitem.title }}</span>
                  <div class="body-1 mt-n1">{{ subitem.name }}</div>
                </div>

              </div>
            </div>
          </v-expand-transition>
        </v-card>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>

  import { Btn, BtnSelect } from '@/components';
  import { itemImage, capitalize, CONSTANTS } from '@/utils';

  export default {
    components: { Btn, BtnSelect },
    props: {
      value: null,
      selected: null,
      items: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        show: !!this.value,
        open: this.unique ? 0 : -1
      }
    },
    watch: {
      value( value ) {
        this.show = !!value;
      },
      show() {
        this.$emit( 'input', this.show );
      },
      unique(v) {
        this.open = v ? 0 : -1;
      }
    },
    computed: {
      isSmallScreen() {
        return this.$vuetify.breakpoint.width <= 600;
      },
      isMobile() {
        return this.$vuetify.breakpoint.width <= 480;
      },
      unique() {
        return this.items.length === 1;
      },
      computedItems() {
        return this.items.map( item => ({
          ...item,
          thumbnail: this.getThumbnail( item ),
          details: this.specialItems( item )
        }))
      }
    },
    methods: {
      getThumbnail( item ) {
        if ( item.thumbnail ) return CONSTANTS.imageBase +  item.thumbnail;
        if (( item = this.$store.state.framesets.find( f => f.id === item.frameset ))) {
          const image = itemImage( item );
          return image.front || image.thumb || image.src;
        }
        return '';
      },
      specialItems( specialBuild ) {
        return [ 'bar','groupset','wheel','tyre','seatpost','saddle' ].map( type => {
          let group = type + 's';
          const item = this.$store.state[group].find( a => {
            return a.id === specialBuild[type] || specialBuild[group];
          });
          return item ? {
            ...item,
            title: capitalize( type ),
            image: itemImage( item )
          } : null;
        }).filter( Boolean );
      }
    }
  }
</script>

<style>
  .dialog-special-builds {
    position: relative;
    overflow: hidden;
  }
  .description-special-details {
    display: flex;
    align-items: center;
    padding: 8px 0;
    background-color: #f9f9f9;
  }
  .description-special-image {
    flex: 0 0 50px;
    height: 50px;
    margin-right: 8px;
    margin-left: 8px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    background-color: white;
  }
  .description-special-details img {
    width: 100%;
    height: auto;
  }
  .special-build-info {
    flex: 1 1 auto;
    position: relative;
    padding: 8px 120px 8px 8px;
  }
  .special-build-info .btn-show-details {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }
  .special-build-info .bike-item-select {
    position: absolute;
    top: 8px;
    right: 8px;
    bottom: auto;
    border: 1px solid var(--v-light-base) !important;
  }
  @media ( max-width: 600px ) {
    .special-build-info {
      padding: 8px 40px 8px 8px;
    }
  }
</style>
