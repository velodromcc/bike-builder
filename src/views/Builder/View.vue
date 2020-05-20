<template>
  <main class="fill-height">

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

          <!-- HEADER -->

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
        <div class="grow">

          <!-- BIKE BUILDER -->

        </div>
        <v-row class="shrink pa-4" align="end" no-gutters>

          <Btn class="outline light--border" color="primary" icon>
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
        <v-sheet class="d-flex justify-space-between align-center shrink order-1 order-md-0"
        color="primary" height="70" tile>

          <Btn class="ml-2" color="white" icon>
            <v-icon v-text="'$prev'"/>
          </Btn>

          <span class="white--text">FRAMESET</span>

          <Btn class="mr-2" color="white" icon>
            <v-icon v-text="'$next'"/>
          </Btn>

        </v-sheet>
        <div class="grow order-0 order-md-1 rel">
          <div class="layer autoscroll">

            <!-- ITEMS LIST -->

          </div>
        </div>
      </v-row>
    </v-row>
  </main>
</template>

<script>

  import Loading from './Loading';
  import { mapState } from 'vuex';
  import Btn from '@/components/Btn';

  export default {
    components: { Loading, Btn },
    mounted() {
      this.fetch();
    },
    data() {
      return {
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
    computed: mapState([ 'loading' ]),
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
      flex: 0 0 400px;
      border-left: 1px solid var(--v-light-base);
    }
  }

  @media only screen and ( max-width: 960px ) {
    .builder {
      flex-direction: column;
      .nav-builder {
        flex: 0 0 250px;
        border-left: 0;
        border-top: 1px solid var(--v-light-base);
      }
    }
  }
  /*@media only screen and ( max-width: 600px ) {
    .builder .nav-builder {
      flex: 0 0 320px;
    }
  }*/
</style>
