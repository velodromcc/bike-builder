<template>
  <v-row
    class="detail-items"
    :class="{'show-description': showDescription, print }">

    <v-col v-for="( item, i ) in items" :key="i" v-bind="columns">
      <v-card class="fill-height">

        <v-sheet
          class="detail-image-container grow"
          :class="{ 'pa-12': !( item.image.front || item.image.thumb )}"
          height="200"
        >

          <div
            v-if="!print"
            class="detail-image"
            :style="`background-image: url(${ item.image.front || item.image.thumb || item.image.src })`"
          />

          <img
            v-else
            :src="item.image.front || item.image.thumb || item.image.src"
          />

          <div class="detail-price headline bb-primary--text">
            {{ item.price }} €
          </div>
        </v-sheet>

        <div class="detail-item-info px-4 mb-2">
          <p class="caption mb-0">{{ item.type }}</p>
          <p class="headline bb-primary--text mb-0">{{ item.name }}</p>
          <p class="mb-0">
            <Color class="mb-0" :value="item.color" small/>
            <span class="caption">{{ item.colorName }}</span>
          </p>
        </div>

        <div class="detail-item-description body-2 pa-4" v-if="showDescription">
          {{ item.item.description }}
        </div>

        <v-card-actions v-else>

          <Btn class="body-1" color="bb-primary" tile dark @click="$emit( 'description', item.item )">
            Description
          </Btn>

          <Btn v-if="item.url" tag="a" :href="item.url" target="_blank"
          class="body-1" color="bb-primary" tile outlined>
            Buy online
          </Btn>

        </v-card-actions>

      </v-card>
    </v-col>

  </v-row>
</template>

<script>
  import { Btn, Color } from '@/components';
  export default {
    components: { Btn, Color },
    props: {
      dense: Boolean,
      print: Boolean,
      showDescription: Boolean,
      items: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      columns() {
        if ( this.dense ) return { cols: 12, sm: 6, md: 3 };
        return { cols: 12, sm: 6, md: 4 };
      }
    }
  }
</script>

<style>
.detail-items .v-card {
  display: flex;
  flex-direction: column;
}
.detail-items.show-description .v-card {
  display: block;
}
.detail-item-description {
  text-transform: none !important;
}
.detail-items.print .detail-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-items.print img {
  width: auto;
  height: 80%;
}
</style>
