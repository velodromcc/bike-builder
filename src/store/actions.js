import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://bikebuilder.inmovens.com/api'
});

export function getData() {
  var host = window.host;
  if ( !host || host == 'localhost' ) {
    host = 'bikebuilder.inmovens.com';
  }
  console.log(host);
  return instance.get( '/site/configuration/'+ host );
}

export function buyBike( ctx, data ) {
  return instance.post( '/site/buy', data);
}
