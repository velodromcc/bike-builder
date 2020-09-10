<template>
  <div v-if="company" v-html="company.finalHtml" class="bike-fit-content">

  </div>
</template>

<script>

  import { mapState } from 'vuex';

  export default {
    computed: mapState([ 'company' ])
  };
</script>

<style lang="scss">
  .bike-fit-content {
    section {
      margin: 0;
      padding: 16px;
      border-bottom: 1px solid var(--v-light-base);
    }
    section:last-child {
      border-bottom: 0;
    }
    h1, h2, h3 {
      font-family: "Open sans", Helvetica, Arial, sans-serif;
      letter-spacing: normal;
      color: var(--bb-primary) !important;
      margin-bottom: 12px !important;
    }
    h1 {
      font-size: 1.875rem;
      font-weight: 400;
      line-height: 1;
    }
    h2 {
      font-size: 1.875rem;
      font-weight: 300;
      line-height: 1;
    }
    h3 {
      font-size: 1.25rem;
      font-weight: 400;
      line-height: 1.2;
    }
    .v-btn {
      font-family: "Open sans", Helvetica, Arial, sans-serif !important;
      font-size: 0.75rem !important;
      letter-spacing: normal !important;
      color: var(--bb-primary) !important;
      box-shadow: none !important;
      text-transform: uppercase;
      font-weight: 400;
      line-height: 1.6;
      cursor: pointer;
      border-radius: 0;
      background-color: transparent;
      border: thin solid currentColor;
      padding: 6px 16px;
    }
  }
</style>
