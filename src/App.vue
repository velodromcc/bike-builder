<template>
  <v-app id="app">
    <Builder />
  </v-app>
</template>

<script>

  import Builder from '@/views/Builder';

  export default {
    components: {
      Builder
    }
  }
</script>

<style lang="scss">

  #app {

    font-family: 'Open Sans', Helvetica, Arial, sans-serif;
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;

    .v-application--wrap {
      -webkit-backface-visibility: visible;
      backface-visibility: visible;
    }
  }
  .fill-width {
    width: 100%;
  }
  .fill-height {
    height: 100%;
  }
  .full, .layer {
    width: 100%;
    height: 100%;
  }
  .rel {
    position: relative;
  }
  .abs, .layer {
    position: absolute;
  }
  .layer {
    top: 0; left: 0;
  }
  .autoscroll {
    overflow: auto !important;
  }
  .outline {

    border: 1px solid var(--v-primary-lighten3) !important;

    &.light--border {
      border-color: var(--v-light-base) !important;
    }

    &-top {

      border-top: 1px solid var(--v-primary-lighten3) !important;

      &.light--border {
        border-color: var(--v-light-base) !important;
      }
    }
    &-right {

      border-right: 1px solid var(--v-primary-lighten4) !important;

      &.light--border {
        border-color: var(--v-light-base) !important;
      }
    }
    &-bottom {

      border-bottom: 1px solid var(--v-primary-lighten3) !important;

      &.light--border {
        border-color: var(--v-light-base) !important;
      }
    }
    &-left {

      border-left: 1px solid var(--v-primary-lighten3) !important;

      &.light--border {
        border-color: var(--v-light-base) !important;
      }
    }
  }
  h1, h2, h3, h4, h5, h6,
  .display-1, .display-2, .display-3, .display-4,
  .headline, .title, .subtitle-1, .subtitle-2, .body-1, .body-2,
  .caption, .overline {
    text-transform: uppercase;
  }
  .body-1, .body-2, .caption, .overline {
    color: var(--v-light-darken4);
  }

  @media only screen and ( max-width: 600px ) {
    html {
      font-size: 24px !important;
    }
  }
</style>
