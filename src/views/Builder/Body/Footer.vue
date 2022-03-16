<template>
  <footer class="builder-footer pa-4">

    <Btn class="footer-details body-1 mr-3" color="bb-secondary" @click="$emit('details')" height="40" tile outlined>
      <v-icon left v-text="'mdi-magnify'"/>
      Your build in detail
    </Btn>

    <nav class="footer-actions">

      <Btn class="outline light--border mr-3" color="bb-primary" width="40" height="40" @click="$emit('reset')" icon>
        <v-icon v-text="'mdi-restore'"/>
      </Btn>

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

    </nav>

    <v-spacer class="footer-spacer"/>

    <Price
      class="footer-srp"
      align="right"
      :price="price"
      :offer="specialBuild && specialBuild.price"
    />

    <Btn class="footer-enquire body-1" color="bb-secondary" @click="$emit('form')" height="40" tile dark>
      <v-icon left v-text="'mdi-send'"/>
      Enquire about this build
    </Btn>

  </footer>
</template>

<script>

  import { Btn, Price } from '@/components';

  export default {
    components: { Btn, Price },
    props: {
      specialBuild: Object,
      price: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style>

  .builder-footer {
    display: -webkit-flex;
    display: flex;
  }
  .footer-srp {
    margin-right: 16px;
  }
  .detail-image {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: contain;
  }
  .detail-price {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  @media ( max-width: 1160px ) {
    .builder-footer {
      display: block;
      border-top: 1px solid var(--v-light-base);
    }
    .footer-details, .footer-actions {
      float: left;
    }
    .footer-left, .footer-right {
      max-width: 350px;
      margin: 0 auto;
    }
    .footer-srp {
      float: right;
      text-align: left;
      margin: 8px 0;
    }
    .footer-srp > p {
      display: inline-block;
    }
    .footer-srp > p.caption {
      font-size: 1rem !important;
      margin-right: 10px;
    }
    .footer-srp > p.display-4 {
      font-size: 1.5rem !important;
    }
    .footer-enquire {
      margin-top: 8px;
      width: 100%;
    }
  }
  @media ( max-width: 1024px ) {
    .builder-footer {
      display: -webkit-flex;
      display: flex;
    }
    .footer-srp {
      float: none;
      margin-right: 16px;
    }
    .footer-enquire {
      margin-top: 0;
      width: auto;
    }
  }
  @media ( max-width: 760px ) {
    .builder-footer {
      display: block;
    }
    .footer-srp {
      float: right;
      text-align: left;
      margin: 8px 0;
    }
    .footer-enquire {
      margin-top: 8px;
      width: 100%;
    }
  }
  @media ( max-width: 540px ) {
    .builder-footer {
      text-align: right;
    }
    .footer-details {
      width: 100%;
      margin-bottom: 8px;
    }
    .footer-srp {
      float: none;
      display: inline-block;
    }
  }
</style>
