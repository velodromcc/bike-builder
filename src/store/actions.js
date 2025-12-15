import axios from 'axios';
import { CONSTANTS } from '@/utils';

const instance = axios.create({
  baseURL: `https://${CONSTANTS.host}/api`
});

export function getData() {
  var host = window.location.host;
  // If localhost OR Render, use the hardcoded host
  if (!host || host.indexOf('localhost') !== -1 || host.indexOf('onrender.com') !== -1) {
    host = CONSTANTS.host;
  }
  return instance.get('/site/configuration/' + host);
}

export function buyBike(ctx, data) {
  // Use local server for emails (relative path for production)
  return axios.post('/api/send-email', data);
}
