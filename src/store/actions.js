import axios from 'axios';
import { CONSTANTS } from '@/utils';

const instance = axios.create({
  baseURL: `https://${CONSTANTS.host}/api`
});

export function getData() {
  var host = window.host;
  if ( ! host || host == 'localhost' ) host = CONSTANTS.host;
  return instance.get( '/site/configuration/'+ host );
}

export function buyBike( ctx, data ) {
  return instance.post( '/site/buy', data );
}
