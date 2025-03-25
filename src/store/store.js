import Vue from 'vue';
import Vuex from 'vuex';
import userState from './user';
import sysState from "./sys";
import chatState from "./chat";
import styleState from "./style"
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userState,
    sysState,
    chatState,
    styleState
  }
});