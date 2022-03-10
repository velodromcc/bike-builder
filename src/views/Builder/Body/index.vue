<template>
  <main
    class="fill-height rel"
    v-resize="redimension"
  >

    <Error v-if="error"/>

    <Loading v-else-if="loading" />

    <div
      v-else
      class="builder layer"
      :class="{ 'show-bike-fit': showBikeFit, 'builder-initial': !composition.length }"
    >

      <Header
        :items="headerMenu"
        :account-link="loginHref"
        @click:menu="drawer = !drawer"
      />

      <div class="builder-body">

        <Breadcrumbs
          class="builder-breadcrumbs outline-bottom light--border body-1"
          :value="index"
          :items="crumbs"
          :height="30"
          @input="onChangeIndex"
        />

        <div class="builder-content" :style="contentStyle">

          <div v-if="!composition.length" class="builder-start layer pa-10">
            <div v-if="company.introHtml" v-html="company.introHtml"></div>
            <p class="builder-start--info">
              CHOOSE A FRAME TO START BUILDING YOUR BIKE
            </p>
          </div>

          <template v-else>

            <div class="builder-bike">
              <Bike ref="bike" :items="composition"/>
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
          ref="footer"
          :price="price"
          @reset="reset"
          @details="showDetails"
          @share="share = true"
          @form="showForm"
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

    <v-navigation-drawer
      v-if="headerMenu.length"
      v-model="drawer"
      class="builder-navigation-drawer"
      overlay-opacity="0.8"
      width="337"
      temporary
      absolute
    >
      <v-sheet class="d-flex flex-column fill-height pl-1 pr-2">
        <div class="py-6 grow text-center">

          <Logo/>

          <Btn
            class="btn-close-drawer"
            color="bb-primary"
            width="40" height="40"
            :ripple="false"
            @click="drawer = false"
            tile fab dark
            absolute
          >
            <v-icon>mdi-close</v-icon>
          </Btn>

        </div>
        <v-sheet class="shrink" color="#f8f8f8">
          <v-divider/>
          <v-list>
            <v-list-item
              v-for="(item,i) in headerMenu"
              class="px-5"
              :href="item.href"
              :ripple="false"
              :title="item.text"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.text"
                  class="text-uppercase bb-primary--text"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-sheet>
    </v-navigation-drawer>

    <!-- DIALOGS -->

    <Description
      v-model="description.show"
      :item="description.item"
      :image="description.image"
      :back-button="description.backButton"
      @back="showDetails"
    />

    <Details
      v-model="details"
      :items="detailsInfo"
      :price="price"
      :hide-form-button="hideForm"
      @form="showForm"
      @description="showDescription( $event, true )"
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
  import Details from './Details';
  import Share from './Share';
  import Form from './Form';

  // UTILS
  import { Btn, Logo } from '@/components';
  const separeChar = '&';

  // Constants

  const HEADER_MENU = [
    { key: 'shopHref', text: 'Shop' },
    { key: 'locationsHref', text: 'Locations' },
    { key: 'storiesHref', text: 'Stories' },
    { key: 'bikebuilderHref', text: 'Bike Builder' },
    { key: 'contactHref', text: 'Contact' },
  ];

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
      Logo,
      Btn
    },
    mounted() {
      this.fetch();
    },
    data() {
      return {
        index: 0,
        error: false,
        drawer: false,
        selectedItem: null,
        selectedColor: 0,
        selection: [],
        form: false,
        share: false,
        details: false,
        contentMargin: 0,
        footerHeight: 0,
        description: {
          show: false,
          item: null,
          image: null,
          backButton: false
        }
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
        this.$nextTick( this.redimension );
      },
      loading() {
        this.$nextTick( this.redimension );
      },
      contentStyle() {
        this.$nextTick(() => {
          if ( this.$refs.bike ) {
            this.$refs.bike.onResize();
          }
        });
      },
      showBikeFit( value ) {
        this.$emit( 'bike-fit', value );
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
      headerMenu() {
        return HEADER_MENU.map( item => {
          if ( this.company[item.key] ) {
            if ( item.key === 'bikebuilderHref' ) return item;
            return { ...item, href: this.company[item.key] };
          }
        }).filter( Boolean );
      },
      loginHref() {
        return this.company.loginHref;
      },
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
      },
      contentStyle() {
        const minHeight = window && window.innerHeight > 480 ? '40vh' : '80vh';
        const calculatedHeigth = this.contentMargin + this.footerHeight;
        return {
          minHeight,
          height: calculatedHeigth > 0 ? `calc( 100% - ${ calculatedHeigth }px )` : null,
          marginBottom: `${this.contentMargin}px`
        };
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

              // console.log( res.data.object );
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
      showDescription( item, backButton ) {
        this.details = this.form = false;
        this.description.item  = item;
        this.description.image = itemImage( item );
        this.description.backButton = backButton;
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
        const { info, footer } = this.$refs;
        if ( info && window.innerWidth < 1024 ) this.contentMargin = info.$el.clientHeight + 32;
        else this.contentMargin = 0;
        if ( footer ) this.footerHeight = footer.$el.clientHeight + 32;
        else this.footerHeight = 0;
      }
    }
  }
