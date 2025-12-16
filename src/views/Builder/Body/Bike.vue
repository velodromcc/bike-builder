<template>
  <div ref="container" v-resize="onResize" class="bike-canvas">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>

  import { CONSTANTS, loadImage, containImage } from '@/utils';

  const GRUOPSET_ANCHORS = {
    groupsetsLeft: 'imageBack',
    groupsetsMiddle: 'imageFront',
    groupsetsBar: 'imageBar',
    groupsetsBrakeLeft: 'imageBrake',
    groupsetsBrakeRight: 'imageBrake',
    groupsetsCapilierLeft: 'imageBrakeCapilierRear',
    groupsetsCapilierRight: 'imageBrakeCapilierFront',
    groupsetsGear: 'imageGearShift'
  };

  const GROUPSET_ANGLE = {
    groupsetsCapilierLeft: 'groupsetCapilierRearAngle',
    groupsetsCapilierRight: 'groupsetCapilierFrontAngle',
    groupsetsGear: 'groupsetCapilierMiddleAngle'
  };

  function radians( degree ) {
    return degree * Math.PI / 180;
  }

  export default {

    props: {
        width: { type: Number, default: 1700 }, // Increased from 1400
        height: { type: Number, default: 1000 },
        items: { type: Array, default: () => [] },
        editable: { type: Boolean, default: false } // New prop
    },
    data() {
      return {
        context: null,
        buffer: [],
        // Interaction State
        dragging: null,
        dragStart: { x: 0, y: 0 },
        initialAnchor: { x: 0, y: 0 }
      }
    },
    mounted() {
      this.onResize();
      this.getContext();
      this.mountBike();
      
      // Delated resize to handle dialog transitions
      setTimeout(() => this.onResize(), 100);
      setTimeout(() => this.onResize(), 300);
      
      // Add Listeners
      const canvas = this.$refs.canvas;
      canvas.addEventListener('mousedown', this.handleMouseDown);
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseup', this.handleMouseUp);
    },
    beforeDestroy() {
        const canvas = this.$refs.canvas;
        if(canvas) canvas.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    },
    watch: {
      width: 'mountBike',
      height: 'mountBike',
      composition: 'mountBike',
      buffer: {
          handler: 'draw',
          deep: true
      }
    },
    computed: {
      aspectRatio() {
        return this.width / this.height;
      },
      composition() {

        var frameset = this.items[0];
        if ( ! frameset || ! frameset.item ) return null;

        var framesetProps = this.itemProps( frameset ), chain = null, itemProps;
        const itemAnchors = {};

        const anchors = {
          bars: {
            x: framesetProps.barX || 0,
            y: framesetProps.barY || 0,
          },
          wheelsLeft: {
            x: framesetProps.leftWheelX || 0,
            y: framesetProps.leftWheelY || 0
          },
          wheelsRight: {
            x: framesetProps.rightWheelX || 0,
            y: framesetProps.rightWheelY || 0
          },
          tyresLeft: {
            x: framesetProps.leftWheelX || 0,
            y: framesetProps.leftWheelY || 0
          },
          tyresRight: {
            x: framesetProps.rightWheelX || 0,
            y: framesetProps.rightWheelY || 0,
          },
          seatposts: {
            x: framesetProps.seatpostX || 0,
            y: framesetProps.seatpostY || 0
          },
          saddles: {
            x: framesetProps.saddleX || 0,
            y: framesetProps.saddleY || 0,
          },
          groupsetsLeft: {
            x: framesetProps.leftWheelX || 0,
            y: framesetProps.leftWheelY || 0
          },
          groupsetsMiddle: {
            x: framesetProps.groupsetMiddleX || 0,
            y: framesetProps.groupsetMiddleY || 0
          },
          groupsetsBar: {
            x: framesetProps.groupsetBarX || 0,
            y: framesetProps.groupsetBarY || 0
          },
          groupsetsBrakeLeft: {
            x: framesetProps.leftWheelX || 0,
            y: framesetProps.leftWheelY || 0
          },
          groupsetsBrakeRight: {
            x: framesetProps.rightWheelX || 0,
            y: framesetProps.rightWheelY || 0
          },
          groupsetsCapilierLeft: {
            x: framesetProps.groupsetCapilierRearX || 0,
            y: framesetProps.groupsetCapilierRearY || 0
          },
          groupsetsCapilierRight: {
            x: framesetProps.groupsetCapilierFrontX || 0,
            y: framesetProps.groupsetCapilierFrontY || 0
          },
          groupsetsGear: {
            x: framesetProps.groupsetCapilierMiddleX || 0,
            y: framesetProps.groupsetCapilierMiddleY || 0
          }
        };
        
        console.log('Bike: FramesetProps', framesetProps);
        console.log('Bike: Anchors', anchors);

        const items = this.items.map(( a, order, color ) => {

          if ( ! a.item || ! ( color = a.item.colors[ a.color ])) return;

          const props = {
            anchor: a.item.type,
            type: a.item.type,
            image: color.color.customImage || color.color.image,
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

              itemProps = this.itemProps( a );
              props.rotation = radians( framesetProps.inclinationFront || 0 );

              itemAnchors.groupsetsBar = {
                x: itemProps.groupsetBarX || 0,
                y: itemProps.groupsetBarY || 0,
                type: 'bars'
              };

              break;

            case 'groupsets':

              itemProps = this.itemProps( a );
              chain = {
                front: itemProps.chainFrontDiameter || 0,
                rear: itemProps.chainRearDiameter || 0,
                break: {
                  x: itemProps.brakeFrontX,
                  y: itemProps.brakeFrontY
                }
              };

              var rot;
              return Object.keys( GRUOPSET_ANCHORS ).map( key => {
                rot = GROUPSET_ANGLE[key];
                return {
                  ...props,
                  type: key,
                  anchor: key,
                  index: CONSTANTS[ key ].zIndex,
                  scale: CONSTANTS[ key ].scale || props.scale,
                  image: color.color[ GRUOPSET_ANCHORS[key] ],
                  origin: key === 'groupsetsMiddle' ? props.origin : {},
                  rotation: rot ? radians( framesetProps[rot] || 0 ) : 0
                }
              });

            case 'wheels':
            case 'tyres':

              // User Request: Tyre needs to scale in the same proportion as the wheel
              // So, use 'wheelScale' for both 'wheels' and 'tyres'
              props.scale *= framesetProps.wheelScale || 1;
              return [ 'Left', 'Right' ].map( pos => ({
                ...props,
                type: a.item.type + pos,
                anchor: a.item.type + pos
              }));

            case 'saddles':

              props.blockRotation = true;

              break;

            case 'seatposts':

              itemProps = this.itemProps( a );
              props.rotation = radians( framesetProps.inclinationRear || 0 );
              props.scale = framesetProps.seatpostScale || props.scale;

              itemAnchors.saddles = {
                x: itemProps.saddleX || 0,
                y: itemProps.saddleY || 0,
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
          items,
          chain
        };
      }
    },

  methods: {
      itemProps( comp ) {

        const props = { ...comp.item };
        const selected = comp.item.colors[ comp.color ];

        if ( selected ) {
          const excludeKeys = ['id','color','color2','colorName','image','price','priority'];
          for ( var key in selected.color ) {
            if ( excludeKeys.indexOf( key ) < 0 ) {
              if ( selected.color[key] != null ) {
                props[key] = selected.color[key];
              }
            }
          }
        }

        return props;
      },
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
            item.image && loadImage( item.image.startsWith('data:') ? item.image : CONSTANTS.imageBase + item.image ).then( image => {
              
              if (!image) {
                  console.error('Bike: LoadImage failed for item', item.type, item.image);
                  return; 
              }
              console.log('Bike: LoadImage success', item.type);

              const anchor = composition.itemAnchors[ item.anchor ] || composition.anchors[ item.anchor ];
              const origin = item.origin;
              let width    = image.naturalWidth; // changed from const for resizing
              let height   = image.naturalHeight;

              // Scale down huge custom images
              if ( item.image.startsWith('data:') && width > 740 ) {
                const ratio = 740 / width;
                width *= ratio;
                height *= ratio;
              }

              if ( origin.x == null ) origin.x = width / 2;
              if ( origin.y == null ) origin.y = height / 2;
              if ( item.anchor === 'framesets' ) origin.y += 60 * item.scale; // Reajust to centrate

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
                  width,  height, image,
                  anchor, origin
                }));
              }

              if ( frameset.loaded ) {

                waiting = waiting.map( item => {

                  if ( item.anchor.type && ( item.parent = composition.items.find( a => a.type === item.anchor.type ))) {
                    if ( this.buffer.indexOf( item.parent ) < 0 ) return item;

                    item.scale  *= frameset.scale;
                    item.width  *= item.scale;
                    item.height *= item.scale;

                    this.buffer.push( item );
                    return;
                  }

                  item.parent = null;
                  item.scale  *= frameset.scale;
                  item.width  *= item.scale;
                  item.height *= item.scale;
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

        //const frameset = this.buffer.find( a => a.type === 'framesets' );

        this.clear();
        this.buffer.slice().sort(( a, b ) => a.index - b.index ).forEach( item => {

          if ( item.type === 'groupsetsMiddle' )
            this.drawFrontChain( item );

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

          if ( item.type === 'groupsetsLeft' )
            this.drawRearChain( item );

          if ( item.type === 'framesets' )
            this.drawShadow( item );
        });
      },
      drawFrontChain( item ) {

        const { chain } = this.composition;
        if ( ! chain || ! chain.rear || ! chain.front ) return;

        const ctx = this.context;
        var radius = ( chain.front * item.scale ) / 2;
        var f1 = { x: item.x, y: item.y - radius };
        var f2 = { x: item.x, y: item.y + radius };

        // Draw

        ctx.strokeStyle = '#222';
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.arc( item.x, item.y, radius, Math.PI / 2, Math.PI * 2 * .75, true );
        ctx.stroke();

        if (( item = this.buffer.find( a => a.type === 'groupsetsLeft' ))) {

          radius = ( chain.rear * item.scale ) / 2;
          var r1 = { x: item.x, y: item.y - radius };
          var r2 = {
            x: item.x - item.origin.x * item.scale + chain.break.x * item.scale,
            y: item.y - item.origin.y * item.scale + chain.break.y * item.scale
          };

          ctx.beginPath();
          ctx.moveTo( f1.x, f1.y );
          ctx.lineTo( f1.x + ( r1.x - f1.x ) / 2, f1.y + ( r1.y - f1.y ) / 2 );
          ctx.moveTo( f2.x, f2.y );
          ctx.lineTo( r2.x, r2.y );
          ctx.stroke();

        }
      },
      drawRearChain( item ) {

        const { chain } = this.composition;
        if ( ! chain || ! chain.rear || ! chain.front ) return;

        const ctx = this.context;
        var radius = ( chain.rear * item.scale ) / 2;
        var r1 = { x: item.x, y: item.y - radius };

        // Draw

        ctx.strokeStyle = '#222';
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.arc( item.x, item.y, radius, Math.PI * 2 * .75, Math.PI / 2, true );
        ctx.stroke();

        if (( item = this.buffer.find( a => a.type === 'groupsetsMiddle' ))) {

          radius = ( chain.front * item.scale ) / 2;
          var f1 = { x: item.x, y: item.y - radius };

          ctx.beginPath();
          ctx.moveTo( r1.x, r1.y );
          ctx.lineTo( r1.x + ( f1.x - r1.x ) / 2, r1.y + ( f1.y - r1.y ) / 2 );
          ctx.stroke();
        }
      },
      drawShadow( item ) {

        const ctx = this.context;

        // Calc dimensions and Position
        const wheel1 = this.composition.anchors.wheelsLeft;
        const wheel2 = this.composition.anchors.wheelsRight;
        const size = ( wheel2.x - wheel1.x ) * item.scale;
        const x = item.x + size / 2;
        const y = item.y + (Math.max( wheel1.y, wheel2.y ) + 215 * CONSTANTS.wheels.scale) * item.scale;
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
      },
      onResize(e) {
        const { width, height } = this;
        const { container, canvas } = this.$refs;
        
        if (container) {
            console.log('Bike: onResize container:', container.clientWidth, 'x', container.clientHeight);
        }
        
        containImage( canvas, width, height, container, e );
      },
      // DRAG HANDLERS
      getMousePos(e) {
          const rect = this.$refs.canvas.getBoundingClientRect();
          // Scale mouse coordinates to match Canvas internal resolution (1400x1000)
          const scaleX = this.width / rect.width;
          const scaleY = this.height / rect.height;
          return {
              x: (e.clientX - rect.left) * scaleX,
              y: (e.clientY - rect.top) * scaleY
          };
      },
      handleMouseDown(e) {
          if (!this.editable) return;
          const pos = this.getMousePos(e);
          // console.log('Bike: MouseDown at', pos);
          
          // Find hit - Iterate buffer in reverse draw order (top first)
          // Filter for wheels and groupsets
          const hit = this.buffer.slice().reverse().find(item => {
              // Allow Wheels
              if (item.type === 'wheelsLeft' || item.type === 'wheelsRight') {
                  // pass
              } 
              // Allow Groupsets (except maybe groupsetsLeft/Right/Brake if they are auto-positioned?)
              // groupsetsLeft is tied to rear wheel. groupsetsBrake* are tied to wheels.
              // Let's allow all 'groupsets*' and we'll see which ones actually have anchors.
              else if (item.type && item.type.startsWith('groupsets')) {
                  // pass
              }
              else if (item.type === 'saddles') {
                  // pass
              }
              else {
                  return false;
              }
              
              // Calculate actual bounding box considering origin and scale
              // drawImage calls translate(x, y) then translate(-originX*scale, -originY*scale)
              const drawX = item.x - (item.origin.x * item.scale);
              const drawY = item.y - (item.origin.y * item.scale);
              const width = item.width;
              const height = item.height;

              const isHit = pos.x >= drawX && pos.x <= drawX + width &&
                     pos.y >= drawY && pos.y <= drawY + height;
              
              // if (isHit) console.log('Bike: Hit item', item.type, item);
              return isHit;
          });

          if (hit) {
              // console.log('Bike: Drag Start on', hit.type);
              this.dragging = hit;
              this.dragStart = pos;
              // Store initial anchor to calculate delta
              // anchor is { x, y } relative to frameset
              this.initialAnchor = { ...hit.anchor };
          }
      },
      handleMouseMove(e) {
        if (!this.dragging) return;
        const pos = this.getMousePos(e);
        const dx = pos.x - this.dragStart.x;
        const dy = pos.y - this.dragStart.y;
        
        // Find frameset reference to calculate scale
        const frameset = this.buffer.find(b => b.type === 'framesets');
        if (!frameset) return;
        
        // 1. VISUAL UPDATE
        this.dragging.x += dx;
        this.dragging.y += dy;
        this.dragStart = pos; // Reset for next delta

        // 2. LOGICAL UPDATE (Calculate Anchor)
        // Original logic: item.x = frameset.x + item.anchor.x * frameset.scale
        // So: item.anchor.x = (item.x - frameset.x) / frameset.scale
        
        const newAnchorX = (this.dragging.x - frameset.x) / frameset.scale;
        const newAnchorY = (this.dragging.y - frameset.y) / frameset.scale;
        
        this.$emit('update-anchor', {
            anchor: this.dragging.anchor.type || this.dragging.type, 
            x: newAnchorX,
            y: newAnchorY
        });
      },
      handleMouseUp() {
          this.dragging = null;
          this.lastMouseX = null;
          this.lastMouseY = null;
      }
    }
  }
</script>

<style>
  .bike-canvas {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
