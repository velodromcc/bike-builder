<template>
  <div class="my-4">

    <div class="item-info px-5 mb-2">
      <p class="caption mb-0">{{ item.step.title }}</p>
      <p class="headline bb-primary--text mb-0">{{ item.name }}</p>
    </div>

    <div v-if="colors.length > 1" class="item-info outline-left light--border px-5">
      <p class="caption mb-1">
        Colour <span v-if="current" class="body-1 bb-primary--text">{{ current.colorName || 'Unkwnown' }}</span>
      </p>
      <v-item-group :value="color" mandatory @change="$emit( 'input', $event )">
        <v-item v-for="( color, i ) in colors" :key="i" v-slot:default="{ active, toggle }">
          <Color
            tag="a"
            :value="[ color.color, color.color2 ]"
            :selected="active"
            @click="toggle"
          />
        </v-item>
      </v-item-group>
    </div>

    <div class="item-actions px-5 mt-2">
      <Btn class="body-1" color="bb-primary" tile dark @click="$emit('description')">
        Descripción
      </Btn>
    </div>

  </div>
</template>

<script>

  import { Btn, Color } from '@/components';

  export default {
    components: { Btn, Color },
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      color: null
    },
    computed: {
      colors() {
        return ( this.item.colors || [] )
          .map( a => a.color )
          .sort(( a, b ) => a.priority - b.priority );
      },
      current() {
        return this.colors[ this.color ];
      }
    }
  }
</script>

<style lang="scss">

  .item-info {
    width: 50%;
    float: left;
  }
  .item-actions {
    clear: both;
  }

  @media ( max-width: 600px ) {
    .item-info {
      float: none;
      &.outline-left {
        border: 0 !important;
      }
    }
  }
</style>
