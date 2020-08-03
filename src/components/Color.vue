<template>
  <component
    :is="tag"
    v-bind="$attrs"
    v-on="$listeners"
    class="b-color outline light--border"
    :class="{ selected, small }"
    :style="`background-color:${ color[0] };`"
  >
    <span v-if="color[1]" :style="`border-color: ${ color[1] }`"/>
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
    width: 24px;
    height: 24px;
    margin: 0 10px 10px 0;
    vertical-align: middle;
    overflow: hidden;

    & > span {

      position: absolute;
      top: 0;
      left: 0;
      border-width: 11px;
      border-style: solid;
      border-top-color: transparent !important;
      border-left-color: transparent !important;

    }
    &.small {

      width: 16px;
      height: 16px;
      margin: 0 4px 4px 0;

      & > span {
        border-width: 7px;
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
