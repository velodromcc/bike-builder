<template>
  <div ref="container" v-resize="onResize" class="bike-items autoscroll">
    <v-item-group class="fill-height" :value="value" @change="$emit( 'input', $event )">
      <v-item v-for="( item, i ) in list" v-slot="{ active, toggle }" :key="i">
        <a class="bike-item body-1 pt-3" href="#" :class="{ selected: active }" @click="toggle">

          <v-avatar v-if="active" class="bike-item-icon" size="30" color="primary">
            <v-icon small dark>mdi-check-bold</v-icon>
          </v-avatar>

          <v-row class="fill-height flex-column flex-nowrap ma-0">

            <v-img :src="item.src" :lazy-src="item.lazySrc" class="shrink mb-2" :height="imageHeight" contain>
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="light"/>
                </v-row>
              </template>
            </v-img>

            <v-row class="bike-item-info shrink pa-3 ma-0" align="center" justify="space-between">
              <p class="mb-0">{{ item.name }}</p>
              <p class="mb-0">
                <Color
                  v-for="( color, i ) in item.info.colors"
                  :key="i"
                  :value="color.value"
                  class="mb-0"
                  small
                />
                <span v-if="item.info.more">
                  +{{ item.info.more }}
                </span>
              </p>
            </v-row>

          </v-row>
        </a>
      </v-item>
    </v-item-group>
  </div>
</template>

<script>

  import { Color } from '@/components';

  export default {
    components: { Color },
    props: {
      value: null,
      items: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      list() {
        return this.items.map( a => {

          const image  = require(`@/assets/items/${ a.items[0].image }`);
          const colors = a.items.map( b => b.color ).filter( _ => _ );

          return {
            ...a,
            src: image,
            lazySrc: image,
            info: {
              colors: colors.slice( 0, 3 ),
              more: colors.length > 3 ? colors.length - 3 : 0
            }
          };
        });
      }
    },
    data() {
      return {
        imageHeight: null
      }
    },
    methods: {
      onResize() {
        const { container } = this.$refs;
        if ( container && window.innerWidth <= 966 ) {
          const info = container.querySelector('.bike-item-info');
          if ( info ) {
            this.imageHeight = container.clientHeight - info.clientHeight;
          }
        } else {
          this.imageHeight = null;
        }
      }
    }
  };
</script>

<style lang="scss">
  .bike-item {

    display: block;
    position: relative;
    border-left: 5px solid transparent;
    border-bottom: 1px solid var(--v-light-base);
    transition: all 135ms ease;
    text-decoration: none;
    height: 200px;

    .bike-item-icon {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .bike-item-info {
      height: 44px;
    }
    &.selected {
      background-color: var(--v-light-base);
      border-left: 5px solid var(--v-primary-base);
    }
    &:hover {
      background-color: var(--v-secondary-base);
      color: white;
    }
  }
  @media ( max-width: 966px ) {
    .bike-items {
      overflow-y: hidden !important;
    }
    .bike-items > div {
      white-space: nowrap;
    }
    .bike-item {
      display: inline-block;
      max-width: 300px;
      height: 100%;
      border-bottom: 0;
      border-right: 1px solid var(--v-light-base);
      vertical-align: top;
    }
  }
</style>
