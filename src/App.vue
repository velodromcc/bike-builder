<template>
  <v-app id="app">
    <Builder/>
  </v-app>
</template>

<script>

  import Builder from '@/views/Builder';
  import { mapState } from 'vuex';
  import { lighten, darken } from '@/utils';

  function lightColor( color, level ) {
    var result;
    level = level == null ? 60 : level;
    while( level > 0 ) {
      result = lighten( color, level );
      if ( result !== '#ffffff' ) return result;
      level -= 10;
    }
    return '#f4f4f4';
  }

  export default {
    components: {
      Builder
    },
    watch: {
      company: 'refreshStyle'
    },
    computed: {
      ...mapState([ 'company' ]),
      primary() {
        const color = '#' + ( this.company.color1 || '000000' ).replace('#','');
        const light = lightColor( color );
        return {
          base: color,
          light
        };
      },
      secondary() {
        const color = '#' + ( this.company.color2 || '4b4b4b' ).replace('#','');
        const light = lightColor( color );
        const dark  = darken( light, 15 );
        return {
          base: color,
          light,
          dark
        };
      },
      background() {
        const color = '#' + ( this.company.color3 || 'ffffff' ).replace('#','');
        return {
          base: color
        };
      },
      cssClasses() {

        const classes = {};
        const root = {};

        this.eachColors(( className, value ) => {
          root[className] = value;
          classes[className] = `background-color: ${ value } !important`;
          classes[className+'--text'] = `color: ${ value } !important`;
          classes[className+'--border'] = `border-color: ${ value } !important`;
        });

        var css = '', className;
        for ( className in classes ) {
          css += `.${className} {\n  ${ classes[className] };\n}\n`;
        }

        // Root
        css += ":root {\n";
        for ( className in root ) {
          css += `  --${className}: ${ root[className] };\n`;
        }
        css += "}";

        return css;
      }
    },
    methods: {
      eachColors( fn ) {

        const prefix = 'bb';
        const colors = {
          primary: this.primary,
          secondary: this.secondary,
          background: this.background
        };

        var name, type, className;
        for ( name in colors ) {
          for ( type in colors[name] ) {
            className = type === 'base' ? [ prefix, name ].join('-') : [ prefix, name, type ].join('-');
            fn( className, colors[name][type], name, type );
          }
        }
      },
      refreshStyle() {

        const head  = document.getElementsByTagName('head')[0];
        if ( ! head ) return;

        var style = document.getElementById('bikebuilder-style');
        if ( style ) head.removeChild( style );

        // Create new style
        style = document.createElement('style');
        style.id = 'bikebuilder-style';
        style.innerHTML = this.cssClasses;
        head.appendChild( style );
      }
    },
    mounted() {
      this.refreshStyle();
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

    position: fixed;
    top: 0; left: 0;
    right: 0; bottom: 0;
    overflow: auto;

    .v-application--wrap {
      min-width: 300px;
      min-height: 632px;
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
  .full {
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
    right: 0; bottom: 0;
  }
  .autoscroll {
    overflow: auto;
  }
  .single-line {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
  .outline {

    border: 1px solid var(--v-light-darken2) !important;

    &.light--border {
      border-color: var(--v-light-base) !important;
    }

    &-top {

      border-top: 1px solid var(--v-light-darken2) !important;

      &.light--border {
        border-color: var(--v-light-base) !important;
      }
    }
    &-right {

      border-right: 1px solid var(--v-light-darken2) !important;

      &.light--border {
        border-color: var(--v-light-base) !important;
      }
    }
    &-bottom {

      border-bottom: 1px solid var(--v-light-darken2) !important;

      &.light--border {
        border-color: var(--v-light-base) !important;
      }
    }
    &-left {

      border-left: 1px solid var(--v-light-darken2) !important;

      &.light--border {
        border-color: var(--v-light-base) !important;
      }
    }
  }

  /* TYPOGRAPHY */

  h1, h2, h3, h4, h5, h6,
  .display-1, .display-2, .display-3, .display-4,
  .headline, .title, .subtitle-1, .subtitle-2, .body-1, .body-2,
  .caption, .overline {
    text-transform: uppercase;
  }
  .body-1, .body-2, .caption, .overline {
    color: var(--bb-secondary-darken3);
  }

  /* SCROLLBAR */

  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--bb-primary);
    border-radius: 20px;
    border: 1px solid white;
  }

  /* OTHERS */
  .v-dialog:not(.v-dialog--fullscreen) {
    max-height: 90vh !important;
  }
</style>
