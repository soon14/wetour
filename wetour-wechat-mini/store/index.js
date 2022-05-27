/*
 * @Description:
 * @Version:
 * @Autor: ljw
 * @Date: 2020-12-28 09:25:32
 * @LastEditors: ljw
 * @LastEditTime: 2021-07-06 09:50:39
 */
import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import line from './modules/line'

import getters from './getters.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    user,
		line,
  },
	getters
})
export default store
