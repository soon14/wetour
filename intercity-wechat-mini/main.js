
import Vue from 'vue'
import App from './App'
import store from './store'
import uniNavBar from '@/components/uni-nav-bar.vue'
import uniLoadMore from '@/components/uni-load-more.vue'
import "@/styles/common.scss"
import uView from 'uview-ui'
Vue.component('uniNavBar', uniNavBar)
Vue.component('uniLoadMore', uniLoadMore)
Vue.use(uView)
Vue.config.productionTip = false
// import { requestApi } from './utils/api.js'
import to from './utils/to.js'
// Vue.prototype.$requestApi = requestApi
Vue.prototype.$to = to
App.mpType = 'app'
const app = new Vue({
  ...App,
  store,
})
app.$mount()
