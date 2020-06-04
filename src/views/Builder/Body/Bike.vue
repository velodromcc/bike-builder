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

        const items = [];

        this.buffer
          .slice()
          .sort(( a, b ) => a.step.order - b.step.order )
          .forEach( item => {

            if ( ! item ) return;

            item.width   = item.width  || 0;
            item.height  = item.height || 0;
            const origin = item.origin || { x: item.width / 2, y: item.height / 2 };
            const base   = items.find( a => ( a.anchors || {} )[ item.anchor ]);
            const anchor = base ? base.anchors[ item.anchor ] : null;

            if ( base && anchor ) {
              return items.unshift({
                ...item,
                x: base.x + ( anchor.x * base.step.scale ) - ( origin.x * item.step.scale ),
                y: base.y + ( anchor.y * base.step.scale ) - ( origin.y * item.step.scale ),
                width: item.width * item.step.scale,
                height: item.height * item.step.scale
              });
            }

            items.unshift({
              ...item,
              x: this.width / 2 - ( origin.x * item.step.scale ),
              y: this.height / 2 - ( origin.y * item.step.scale ),
              width: item.width * item.step.scale,
              height: item.height * item.step.scale
            });
          });

        return items.sort(( a, b ) => a.step.index - b.step.index );
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
    max-width: 100%;
    max-height: 420px;
  }
</style>
