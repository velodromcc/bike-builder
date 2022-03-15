<template>
  <div class="details-complete pb-4">
    <div class="details-wrapper">

      <Btn class="btn-return mb-6" @click="$emit('return')" small text>
        <v-icon left>$prev</v-icon>
        Return to builder
      </Btn>

      <div class="builder-bike mt-0 mb-6"/>

      <h1 class="bb-primary--text mb-6">
        YOUR BUILD
      </h1>

      <p>
        Thank you for creating your dream build with Bespoke. Whatever combination you've c
        hosen we'll ensure that it all works together and, of course, fits you perfectly.
      </p>

      <p>
        Get in touch to discuss your requirements in more detail, and for impartial expert
        advice on bike and component choice.
      </p>

      <div class="mb-6">
        <p class="body-2 mb-0">SRP</p>
        <p class="display-4 bb-primary--text mb-0">
          <strong>{{ price }} €</strong>
        </p>
      </div>

      <Btn class="btn-form footer-enquire body-1" color="bb-secondary" @click="$emit('form')" height="40" tile dark>
        <v-icon left v-text="'mdi-send'"/>
        Contact us to discuss this build
      </Btn>

      <div class="detail-actions mt-6">

        <Btn class="outline light--border mr-3" color="bb-primary" width="40" height="40" @click="$emit('share')" icon>
          <v-icon v-text="'mdi-share-variant'"/>
        </Btn>

        <Btn
          class="outline light--border"
          href="https://web.whatsapp.com/send?phone=34652923272&text=%C2%A1Hola!%20Me%20gustar%C3%ADa%20que%20me%20ayudaras%20con...."
          width="40" height="40"
          title="¿Cómo puedo ayudarte?"
          color="bb-primary"
          target="_blank"
          icon
        >
          <v-icon v-text="'mdi-whatsapp'"/>
        </Btn>
      </div>

      <v-divider class="my-5"/>

      <h2 class="bb-primary--text my-6">
        YOUR BUILD IN DEATIL
      </h2>

    </div>

    <DetailItems
      class="text-left"
      :items="items"
      :print="print"
      show-description
    />

  </div>
</template>

<script>
import Btn from '@/components/Btn';
import DetailItems from './DetailItems';

export default {
  components: { Btn, DetailItems },
  props: {
    print: Boolean,
    items: Array,
    price: Number
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
</style>
