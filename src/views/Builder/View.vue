<template>
  <main class="fill-height rel">

    <!--<Loading
      v-if="loading"
      :value="load.value"
      :load-text="load.text"
      :title="title"
      :text="text"
      />-->

    <v-row class="builder" no-gutters>
      <v-row class="flex-column flex-nowrap grow" no-gutters>
        <v-toolbar tag="header" class="shrink outline-bottom light--border" height="70" elevation="0">

          <h1 class="title">Logotype</h1>

          <v-spacer/>

          <nav>

            <Btn class="mr-2" color="primary" icon>
              <v-icon v-text="'mdi-chat-outline'"/>
            </Btn>

            <Btn color="primary" icon>
              <v-icon v-text="'mdi-share-variant'"/>
            </Btn>

          </nav>

        </v-toolbar>
        <div class="builder-info grow rel">
          <div class="layer py-4">

            <div v-if="current">

              <div class="item-info px-4 mb-2">
                <p class="caption mb-0">{{ step.title }}</p>
                <p class="headline mb-0">{{ current.name }}</p>
              </div>

              <div class="item-info outline-left light--border px-4">
                <p class="caption mb-1">
                  Colour <span v-if="currentColor" class="body-1 primary--text">{{ currentColor.name }}</span>
                </p>
                <v-item-group v-model="selectedColor">
                  <v-item v-for="(color,i) in current.colors" :key="i">
                    <template v-slot:default="{ active, toggle }">
                      <a href="#" class="btn-color outline light--border" :class="{ selected: active }" @click="toggle">
                        <span
                          v-for="(code,e) in color.codes"
                          :key="e"
                          :style="`border-color: ${ code }`"
                        />
                      </a>
                    </template>
                  </v-item>
                </v-item-group>
              </div>

              <div class="item-actions px-4">
                <Btn class="body-1" color="primary" tile dark>
                  Descripción
                </Btn>
              </div>

            </div>

            <div class="builder-bike">

              <!-- BIKE -->

            </div>
          </div>
        </div>
        <v-row class="shrink pa-4" align="end" no-gutters>

          <Btn class="outline light--border" color="primary" width="48" height="48" icon>
            <v-icon v-text="'mdi-restore'"/>
          </Btn>

          <v-spacer/>

          <div class="text-right">
            <p class="caption mb-0">SRP</p>
            <p class="display-4 mb-0">400 €</p>
          </div>

        </v-row>
      </v-row>
      <v-row class="nav-builder flex-column flex-nowrap" no-gutters>
        <v-sheet tag="nav" class="d-flex justify-space-between align-center shrink"
        color="primary" height="70" tile>

          <Btn class="ml-2" color="white" :disabled="!index" icon>
            <v-icon v-text="'$prev'"/>
          </Btn>

          <span class="title white--text">
            {{ step.title }}
          </span>

          <Btn class="mr-2" color="white" :disabled="index === data.length - 1" icon>
            <v-icon v-text="'$next'"/>
          </Btn>

        </v-sheet>
        <div class="grow rel">
          <v-item-group class="layer autoscroll" v-model="selected">
            <v-item v-for="(item,i) in items" v-slot="{ active, toggle }" :key="i">
              <a class="bike-item body-1 pt-3" href="#" :class="{ selected: active }" @click="toggle">

                <v-img v-bind="image( require(`@/assets/items/${step.type}/${item.image}`), true )" class="mb-2" height="140" contain>
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="light"/>
                    </v-row>
                  </template>
                </v-img>

                <v-row class="pa-3 ma-0" align="center" justify="space-between">
                  <p class="mb-0">{{ item.name }}</p>
                  <p class="mb-0">
                    <span v-for="(color,i) in colors(item)" :key="i" class="btn-color small outline light--border mb-0">
                      <span
                        v-for="(code,e) in color.codes"
                        :key="e"
                        :style="`border-color: ${ code }`"
                      />
                    </span>
                    <span v-if="item.colors.length > 3">
                      +{{ item.colors.length - 3 }}
                    </span>
                  </p>
                </v-row>
              </a>
            </v-item>
          </v-item-group>
        </div>
      </v-row>
    </v-row>
  </main>
