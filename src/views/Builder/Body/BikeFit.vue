<template>
  <div class="bike-fit">

    <div class="outline-bottom light--border pa-4">
      <h3 class="display-2 bb-primary--text mb-3">
        FREE INITIAL CONSULTATION
      </h3>
      <p>We recognise that building your dream bike can be a significant investment.</p>
      <p>
        Once you've created your build online we offer a free 1 hour consultation in-store to ensure that
        the bike you've chosen will fit you and suit your aims and requirements, and to establish which
        contact points will work best.
      </p>
      <p>
        Can't get to us in person, or don't have fit data? No problem! We offer a full menu of optional
        services, details below:
      </p>
      <h3 class="display-2 bb-primary--text mb-3">
        COMPLETE YOUR BUILD PACKAGE
      </h3>
      <p>
        Our online Builder base price gives an indication of the total price of your bike build.
        It assumes that we already have your bike fit data on file, or you are able to provide your
        own fit data.
      </p>
      <p>
        We offer a range of flexible options to complete your build. Contact us and we'll tailor a
        quote to your exact requirements.
      </p>
    </div>

    <div class="outline-bottom light--border pa-4">
      <h3 class="display-2 bb-primary--text mb-3">
        UPGRADE YOUR FIT:
      </h3>
      <p>
        Every bike we sell is unique, there is no selling what we have 'in stock' off of the shop floor.
        Each bike sale is a custom order, and we select and then order what is perfect for you.
      </p>
      <p>
        We're bike fit specialists, and a full Bespoke fit is the best way to ensure that your new bike
        will allow you to perform at your best, remain comfortable and injury free.
      </p>
      <p>
        To ensure the perfect fit on your new bike we offer an in-depth full Bespoke Bike Fit for an
        additional £350. Read more about our bike fit service below:
      </p>
      <Btn class="body-1" color="bb-primary" @click="$emit('read-more.bike-fitting')" tile outlined>
        Read More about bike fitting
      </Btn>
    </div>

    <div class="outline-bottom light--border pa-4">
      <h3 class="display-2 bb-primary--text mb-3">
        HANDOVER AND FINAL FIT
      </h3>
      <p>
        Our in-store handover service is a lot more than just presenting you with a bike!
        We spend time ensuring that the fit is 100% correct and as expected,
        take you through the build in detail, and make any final adjustments as required.
        A final fit session is available for an additional £100 when ordering via the Bike Builder.
      </p>
    </div>

    <div class="outline-bottom light--border pa-4">
      <h3 class="display-2 bb-primary--text mb-3">
        DELIVERY
      </h3>
      <p>
        We regularly deliver bikes across the UK and worldwide. Ask us for a quote for fully insured
        specialist courier delivery to your home or work address, from as little as £60.
      </p>
    </div>

  </div>
</template>

<script>
  import { Btn } from '@/components';
  export default {
    components: {
      Btn
    }
  }
</script>

<style>
  .bike-fit {
    position: absolute;
    top: 0; left: 0;
    right: 0; bottom: 0;
    overflow: auto;
  }
  @media ( max-width: 966px ) {
    .bike-fit {
      position: static;
      overflow: visible;
    }
  }
</style>
