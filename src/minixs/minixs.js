import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
Vue.mixin({
  computed: {
    ...mapGetters([
      'getToken',
      'getUserInfo'
    ])
  },
  methods: {
    ...mapActions(['setToken', 'setUserInfo'])
  }
})