import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Loading: false //全局加载
  },
  getters: {},
  mutations: {
    setLoading(state, status) {
      state.Loading = status;
    }
  },
  actions: {}
});
