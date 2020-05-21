import Vue from 'vue';
import Vuex from 'vuex';
import * as mutations from './mutations';
import * as actions from './actions';

Vue.use( Vuex );

export default new Vuex.Store({
  state: {
    loading: true,
    index: 0,
    data: [
      {
        title: 'Frameset',
        type: 'frameset',
        items: [
          {
            name: 'Wilier CENTO10NDR',
            image: '102293-wiliercento10ndr-render-01d.png',
            colors: [
              { name: 'Black bar tape', codes: [ '#2d85ac', '#e84131' ], image: '102293-wiliercento10ndr-render-01d.png' },
              { name: 'Black bar tape', codes: [ '#2d85ac', '#e84131' ], image: '102293-wiliercento10ndr-render-01d.png' },
              { name: 'Black bar tape', codes: [ '#2d85ac', '#e84131' ], image: '102293-wiliercento10ndr-render-01d.png' },
              { name: 'Black bar tape', codes: [ '#2d85ac', '#e84131' ], image: '102293-wiliercento10ndr-render-01d.png' },
              { name: 'Black bar tape', codes: [ '#2d85ac', '#e84131' ], image: '102293-wiliercento10ndr-render-01d.png' },
              { name: 'Black bar tape', codes: [ '#2d85ac', '#e84131' ], image: '102293-wiliercento10ndr-render-01d.png' }
            ]
          }
        ]
      }
    ]
  },
  mutations,
  actions
})
