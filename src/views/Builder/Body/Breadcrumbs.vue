<template>
  <v-sheet v-bind="$attrs" :height="height">
    <div class="d-flex fill-height flex-nowrap">
      <a class="crumb" v-for="(item,i) in items" :key="i" :class="color(i)" @click="toggle(i)">
        <span class="text">{{ item }}</span>
        <span class="arrow" :style="dimension"/>
        <span class="arrow-line" :style="dimension"/>
      </a>
    </div>
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
        if ( index === this.value ) return 'bb-primary white--text';
        else if ( index < this.value ) return 'bb-secondary white--text';
        else return 'bb-secondary-light';
      },
      toggle( index ) {
        this.$emit( 'input', index );
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

    &.bb-primary .arrow { border-left-color: var(--bb-primary) !important; }
    &.bb-secondary .arrow { border-left-color: var(--bb-secondary) !important; }
    &.bb-secondary-light {
      .text { color: var(--bb-secondary-dark); }
      .arrow { border-left-color: var(--bb-secondary-light) !important; }
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
