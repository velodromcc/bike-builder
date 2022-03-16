import Vue from 'vue';
import Vuex from 'vuex';
import * as mutations from './mutations';
import * as actions from './actions';

Vue.use( Vuex );

export default new Vuex.Store({
  state: {
    loading: true,
    company: {},
    specialBuilds: [],
    framesets: [],
    bars: [],
    groupsets: [],
    wheels: [],
    tyres: [],
    seatposts: [],
    saddles: []
  },
  mutations,
  actions
})
