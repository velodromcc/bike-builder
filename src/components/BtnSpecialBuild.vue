<template>
  <v-tooltip v-bind="$attrs">
    <template v-slot:activator="{ attrs, on }">
      <Btn
        v-bind="attrs"
        v-on="on"
        class="btn-special-build"
        @click="$emit('click',$event)"
        color="orange"
        :large="large"
        icon
      >
        <v-icon>mdi-star</v-icon>
      </Btn>
    </template>
    <div>
      Special Build
    </div>
  </v-tooltip>
</template>

<script>
  import { Btn } from '@/components';
  export default {
    components: { Btn },
    props: {
      large: {
        type: Boolean,
        default: true
      }
    }
  }
</script>
