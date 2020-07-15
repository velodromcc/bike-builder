<template>
  <v-dialog v-model="show" max-width="1024">
    <v-card class="d-flex flex-column flex-nowrap" height="90vh">
      <v-toolbar class="outline-bottom light--border shrink" elevation="0" height="90">

        <span>
          <h3 class="headline mb-0">ENQUIRE ABOUT THIS SET UP</h3>
          <small class="mb-0">Simply fill out the form below and we’ll get in touch to discuss your custom bike.</small>
        </span>

        <v-spacer/>

        <Btn class="btn-close" color="bb-primary" @click="show = false" width="20" height="20" fab dark>
          <v-icon small v-text="'$close'"/>
        </Btn>

      </v-toolbar>
      <v-row class="grow rel" no-gutters>
        <v-form ref="form" v-model="valid" class="layer autoscroll pa-4">

          <label class="d-block caption mb-2 bb-primary--text">
            First Name <span style="color:red">*</span>
          </label>

          <v-text-field
            color="bb-primary"
            v-model="data.firstName"
            :rules="rules.firstName"
            single-line
            outlined
            dense
          />

          <label class="d-block caption mb-2 bb-primary--text">
            Last Name <span style="color:red">*</span>
          </label>

          <v-text-field
            color="bb-primary"
            v-model="data.lastName"
            :rules="rules.lastName"
            single-line
            outlined
            dense
          />

          <label class="d-block caption mb-2 bb-primary--text">
            Email <span style="color:red">*</span>
          </label>

          <v-text-field
            color="bb-primary"
            v-model="data.email"
            :rules="rules.email"
            single-line
            outlined
            dense
          />

          <label class="d-block caption mb-2 bb-primary--text">
            Telephone Number
          </label>

          <v-text-field
            type="number"
            color="bb-primary"
            v-model="data.phone"
            single-line
            outlined
            dense
          />

          <label class="d-block caption mb-2 bb-primary--text">
            Your Message <span style="color:red">*</span>
          </label>

          <v-textarea
            rows="8"
            color="bb-primary"
            v-model="data.message"
            :rules="rules.message"
            single-line
            no-resize
            outlined
          />

          <small class="d-block" style="max-width:600px">
            We'd love to keep you up to date with the latest products, events and services at Bespoke.
            We never sell your details to anyone else, and you can unsubscribe at any time.
          </small>

          <v-checkbox
            v-model="data.accept"
            label="Yes please, sign me up to receive email newsletters from Bespoke"
          />

        </v-form>
      </v-row>
      <v-toolbar class="outline-top light--border shrink" elevation="0" height="70">

        <v-spacer/>

        <Btn color="bb-primary" :disabled="!valid" :dark="valid">
          Send Enquiry
        </Btn>

      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>

  import { Btn } from '@/components';
  const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // RULES

  const required = v => !!v || 'The field is required.';
  const email = v => EMAIL_REGEX.test(v) || 'The email is not valid.';
  const shortest = v => v && v.length > 10 || 'The message is too short.'

  export default {
    components: { Btn },
    props: {
      value: null,
      items: Array
    },
    data() {
      return {
        show: !!this.value,
        valid: false,
        data: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          accept: false
        },
        rules: {
          firstName: [
            required
          ],
          lastName: [
            required
          ],
          email: [
            required,
            email
          ],
          message: [
            required,
            shortest
          ]
        }
      }
    },
    watch: {
      value( value ) {
        this.show = !!value;
      },
      show( value ) {
        value && this.reset();
        this.$emit( 'input', this.show );
      }
    },
    methods: {
      reset() {
        const { form } = this.$refs;
        if ( form ) form.reset();
      },
      send() {
        if ( this.valid ) {
          console.log( this.data );
        }
      }
    }
  }
</script>
