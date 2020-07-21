<template>
  <main class="fill-height rel" :class="{ 'show-bike-fit': showBikeFit }">

    <Error v-if="error"/>

    <Loading v-else-if="loading" />

    <div v-else class="builder layer" no-gutters>

      <Header class="builder-header shrink" @share="share = true"/>

      <v-row class="builder-body flex-column flex-nowrap" no-gutters>

        <Breadcrumbs
          class="breadcrumbs body-1 outline-bottom light--border"
          :value="index"
          :items="crumbs"
          :height="30"
          @input="onChangeIndex"
        />

        <div class="grow rel">
          <div class="d-flex flex-column layer autoscroll">

            <BikeInfo
              v-if="current"
              class="builder-info"
              :item="current"
              :color="selectedColor"
              @input="selectedColor = $event"
              @description="showDescription(current)"
            />

            <div v-if="!composition.length" class="builder-start layer pa-10">

              <h1 class="display-4 mb-4 bb-primary--text">Bike Builder</h1>
              <p class="bb-secondary--text">Use this interactive configurator to design your dream bike; swap components, change colours, the choice is yours.</p>
              <p class="display-1">CHOOSE A FRAME TO START BUILDING YOUR BIKE</p>

            </div>

            <div class="builder-bike">
              <Bike class="fill-height" :items="composition"/>
            </div>

          </div>
        </div>

        <Footer
          ref="footer"
          class="shrink"
          :items="composition"
          :hide-form-button="hideForm"
          @reset="reset"
          @description="showDescription"
          @form="showForm"
        />

      </v-row>

      <v-row class="builder-nav bb-background flex-column flex-nowrap" no-gutters>
        <v-sheet tag="nav" class="d-flex justify-space-between align-center shrink"
        color="bb-primary" height="70" tile>

          <Btn class="ml-2" color="white" :disabled="isDisabled( index - 1 )" @click="prev" icon>
            <v-icon v-text="'$prev'"/>
          </Btn>

          <span class="title white--text single-line">
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

          <BikeFit v-if="showBikeFit"/>

          <BikeItems
            v-else
            class="layer"
            v-model="selectedItem"
            :items="items"
          />

        </div>
        <Btn v-if="showBikeFit" class="btn-contact outline-top shrink" color="bb-primary"
        height="70" @click="showForm" text tile block dark>
          Contact us for a quote
          <v-icon v-text="'$next'"/>
        </Btn>
      </v-row>
    </div>

    <!-- DIALOGS -->

    <Description
      v-model="description.show"
      :item="description.item"
      :image="description.image"
    />

    <Form
      v-model="form"
      :items="composition"
    />

    <Share
      v-model="share"
      :id="compositionID"
    />

  </main>
</template>

