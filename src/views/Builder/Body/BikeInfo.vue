<template>
  <div>

    <div class="item-info px-4 mb-2">
      <p class="caption mb-0">{{ type }}</p>
      <p class="headline mb-0">{{ title }}</p>
    </div>

    <div class="item-info outline-left light--border px-4">
      <p class="caption mb-1">
        Colour <span v-if="current" class="body-1 primary--text">{{ current.name || 'Unkwnown' }}</span>
      </p>
      <v-item-group :value="color" @change="$emit( 'input', $event )">
        <v-item v-for="( item, i ) in colors" :key="i" v-slot:default="{ active, toggle }">

            <Color
              tag="a"
              href="#"
              :value="item.codes"
              :selected="active"
              @click="toggle"
            />

        </v-item>
      </v-item-group>
    </div>

    <div v-if="hasDescription" class="item-actions px-4">
      <Btn class="body-1" color="primary" tile dark @click="$emit( 'description', $event )">
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
      type: String,
      title: String,
      hasDescription: Boolean,
      color: null,
      colors: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      current() {
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
