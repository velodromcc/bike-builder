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
          @input="onChangeIndex"
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
              @description="showDescription = true"
            />

            <div class="builder-bike">

              <!-- BIKE -->

            </div>
          </div>
        </div>

        <Footer
          class="shrink"
          @reset="reset"
          @details="details"
        />

      </v-row>
      <v-row class="nav-builder flex-column flex-nowrap" no-gutters>
        <v-sheet tag="nav" class="d-flex justify-space-between align-center shrink"
        color="primary" height="70" tile>

          <Btn class="ml-2" color="white" :disabled="isDisabled( index - 1 )" @click="prev" icon>
            <v-icon v-text="'$prev'"/>
          </Btn>

          <span class="title white--text">
            {{ step.title }} {{ $vuetify.breakpoint.mdAndUp ? '' : '(' + [ index + 1, data.length ].join(' of ') + ')' }}
          </span>

          <Btn class="mr-2" color="white" :disabled="isDisabled( index + 1 )" @click="next" icon>
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
            :type="step.id"
            :items="step.items"
          />

        </div>
      </v-row>
    </v-row>

    <!-- DESCRIPTION -->

    <v-dialog v-model="showDescription" max-width="1024">
      <v-card class="light" min-height="560">

        <Btn class="btn-close" color="primary" @click="showDescription = false" x-small fab>
          <v-icon v-text="'$close'"/>
        </Btn>

        <v-row v-if="current" class="pr-7 ma-0" style="min-height:560px">
          <v-col class="pa-5" cols="12" md="6">

            <v-img
              :src="image( current )"
              height="100%"
              contain
            />

          </v-col>
          <v-col class="pa-5" cols="12" md="6">

            <h3 class="display-4 primary--text">{{ current.name }}</h3>
            <span class="caption">{{ step.title }}</span>
            <div v-html="current.description"/>

          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

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
        showDescription: false,
        index: 0,
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

        const { composition, step } = this;
        var index = composition.findIndex( a => a.id === step.id );
        if ( ! composition[index] ) index = composition.length;

        composition.splice( index, 1, {
          ...step,
          value,
          item: step.items[ value ],
          color: 0
        });

        this.selectedColor = 0;
      },
      selectedColor( color ) {
        const { composition, step } = this;
        var index = composition.findIndex( a => a.id === step.id );
        if ( composition[index] ) composition[index].color = color;
      },
      index() {
        const { composition, step } = this;
        const index = composition.findIndex( a => a.id === step.id );
        if ( composition[index] ) {
          this.selected = composition[index].value;
          this.selectedColor = composition[index].color || 0;
        } else {
          this.selected = null;
          this.selectedColor = 0;
        }
      }
    },
    computed: {
      ...mapState([ 'loading', 'data' ]),
      steps() {

        var steps = this.data.slice()
          .sort(( a, b ) => a.priority - b.priority )
          .map(( a, index ) => ({ ...a, index }));

        this.composition.forEach( a => {
          if ( a.item && a.item.accept )
            steps = steps.filter( step => step.id === a.id || a.item.accept.indexOf( step.id ) !== -1 );
        });

        return steps.concat([{
          title: 'Bike Fit',
          items: []
        }]);
      },
      step() {
        return this.steps[ this.index ] || {
          title: '?',
          items: []
        };
      },
      crumbs() {
        return this.steps.map( a => a.title );
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
      image( item ) {
        return require(`@/assets/items/${ this.step.id }/${ item.image }`);
      },
      isDisabled( index ) {
        if ( index < 0 ) return true;
        if ( index >= this.steps.length ) return true;
        if ( index !== 0 ) {
          const step = this.steps[ index - 1 ];
          const comp = step ? this.composition.find( a => a.id === step.id ) : null;
          if ( ! comp || ! comp.item ) return true;
        }
        return false;
      },
      onChangeIndex( index ) {
        if ( ! this.isDisabled( index )) this.index = index;
      },
      reset() {
        this.composition = [];
        this.selected = null;
        this.index = 0;
      },
      prev() {
        this.index = Math.max( this.index - 1, 0 );
      },
      next() {
        this.index = Math.min( this.index + 1, this.steps.length - 1 );
      },
      details() {

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

  .btn-close {
    position: absolute;
    top: 10px;
    right: 10px;
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
