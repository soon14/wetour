import storage from '@/utils/storage'
import {
	ACCESS_TOKEN,
	USER_INFO,
	TIME_NODE,
} from '@/store/mutation-types'
// import { Login, GetInfo } from '@/api/consumer.js'
import Vue from 'vue'
import {
	getUserInfo,
	refreshToken
} from "@/api/user.js"
const user = {
	state: {
		access_token: storage.get('access_token') || '',
		refresh_token: storage.get('refresh_token') || '',
		userInfo: storage.get('user_info') || {},
		// 登录信息获取时间节点
		timeNode: storage.get('timeNode') || '',
		//跳转时传递大数据
		skipData: storage.get('skipData') || {},
		//工作台总未读数
		totalUnreadNumber: storage.get('totalUnreadNumber') || 0,
		//缓存结算申请信息
		accountData: storage.get('accountData') || {},
		//获取区号
		prefixMobile: storage.get('prefixMobile') || {},
	},

	mutations: {
		SET_ACCESS_TOKEN: (state, access_token) => {
			state.access_token = access_token
			storage.set('access_token', access_token)
		},
		SET_REFRESH_TOKEN: (state, refresh_token) => {
			state.refresh_token = refresh_token
			storage.set('refresh_token', refresh_token)
		},
		SET_INFO(state, userInfo) {
			state.userInfo = userInfo
			storage.set('user_info', userInfo)
		},
		SET_TIME_NODE(state, value) {
			state.timeNode = value
			storage.set('timeNode', value)
		},
		SET_SKIPDATA: (state, data) => {
			state.skipData = data
			storage.set('skipData', data)
		},
		SET_TOTALUNREADNUMBER: (state, number) => {
			state.totalUnreadNumber = number
			storage.set('totalUnreadNumber', number)
		},
		SET_ACCOUNTDATA: (state, data) => {
			state.accountData = data
			storage.set('accountData', data)
		},
		SET_PREFIXMOBILE: (state, data) => {
			state.prefixMobile = data
			storage.set('prefixMobile', data)
		},
	},

	actions: {
		setTimeNode({
			commit
		}, time) {
			return new Promise((resolve, reject) => {
				console.log("time", time)
				commit('SET_TIME_NODE', `${time}`)
				resolve()
			})
		},
		// async getTimeNode({
		// 	commit,
		// 	state
		// }) {
		// 	// const {
		// 	// 	code,
		// 	// 	data
		// 	// } = await getUserInfo()
		// 	// if (code === 0) commit('SET_INFO', data)

		// 	 state.timeNode 
		// },
		setToken({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				commit('SET_ACCESS_TOKEN', `${data.access_token}`)
				commit('SET_REFRESH_TOKEN', `${data.refresh_token}`)
				resolve()
			})
		},
		remoToken({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				commit('SET_ACCESS_TOKEN', '')
				commit('SET_REFRESH_TOKEN', '')
				resolve()
			})
		},
		refreshToken({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				console.log("state==>", state.refresh_token)
				console.log("state==>", state.access_token)
				refreshToken(state.refresh_token).then(response => {
					const data = response.data;
					console.log("data", data);
					commit('SET_ACCESS_TOKEN', data.access_token);
					commit('SET_REFRESH_TOKEN', data.refresh_token);
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},
		async getUserInfo({
			commit
		}) {
			const {
				code,
				data
			} = await getUserInfo()
			if (code === 0) commit('SET_INFO', data)
		},
		setUserInfo({
			commit
		}, info) {
			return new Promise((resolve, reject) => {
				commit('SET_INFO', info)
				resolve()
			})
		},
		setSkipData({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				console.log("data", data);
				commit('SET_SKIPDATA', data)
				resolve()
			})
		},
		setTotalUnreadNumber({
			commit
		}, number) {
			return new Promise((resolve, reject) => {
				console.log("data", number);
				commit('SET_TOTALUNREADNUMBER', number)
				resolve()
			})
		},
		setAccountData({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				console.log("AccountData", data);
				commit('SET_ACCOUNTDATA', data)
				resolve()
			})
		},
		setPrefixMobile({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				console.log("PrefixMobile", data);
				commit('SET_PREFIXMOBILE', data)
				resolve()
			})
		},
	},
	namespaced: true,
}

export default user
