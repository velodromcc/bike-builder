<template>
  <canvas class="bike-canvas" ref="canvas"></canvas>
</template>

<script>

  import { CONSTANTS } from '@/utils';

  const GRUOPSET_ANCHORS = {
    groupsetsLeft: 'imageBack',
    groupsetsMiddle: 'imageFront',
    groupsetsBar: 'imageBar'
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

  function radians( degree ) {
    return degree * Math.PI / 180;
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

        const itemAnchors = {};
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
            type: a.item.type,
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

              props.rotation = radians( this.items[0].item.inclinationFront || 0 );
              itemAnchors.groupsetsBar = {
                x: a.item.groupsetBarX || 0,
                y: a.item.groupsetBarY || 0,
                type: 'bars'
              };

              break;

            case 'groupsets':

              return Object.keys( GRUOPSET_ANCHORS ).map( key => ({
                ...props,
                type: key,
                anchor: key,
                index: CONSTANTS[ key ].zIndex,
                scale: CONSTANTS[ key ].scale || props.scale,
                image: color.color[ GRUOPSET_ANCHORS[key] ],
                origin: key === 'groupsetsMiddle' ? props.origin : {}
              }));

            case 'wheels':
            case 'tyres':

              return [ 'Left', 'Right' ].map( pos => ({
                ...props,
                type: a.item.type + pos,
                anchor: a.item.type + pos
              }));

            case 'saddles':

              props.blockRotation = true;

              break;

            case 'seatposts':

              props.rotation = radians( this.items[0].item.inclinationRear || 0 );
              itemAnchors.saddles = {
                x: a.item.saddleX || 0,
                y: a.item.saddleY || 0,
                type: 'seatposts'
              };

              break;
          }

          return props;
        })
        .filter( a => a )
        .flat();

        // RESULT

        return {
          frameset,
          anchors,
          itemAnchors,
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

          var waiting = [];
          const { frameset } = composition;
          frameset.loaded = false;

          composition.items.forEach( item => {
            loadImage( item.image ).then( image => {

              const anchor = composition.itemAnchors[ item.anchor ] || composition.anchors[ item.anchor ];
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

              } else {

                waiting.push( Object.assign( item, {
                  width: width * item.scale,
                  height: height * item.scale,
                  image,
                  anchor,
                  origin
                }));
              }

              if ( frameset.loaded ) {

                waiting = waiting.map( item => {

                  if ( item.anchor.type && ( item.parent = composition.items.find( a => a.type === item.anchor.type ))) {

                    if ( this.buffer.indexOf( item.parent ) < 0 ) return item;
                    this.buffer.push( item );
                    return;
                  }

                  item.parent = null;
                  item.x = frameset.x + item.anchor.x * frameset.scale;
                  item.y = frameset.y + item.anchor.y * frameset.scale;
                  this.buffer.push( item );
                })
                .filter( a => a );
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

          this.context.save();

          if ( ! item.parent ) {

            this.context.translate( item.x, item.y );

            if ( item.type !== 'framesets' ) {

              if ( item.rotation && ! item.blockRotation )
                this.context.rotate( -item.rotation );

              this.context.translate(
                - item.origin.x * item.scale,
                - item.origin.y * item.scale
              );
            }

          } else {

            this.context.translate(
              item.parent.x,
              item.parent.y
            );

            if ( item.parent.rotation )
              this.context.rotate( -item.parent.rotation );

            var ox = item.parent.origin.x * item.parent.scale;
            var oy = item.parent.origin.y * item.parent.scale;

            this.context.translate(
              item.anchor.x * item.parent.scale - ox,
              item.anchor.y * item.parent.scale - oy
            );

            if ( item.blockRotation ) {
              if ( item.parent.rotation ) {
                this.context.rotate( item.parent.rotation );
              }
            } else if ( item.rotation && ! item.blockRotation ) {
              this.context.rotate( -item.rotation );
            }

            this.context.translate(
              - item.origin.x * item.scale,
              - item.origin.y * item.scale
            );
          }

          this.context.drawImage( item.image, 0, 0, item.width, item.height );
          this.context.restore();

          if ( item.type === 'framesets' )
            this.drawShadow( item );
        });
      },
      drawShadow( item ) {

        const ctx = this.context;

        // Calc dimensions and Position
        const wheel1 = this.composition.anchors.wheelsLeft;
        const wheel2 = this.composition.anchors.wheelsRight;
        const size = wheel2.x - wheel1.x;
        const x = item.x + size / 2;
        const y = item.y + Math.max( wheel1.y, wheel2.y ) + 215 * CONSTANTS.wheels.scale;
        const gradient = ctx.createRadialGradient( 0, 0, 0, 0, 0, size );

        gradient.addColorStop( 0, 'rgba(0,0,0,0.05)' );
        gradient.addColorStop( 1, 'rgba(0,0,0,0)' );

        ctx.save();
        ctx.translate( x, y );
        ctx.scale( 1, .05 ); // To draw Gradient as a Ellipse

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse( 0, 0, size, size, 0, 0, 2 * Math.PI );
        ctx.fill();

        ctx.restore(); // Reset Canvas state
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