</script>

<style>

  .builder-body, .builder-breadcrumbs, .builder-content, .builder-footer, .builder-nav,
  .builder-nav--top, .builder-nav--steps, .builder-nav--items, .builder-nav--bikefit, .builder-nav--continue,
  .builder-info {
    position: absolute;
  }
  .builder-nav--top, .builder-nav--steps, .builder-nav--items, .builder-nav--bikefit, .builder-info,
  .builder-breadcrumbs, .builder-content, .builder-footer {
    width: 100%;
  }
  .builder-breadcrumbs, .builder-nav--top, .builder-info {
    top: 0;
    left: 0;
  }
  .builder-body {
    display: flex;
    flex-direction: column;
    bottom: 0;
    left: 0;
    right: 400px;
  }
  .builder-content {
    flex: 1 1 auto;
    top: 30px;
    bottom: 75px;
    left: 0;
  }
  .builder-footer {
    bottom: 0;
    left: 0;
  }
  .builder-nav {
    width: 400px;
    right: 0;
    top: 76px;
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
  .builder-start p {
    max-width: 440px;
    color: var(--bb-secondary) !important;
  }
  .builder-start h1, .builder-start h2, .builder-start h3 {
    font-family: "Open sans", Helvetica, Arial, sans-serif;
    letter-spacing: normal;
    color: var(--bb-primary) !important;
    margin-bottom: 12px !important;
  }
  .builder-start h1 {
    font-size: 1.875rem;
    font-weight: 400;
    line-height: 1;
  }
  .builder-start h2 {
    font-size: 1.875rem;
    font-weight: 300;
    line-height: 1;
  }
  .builder-start h3 {
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.2;
  }
  .builder-start--info {
    max-width: none !important;
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

  .builder-navigation-drawer, .builder-navigation-drawer > div {
    overflow: visible !important;
  }
  .builder-navigation-drawer .btn-close-drawer {
    right: -40px;
    top: 0;
  }

  /* MEDIA */

  @media ( max-width: 1120px ) {
    .builder-content {
      bottom: 154px;
    }
  }

  @media ( max-width: 1024px ) {
    .builder-body {
      right: 0;
      bottom: 250px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .builder-breadcrumbs, .builder-nav--continue {
      display: none;
    }
    .builder-content {
      position: static;
    }
    .builder-start {
      position: relative;
    }
    .builder:not(.builder-initial) .builder-content {
      height: 100%;
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
    .builder-start > div {
      border-bottom: 1px solid;
    }
    .builder-start--info {
      font-size: 1rem !important;
      position: static;
      text-align: left;
      padding-top: 1rem;
    }
  }
</style>
