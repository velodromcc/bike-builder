<template>
  <v-dialog v-model="show" max-width="720">
    <v-card class="d-flex align-center pa-2">

      <v-icon
        class="mx-2"
        color="bb-secondary"
        v-text="'mdi-share-variant'"
      />

      <v-text-field
        ref="input"
        :value="link"
        @click="selectText"
        class="grow mx-2"
        color="bb-primary"
        hide-details
        autofocus
        outlined
        readonly
        dense
      />

      <Btn color="bb-primary" @click="copy" icon>
        <v-icon v-text="'mdi-content-copy'"/>
      </Btn>

    </v-card>
  </v-dialog>
</template>

<script>

  import { Btn } from '@/components';

  export default {
    components: { Btn },
    props: {
      value: null,
      id: String
    },
    data() {
      return {
        show: !!this.value
      }
    },
    computed: {
      link() {
        var path = window.location.origin;
        if ( this.id ) path += '/?id=' + this.id;
        return path;
      }
    },
    watch: {
      value( value ) {
        this.show = !!value;
      },
      show( value ) {
        this.$emit( 'input', value );
      }
    },
    methods: {
      input() {
        return this.$refs.input
          ? this.$refs.input.$el.getElementsByTagName('input')[0]
          : null;
      },
      selectText() {
        const input = this.input();
        if ( input ) {
          input.focus();
          input.selectionStart = 0;
          input.selectionEnd = this.link.length;
        }
      },
      copy() {
        this.selectText();
        if ( document.execCommand )
          document.execCommand('copy');
      }
    }
  }
</script>
