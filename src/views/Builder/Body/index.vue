<template>
  <main class="fill-height rel">

    <Loading v-if="loading" :value="loaded" />

    <v-row v-else class="builder" no-gutters>
      <v-row class="flex-column flex-nowrap grow" no-gutters>

        <Header class="builder-header shrink"/>

        <Breadcrumbs
          class="breadcrumbs body-1 outline-bottom light--border"
          :value="index"
          :items="crumbs"
          :height="30"
          @input="onChangeIndex"
        />

        <div class="grow rel">
          <div class="layer autoscroll py-4">

            <BikeInfo
              v-if="current"
              class="builder-info"
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
      <v-row class="nav-builder bb-background flex-column flex-nowrap" no-gutters>
        <v-sheet tag="nav" class="d-flex justify-space-between align-center shrink"
        color="bb-primary" height="70" tile>

          <Btn class="ml-2" color="white" :disabled="isDisabled( index - 1 )" @click="prev" icon>
            <v-icon v-text="'$prev'"/>
          </Btn>

          <span class="title white--text">
            {{ step.title }} {{ $vuetify.breakpoint.mdAndUp ? '' : '( ' + [ index + 1, steps.length ].join(' of ') + ' )' }}
          </span>

          <Btn class="mr-2" color="white" :disabled="isDisabled( index + 1 )" @click="next" icon>
            <v-icon v-text="'$next'"/>
          </Btn>

        </v-sheet>
        <v-row class="step-counter shrink outline-bottom light--border ma-0" justify="center" align="center">

          <span class="body-1 bb-primary--text">Step {{ index + 1 }} of {{ steps.length }}</span>

        </v-row>
        <div class="grow rel">

          <BikeItems
            class="layer"
            v-model="selectedItem"
            :items="items"
          />

        </div>
      </v-row>
    </v-row>

    <!-- DESCRIPTION -->

    <v-dialog v-model="description.show" max-width="1024">
      <v-card v-if="description.item" min-height="560">

        <Btn class="btn-close" color="bb-primary" @click="description.show = false" width="20" height="20" fab dark>
          <v-icon small v-text="'$close'"/>
        </Btn>

        <v-row class="pr-7 ma-0" style="min-height:560px">
          <v-col class="pa-10" cols="12" md="6">

            <v-img :src="description.image" height="100%" contain/>

          </v-col>
          <v-col class="pa-10" cols="12" md="6">

            <span class="caption">{{ description.item.step.title }}</span>
            <h3 class="display-4 bb-primary--text mb-4">{{ description.item.name }}</h3>
            <div v-html="description.item.description"/>

          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

  </main>
</template>

<script>

  import { mapState } from 'vuex';
  import { CONSTANTS, itemImage } from '@/utils';

  // COMPONENTS

  import Loading from '../Loading';
  import Header from './Header';
  import Footer from './Footer';
  import Breadcrumbs from './Breadcrumbs';
  import BikeItems from './BikeItems';
  import BikeInfo from './BikeInfo';
  import Bike from './Bike';
  import { Btn } from '@/components';

  // Constants

  const ITEMS_LIST = Object.keys( CONSTANTS ).map( key => ({
    id: key,
    ...CONSTANTS[key]
  }));

  export default {
    components: {
      Loading,
      Header,
      Footer,
      Breadcrumbs,
      BikeItems,
      BikeInfo,
      Bike,
      Btn
    },
    mounted() {
      this.fetch();
    },
    data() {
      return {
        loaded: 0,
        index: 0,
        selectedItem: null,
        selectedColor: 0,
        selection: [],
        description: {
          show: false,
          item: null,
          image: null
        }
      }
    },
    watch: {
      selectedItem( value ) {
        const { selection, index, step } = this;
        if ( value != null ) {
          this.selectedColor = 0;
          selection.splice( index, 1, {
            props: step,
            selected: value,
            item: this.current,
            color: 0
          });
        }
      },
      selectedColor( color ) {
        const { selection, index } = this;
        if ( selection[index] ) selection[index].color = color;
      },
      index( index ) {
        const { selection } = this;
        if ( selection[index] ) {
          this.selectedItem  = selection[index].selected;
          this.selectedColor = selection[index].color || 0;
        } else {
          this.selectedItem  = null;
          this.selectedColor = 0;
        }
      }
    },
    computed: {
      ...mapState([
        'loading',
        'framesets',
        'bars',
        'groupsets',
        'wheels',
        'tyres',
        'seatposts',
        'saddles'
      ]),
      steps() {

        const { selection } = this;
        const frameset = selection[0] ? selection[0].item : null;
        const steps = ITEMS_LIST.slice();

        if ( frameset ) {
          if ( ! frameset.saddleEnabled ) steps.splice( 6, 1 );
          if ( ! frameset.seatpostEnabled ) steps.splice( 5, 1 );
          if ( ! frameset.wheelEnabled ) steps.splice( 3, 1 );
          if ( ! frameset.groupsetEnabled ) steps.splice( 2, 1 );
          if ( ! frameset.barEnabled ) steps.splice( 1, 1 );
        }

        return steps.concat([{ title: 'Bike Fit' }]);
      },
      step() {
        return this.steps[ this.index ] || { title: '?' };
      },
      crumbs() {
        return this.steps.map( a => a.title );
      },
      items() {
        return this[ this.step.id ] || [];
      },
      current() {
        const item = this.items[ this.selectedItem ];
        if ( item ) {
          item.type = this.step.id;
          item.step = this.step;
        }
        return item;
      },
      composition() {
        const steps = this.steps.map( a => a.id );
        const { selection } = this;
        return selection.filter( a => a.item && steps.indexOf( a.item.type ) !== -1 );
      }
    },
    methods: {
      image: itemImage,
      fetch() {
        this.$store
          .dispatch( 'getData' )
          .then( res => {
            console.log( res.data.object );
            if ( res.data.error ) console.error( res.data );
            else setTimeout(() => {
              this.$store.commit( 'set', {
                loading: false,
                ...res.data.object
              })
            }, 1000 );
          });
      },
      isDisabled( index ) {
        if ( index < 0 ) return true;
        if ( index >= this.steps.length ) return true;
        if ( index !== 0 ) {
          const step = this.steps[ index - 1 ];
          const comp = step ? this.selection.find( a => a.props.id === step.id ) : null;
          if ( ! comp || ! comp.item ) return true;
        }
        return false;
      },
      onChangeIndex( index ) {
        if ( ! this.isDisabled( index )) this.index = index;
      },
      reset() {
        this.selection = [];
        this.selectedItem = null;
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
        this.description.item  = item;
        this.description.image = this.image( item );
        this.description.show  = true;
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
    border-left: 1px solid var(--bb-secondary-light);
    z-index: 1;
  }
  .step-counter {
    height: 30px;
  }
  .builder-header, .breadcrumbs {
    position: relative;
    z-index: 2;
  }
  .builder-info {
    position: relative;
    z-index: 1;
  }
  .builder-bike {
    position: absolute;
    width: 100%;
    padding-top: 100px;
    bottom: 0;
    z-index: 0;
    text-align: center;
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
    .builder-bike {
      position: static;
      padding-top: 0;
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
