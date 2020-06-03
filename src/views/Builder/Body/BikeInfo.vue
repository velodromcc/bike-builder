<template>
  <div>

    <div class="item-info px-4 mb-2">
      <p class="caption mb-0">{{ item.step.title }}</p>
      <p class="headline mb-0">{{ item.name }}</p>
    </div>

    <div v-if="colors.length" class="item-info outline-left light--border px-4">
      <p class="caption mb-1">
        Colour <span v-if="currentColor" class="body-1 primary--text">{{ currentColor.name || 'Unkwnown' }}</span>
      </p>
      <v-item-group :value="color" @change="$emit( 'input', $event )">
        <v-item v-for="( color, i ) in colors" :key="i" v-slot:default="{ active, toggle }">
          <Color
            tag="a" href="#"
            :value="color.value"
            :selected="active"
            @click="toggle"
          />
        </v-item>
      </v-item-group>
    </div>

    <div class="item-actions px-4">
      <Btn class="body-1" color="primary" tile dark @click="$emit('description')">
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
        return ( this.item.items || [] )
          .map( a => a.color )
          .filter( a => a );
      },
      currentColor() {
        return this.colors[ this.color ];
      }
    }
  }
</script>

<style lang="scss">
  .item-info {
    float: left;
  }
  .item-actions {
    clear: both;
  }
  @media ( max-width: 966px ) {
    .item-info {
      float: none;
      &.outline-left {
        border: 0 !important;
      }
    }
  }
</style>
