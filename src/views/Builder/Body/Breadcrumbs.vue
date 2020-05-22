<template>
  <v-sheet v-bind="$attrs" :height="height">
    <v-item-group :value="value" class="d-flex fill-height flex-nowrap" mandatory @change="$emit( 'input', $event )">
      <v-item v-for="(item,i) in items" :key="i" v-slot="{ toggle }">
        <a class="crumb" :class="color(i)"  @click="toggle">
          {{ item }}
          <span class="arrow" :style="dimension"/>
          <span class="arrow-line" :style="dimension"/>
        </a>
      </v-item>
    </v-item-group>
  </v-sheet>
</template>

<script>
  export default {
    props: {
      value: Number,
      height: {
        type: Number,
        default: 30
      },
      items: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      dimension() {
        return { borderWidth: ( this.height / 2 ) + 'px' }
      }
    },
    methods: {
      color( index ) {
        if ( index === this.value ) return 'primary white--text';
        else if ( index < this.value ) return 'secondary white--text';
        else return 'light';
      }
    }
  }
</script>

<style lang="scss">
  .crumb {

    position: relative;
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
    padding-left: 14px;

    .arrow, .arrow-line {
      z-index: 2;
      position: absolute;
      top: 0; left: 100%;
      border: 15px solid transparent;
      border-left-width: 12px !important;
    }

    &.primary .arrow { border-left-color: var(--v-primary-base) !important; }
    &.secondary .arrow { border-left-color: var(--v-secondary-base) !important; }
    &.light {
      color: var(--v-light-darken2);
      .arrow { border-left-color: var(--v-light-base) !important; }
    }

    .arrow-line {
      z-index: 1;
      border-left-color: white !important;
      margin-left: 1px;
    }

    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      .arrow, .arrow-line {
        display: none;
      }
    }
  }
</style>
