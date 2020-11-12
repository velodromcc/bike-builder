import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://velodrom.dreambikebuilder.com/api'
});

export function getData() {
  var host = window.host;
  if ( !host || host == 'localhost' ) {
    host = 'velodrom.dreambikebuilder.com';
  }
  console.log(host);
  return instance.get( '/site/configuration/'+ host );
}

export function buyBike( ctx, data ) {
  return instance.post( '/site/buy', data);
}
