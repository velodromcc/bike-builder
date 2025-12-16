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
      :class="{
        'show-bike-fit': showBikeFit,
        'builder-initial': !composition.length,
        'show-details-complete': this.detailsComplete
      }"
    >

      <Header
        :items="headerMenu"
        :account-link="loginHref"
        @click:menu="drawer = !drawer"
      />

      <div class="builder-body">

        <Breadcrumbs
          v-if="!detailsComplete"
          class="builder-breadcrumbs outline-bottom light--border body-1"
          :value="index"
          :items="crumbs"
          :selected="selection"
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
              v-if="current && !detailsComplete"
              ref="info"
              :item="current"
              :color="selectedColor"
              :special-builds="specialBuildList"
              @input="selectedColor = $event"
              @description="showDescription(current)"
              @special-build="special = true"
            />

            <BtnSpecialBuild
              v-if="specialBuild && !detailsComplete"
              @click="special = true"
              bottom
            />

          </template>
        </div>

        <Details
          v-if="detailsComplete"
          @return="detailsComplete = false"
          @form="showForm"
          @share="share = true"
          @special-build="special = true"
          @print="initPrint"
          :items="detailsInfo"
          :special-build="specialBuild"
          :price="price"
          :print="print"
        />

        <Footer
          ref="footer"
          v-else
          :price="price"
          :special-build="specialBuild"
          :bike-fit="showBikeFit"
          @reset="reset"
          @details="showDetails"
          @share="share = true"
          @form="showForm"
        />

      </div>

      <nav
        v-if="!detailsComplete"
        class="builder-nav"
      >

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

        <BikeItems
          v-model="selectedItem"
          v-if="!showBikeFit"
          :type="step.title"
          :items="items"
        />

        <BikeFit
          v-else
          class="builder-nav--bikefit"
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
        <div class="py-6 text-center">

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
        <v-sheet class="shrink">
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

    <DetailsForm
      v-model="details"
      :items="detailsInfo"
      :special-build="specialBuild"
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

    <SpecialBuilds
      v-model="special"
      :items="specialBuildList"
      :selected="specialBuild"
      @select="getComposition($event.query)"
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
  import SpecialBuilds from './SpecialBuilds';
  import Description from './Description';
  import DetailsForm from './DetailsForm';
  import Details from './Details';
  import Share from './Share';
  import Form from './Form';

  // UTILS
  import { Btn, Logo, BtnSpecialBuild } from '@/components';
  const separeChar = '&';

  // Constants

  const HEADER_MENU = [
    { key: 'shopHref', text: 'Shop' },
    { key: 'locationsHref', text: 'Locations' },
    { key: 'storiesHref', text: 'Stories' },
    { key: 'toolsHref', text: 'Tours' },
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
      BtnSpecialBuild,
      SpecialBuilds,
      Breadcrumbs,
      Description,
      DetailsForm,
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
      window.addEventListener( 'beforeprint', this.onPrint );
      window.addEventListener( 'afterprint', this.onAfterPrint );
    },
    beforeDestroy() {
      window.removeEventListener( 'beforeprint', this.onPrint );
      window.removeEventListener( 'afterprint', this.onAfterPrint );
    },
    data() {
      return {
        index: 0,
        error: false,
        drawer: false,
        print: false,
        selectedItem: null,
        selectedColor: 0,
        selection: [],
        form: false,
        share: false,
        details: false,
        special: false,
        detailsComplete: false,
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

          var replace = 0;
          var color = 0;

          if ( this.current && selection[index] ) {
            if ( selection[index].item && selection[index].item.type === this.current.type ) {
              replace = 1;
            }
            color = Math.min( this.current.colors.length - 1, selection[index].color );
          }

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
      contentStyle: 'resizeBike',
      showBikeFit( value ) {
        this.$emit( 'bike-fit', value );
      },
      steps( steps, old ) {
        if ( steps.length === old.length ) return;
        this.selection = this.selection
          .filter( a => steps.find( s => s.id === a.props.id ));
      }
    },
    computed: {
      ...mapState([
        'loading',
        'specialBuilds',
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
        return this.getQuery( true );
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
      specialBuildList() {
        const frameset = ( this.composition[0] || {} ).item;
        if ( ! frameset ) return [];
        return this.specialBuilds.filter( s => s.frameset === frameset.id );
      },
      specialBuild() {
        const query = this.getQuery();
        return this.specialBuildList.find( s => s.query === query );
      },
      contentStyle() {

        const minHeight = window && window.innerHeight > 480 ? '40vh' : '80vh';
        const calculatedHeigth = !this.detailsComplete
          ? this.contentMargin + this.footerHeight
          : 0;

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

          let step = this.steps[ index + 1 ];
          let comp = step ? this.selection.find( a => a.props.id === step.id ) : null;
          if ( comp && comp.item ) return false;

          step = this.steps[ index - 1 ];
          comp = step ? this.selection.find( a => a.props.id === step.id ) : null;
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
        this.description.show = this.form = false;
        if ( this.showBikeFit ) {
          this.detailsComplete = true;
        } else {
          this.details = true;
        }
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
      getComposition( id ) {

        id = id || window.location.search
          .replace(/^\?.*(id=[^=]+).*$/g,'$1')
          .replace( 'id=', '' )
          .replace( /&\D+$/, '' );

        if ( id ) {

          var codes = id.split(/[a-z]/i).map( a => {
            a = a.split( separeChar ).map( n => parseInt( n ));
            // Allow just ID (length 1), default color to 0. Ensure ID is valid.
            if ( a.length >= 1 && !isNaN(a[0]) ) {
              if (isNaN(a[1])) a[1] = 0;
              return a;
            }
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
          this.special = false;
        }
      },
      getQuery( color ) {
        return this.composition.map( a => {
          return a.item.type.charAt(0) + [
            a.item ? a.item.id : 0,
            color && a.item && a.item.colors[ a.color ] ? a.color : 0
          ].join( separeChar );
        }).join('');
      },
      redimension() {
        const { info, footer } = this.$refs;
        if ( info && window.innerWidth < 1024 ) this.contentMargin = info.$el.clientHeight + 32;
        else this.contentMargin = 0;
        if ( footer ) this.footerHeight = footer.$el.clientHeight + 32;
        else this.footerHeight = 0;
      },
      resizeBike( dim ) {
        this.$nextTick(() => {
          if ( this.$refs.bike ) {
            this.$refs.bike.onResize( dim );
          }
        });
      },
      initPrint() {
        this.print = true;
        this.$nextTick(() => {
          window.print();
        });
      },
      onPrint() {
        this.print = true;
        this.$refs.bike.onResize( this.detailsComplete ? {
          containerWidth: 400,
          containerHeight: 240
        } : {} );
      },
      onAfterPrint() {
        this.print = false;
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
  .details-complete {
    top: 76px;
  }
  .builder-content .btn-special-build {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  /* NAV */

  .builder-nav--top {
    display: flex;
    height: 48px;
    justify-content: space-between;
    align-items: center;
  }
  .builder-nav--steps {
    text-align: center;
    height: 30px;
    top: 48px;
    left: 0;
  }
  .builder-nav--items, .builder-nav--bikefit {
    top: 78px;
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

  /* DETAILS COMPLETE */

  .show-details-complete .builder-header {
    position: fixed;
    width: 100%;
    z-index: 6;
  }
  .show-details-complete .builder-body {
    display: block;
    padding: 0 3.175%;
    max-width: 1200px;
    margin: 0 auto;
    right: 0;
  }
  .show-details-complete .builder-content {
    right: 20px;
    left: auto;
    bottom: auto;
    max-width: 720px;
  }
  .show-details-complete .builder-bike {
    height: auto;
    position: relative;
    padding-top: 0;
    margin-top: 20px;
  }
  .show-details-complete .builder-bike::before {
    display: block;
    content: '';
    padding-top: 71.428%;
  }
  .show-details-complete .builder-bike > div {
    position: absolute;
    width: 100%;
    top: 0; left: 0;
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
      bottom: 300px;
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
      height: 298px;
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
      bottom: 48px;
    }
    .builder-nav--items > header {
      justify-content: flex-end;
    }
    .builder-nav--items > header > input {
      max-width: 320px;
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
    .show-bike-fit .builder-header {
      position: fixed;
      width: 100%;
      z-index: 6;
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
      bottom: 50px;
    }
    .show-bike-fit .builder-nav {
      margin-top: -50px;
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

  @media( max-width: 992px ) {
    .show-details-complete .builder-content {
      max-width: 100%;
    }
    .show-details-complete .builder-bike {
      margin-top: 70px;
    }
    .show-details-complete .builder-bike::before {
      padding-top: 56%;
    }
    .builder.show-bike-fit {
      padding-top: 60px;
    }
    .builder-content .btn-special-build {
      top: 0;
    }
  }

  @media ( max-width: 480px ) {
    .builder-body {
      bottom: 250px;
    }
    .builder-nav {
      height: 250px;
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

  @media print {
    .details-divider {
      margin-bottom: 1000px;
    }
    .builder.layer, .builder-body, .v-application {
      position: relative !important;
      top: 0 !important;
    }
    .show-details-complete .builder-content {
      max-width: 360px !important;
    }
    .show-details-complete .builder-bike {
      margin-top: 20px !important;
    }
    .show-details-complete .builder-bike::before {
      padding-top: 71.428% !important;
    }
    .details-complete {
      text-align: left;
      padding-top: 32px;
    }
    .details-complete > .details-wrapper {
      padding-right: 360px;
    }
    .details-complete .builder-bike {
      display: none;
    }
    .builder-header,
    .details-complete .btn-return,
    .details-complete .btn-form,
    .details-complete .detail-actions {
      display: none;
    }
    .details-complete .col-12 {
      flex: 0 0 33.3333333333% !important;
      max-width: 33.3333333333% !important;
    }
    .details-complete .detail-item-info .caption {
      font-size: 8px !important;
    }
    .details-complete .details-wrapper > p {
      font-size: 12px !important;
    }
    .details-complete .detail-item-info .headline,
    .details-complete .detail-price,
    .details-complete h2 {
      font-size: 12px !important;
      text-transform: none !important;
    }
    .detail-image-container {
      height: 100px !important;
    }
  }
</style>
