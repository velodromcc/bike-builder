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
              :item="current"
              :color="selectedColor"
              @input="selectedColor = $event"
              @description="showDescription(current)"
            />

            <div class="builder-bike">

              <Bike :items="composition"/>

            </div>
          </div>
        </div>

        <Footer
          ref="footer"
          class="shrink"
          :items="composition"
          @reset="reset"
          @description="showDescription"
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
        <v-row class="step-counter shrink outline-bottom light--border ma-0" justify="center" align="center">

          <span class="body-1">Step {{ index + 1 }} of {{ data.length }}</span>

        </v-row>
        <div class="grow rel">

          <BikeItems
            class="layer"
            v-model="selected"
            :type="step.id"
            :items="items"
          />

        </div>
      </v-row>
    </v-row>

    <!-- DESCRIPTION -->

    <v-dialog v-model="description.show" max-width="1024">
      <v-card v-if="description.item" min-height="560">

        <Btn class="btn-close" color="primary" @click="description.show = false" x-small fab>
          <v-icon v-text="'$close'"/>
        </Btn>

        <v-row class="pr-7 ma-0" style="min-height:560px">
          <v-col class="pa-10" cols="12" md="6">

            <v-img
              :src="require(`@/assets/items/${ description.item.type }/${ description.item.image }`)"
              height="100%"
              contain
            />

          </v-col>
          <v-col class="pa-10" cols="12" md="6">

            <h3 class="display-4 primary--text">{{ description.item.name }}</h3>
            <span class="caption">{{ description.item.step }}</span>
            <div v-html="description.item.description"/>

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
  import Bike from './Bike';

  export default {
    components: { Header, Footer, Breadcrumbs, BikeItems, BikeInfo, Bike, Btn },
    mounted() {
      this.fetch();
    },
    data() {
      return {
        index: 0,
        selected: -1,
        selectedColor: 0,
        selection: [],
        title: 'Bike Builder',
        text: '<p>' + [
          'Use this interactive configurator to design your dream bike; swap components, change colours, the choice is yours.',
          'Get in touch once you\'ve completed your build and we\'ll talk you through the options, including a <a href="#">Full Bike Fit</a>'
        ].join('</p><p>') + '</p>',
        description: {
          show: false,
          item: null
        },
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

        const { selection, step } = this;
        var index = selection.findIndex( a => a.id === step.id );
        if ( ! selection[index] ) index = selection.length;

        selection.splice( index, 1, {
          ...step,
          value,
          item: step.items[ value ],
          color: 0
        });

        this.selectedColor = 0;
      },
      selectedColor( color ) {
        const { selection, step } = this;
        var index = selection.findIndex( a => a.id === step.id );
        if ( selection[index] ) selection[index].color = color;
      },
      index() {
        const { selection, step } = this;
        const index = selection.findIndex( a => a.id === step.id );
        if ( selection[index] ) {
          this.selected = selection[index].value;
          this.selectedColor = selection[index].color || 0;
        } else {
          this.selected = null;
          this.selectedColor = 0;
        }
      }
    },
    computed: {
      ...mapState([ 'loading', 'data' ]),
      accept() {
        const { selection } = this;
        return selection[0] && selection[0].item
          ? [ selection[0].item.type ].concat( selection[0].item.accept )
          : null;
      },
      composition() {
        var { selection, accept } = this;
        selection = selection.filter( a => a.item );
        if ( accept ) selection = selection.filter( a => accept.indexOf( a.item.type ) !== -1 );
        return selection;
      },
      steps() {

        var steps = this.data.slice()
          .sort(( a, b ) => a.priority - b.priority )
          .map(( a, index ) => {
            a.items.forEach( item => item.step = a.title );
            return { ...a, index };
          });

        const { accept } = this;
        if ( accept )
          steps = steps.filter( step => accept.indexOf( step.id ) !== -1 );

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
      isDisabled( index ) {
        if ( index < 0 ) return true;
        if ( index >= this.steps.length ) return true;
        if ( index !== 0 ) {
          const step = this.steps[ index - 1 ];
          const comp = step ? this.selection.find( a => a.id === step.id ) : null;
          if ( ! comp || ! comp.item ) return true;
        }
        return false;
      },
      onChangeIndex( index ) {
        if ( ! this.isDisabled( index )) this.index = index;
      },
      reset() {
        this.selection = [];
        this.selected = null;
        this.index = 0;
      },
      prev() {
        this.index = Math.max( this.index - 1, 0 );
      },
      next() {
        this.index = Math.min( this.index + 1, this.steps.length - 1 );
      },
      showDescription( item ) {
        this.$refs.footer.close();
        this.description.item = item;
        this.description.show = true;
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
  }
  .nav-builder {
    position: relative;
    background-color: white;
    flex: 0 0 400px;
    border-left: 1px solid var(--v-light-base);
    z-index: 1;
  }
  .step-counter {
    height: 30px;
  }
  .builder-bike {
    position: absolute;
    width: 100%;
    padding-top: 100px;
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
    }
    .breadcrumbs, .step-counter {
      display: none !important;
    }
    .nav-builder {

      flex: 0 0 250px;
      border-left: 0;
      border-top: 1px solid var(--v-light-base);

      & > nav { order: 1; }
      & > div { order: 0; }
    }
  }
</style>
