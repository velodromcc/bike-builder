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

          <v-card
            v-if="specialBuild"
            class="special-build-info pa-4 mt-6"
            @click="$emit('special-build', specialBuild )"
            :ripple="false"
          >

            <BtnSelect
              class="caption"
              :active="specialBuildSelected === specialBuild"
            />

            <h4 class="bb-primary--text mb-1">
              <v-icon color="orange">mdi-star</v-icon>
              Special build
            </h4>

            <div
              class="mb-3"
              v-html="specialBuild.description"
            />

            <div class="mb-3">
              Price: <strong>{{specialBuild.price}} €</strong>
            </div>

            <div
              class="description-special-details outline-bottom light--border"
              v-for="(item,i) in specialItems"
              :key="i"
            >

              <div class="description-special-image outline light--border"
                :style="`background-image:url(${item.image.front || item.image.thumb || item.image.src})`"
              />

              <div class="grow">
                <span class="caption">{{ item.title }}</span>
                <div class="body-1 mt-n1">{{ item.name }}</div>
              </div>

            </div>

          </v-card>

        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>

  import { Btn, BtnSelect } from '@/components';
  import { itemImage, capitalize } from '@/utils';

  export default {
    components: { Btn, BtnSelect },
    props: {
      value: null,
      item: Object,
      image: Object,
      backButton: Boolean,
      specialBuildSelected: null
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
    },
    computed: {
      specialBuild() {
        if ( this.item && this.item.step.title === 'Frameset' ) {
          return this.$store.state.specialBuilds.find( s => {
            return s.frameset === this.item.id;
          });
        }
        return null;
      },
      specialItems() {
        if ( ! this.specialBuild ) return [];
        return ['bar','groupset','wheel','tyre','seatpost','saddle'].map( type => {
          let group = type + 's';
          const item = this.$store.state[group].find( a => {
            return a.id === this.specialBuild[type] || this.specialBuild[group];
          });
          return item ? {
            ...item,
            title: capitalize(type),
            image: itemImage( item )
          } : null;
        }).filter( Boolean );
      }
    }
  }
</script>

<style>
  .dialog-extra {
    position: relative;
    overflow: hidden;
  }
  .description-special-details {
    display: flex;
    align-items: center;
    padding: 8px 0;
  }
  .description-special-details:last-child {
    border: 0 !important;
  }
  .description-special-image {
    flex: 0 0 50px;
    height: 50px;
    margin-right: 8px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .description-special-details img {
    width: 100%;
    height: auto;
  }
  .special-build-info {
    position: relative;
  }
  .special-build-info .bike-item-select {
    position: absolute;
    top: 16px;
    right: 16px;
    bottom: auto;
    border: 1px solid var(--v-light-base) !important;
  }
</style>
