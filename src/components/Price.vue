<template>
  <div class="price mt-n1" :class="{['text-' + align ]: align }">
    <div v-if="!hideTitle" class="price-srp caption">SRP</div>
    <div class="price-values bb-primary--text mt-n1">

      <slot name="left"/>

      <span class="price-old" v-if="offer && align !== 'left'">
        {{ price }}
      </span>
      <span class="price-value display-4">
        {{ offer || price }} €
      </span>
      <span class="price-old" v-if="offer && align === 'left'">
        {{ price }}
      </span>

      <slot name="right"/>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    hideTitle: Boolean,
    price: Number,
    offer: Number,
    align: {
      type: String,
      default: 'left'
    }
  }
}
</script>

<style>
.price {
  text-align: left;
}
.price-srp {
  line-height: 1.4;
  font-size: .6rem !important;
}
.price-value, .price-old {
  white-space: nowrap;
}
.price-old {
  text-decoration: line-through;
  font-weight: bold;
  opacity: .25;
}
</style>
