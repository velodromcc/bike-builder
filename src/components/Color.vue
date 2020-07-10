<template>
  <component :is="tag" v-bind="$attrs" v-on="$listeners" class="b-color outline light--border" :class="{ selected, small }">
    <span :style="`border-color: ${ color[0] }`"/>
    <span :style="`border-color: ${ color[1] || color[0] }`"/>
  </component>
</template>

<script>

  import { toArray } from '@/utils';

  export default {
    props: {
      value: [ String, Array ],
      tag: {
        type: String,
        default: 'span'
      },
      small: Boolean,
      selected: Boolean
    },
    computed: {
      color() {
        return toArray( this.value )
          .filter( a => a )
          .map( v => '#' + v.replace('#',''));
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
      outline: 1px solid var(--bb-primary);
      outline-offset: 2px;
    }
    &:hover:not(.selected) {
      outline-color: var(--bb-secondary-light);
    }
  }
</style>
