import Loading from './Loading.vue';
import Error from './Error.vue';

const Builder = () => ({
  component: import('./Body/index.vue'),
  loading: Loading,
  error: Error
});

export default Builder;
