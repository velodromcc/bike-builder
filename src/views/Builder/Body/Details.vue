<template>
  <div class="details-complete pb-4">
    <div class="details-wrapper">

      <div class="text-left">
        <Btn class="btn-return mb-6" @click="$emit('return')" small text>
          <v-icon left>$prev</v-icon>
          Return to builder
        </Btn>
      </div>

      <div class="builder-bike mt-0 mb-6"/>

      <h1 class="bb-primary--text mb-6">
        YOUR BUILD
      </h1>

      <div v-if="company && company.summaryHtml" v-html="company.summaryHtml"></div>
      <div v-else>
        <p>
            Thank you for creating your dream build with Velodrom. Whatever combination you've
            chosen we'll ensure that it all works together and, of course, fits you perfectly.
        </p>

        <p>
            Get in touch to discuss your requirements in more detail, and for impartial expert
            advice on bike and component choice.
        </p>
      </div>

      <Price
        class="d-inline-block mb-6"
        :price="price"
        :offer="specialBuild && specialBuild.price"
      >
        <template v-slot:right>
          <BtnSpecialBuild
            v-if="specialBuild"
            @click="$emit('special-build')"
            right
          />
        </template>
      </Price>

      <div>
        <Btn class="btn-form footer-enquire body-1" color="bb-secondary" @click="$emit('form')" height="40" tile dark>
          <v-icon left v-text="'mdi-send'"/>
          Contact us to discuss this build
        </Btn>
      </div>

      <div class="detail-actions mt-6">

        <Btn class="outline light--border mr-3" color="bb-primary" width="40" height="40" @click="$emit('share')" icon>
          <v-icon v-text="'mdi-share-variant'"/>
        </Btn>

        <Btn
          class="outline light--border mr-3"
          href="https://web.whatsapp.com/send?phone=34652923272&text=%C2%A1Hola!%20Me%20gustar%C3%ADa%20que%20me%20ayudaras%20con...."
          width="40" height="40"
          title="¿Cómo puedo ayudarte?"
          color="bb-primary"
          target="_blank"
          icon
        >
          <v-icon v-text="'mdi-whatsapp'"/>
        </Btn>

        <Btn
          class="btn-print outline light--border"
          color="bb-primary"
          width="40" height="40"
          title="Imprimir"
          @click="$emit('print')"
          icon
        >
          <v-icon v-text="'mdi-printer'"/>
        </Btn>
      </div>
    </div>

    <v-divider class="details-divider my-5"/>

    <h2 class="details-title bb-primary--text my-6" style="break-before:always">
      YOUR BUILD IN DETAIL
    </h2>

    <DetailItems
      class="text-left"
      :items="items"
      :print="print"
      show-description
    />

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Btn, BtnSpecialBuild, Price } from '@/components';
import DetailItems from './DetailItems';

export default {
  components: { Btn, Price, BtnSpecialBuild, DetailItems },
  props: {
    print: Boolean,
    items: Array,
    price: Number,
    specialBuild: Object
  },
  computed: {
    ...mapState(['company'])
  }
}
</script>

<style>
.details-complete {
  padding-top: 32px;
}
.details-complete p {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.details-complete > .details-wrapper {
  padding-right: 720px;
}
.details-complete .builder-bike {
  display: none;
}
@media(max-width:993px) {
  .details-complete {
    text-align: center;
    padding-top: 0;
  }
  .details-complete > .details-wrapper {
    padding-right: 0;
  }
  .details-complete .builder-bike {
    display: block;
  }
}
@media ( max-width: 480px ) {
  .btn-print {
    display: none !important;
  }
}
</style>
