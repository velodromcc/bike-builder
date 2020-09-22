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
        class="outline light--border" width="40" height="40"
        :color="!chatVisibility ? (chatOnline ? 'success' : 'error') : 'bb-primary'"
        :dark="chatVisibility"
        :fab="chatVisibility"
        :icon="!chatVisibility"
        @click="$emit('message')"
      >
        <v-icon v-text="chatWritting ? 'mdi-chat-processing-outline' : 'mdi-chat-outline'"/>
        <v-badge
          class="mb-5"
          color="success"
          :content="chatMessages"
          :hidden="chatVisibility || !chatMessages"
          bordered
        />
      </Btn>

    </nav>

    <v-spacer class="footer-spacer"/>

    <div class="footer-srp">
      <p class="caption mb-0" style="line-height:1.4;">SRP</p>
      <p class="display-4 bb-primary--text mt-n1 mb-0">{{ price }} €</p>
    </div>

    <Btn class="footer-enquire body-1" color="bb-secondary" @click="$emit('form')" height="40" tile dark>
      <v-icon left v-text="'mdi-send'"/>
      Enquire about this build
    </Btn>

  </footer>
</template>

<script>

  import { Btn } from '@/components';

  export default {
    components: { Btn },
    props: {
      price: {
        type: Number,
        default: 0
      },
      chatMessages: {
        type: Number,
        default: 0
      },
      chatWritting: Boolean,
      chatOnline: Boolean,
      chatVisibility: Boolean
    }
  }
</script>

<style>

  .builder-footer {
    display: -webkit-flex;
    display: flex;
  }
  .footer-srp {
    text-align: right;
    margin-right: 16px;
  }
  .footer-srp > p.caption {
    line-height: 1.4;
    font-size: .6rem !important;
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
  @media ( max-width: 1120px ) {
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
  @media ( max-width: 966px ) {
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
  @media ( max-width: 520px ) {
    .footer-details {
      width: 100%;
      margin-bottom: 8px;
    }
  }
</style>
