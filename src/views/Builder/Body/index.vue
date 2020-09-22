<template>
  <main class="fill-height rel" v-resize="redimension">

    <Error v-if="error"/>

    <Loading v-else-if="loading" />

    <div v-else class="builder layer" :class="{ 'show-bike-fit': showBikeFit }">

      <Header class="builder-header" :height="70"/>

      <div class="builder-body">

        <Breadcrumbs
          class="builder-breadcrumbs outline-bottom light--border body-1"
          :value="index"
          :items="crumbs"
          :height="30"
          @input="onChangeIndex"
        />

        <div class="builder-content" :style="{ marginBottom: contentMargin }">

          <div v-if="!composition.length" class="builder-start layer pa-10">
            <h1 class="display-4 mb-4 bb-primary--text">
              {{ company.name || 'Bike Builder' }}
            </h1>
            <p class="bb-secondary--text">
              {{ company.description || builderDescription }}
            </p>
            <p class="display-1">
              CHOOSE A FRAME TO START BUILDING YOUR BIKE
            </p>
          </div>

          <template v-else>

            <div class="builder-bike">
              <Bike :items="composition"/>
            </div>

            <BikeInfo
              v-if="current"
              ref="info"
              class="builder-info"
              :item="current"
              :color="selectedColor"
              @input="selectedColor = $event"
              @description="showDescription(current)"
            />

          </template>
        </div>

        <Footer
          :price="price"
          :chat-visibility="chat.show"
          :chat-online="chat.online"
          :chat-messages="chat.messages"
          :chat-writting="chat.chatting"
          @reset="reset"
          @details="showDetails"
          @description="showDescription"
          @share="share = true"
          @form="showForm"
          @message="toggleMessage"
        />

      </div>

      <nav class="builder-nav">

        <div class="builder-nav--top bb-primary">

          <Btn class="ml-2" color="white" :disabled="prevDisabled" @click="prev" icon>
            <v-icon v-text="'$prev'"/>
          </Btn>

          <span class="title white--text single-line">
            {{ step.title }} {{ $vuetify.breakpoint.mdAndUp ? '' : '( ' + [ index + 1, steps.length ].join(' of ') + ' )' }}
          </span>

          <Btn class="mr-2" color="white" :disabled="nextDisabled" @click="next" icon>
            <v-icon v-text="'$next'"/>
          </Btn>

        </div>

        <div class="builder-nav--steps outline-bottom light--border">
          <span class="body-1 bb-primary--text">
            Step {{ index + 1 }} of {{ steps.length }}
          </span>
        </div>

        <BikeFit
          v-if="showBikeFit"
          class="builder-nav--bikefit"
        />

        <BikeItems
          v-else
          v-model="selectedItem"
          :items="items"
        />

        <Btn
          class="builder-nav--continue outline-top light--border"
          color="bb-primary"
          height="70"
          :disabled="showBikeFit ? false : nextDisabled"
          :dark="!nextDisabled"
          @click="showBikeFit ? showForm() : next()"
          text tile block
        >
          {{ showBikeFit ? 'Contact us for a quote' : `Continue to ${ steps[index + 1 ].title }` }}
          <v-icon right v-text="'$next'"/>
        </Btn>

      </nav>
    </div>

    <!-- DIALOGS -->

    <Description
      v-model="description.show"
      :item="description.item"
      :image="description.image"
    />

    <Details
      v-model="details"
      :items="detailsInfo"
      :price="price"
      :hide-form-button="hideForm"
      @form="showForm"
      @description="showDescription"
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
  import { CONSTANTS, itemImage, itemThumbnail } from '@/utils';

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
  import Details from './Details';
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
      Details,
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
        details: false,
        contentMargin: 0,
        chat: {
          show: false,
          chatting: false,
          online: false,
          messages: 0
        },
        description: {
          show: false,
          item: null,
          image: null
        },
        builderDescription: (
          'Use this interactive configurator to design your dream bike; '+
          'swap components, change colours, the choice is yours.'
        )
      }
    },
    watch: {
      selectedItem( value ) {
        const { selection, index, step } = this;
        if ( value != null ) {

          var replace = selection[index] && selection[index].item.type === this.current.type ? 1 : 0;
          var color = selection[index] ? selection[index].color : 0;
          color = Math.min( this.current.colors.length - 1, color );

          this.selectedColor = color;
          selection.splice( index, replace, {
            props: step,
            selected: value,
            item: this.current,
            color
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
      compositionID: 'setRoute',
      current() {
        this.$nextTick(() => this.redimension());
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
        'saddles',
        'company'
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
      prevDisabled() {
        return this.isDisabled( this.index - 1 );
      },
      nextDisabled() {
        return this.isDisabled( this.index + 1 );
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
      },
      detailsInfo() {
        return this.composition.map(( a, item ) => {
          item = a.item.colors[ a.color ];
          return {
            type: a.item.step.title,
            name: a.item.name,
            item: a.item,
            price: item.color.price || item.price || 0,
            colorName: item.color.colorName,
            color: [ item.color.color, item.color.color2 ],
            image: itemImage( a.item, a.color ),
            url: item.url
          }
        });
      },
      price() {
        return this.detailsInfo
          .reduce(( sum, a ) => sum + a.price, 0 );
      }
    },
    methods: {
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
      showDetails() {
        this.details = true;
        this.description.show = this.form = false;
      },
      showDescription( item ) {
        this.details = this.form = false;
        this.description.item  = item;
        this.description.image = itemThumbnail( item ) || itemImage( item );
        this.description.show  = true;
      },
      showForm() {
        this.details = this.description.show = false;
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
      },
      redimension() {
        const { info } = this.$refs;
        if ( info && window.innerWidth < 966 ) this.contentMargin = ( info.$el.clientHeight + 32 ) + 'px';
        else this.contentMargin = 0;
      },
      toggleMessage() {
        const LCW = window.LiveChatWidget;
        LCW && LCW.call( this.chat.show ? 'hide' : 'maximize' );
      }
    },
    beforeCreate() {

      const LCW = window.LiveChatWidget;
      if ( LCW ) {

        // On change visibility
        LCW.on( 'visibility_changed', ({ visibility }) => {
          this.chat.show = visibility !== 'hidden';
          if ( visibility === 'minimized' ) LCW.call('hide');
          else if ( this.chat.show ) this.chat.messages = 0;
        });

        // On change availability
        LCW.on( 'availability_changed', ({ availability }) => {
          this.chat.online = availability === 'online';
        });

        // On change status
        LCW.on( 'customer_status_changed', ({ status }) => {
          this.chat.chatting = status === 'chatting';
        });

        // On new event
        LCW.on( 'new_event', ({ author }) => {
          if ( author.type === 'agent' && !this.chat.show )
            this.chat.messages++;
        });
      }
    }
  }
</script>

<style>

  .builder-header, .builder-body, .builder-breadcrumbs, .builder-content, .builder-footer, .builder-nav,
  .builder-nav--top, .builder-nav--steps, .builder-nav--items, .builder-nav--bikefit, .builder-nav--continue,
  .builder-info {
    position: absolute;
  }
  .builder-header, .builder-nav--top, .builder-nav--steps, .builder-nav--items, .builder-nav--bikefit, .builder-info,
  .builder-breadcrumbs, .builder-content, .builder-footer {
    width: 100%;
  }
  .builder-header, .builder-breadcrumbs, .builder-nav--top, .builder-info {
    top: 0;
    left: 0;
  }
  .builder-body {
    top: 70px;
    bottom: 0;
    left: 0;
    right: 400px;
  }
  .builder-content {
    top: 30px;
    bottom: 72px;
    left: 0;
  }
  .builder-footer {
    bottom: 0;
    left: 0;
  }
  .builder-nav {
    width: 400px;
    right: 0;
    top: 70px;
    bottom: 0;
    background-color: white;
    border-left: 1px solid var(--v-light-base);
  }

  /* NAV */

  .builder-nav--top {
    display: flex;
    height: 70px;
    justify-content: space-between;
    align-items: center;
  }
  .builder-nav--steps {
    text-align: center;
    height: 30px;
    top: 70px;
    left: 0;
  }
  .builder-nav--items, .builder-nav--bikefit {
    top: 100px;
    bottom: 70px;
    left: 0;
  }
  .builder-nav--continue {
    bottom: 0;
    left: 0;
  }
  .builder-nav--bikefit {
    overflow: auto;
  }

  /* CONTENT */

  .builder-start {
    background: url('../../../assets/frameset-bg.svg') no-repeat center;
    background-size: 320px;
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
  .builder-bike {
    padding-top: 50px;
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .builder-bike > div {
    height: 100%;
  }

  /* MEDIA */

  @media ( max-width: 1120px ) {
    .builder-content {
      bottom: 154px;
    }
  }

  @media ( max-width: 966px ) {
    .builder-body {
      right: 0;
      bottom: 250px;
      overflow: auto;
    }
    .builder-breadcrumbs, .builder-nav--continue {
      display: none;
    }
    .builder-content, .builder-start {
      position: static;
      height: 100%;
    }
    .builder-content {
      max-height: 320px;
    }
    .builder-footer, .builder-info, .builder-nav--bikefit {
      position: static;
    }
    .builder-nav {
      width: 100%;
      top: auto;
      height: 250px;
      border-top: 1px solid var(--v-light-base);
      border-left: 0;
    }
    .builder-nav--top {
      top: auto;
      bottom: 0;
    }
    .builder-nav--steps {
      display: none;
    }
    .builder-nav--items {
      top: 0;
      bottom: 70px;
    }
    .builder-bike {
      padding-top: 0;
    }
    .builder-nav--bikefit {
      position: static;
      overflow: visible;
    }

    /* On Bike fit */

    .builder.show-bike-fit {
      padding-top: 70px;
      overflow: auto;
    }
    .show-bike-fit .builder-body {
      position: relative;
      overflow: visible;
      height: 100%;
      top: 0;
    }
    .show-bike-fit .builder-content {
      position: absolute;
      height: auto;
      bottom: 224px;
      top: 0;
    }
    .show-bike-fit .builder-footer {
      position: absolute;
      bottom: 70px;
    }
    .show-bike-fit .builder-nav {
      margin-top: -70px;
      position: static;
      height: auto;
    }
    .show-bike-fit .builder-nav--top {
      position: static;
    }
    .show-bike-fit .builder-nav--continue {
      position: static;
      display: block;
    }
  }

  @media ( max-width: 520px ) {
    .builder-start {
      background-position: center bottom;
      background-size: 90%;
    }
    .builder-start > p.display-1 {
      font-size: 1rem !important;
      position: static;
      text-align: left;
      border-top: 1px solid;
      padding-top: 1rem;
    }
  }
</style>
