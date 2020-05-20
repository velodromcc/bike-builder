import View from './View.vue';
import Loading from './Loading.vue';
import Error from './Error.vue';

const TESTER = new Promise( resolve => {
  setTimeout(() => resolve( View ), 0 );
});

const Builder = () => ({
  //component: import('./Loader.vue'),
  component: TESTER,
  loading: Loading,
  error: Error
});

export default Builder;
