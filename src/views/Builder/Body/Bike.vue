<template>
  <canvas class="bike-canvas" ref="canvas"></canvas>
</template>

<script>

  import { CONSTANTS } from '@/utils';

  const GRUOPSET_ANCHORS = {
    //groupsetsLeft: 'imageBack',
    groupsetsMiddle: 'imageFront',
    //groupsetsBar: 'imageBar'
  };

  function loadImage( url ) {
    return new Promise( resolve => {

      const image = new Image();
      image.src = 'http://bikebuilder.inmovens.com' + url;

      if ( image.complete && image.naturalHeight !== 0 ) {
        resolve( image );
      } else {
        image.addEventListener( 'load', () => resolve( image ));
      }
    })
  }

  export default {
    props: {
      width: {
        type: Number,
        default: 1400
      },
      height: {
        type: Number,
        default: 820
      },
      items: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        context: null,
        buffer: []
      }
    },
    mounted() {
      this.getContext();
      this.mountBike();
    },
    watch: {
      width: 'mountBike',
      height: 'mountBike',
      composition: 'mountBike',
      buffer: 'draw'
    },
    computed: {
      composition() {

        var frameset = this.items[0];
        if ( ! frameset || ! frameset.item ) return null;

        const anchors = {
          bars: {
            x: frameset.item.barX || 0,
            y: frameset.item.barY || 0,
          },
          wheelsLeft: {
            x: frameset.item.leftWheelX || 0,
            y: frameset.item.leftWheelY || 0
          },
          wheelsRight: {
            x: frameset.item.rightWheelX || 0,
            y: frameset.item.rightWheelY || 0
          },
          tyresLeft: {
            x: frameset.item.leftWheelX || 0,
            y: frameset.item.leftWheelY || 0
          },
          tyresRight: {
            x: frameset.item.rightWheelX || 0,
            y: frameset.item.rightWheelY || 0,
          },
          seatposts: {
            x: frameset.item.seatpostX || 0,
            y: frameset.item.seatpostY || 0
          },
          saddles: {
            x: frameset.item.saddleX || 0,
            y: frameset.item.saddleY || 0,
          },
          groupsetsLeft: {
            x: frameset.item.leftWheelX || 0,
            y: frameset.item.leftWheelY || 0
          },
          groupsetsMiddle: {
            x: frameset.item.groupsetMiddleX || 0,
            y: frameset.item.groupsetMiddleY || 0
          },
          groupsetsBar: {
            x: frameset.item.groupsetBarX || 0,
            y: frameset.item.groupsetBarY || 0
          }
        };

        const items = this.items.map(( a, order, color ) => {

          if ( ! a.item || ! ( color = a.item.colors[ a.color ])) return;

          const props = {
            anchor: a.item.type,
            image: color.color.image,
            scale: CONSTANTS[ a.item.type ].scale || 1,
            index: CONSTANTS[ a.item.type ].zIndex,
            origin: { x: a.item.originX, y: a.item.originY },
            order
          };

          switch ( a.item.type ) {
            case 'framesets':

              frameset = props;

              break;

            case 'bars':

              anchors.groupsetsBar = {
                x: a.item.groupsetBarX || 0,
                y: a.item.groupsetBarY || 0
              };

              break;

            case 'groupsets':

              return Object.keys( GRUOPSET_ANCHORS ).map( key => ({
                ...props,
                anchor: key,
                image: color.color[ GRUOPSET_ANCHORS[key] ]
              }));

            case 'wheels':
            case 'tyres':

              return [ 'Left', 'Right' ].map( pos => ({
                ...props,
                anchor: a.item.type + pos
              }));
          }

          return props;
        })
        .filter( a => a )
        .flat();

        // RESULT

        return {
          frameset,
          anchors,
          items
        };
      }
    },
    methods: {
      getContext() {
        const { canvas } = this.$refs;
        if ( canvas ) {
          canvas.width  = this.width;
          canvas.height = this.height;
          this.context  = canvas.getContext('2d');
        }
      },
      mountBike() {
        this.buffer = [];
        const { composition } = this;
        //console.log( composition );
        if ( composition ) {

          const { frameset } = composition;
          const waiting = [];
          frameset.loaded = false;

          composition.items.forEach( item => {
            loadImage( item.image ).then( image => {

              const anchor = composition.anchors[ item.anchor ];
              const origin = item.origin;
              const width  = image.naturalWidth;
              const height = image.naturalHeight;

              if ( origin.x == null ) origin.x = width / 2;
              if ( origin.y == null ) origin.y = height / 2;

              if ( item.anchor === 'framesets' ) {

                this.buffer.push( Object.assign( frameset, {
                  image,
                  width: width * item.scale,
                  height: height * item.scale,
                  x: this.width / 2 - origin.x * item.scale,
                  y: this.height / 2 - origin.y * item.scale,
                  loaded: true
                }));

              } else if ( anchor ) {

                waiting.push({
                  ...item,
                  width: width * item.scale,
                  height: height * item.scale,
                  image,
                  anchor,
                  origin 
                });

              }

              if ( frameset.loaded ) {

                waiting.forEach( item => {
                  item.x = frameset.x + item.anchor.x * frameset.scale - item.origin.x * item.scale;
                  item.y = frameset.y + item.anchor.y * frameset.scale - item.origin.y * item.scale;
                  this.buffer.push( item );
                });

                // Clear array
                waiting.length = 0;
              }
            })
          });
        }
      },
      clear() {
        const { context } = this;
        context.clearRect( 0, 0, this.width, this.height );
      },
      draw() {
        this.clear();
        this.buffer.slice().sort(( a, b ) => a.index - b.index ).forEach( item => {
          this.context.drawImage( item.image, item.x, item.y, item.width, item.height );
        });
      }
    }
  }
</script>

<style>
  .bike-canvas {
    max-width: 100%;
    max-height: 420px;
  }
</style>
