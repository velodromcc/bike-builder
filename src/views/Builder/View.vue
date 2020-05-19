<template>
  <main class="fill-height">

    <Loading
      v-if="loading"
      :value="load.value"
      :load-text="load.text"
      :title="title"
      :text="text"
      />

    <div v-else>
      LOADED!
    </div>

  </main>
</template>

<script>

  import Loading from './Loading';
  import { mapState } from 'vuex';

  export default {
    components: {
      Loading
    },
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

        index = index || 0;
        const { load } = this;
        const step = load.steps[index];

        if ( step ) {

          total = total || load.steps.reduce(( sum, a ) => sum + a.size, 0 );
          load.value = (( loaded || 0 ) / total ) * 100;
          load.text  = step.text || '';

          return Promise
            .resolve( load.steps[index].handler())
            .then(() => this.fetch( index + 1, total, loaded + step.size ))
            .catch( console.warn )
        }

        this.$store.commit( 'set', { loading: false });
      }
    }
  }
</script>
