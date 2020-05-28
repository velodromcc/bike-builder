<template>
  <canvas class="bike-canvas" ref="canvas"></canvas>
</template>

<script>
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
    computed: {
      images() {

        const buffer  = this.buffer.slice();
        const index   = buffer.findIndex( a => a.base );
        const anchors = {};
        const base    = this.calcDimension(
          index !== -1 ? buffer.splice( index, 1 ) : null, 0, anchors
        );

        return [ base ].concat(
            buffer.map( item => this.calcDimension( item, base, anchors ))
          )
          .filter( a => a )
          .sort(( a, b ) => a.index - b.index )
      }
    },
    watch: {
      width:  'refresh',
      height: 'refresh',
      items:  'loadImages',
      images: 'draw'
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
      clear() {
        const { context } = this;
        context.clearRect( 0, 0, this.width, this.height );
      },
      draw() {
        this.clear();
        this.images.forEach( a => this.context.drawImage( a.image, a.x, a.y, a.width, a.height ));
      },
      refresh() {
        this.getContext();
        this.draw();
      },
      loadImages() {
        this.buffer = [];
        this.items.forEach( a => this.loadImage( a.item ));
      },
      loadImage( item ) {

        // Get all image to Draw

        var items = this.items || [];
        if ( item.anchor ) {

          items.unshifth({
            anchor:  item.anchor,
            origin:  item.origin || [],
            image:   item.image
          });

        } else if ( this.base ) {

          items.unshifth({
            base: true,
            image: item.image
          });
        }

        // Load image

        items.forEach( a => {

          var image = new Image();
          image.src = require(`@/assets/items/${ item.type }/${ a.image }`);
          a.image   = image;
          a.index   = a.index == null ? item.priority : a.index;
          a.anchors = a.anchors || item.anchors;

          if ( image.complete && image.naturalHeight !== 0 ) {

            this.buffer.push( a );

          } else {

            image.addEventListener( 'load', () => this.buffer.push( a ));

          }
        });
      },
      calcDimension( item, base, anchors ) {

        if ( ! item ) return;

        // Merge anchors
        Object.assign( anchors, item.anchors );
        const { anchor, origin, image } = item;

        if ( base && anchors[anchor] ) {

          var a = anchors[anchor][0] || { x: 0, y: 0 },
              b = anchors[anchor][1] || { x: 0, y: 0 },
              A = origin[0] || { x: 0, y: 0 },
              B = origin[1] || { x: 0, y: 0 },
              d = Math.sqrt( Math.pow( b.x - a.x, 2 ) + Math.pow( b.y - a.y, 2 )),
              D = Math.sqrt( Math.pow( B.x - A.x, 2 ) + Math.pow( B.y - A.y, 2 )),
              scale = D / d;

          return {
            ...item,
            x: a.x - ( A.x * scale ),
            y: a.y - ( A.y * scale ),
            width: image.width * scale,
            height: image.height * scale
          }

        } else if ( item.base ) {

          return {
            ...item,
            x: ( this.width - image.width ) / 2,
            y: ( this.height - image.height ) / 2,
            width: image.width,
            height: image.height
          }
        }
      }
    },
    mounted() {
      this.getContext();
      this.loadImages();
    }
  }
</script>

<style>
  .bike-canvas {
    height: 100%;
    width: auto;
    margin: 0 auto;
  }
</style>
