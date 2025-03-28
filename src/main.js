import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from "@/store/store.js";
import '@/minixs/minixs.js';
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
