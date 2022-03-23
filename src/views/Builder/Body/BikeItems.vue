<template>
  <div class="builder-nav--items">
    <header class="outline-bottom light--border">

      <input
        type="text"
        v-model="search"
        autocomplete="off"
        placeholder="Search..."
        class="outline light--border"
      />

      <v-icon class="mx-2">
        mdi-magnify
      </v-icon>

    </header>
    <v-item-group
      class="fill-height autoscroll"
      :value="value"
      :mandatory="value != null"
      @change="$emit( 'input', $event )"
    >
      <v-item
        v-for="( item, i ) in list"
        v-slot="{ active, toggle }"
        v-show="!item.hide"
        :key="i"
      >
        <a
          class="bike-item body-1"
          :class="{ selected: active, thumb: item.thumb }"
          @click="toggle"
        >

          <v-avatar v-if="active" class="bike-item-icon" size="30" color="bb-primary">
            <v-icon small dark>mdi-check-bold</v-icon>
          </v-avatar>

          <div
            class="bike-item-image"
            :style="`background-image: url(${ item.src })`"
          />

          <div class="bike-item-info-name">
            {{ item.name }}
          </div>

          <div class="bike-item-info-colors"  v-if="item.info.colors.length > 1">
            <Color
              v-for="( color, i ) in item.info.colors"
              :key="i"
              :value="[ color.color, color.color2 ]"
              class="mb-0"
              small
            />
            <span v-if="item.info.more">
              +{{ item.info.more }}
            </span>

          </div>

          <BtnSelect :active="active"/>

        </a>
      </v-item>
    </v-item-group>
  </div>
</template>

<script>

  import { Color, BtnSelect } from '@/components';
  import { itemImage, normalize } from '@/utils';
  import { mapState } from 'vuex';

  export default {
    components: { Color, BtnSelect },
    props: {
      value: null,
      type: String,
      items: {
        type: Array,
        default: () => []
      }
    },
    data: () => ({
      search: ''
    }),
    watch: {
      items() {
        this.search = '';
      }
    },
    computed: {
      ...mapState([ 'specialBuilds' ]),
      list() {
        let search = normalize( this.search );
        return this.items.map( item => {
          const colors = item.colors.map( a => a.color );
          const image = itemImage( item );
          return {
            ...item,
            thumb: !!image.thumb,
            src: image.front || image.thumb || image.src,
            hide: ! normalize( item.name || '' ).includes( search ),
            specialBuild: this.type === 'Frameset' && this.specialBuilds.find( s => {
              return s.frameset === item.id;
            }),
            info: {
              colors: colors.slice( 0, 3 ),
              more: colors.length > 3 ? colors.length - 3 : 0
            }
          };
        });
      }
    }
  };
</script>

<style lang="scss">
  .builder-nav--items {
    padding-top: 48px;
  }
  .builder-nav--items > header {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    padding: 8px;
  }
  .builder-nav--items > header > input {
    flex: 1 1 auto;
    border-radius: 4px;
    padding: 4px 8px;
  }
  /*.builder-nav--items > header > input:focus {
    outline: 0;
  }*/
  .bike-item {

    display: flex;
    flex-direction: column;
    position: relative;
    border-left: 5px solid transparent;
    border-bottom: 1px solid var(--v-light-base);
    transition: background-color 500ms ease;
    text-decoration: none;
    height: 240px;

    .bike-item-image {
      flex: 1 0 auto;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
      margin: 10px 0 60px 0;
    }
    &:not(.thumb) .bike-item-image {
      transform: scale(.75);
    }
    .bike-item-icon {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .bike-item-info-name {
      position: absolute;
      left: 0; bottom: 0; right: 120px;
      padding: 10px;
    }
    .bike-item-info-colors {
      position: absolute;
      right: 10px; bottom: 47px;
    }
    &.thumb .bike-item-image {
      margin: 0 0 60px 0;
    }
    &.selected {
      background-color: #f4f4f4;
      border-left: 5px solid var(--bb-primary);
    }
    &:hover {

      background-color: var(--bb-secondary);
      color: white;

      .bike-item-info-name, .bike-item-info-colors {
        color: white !important;
      }
    }
    .bike-item-select {
      position: absolute;
      bottom: 10px;
      right: 10px;
      border: 1px solid var(--v-light-base) !important;
    }
  }
  @media ( max-width: 1024px ) {
    .builder-nav--items > div {
      overflow-y: hidden !important;
    }
    .builder-nav--items > div {
      white-space: nowrap;
    }
    .bike-item {

      display: inline-flex;
      width: 350px;
      height: 100%;
      border-bottom: 0;
      border-left: 0;
      border-right: 1px solid var(--v-light-base);
      border-top: 5px solid transparent;
      vertical-align: top;

      .bike-item-info-name {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      &.selected {
        border-left: 0;
        border-top: 5px solid var(--bb-primary);
      }
    }
  }
  @media ( max-width: 480px ) {
    .builder-nav--items {
      padding-top: 0;
    }
    .builder-nav--items > header {
      display: none;
    }
    .bike-item {
      width: 180px;
      .bike-item-select {
        display: none !important;
      }
      .bike-item-info-colors {
        bottom: 37px;
      }
      .bike-item-info-name {
        right: 10px;
      }
    }
    .bike-item.thumb .bike-item-image {
      background-position: center 20px;
      background-size: 90%;
    }
  }
</style>
