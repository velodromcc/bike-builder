<template>
  <v-dialog v-model="show" :persistent="loading" max-width="720" no-click-animation>
    <v-card class="d-flex flex-column flex-nowrap rel" height="480">
      <v-overlay :value="loading" color="white" absolute/>
      <v-toolbar class="outline-bottom light--border shrink" elevation="0" height="90">

        <span>
          <h3 class="headline bb-primary--text mb-0">ENQUIRE ABOUT THIS SET UP</h3>
          <small class="mb-0">Simply fill out the form below and we’ll get in touch to discuss your custom bike.</small>
        </span>

        <v-spacer/>

        <Btn class="btn-close" color="bb-primary" @click="show = false" width="20" height="20" fab dark>
          <v-icon small v-text="'$close'"/>
        </Btn>

      </v-toolbar>
      <v-row class="grow rel" no-gutters>
        <div v-if="sended" class="fill-width">

          <v-alert type="success" class="ma-4" outlined>
            <span>Your command has been sended succesfully.</span>
          </v-alert>

        </div>
        <div v-else-if="error" class="fill-width">

          <v-alert type="error" class="ma-4" outlined>
            <span>It seems there has been an error, please try again later.</span>
          </v-alert>

        </div>
        <v-form v-else ref="form" v-model="valid" class="layer autoscroll pa-4">

          <label class="d-block caption mb-2 bb-primary--text">
            Name <span style="color:red">*</span>
          </label>

          <v-text-field
            name="name"
            autocomplete="name"
            color="bb-primary"
            v-model="data.name"
            :rules="rules.name"
            single-line
            outlined
            dense
          />

          <label class="d-block caption mb-2 bb-primary--text">
            Email <span style="color:red">*</span>
          </label>

          <v-text-field
            type="email"
            name="email"
            autocomplete="email"
            color="bb-primary"
            v-model="data.email"
            :rules="rules.email"
            single-line
            outlined
            dense
          />

          <label class="d-block caption mb-2 bb-primary--text">
            Telephone Number <span style="color:red">*</span>
          </label>

          <v-text-field
            type="number"
            name="tel"
            autocomplete="tel"
            color="bb-primary"
            v-model="data.phone"
            :rules="rules.phone"
            single-line
            outlined
            dense
          />

        </v-form>
      </v-row>
      <v-toolbar tag="footer" class="outline-top light--border shrink" elevation="0" height="70">

        <v-spacer/>

        <Btn v-if="sended" color="bb-primary" @click="show = false" dark>
          Accept
        </Btn>

        <Btn v-else-if="error" color="bb-primary" @click="error = false" dark>
          Try Again
        </Btn>

        <Btn v-else color="bb-primary" :disabled="!valid" :loading="loading" @click="send" :dark="valid">
          Send Enquiry
        </Btn>

      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>

  import { Btn } from '@/components';
  import { capitalize } from '@/utils';
  import { mapState } from 'vuex';

  const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // RULES

  const required = v => !!(v||'').trim() || 'The field is required.';
  const email = v => EMAIL_REGEX.test(v) || 'The email is not valid.';
  const shortest = n => v => (v||'').trim().length > n || 'The field is too short.';

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
        loading: false,
        sended: false,
        error: false,
        data: {
          name: '',
          email: '',
          phone: ''
        },
        rules: {
          name: [ required, shortest(2) ],
          email: [ required, email ],
          phone: [ required ]
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
    computed: mapState([ 'company' ]),
    methods: {
      reset() {
        this.sended = this.error = false;
        const { form } = this.$refs;
        if ( form ) form.reset();
      },
      send() {
        if ( this.valid ) {

          const params = {
            ...this.data,
            idCompany: this.company.id,
            url: this.company.website,
            idFramesetColor: -1,
            idSeatpostColor: -1,
            idBarColor: -1,
            idSaddleColor: -1,
            idGroupsetColor: -1,
            idWheelColor: -1,
            idTyreColor: -1
          };

          // Add composition
          this.items.forEach(( a, key ) => {
            key = 'id' + capitalize( a.item.step.id ).replace(/s$/,'') + 'Color';
            params[key] = a.item.colors[ a.color ].color.id;
          });

          // Send request
          this.loading = true;
          this.$store
            .dispatch( 'buyBike', params )
            .then( res => {
              if ( res.data.error ) {
                console.error( res.data.message );
                this.error = true;
              } else {
                this.sended = true;
              }
            })
            .catch( err => {
              console.error( err );
              this.error = true;
            })
            .finally(() => this.loading = false );
        }
      }
    }
  }
</script>