</template>

<script>

  //import Loading from './Loading';
  import { mapState } from 'vuex';
  import Btn from '@/components/Btn';

  export default {
    components: { Btn },
    mounted() {
      this.fetch();
    },
    data() {
      return {
        selected: 0,
        selectedColor: 0,
        composition: [],
        title: 'Bike Builder',
        text: '<p>' + [
          'Use this interactive configurator to design your dream bike; swap components, change colours, the choice is yours.',
          'Get in touch once you\'ve completed your build and we\'ll talk you through the options, including a <a href="#">Full Bike Fit</a>'
        ].join('</p><p>') + '</p>',
        load: {
          value: 0,
          text: '',
          steps: [
            { handler: () => this.$store.dispatch('loadInfo'), text: 'Loading...', size: 20 },
            { handler: () => this.$store.dispatch('loadData'), text: 'Loading interface...', size: 80 }
          ]
        }
      }
    },
    computed: {
      ...mapState([ 'loading', 'data', 'index' ]),
      step() {
        return this.data[ this.index ] || {
          title: '?',
          type: '?',
          items: []
        };
      },
      items() {
        return this.step.items;
      },
      current() {
        return this.items[ this.selected ];
      },
      currentColor() {
        return this.current ? this.current.colors[ this.selectedColor ] : null;
      }
    },
    methods: {
      fetch( index, total, loaded ) {

        index  = index  || 0;
        loaded = loaded || 0;
        total  = total  || this.load.steps.reduce(( sum, a ) => sum + a.size, 0 );

        const step = this.load.steps[index];
        this.load.value = ( loaded / total ) * 100;
        this.load.text  = step ? step.text : 'Complete';

        if ( step ) {
          return Promise
            .resolve( step.handler())
            .then(() => this.fetch( index + 1, total, loaded + step.size ))
            .catch( console.warn )
        }

        // Esperamos a que finalice la animación del loader
        setTimeout(() => this.$store.commit( 'set', { loading: false }), 500 );
      },
      image( src, lazy ) {
        const props = { src: src }
        if ( lazy ) props.lazySrc = props.src;
        return props;
      },
      colors( item ) {
        return item.colors.slice( 0, 3 );
      }
    }
  }
</script>

<style lang="scss">

  .builder {

    position: absolute;
    top: 0;  bottom: 0;
    left: 0; right: 0;
    flex-wrap: nowrap;

    .nav-builder {
      position: relative;
      background-color: white;
      flex: 0 0 400px;
      border-left: 1px solid var(--v-light-base);
      z-index: 1;
    }
  }
  .builder-bike {
    position: absolute;
    width: 100%;
    bottom: 0;
  }
  .item-info {
    float: left;
  }
  .item-actions {
    clear: both;
  }

  /* COLOR BTNS */

  .btn-color {

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
  a.btn-color {

    cursor: pointer;

    &:hover, &:focus, &.selected {
      outline: 1px solid var(--v-primary-base);
      outline-offset: 2px;
    }
    &:hover:not(.selected) {
      outline-color: var(--v-light-base);
    }
  }

  /* BIKE ITEM */

  .bike-item {

    display: block;
    border-left: 5px solid transparent;
    border-bottom: 1px solid var(--v-light-base);
    transition: all 135ms ease;
    text-decoration: none;

    &.selected {
      background-color: var(--v-light-base);
      border-left: 5px solid var(--v-primary-base);
    }
    &:hover {
      background-color: var(--v-secondary-base);
      color: white;
    }
  }

  /* MEDIA */

  @media ( max-width: 966px ) {
    .builder {

      flex-direction: column;

      .nav-builder {

        flex: 0 0 250px;
        border-left: 0;
        border-top: 1px solid var(--v-light-base);

        & > nav { order: 1; }
        & > div { order: 0; }
      }
    }
    .item-info {
      float: none;
      &.outline-left {
        border: 0 !important;
      }
    }
  }
</style>
