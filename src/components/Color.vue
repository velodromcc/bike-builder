<template>
  <component :is="tag" v-bind="$attrs" v-on="$listeners" class="b-color outline light--border" :class="{ selected, small }">
    <span v-for="( color, e ) in colors" :key="e" :style="`border-color: ${ color }`"/>
  </component>
</template>

<script>

  export default {
    props: {
      value: {
        type: Array,
        default: () => []
      },
      tag: {
        type: String,
        default: 'span'
      },
      small: Boolean,
      selected: Boolean
    },
    computed: {
      colors() {
        return this.value.slice( 0, 2 );
      }
    }
  }
</script>

<style lang="scss">

  .b-color {

    position: relative;
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    margin: 0 0.625rem 0.625rem 0;
    vertical-align: middle;

    & > span {

      position: absolute;
      top: 0;
      left: 0;
      border-width: 0.7rem;
      border-style: solid;

      &:nth-child(2) {
        border-top-color: transparent !important;
        border-left-color: transparent !important;
      }
    }
    &.small {

      width: 1rem;
      height: 1rem;
      margin: 0 0.25rem 0.25rem 0;

      & > span {
        border-width: .455rem;
        top: -.5px;
      }
    }
  }
  a.b-color {

    cursor: pointer;

    &:hover, &:focus, &.selected {
      outline: 1px solid var(--v-primary-base);
      outline-offset: 2px;
    }
    &:hover:not(.selected) {
      outline-color: var(--v-light-base);
    }
  }
</style>
