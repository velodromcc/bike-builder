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
      composition() {
        return this.items.map( a => {
          if ( ! a.item ) return;
          var item = { ...a.item, ...a.item.items[ a.color || 0 ] };
          if ( ! item.parts ) return item;
          return item.parts.map( part => ({ ...item, ...part }));
        })
        .flat()
        .filter( a => a )
      },
      images() {

        const anchors = {};
        const buffer  = this.buffer.slice().sort(( a, b ) => a.step.order - b.step.order );
        const base    = this.calcDimension( buffer.splice( 0, 1 )[0], anchors );

        return [ base ].concat( buffer.map( a => this.calcDimension( a, anchors, base )))
          .filter( a => a )
          .sort(( a, b ) => a.step.index - b.step.index );
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
        this.composition.forEach( this.loadImage );
      },
      loadImage( item ) {

        if ( ! item.image ) return;

        const image = new Image();
        image.src = require(`@/assets/items/${ item.image }`);
        item = { ...item, image };

        if ( image.complete && image.naturalHeight !== 0 ) this.buffer.push( item );
        else {
          image.addEventListener( 'load', () => this.buffer.push( item ));
        }
      },
      calcDimension( item, anchors, base ) {

        if ( ! item ) return;

        // Merge anchors
        Object.assign( anchors, item.anchors );

        const { image } = item;
        const { scale } = item.step;
        const origin = item.origin || { x: ( item.width || 0 ) / 2, y: ( item.height || 0 ) / 2 };
        const anchor = anchors[ item.anchor ];

        if ( base && anchor ) {
          return {
            ...item,
            x: base.x + ( anchor.x * base.step.scale ) - ( origin.x * scale ),
            y: base.y + ( anchor.y * base.step.scale ) - ( origin.y * scale ),
            width: item.width * scale,
            height: item.height * scale
          };
        }

        return {
          ...item,
          x: this.width / 2 - ( origin.x * scale ),
          y: this.height / 2 - ( origin.y * scale ),
          width: image.width * scale,
          height: image.height * scale
        };
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
    width: 100%;
    margin: 0 auto;
  }
</style>
