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
        priority: 0
      },
      {
        id: 'bars',
        title: 'Bars/Stem',
        items: items.bars,
        priority: 1
      },
      {
        id: 'groupsets',
        title: 'Groupsets',
        items: items.groupsets,
        priority: 2
      },
      {
        id: 'wheels',
        title: 'Wheels',
        items: items.wheels,
        priority: 3
      },
      {
        id: 'tyres',
        title: 'Tyres',
        items: items.tyres,
        priority: 4
      },
      {
        id: 'seatposts',
        title: 'Seatposts',
        items: items.seatposts,
        priority: 5
      },
      {
        id: 'saddles',
        title: 'Saddles',
        items: items.saddles,
        priority: 6
      }
    ]
  },
  mutations,
  actions
})
