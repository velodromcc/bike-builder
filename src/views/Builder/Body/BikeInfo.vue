<template>
  <div class="builder-info my-4">

    <div class="item-info px-5 mb-2" :class="{ alone: !hasColors }">
      <p class="caption mb-0">{{ item.step.title }}</p>
      <p class="headline bb-primary--text mb-0">{{ item.name }}</p>
    </div>

    <div v-if="hasColors" class="item-info outline-left light--border px-5">
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
        Description
      </Btn>
    </div>

  </div>
</template>

<script>

  import { Btn, Color } from '@/components';

  export default {
    components: { Btn, Color },
    props: {
      color: null,
      specialBuild: Object,
      item: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      colors() {
        return ( this.item.colors || [] )
          .map( a => a.color )
          .sort(( a, b ) => a.priority - b.priority );
      },
      current() {
        return this.colors[ this.color ];
      },
      hasColors() {
        return this.colors.length > 1;
      }
    }
  }
</script>

<style lang="scss">
  .builder-info {
    position: relative;
  }
  .item-info {

    width: 50%;
    float: left;

    &.alone {
      width: 100%;
    }
  }
  .item-actions {
    clear: both;
  }

  @media ( max-width: 600px ) {
    .builder-info {
      display: flex;
      flex-direction: column;
    }
    .item-info {
      float: none;
      width: 100%;
      order: 1;
      &.outline-left {
        border: 0 !important;
        order: 0;
      }
    }
    .item-actions {
      order: 2;
    }
  }
</style>
