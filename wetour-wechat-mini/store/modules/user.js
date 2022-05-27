import storage from '@/utils/storage'
import {
  ACCESS_TOKEN,
  USER_INFO,
  CAPITAL_VISIBLE,
  TIME_NODE,
	NEW_ITEM,
	ORDER_ITEM,
} from '@/store/mutation-types'
// import { Login, GetInfo } from '@/api/consumer.js'
import Vue from 'vue'
	import { tokenSocial, getUserInfo , userBindPhone } from "@/api/user.js"
console.log(storage.get('user_phone'),"storage.get('user_phone')")
const user = {
  state: {
    access_token: storage.get('access_token') || '',
    refresh_token: storage.get('refresh_token') || '',
    isLogin: storage.get('isLogin') || '',
    userInfo: storage.get('user_info') || {},
		userPhone: storage.get('user_phone') || '',
    // 登录信息获取时间节点
    timeNode: storage.get('timeNode') || '',
		invoiceData:storage.get('invoice_data') || {},
		receiptData: storage.get('receiptData') || {},
		orderUser: storage.get('order_user') || {},
		Historical:  storage.get('Historical') || [],
		orderInfo:{},
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      storage.set('token_', token)
    },
		SET_ACCESS_TOKEN: (state, access_token) => {
			state.access_token = access_token
			storage.set('access_token', access_token)
		},
		SET_REFRESH_TOKEN: (state, rfToken) => {
			state.refresh_token = rfToken
			storage.set('refresh_token', rfToken)
		},
		SET_LOGIN(state, isLogin) {
      state.isLogin = isLogin
      storage.set('isLogin', isLogin)
    },
    SET_INFO(state, userInfo) {
      state.userInfo = userInfo
      storage.set('user_info', userInfo)
    },
	SET_ORDERUSER(state, info) {
      state.orderUser = info
      storage.set('order_user', info)
    },
		SET_USERPHONE(state, userPhone) {
      state.userPhone = userPhone
      storage.set('user_phone', userPhone)
    },
    SET_CAPITAL_VISIBLE(state, value) {
      state.capitalVisible = value
      storage.set(CAPITAL_VISIBLE, value)
    },
    SET_TIME_NODE(state, value) {
      state.timeNode = value
      storage.set('timeNode', value)
    },
		SET_NEWITEM: (state, data) => {
		  state.newItem = data
			storage.set(NEW_ITEM, data)
		},
		SET_ORDERITEM: (state, data) => {
		  state.orderItem = data
			storage.set(ORDER_ITEM, data)
		},
		SET_INVOICE: (state, data) => {
		  state.invoiceData = data
			storage.set('invoice_data', data)
		},
		SET_RECEIPTDATA: (state, data) => {
		  state.receiptData = data
			storage.set('receiptData', data)
		},
		SET_HISTORICAL: (state, data) => {
			let Historical = state.Historical
			let k = -1
			Historical.forEach((item,key)=>{
				if(item.label.content == data.label.content){
					k = key
				}
			})
			if(k != -1){
				Historical.splice(k,1)
				
			}else if(state.Historical.length == 0){
				
			}else if(Historical.length >= 5){
				Historical = Historical.splice(0,4)
			}
			Historical.unshift(data)
			state.Historical = Historical
			storage.set('Historical', Historical)
			// state.Historical = data
			// storage.set('receiptData', data)
		},
		SET_ORDERINFO: (state, data) => {
		  state.orderInfo = data
		},
  },

  actions: {
    login({ commit }, params) {
      return new Promise(async (resolve, reject) => {
        try {
          const { code, data } = await Login(params)
					// const { code, data } = await Vue.prototype.$requestApi({
					// 	url: '/api/App/Consumer/WeChatLogin',
					// 	method:'POST',
					// 	data:params
					// })
          if (code === 200) {
            commit('SET_TOKEN', `${data.token_Type} ${data.access_Token}`)
            const { code: code2, data: data2 } = await GetInfo()
            // const { code: code2, data: data2 } = await Vue.prototype.$requestApi({
						// 	url: '/api/App/Consumer/CompleteInfo',
						// 	method:'POST',
						// })
            if (code2 === 200) {
              commit('SET_INFO', data2)
              resolve()
            } else {
              reject()
            }
          } else {
            reject()
          }
        } catch (err) {
          reject(err)
        }
      })
    },
    LogOut({commit}) {
			return new Promise((resolve, reject) => {
				// logout().then(() => {
					commit('SET_ACCESS_TOKEN', '')
					commit('SET_REFRESH_TOKEN', '')
					resolve()
				// }).catch(error => {
				// 	reject(error)
				// })
			})
		},
		setToken({ commit },data) {
			return new Promise((resolve, reject) => {
				commit('SET_ACCESS_TOKEN', `${data.access_token}`)
				commit('SET_REFRESH_TOKEN', `${data.refresh_token}`)
				resolve()
			})
		},
		remoToken({ commit },data) {
			return new Promise((resolve, reject) => {
				commit('SET_ACCESS_TOKEN', '')
				commit('SET_REFRESH_TOKEN', '')
				resolve()
			})
		},
		setLogin({ commit },isLogin) {
			return new Promise((resolve, reject) => {
				commit('SET_LOGIN', `${isLogin}`)
				resolve()
			})
		  
		},
    async getUserInfo({ commit }) {
      const { code, data } = await getUserInfo()
      if (code === 0) commit('SET_INFO', data)
    },
		setUserInfo({ commit },info) {
			return new Promise((resolve, reject) => {
				commit('SET_INFO', info)
				resolve()
			})
		},
		orderUser({ commit },info) {
			return new Promise((resolve, reject) => {
				commit('SET_ORDERUSER', info)
				resolve()
			})
		},
		// 刷新token
		RefreshToken({commit, state}) {
			resolve()
			return false
			return new Promise((resolve, reject) => {
				// refreshToken(state.refresh_token).then(response => {
				// 	const data = response.data
				// 	commit('SET_ACCESS_TOKEN', data.access_token)
				// 	commit('SET_REFRESH_TOKEN', data.refresh_token)
				// 	resolve()
				// }).catch(error => {
				// 	reject(error)
				// })
			})
		},
		getWxCode({commit, state},bol){
			return new Promise((resolve, reject) => {
				// if(!state.access_token || bol){
					uni.login({
					  provider: 'weixin',
					  success: ({ code }) => {
							tokenSocial(code).then(res=>{
								console.log(res,333,'res,3333')
								if(res.access_token){
									commit('SET_ACCESS_TOKEN', `${res.access_token}`)
									commit('SET_REFRESH_TOKEN', `${res.refresh_token}`)
									resolve()
								}
							})
					  },
					  complete: _ => {
					  },
					})
				// }else{
				// 	resolve()
				// }
			})
		},
		setHistorical({commit, state},obj){
			return new Promise((resolve, reject) => {
				console.log(obj)
				commit('SET_HISTORICAL', obj)
				resolve()
			})
		},
		setOrderInfo({commit, state},data){
			return new Promise((resolve, reject) => {
				commit('SET_ORDERINFO', data)
				resolve()
			})
		},
  },
  namespaced: true,
}

export default user
