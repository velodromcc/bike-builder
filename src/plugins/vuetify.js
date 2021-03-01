import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import es from 'vuetify/es5/locale/es';

Vue.use(Vuetify);

export default new Vuetify({
  breakpoint: {
    thresholds: {
      xs: 600,
      sm: 1024,
      md: 1280,
      lg: 1920
    }
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#000000',
        secondary: '#4d4d4d',
        light: '#e6e6e6',
        //accent: '#82B1FF',
        //error: '#FF5252',
        //info: '#2196F3',
        //success: '#4CAF50',
        //warning: '#FFC107'
      },
    },
  },
  lang: {
    locales: { es },
    current: 'es',
  },
});
