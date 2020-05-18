import Loader from './Loader.vue';
import Loading from './Loading.vue';
import Error from './Error.vue';

const TESTER = new Promise( resolve => {
  setTimeout(() => {
    console.log('loading!');
    resolve( Loader );
  }, 3000 );
});

const LoadingView = () => ({
  //component: import('./Loader.vue'),
  component: TESTER,
  loading: Loading,
  error: Error
});

export default LoadingView;
