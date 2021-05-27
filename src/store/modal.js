import _ from 'lodash';

import utils from '../tea/utils';

const initState = ()=>{
  return {
    put_to_auction_store: {
      visible: false,
      param: {},
    },

  };
}

export default {
  namespaced: true,

  state: initState(),
  mutations: {
    open(state, params){
      const {key, cb, param} = params;
      if(!_.isUndefined(state[key])){
        _.set(state, key, {
          visible: true,
          param,
        });

        utils.mem.set(key, cb);
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
  }
};