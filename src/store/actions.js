import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://bikebuilder.inmovens.com/api'
});

export function getData() {
  return instance.get( '/site/configuration/bikebuilder.inmovens.com' );
}

export function buyBike( ctx, params ) {
  return instance.get( '/site/buy', { params });
}
