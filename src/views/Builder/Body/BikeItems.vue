<template>
  <div ref="container" v-resize="onResize" class="bike-items autoscroll">
    <v-item-group
      class="fill-height"
      :value="value"
      :mandatory="value != null"
      @change="$emit( 'input', $event )"
    >
      <v-item v-for="( item, i ) in list" v-slot="{ active, toggle }" :key="i">
        <a class="bike-item body-1 pt-3" :class="{ selected: active }" @click="toggle">

          <v-avatar v-if="active" class="bike-item-icon" size="30" color="bb-primary">
            <v-icon small dark>mdi-check-bold</v-icon>
          </v-avatar>

          <v-row class="fill-height flex-column flex-nowrap ma-0">

            <v-img
              :src="item.src"
              :lazy-src="item.src"
              :height="imageHeight"
              width="200"
              class="shrink mx-auto mb-2"
              contain
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="bb-primary"/>
                </v-row>
              </template>
            </v-img>

            <v-row class="bike-item-info bb-primary--text shrink pa-3 ma-0" align="center" justify="space-between">
              <p class="mb-0">{{ item.name }}</p>
              <p class="mb-0" v-if="item.info.colors.length > 1">
                <Color
                  v-for="( color, i ) in item.info.colors"
                  :key="i"
                  :value="[ color.color, color.color2 ]"
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
  import { itemImage } from '@/utils';

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
        return this.items.map( item => {
          const colors = item.colors.map( a => a.color );
          return {
            ...item,
            src: itemImage( item ),
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
        imageHeight: 140
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
          this.imageHeight = 140;
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
    transition: background-color 500ms ease;
    text-decoration: none;
    height: 200px;

    .bike-item-icon {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .bike-item-info {
      transition: color 500ms ease;
      height: 44px;
    }
    &.selected {
      background-color: #f4f4f4;
      border-left: 5px solid var(--bb-primary);
    }
    &:hover {

      background-color: var(--bb-secondary);
      color: white;

      .bike-item-info {
        color: white !important;
      }
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
      width: 300px;
      height: 100%;
      border-bottom: 0;
      border-left: 0;
      border-right: 1px solid var(--v-light-base);
      border-top: 5px solid transparent;
      vertical-align: top;

      &.selected {
        border-left: 0;
        border-top: 5px solid var(--bb-primary);
      }
    }
  }
</style>
