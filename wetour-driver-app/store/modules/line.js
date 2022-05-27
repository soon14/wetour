import storage from '@/utils/storage'
// import { Newest } from '@/api/app'

const app = {
	state: {
		lineDetail: storage.get('lineDetail') || {},
		// newestVersion: storage.get(NEWEST_VERSION),
	},

	mutations: {
		SET_LINEDETAIL(state, obj) {
			state.lineDetail = obj
			storage.set('lineDetail', obj)
		},
	},
	actions: {
		setLineDetail({
			commit
		}, obj) {
			commit('SET_LINEDETAIL', obj)
		},
	},
	namespaced: true,
}

export default app