<script>

  import { mapState } from 'vuex';
  import { CONSTANTS, itemImage } from '@/utils';

  // COMPONENTS

  import Loading from '../Loading';
  import Error from '../Error';
  import Header from './Header';
  import Footer from './Footer';

  import Breadcrumbs from './Breadcrumbs';
  import BikeItems from './BikeItems';
  import BikeInfo from './BikeInfo';
  import BikeFit from './BikeFit';
  import Bike from './Bike';

  // DIALOGS
  import Description from './Description';
  import Share from './Share';
  import Form from './Form';

  // UTILS
  import { Btn } from '@/components';
  const separeChar = '&';

  // Constants

  const ITEMS_LIST = Object.keys( CONSTANTS ).map( key => ({
      id: key,
      ...CONSTANTS[key]
    }))
    .filter( a => a.title );

  export default {
    components: {
      Loading,
      Error,
      Header,
      Footer,
      Breadcrumbs,
      Description,
      Share,
      Form,
      BikeItems,
      BikeFit,
      BikeInfo,
      Bike,
      Btn
    },
    mounted() {
      this.fetch();
    },
    data() {
      return {
        index: 0,
        error: false,
        selectedItem: null,
        selectedColor: 0,
        selection: [],
        form: false,
        share: false,
        description: {
          show: false,
          item: null,
          image: null
        },
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
      },
      compositionID: 'setRoute'
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
        const steps = this.getSteps( selection[0] ? selection[0].item : null );
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
      },
      hideForm() {
        return this.composition.length < this.steps.length - 1;
      },
      showBikeFit() {
        return this.index === this.steps.length - 1;
      },
      compositionID() {
        return this.composition.map( a => {
          return a.item.type.charAt(0) + [
            a.item ? a.item.id : 0,
            a.item && a.item.colors[ a.color ] ? a.color : 0
          ].join( separeChar );
        }).join('');
      }
    },
    methods: {
      image: itemImage,
      fetch() {
        this.$store
          .dispatch( 'getData' )
          .then( res => {
            if ( res.data.error ) {

              this.error = true;
              console.error( res.data );

            } else setTimeout(() => {

              //console.log( res.data.object );
              this.error = false;
              this.$store.commit( 'set', {
                loading: false,
                ...res.data.object
              });

              this.getComposition();

            }, 1000 );
          })
          .catch( err => {
            this.error = true;
            console.error( err );
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
      },
      showForm() {
        this.$refs.footer.close();
        this.description.show = false;
        this.form = true;
      },
      setRoute( id ) {
        const { history } = window;
        if ( history ) {
          if ( id ) history.replaceState( '', '', `?id=${ id }`);
          else history.replaceState( '', '', '/' );
        }
      },
      getSteps( frameset ) {
        const steps = ITEMS_LIST.slice();
        if ( frameset ) {
          if ( ! frameset.saddleEnabled ) steps.splice( 6, 1 );
          if ( ! frameset.seatpostEnabled ) steps.splice( 5, 1 );
          if ( ! frameset.wheelEnabled ) steps.splice( 3, 1 );
          if ( ! frameset.groupsetEnabled ) steps.splice( 2, 1 );
          if ( ! frameset.barEnabled ) steps.splice( 1, 1 );
        }
        return steps;
      },
      getComposition() {

        var id = window.location.search
          .replace(/^\?.*(id=[^=]+).*$/g,'$1')
          .replace( 'id=', '' )
          .replace( /&\D+$/, '' );

        if ( id ) {

          var codes = id.split(/[a-z]/i).map( a => {
            a = a.split( separeChar ).map( n => parseInt( n ));
            if ( a.length >= 2 ) return a;
          }).filter( a => a );

          const selection = [];
          var index = this.framesets.findIndex( a => a.id === codes[0][0] );

          if ( index !== -1 ) {
            const steps = this.getSteps( this.framesets[ index ] );
            steps.forEach(( step, i ) => {
              if ( codes[i] ) {

                index = step.id === 'framesets'
                  ? index
                  : this[ step.id ].findIndex( a => a.id === codes[i][0] );

                if ( index !== -1 ) {
                  selection.push({
                    props: step,
                    selected: index,
                    color: codes[i][1],
                    item: Object.assign( this[ step.id ][ index ], {
                      type: step.id,
                      step
                    })
                  });
                }
              }
            });
          }

          this.selection = selection;
          this.index = this.selection.length;
        }
      }
    }
  }
</script>

<style lang="scss">

  .builder-body {
    position: absolute;
    top: 70px; bottom: 0;
    left: 0; right: 400px;
  }
  .builder-nav {
    position: absolute;
    top: 70px; bottom: 0; right: 0;
    width: 400px;
    background-color: white;
    border-left: 1px solid var(--bb-primary-light);
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
  .builder-start {
    z-index: 1;
    background: url('../../../assets/frameset-bg.svg') no-repeat center;
    background-size: 460px;
  }
  .builder-start > p {
    max-width: 440px;
  }
  .builder-start > p.display-1 {
    max-width: none;
    position: absolute;
    text-align: center;
    left: 0; right: 0;
    top: 50%;
  }
  .builder-title > h1 {
    margin-bottom: 16px;
  }
  .builder-bike {
    padding-top: 50px;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
    text-align: center;
  }

  /* MEDIA */

  @media ( max-width: 966px ) {
    .builder-body {
      right: 0;
      bottom: 250px;
    }
    .builder-nav {

      top: auto;
      width: 100%;
      height: 250px;

      border-left: 0;
      border-top: 1px solid var(--v-light-base);

      & > nav { order: 1; }
      & > div { order: 0; }
    }
    .show-bike-fit .builder-body {
      bottom: 70px;
    }
    .show-bike-fit .builder-nav {
      margin-top: -70px;
      top: 100%;
      bottom: auto;
      height: auto;
    }
    .breadcrumbs, .step-counter {
      display: none !important;
    }
    .builder-bike {
      padding-top: 0;
      position: static;
      height: auto;
      order: -1;
    }
    .btn-contact {
      order: 3;
    }
    .show-bike-fit .builder-nav {
      & > nav { order: 0; }
      & > div { order: 1; }
    }
  }
</style>
