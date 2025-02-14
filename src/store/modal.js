import _ from 'lodash';

import utils from '../tea/utils';

const initState = ()=>{
  return {
    put_to_auction_store: {
      visible: false,
      param: {},
    },
    bid_for_auction: {
      visible: false,
      param: {},
    },
    data_details: {
      visible: false,
      title: '',
      param: {}
    },
    transfer_balance: {
      visible: false,
      param: {}
    },
    log_details: {
      visible: false,
      param: {}
    },

    common_tx: {
      visible: false,
      param: {},
    },
    staking_slot: {
      visible: false,
      param: {},
    },
    cml_details: {
      visible: false,
      param: {},
    }

  };
}

export default {
  namespaced: true,

  state: initState(),
  mutations: {
    open(state, params){
      const {key, cb, param} = params;
      if(!_.isUndefined(state[key])){
        const doc = {
          visible: true,
          param,
        };
        if(param.title){
          doc.title = param.title;
          doc.param = _.omit(param, 'title');
        }

        _.set(state, key, doc);

        cb && utils.mem.set(key, cb);
      }
    },
    close(state, key){
      if(!_.isUndefined(state[key])){
        _.set(state, key, {
          visible: false,
          param: {},
        });

        utils.mem.remove(key);
      }
    }
  },
  actions: {
    async open(store, opts){
      const {key, param} = opts;
      if(!key) throw 'Invalid open modal key.';

      if(key === 'staking_slot'){
        const len = param.list.length;
        param.list = await Promise.all(_.map(param.list, async (item, index)=>{
          item.weight = await utils.getStakingWeightByIndex(index, len);
          return item;
        }));
      }

      store.commit('open', opts);
    }
  },
};