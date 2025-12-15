<template>
  <header class="builder-header">
    
    <!-- TOP BAR (Desktop Only) -->
    <div class="header-top hidden-sm-and-down">
      <div class="header-top-content">
        <nav class="header-nav">
          <ul class="nav-list">
            <li><a href="#" @click.prevent="$emit('click:menu')">Shop</a></li>
            <li><a href="https://global.velodrom.cc/">Locations</a></li>
            <li><a href="https://global.velodrom.cc/stories">Stories</a></li>
            <li><a href="https://global.velodrom.cc/es/taller-bicicletas-barcelona-workshop/">Workshop</a></li>
            <li><a href="https://global.velodrom.cc/velodrom-travel">Bike Rental/Travel</a></li>
            <li><a href="https://velodrom.dreambikebuilder.com/">Bike Builder</a></li>
            <li><a href="/pages/contact">Contact</a></li>
          </ul>
        </nav>
        
        <a v-if="accountLink" :href="accountLink" class="account-link">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="icon icon-account-2" fill="inherit" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
          </svg>
        </a>
      </div>
    </div>

    <!-- BOTTOM BAR (Logo + Mobile Elements) -->
    <div class="header-bottom outline-bottom light--border">
      
      <!-- Mobile: Hamburger -->
      <Btn
        class="hidden-md-and-up ml-2"
        color="black"
        width="40" height="40"
        @click="$emit('click:menu')"
        :ripple="false"
        text icon
      >
        <v-icon size="28">mdi-menu</v-icon>
      </Btn>

      <!-- Logo (Centered on Desktop, or Left aligned? User said "below ... header line with the logo") -->
      <!-- Standard Velodrom site has logo left/center. Let's keep it left for bottom bar as in the screenshot -->
      <div class="logo-container">
        <Logo/>
      </div>
      
      <v-spacer class="hidden-md-and-up"/>

      <!-- Mobile: Account Icon -->
      <Btn
        v-if="accountLink"
        class="hidden-md-and-up mr-2"
        color="black"
        width="40" height="40"
        :href="accountLink"
        :ripple="false"
        text icon
      >
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="icon icon-account-2" fill="inherit" viewBox="0 0 24 24" style="width: 24px; height: 24px;">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
        </svg>
      </Btn>

    </div>

  </header>
</template>

<script>

  import { Btn, Logo } from '@/components';

  export default {
    components: { Btn, Logo },
    props: {
      accountLink: String
    }
  }
</script>

<style lang="scss">
  /* Import Montserrat to approximate Proxima Nova */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap');

  /* Layout & Positioning */
  .builder-header {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    z-index: 5;
    background: white;
  }

  /* TOP BAR */
  .header-top {
    background-color: #F5F5F5; /* Keep grey as requested by user ("header in grey") */
    height: 32px;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #e5e5e5;
  }
  .header-top-content {
    width: 100%;
    /* Remove max-width to allow full bleed right alignment if desired, or keep generic site max-width */
    padding: 0 40px; /* Increase side padding */
    display: flex;
    align-items: center;
    justify-content: flex-end; /* Strictly right aligned */
  }
  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    
    li {
      margin-left: 25px; /* More spacing */
      
      a {
        text-decoration: none;
        color: rgba(18, 18, 18, 0.75); /* Scraped color */
        font-size: 12px; /* Updated to 12px as requested/observed */
        text-transform: uppercase;
        font-weight: 500; /* Slightly bolder than 400 for legibility on grey */
        font-family: 'Proxima Nova', 'Montserrat', sans-serif; /* Add Proxima Nova to stack */
        letter-spacing: 1px; /* More spacing */
        transition: color 0.2s;
        
        &:hover {
          color: #000;
        }
      }
    }
  }
  .account-link {
    margin-left: 25px;
    text-decoration: none;
    display: flex;
    align-items: center;
    opacity: 0.75;
    &:hover { opacity: 1; }
    
    svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  }

  /* BOTTOM BAR */
  .header-bottom {
    height: 80px;
    display: flex;
    align-items: center;
    padding: 0 40px; /* Match top bar padding */
    background: white;
  }
  .logo-container {
    display: flex;
    align-items: center;
    /* Determine if logo needs offset */
  }

  /* RESPONSIVE ADJUSTMENTS */
  
  /* Desktop Body Offset */
  .builder-body, .builder-nav {
    top: 112px; /* 32px top + 80px bottom */
  }

  @media (max-width: 960px) { /* Tablet/Mobile */
    .header-bottom {
      height: 60px;
      padding: 0 20px;
      justify-content: space-between;
    }
    
    .builder-body, .builder-nav {
      top: 60px; /* Only bottom bar visible */
    }

    /* Center logo on mobile */
    .logo-container {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

</style>
