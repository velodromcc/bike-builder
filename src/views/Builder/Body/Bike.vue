<template>
  <canvas class="bike-canvas" ref="canvas"></canvas>
</template>

<script>

  import { CONSTANTS } from '@/utils';

  const GRUOPSET_ANCHORS = {
    groupsetsLeft: 'imageBack',
    groupsetsMiddle: 'imageFront',
    groupsetsRight: 'imageBar'
  };

  function loadImage( url ) {
    return new Promise( resolve => {

      const image = new Image();
      image.src = url;

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
            x: frameset.item.barX,
            y: frameset.item.barY,
          },
          wheelsLeft: {
            x: frameset.item.leftWheelX,
            y: frameset.item.leftWheelY
          },
          wheelsRight: {
            x: frameset.item.rightWheelX,
            y: frameset.item.rightWheelY
          },
          tyresLeft: {
            x: frameset.item.leftWheelX,
            y: frameset.item.leftWheelY
          },
          tyresRigth: {
            x: frameset.item.rightWheelX,
            y: frameset.item.rightWheelY,
          },
          seatposts: {
            x: frameset.item.seatpostX,
            y: frameset.item.seatpostY
          },
          saddles: {
            x: frameset.item.saddleX,
            y: frameset.item.saddleY,
          },
          groupsetsLeft: {
            x: frameset.item.leftWheelX,
            y: frameset.item.leftWheelY
          },
          groupsetsMiddle: {
            x: frameset.item.groupsetMiddleX,
            y: frameset.item.groupsetMiddleY
          },
          groupsetsBar: {
            x: frameset.item.groupsetBarX,
            y: frameset.item.groupsetBarY
          }
        };

        const items = this.items.map(( a, order, color ) => {

          if ( ! a.item || ! ( color = a.item.colors[ a.color ])) return;

          const props = {
            anchor: a.item.type,
            image: color.image,
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
                x: a.item.groupsetBarX,
                y: a.item.groupsetBarY
              };

              break;

            case 'groupsets':

              return Object.keys( GRUOPSET_ANCHORS ).map( key => ({
                ...props,
                anchor: key,
                image: color[ GRUOPSET_ANCHORS[key] ]
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
        if ( composition ) {

          const { frameset } = composition;
          const waiting = [];
          frameset.loaded = false;

          composition.items.forEach( item => {
            loadImage( item.image ).then( image => {

              const anchor = composition.anchors[ item.anchor ];
              const origin = item.origin;
              const width  = image.naturalWidth * item.scale;
              const height = image.naturalHeight * item.scale;

              if ( origin.x == null ) origin.x = width / 2;
              if ( origin.y == null ) origin.y = height / 2;

              if ( ! anchor ) { // is Frameset

                this.buffer.push( Object.assign( frameset, {
                  image,
                  width,
                  height,
                  x: this.width / 2 - origin.x * item.scale,
                  y: this.height / 2 - origin.y * item.scale,
                  loaded: true
                }));

              } else {

                waiting.push({ ...item, image, width, height, anchor, origin });

              }

              if ( frameset.loaded ) {

                waiting.forEach( item => {
                  item.x = frameset.x + item.anchor.x * frameset.scale - item.orign.x * item.scale;
                  item.y = frameset.y + item.anchor.y * frameset.scale - item.orign.y * item.scale;
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
        this.buffer.sort(( a, b ) => a.index - b.index ).forEach( item => {
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
