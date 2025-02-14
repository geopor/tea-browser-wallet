import Vue from 'vue'
import App from './App.vue'

import './elementui-style/index.css';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import { Loading } from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';

import router from './router';
import './style.scss';

import store from './store';
import utils from './tea/utils';
import { _ } from 'tearust_utils';

import layer1_error_tips from './assets/error';
import strings from './assets/string';

import './filter';

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;



router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.needLogin) {
    const { layer1_account } = store.getters;
    if (!layer1_account) {
      next({ path: '/login_account' })
    }
  }

  next();
});

const C = {};
new Vue({
  router,
  store,
  methods: {
    isDev() {
      return true;
    },
    loading(f, text = 'Loading...') {
      if (f) {
        C._loading = Loading.service({
          lock: true,
          text: 'Loading...',
          customClass: 'c-fullscreen-loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      }
      else {
        C._loading && C._loading.close();
      }
    },
    showError(e, title = 'Error message') {
      const err = e.message || e.toString();
      const ex = _.get(layer1_error_tips, err, err);
      this.$alert(ex, title, {
        type: 'error'
      });
    },
    success(message='', type='success'){
      const title = {
        'success': 'Success',
        'error': 'Error',
      }[type];
      this.$notify({
        title: title || '',
        message,
        customClass: 'tea-notify',
        type,
        duration: 2500
      });
    },
    str(key){
      return _.get(strings, key, key);
    },
    goPath(path, type="push"){
      this.$router[type](path).catch(()=>{});
    }
  },
  render: h => h(App),
}).$mount('#app');
