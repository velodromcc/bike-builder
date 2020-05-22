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

        <Header class="shrink"/>

        <Breadcrumbs
          :value="index"
          :items="crumbs"
          :height="30"
          class="breadcrumbs body-1 outline-bottom light--border"
          @input="$store.commit( 'set', { index: $event })"
        />

        <div class="builder-info grow rel">
          <div class="layer py-4">

            <BikeInfo
              v-if="current"
              :type="step.title"
              :title="current.name"
              :color="selectedColor"
              :colors="current.colors"
              has-description
              @input="selectedColor = $event"
            />

            <div class="builder-bike">

              <!-- BIKE -->

            </div>
          </div>
        </div>

        <Footer class="shrink"/>

      </v-row>
      <v-row class="nav-builder flex-column flex-nowrap" no-gutters>
        <v-sheet tag="nav" class="d-flex justify-space-between align-center shrink"
        color="primary" height="70" tile>

          <Btn class="ml-2" color="white" :disabled="!index" @click="prev" icon>
            <v-icon v-text="'$prev'"/>
          </Btn>

          <span class="title white--text">
            {{ step.title }} {{ $vuetify.breakpoint.mdAndUp ? '' : '(' + [ index + 1, data.length ].join(' of ') + ')' }}
          </span>

          <Btn class="mr-2" color="white" :disabled="index === data.length - 1" @click="next" icon>
            <v-icon v-text="'$next'"/>
          </Btn>

        </v-sheet>
        <v-sheet class="step-counter d-flex justify-center align-center shrink outline-bottom light--border" height="30" tile>

          <span class="body-1">Step {{ index + 1 }} of {{ data.length }}</span>

        </v-sheet>
        <div class="grow rel">

          <BikeItems
            class="layer"
            v-model="selected"
            :type="step.type"
            :items="step.items"
          />

        </div>
      </v-row>
    </v-row>
  </main>
</template>

<script>

  import { mapState } from 'vuex';
  //import Loading from '../Loading';
  import { Btn } from '@/components';
  import Header from './Header';
  import Footer from './Footer';
  import Breadcrumbs from './Breadcrumbs';
  import BikeItems from './BikeItems';
  import BikeInfo from './BikeInfo';

  export default {
    components: { Header, Footer, Breadcrumbs, BikeItems, BikeInfo, Btn },
    mounted() {
      this.fetch();
    },
    data() {
      return {
        selected: -1,
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
    watch: {
      selected( value ) {
        const { composition, index } = this;
        composition[index] = composition[index] || { value, color: 0 };
        composition[index].value = value;
        this.selectedColor = 0;
      },
      selectedColor( color ) {
        const { composition, index } = this;
        if ( composition[index] ) {
          composition[index].color = color;
        }
      },
      index( index ) {
        const { composition } = this;
        if ( composition[index] ) {
          this.selected = composition[index].value;
          this.selectedColor = composition[index].color || 0;
        }
      }
    },
    computed: {
      ...mapState([ 'loading', 'data', 'index' ]),
      crumbs() {
        return this.data.map( a => a.title );
      },
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
      prev() {
        const index = Math.max( this.index - 1, 0 );
        this.$store.commit( 'set', { index });
      },
      next() {
        const index = Math.min( this.index + 1, this.data.length - 1 );
        this.$store.commit( 'set', { index });
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

      & > nav .step-counter { display: none; }
    }
  }
  .builder-bike {
    position: absolute;
    width: 100%;
    bottom: 0;
  }

  /* MEDIA */

  @media ( max-width: 966px ) {
    .builder {

      flex-direction: column;

      .breadcrumbs, .step-counter {
        display: none;
      }
      .nav-builder {

        flex: 0 0 250px;
        border-left: 0;
        border-top: 1px solid var(--v-light-base);

        & > nav { order: 1; }
        & > nav .step-counter { display: block; }
        & > div { order: 0; }
      }
    }
  }
</style>
