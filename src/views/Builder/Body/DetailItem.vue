<template>
  <v-sheet
    class="detail-image-container grow"
    v-resize="resize"
    :class="{ 'pa-12': !( item.image.front || item.image.thumb )}"
    height="200"
  >

    <img
      ref="image"
      :src="item.image.front || item.image.src || item.image.thumb"
      :width="width"
      :height="height"
    />

    <div class="detail-price headline bb-primary--text">
      {{ item.price }} €
    </div>

  </v-sheet>
</template>

<script>

  import { loadImage, containImage } from '@/utils';

  export default {
    props: {
      item: Object,
      print: Boolean
    },
    data: () => ({
      width: null,
      height: null
    }),
    watch: {
      item: 'getImageSize',
      print(v) {
        this.resize( v ? {
          containerWidth: 150,
          containerHeight: 100
        } : {});
      }
    },
    methods: {
      getImageSize() {
        if ( ! this.item ) return;
        const src = this.item.image.front || this.item.image.src || this.item.image.thumb;
        loadImage( src ).then( image => {
          this.width = image.naturalWidth;
          this.height = image.naturalHeight;
          requestAnimationFrame( this.resize );
        });
      },
      resize(e) {
        containImage( this.$refs.image, this.width, this.height, null, e );
      }
    },
    mounted() {
      this.getImageSize();
    }
  }
</script>

<style>
.detail-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
