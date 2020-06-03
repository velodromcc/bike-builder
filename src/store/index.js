import Vue from 'vue';
import Vuex from 'vuex';
import * as mutations from './mutations';
import * as actions from './actions';
import items from '@/assets/items';

Vue.use( Vuex );

export default new Vuex.Store({
  state: {
    loading: true,
    data: [
      {
        id: 'frameset',
        title: 'Frameset',
        items: items.frameset,
        order: 0,
        index: 0,
        scale: 1
      },
      {
        id: 'bars',
        title: 'Bars/Stem',
        items: items.bars,
        order: 1,
        index: 0,
        scale: 1
      },
      {
        id: 'groupsets',
        title: 'Groupsets',
        items: items.groupsets,
        order: 2,
        index: 0,
        scale: 1
      },
      {
        id: 'wheels',
        title: 'Wheels',
        items: items.wheels,
        order: 3,
        index: 0,
        scale: 1
      },
      {
        id: 'tyres',
        title: 'Tyres',
        items: items.tyres,
        order: 4,
        index: 0,
        scale: 1
      },
      {
        id: 'seatposts',
        title: 'Seatposts',
        items: items.seatposts,
        order: 5,
        index: 0,
        scale: 1
      },
      {
        id: 'saddles',
        title: 'Saddles',
        items: items.saddles,
        order: 6,
        index: 0,
        scale: 1
      }
    ]
  },
  mutations,
  actions
})
