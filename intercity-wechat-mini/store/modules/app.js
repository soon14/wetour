import storage from '@/utils/storage'
// import { Newest } from '@/api/app'

const app = {
  state: {
    latitude: storage.get('latitude') || '',
    longitude: storage.get('longitude') || '',
    city_id: storage.get('city_id') || '',
    city_name: storage.get('city_name') || '',
		mytime: storage.get('mytime') || '',
		nowtime: storage.get('nowtime') || '',
		system_days: storage.get('system_days') || '',
		chartered_days: storage.get('chartered_days') || '',
    // newestVersion: storage.get(NEWEST_VERSION),
  },

  mutations: {
    SET_LATITUDE(state, latitude) {
      state.latitude = latitude
      storage.set('latitude', latitude)
    },
		SET_LOGITUDE(state, longitude) {
		  state.longitude = longitude
		  storage.set('longitude', longitude)
		},
		SET_CITYID(state, city_id) {
		  state.city_id = city_id
		  storage.set('city_id', city_id)
		},
		SET_CIITYNAME(state, city_name) {
		  state.city_name = city_name
		  storage.set('city_name', city_name)
		},
		
		
		SET_MYTIME(state, time) {
		  state.mytime = time
		  storage.set('mytime', time)
		},
		SET_NOWTIME(state, time) {
		  state.nowtime = time
		  storage.set('nowtime', time)
		},
		
		SET_SYSTEDAYS(state, day) {
		  state.system_days = day
		  storage.set('system_days', day)
		},
		SET_CHARTEREDAYS(state, day) {
		  state.chartered_days = day
		  storage.set('chartered_days', day)
		},
  },

  actions: {
    setLatitude({ commit },latitude) {
      commit('SET_LATITUDE', latitude)
    },
		setLongitude({ commit },longitude) {
		  commit('SET_LOGITUDE', longitude)
		},
		setCityId({ commit },city_id) {
		  commit('SET_CITYID', city_id)
		},
		setCityName({ commit },city_name) {
		  commit('SET_CIITYNAME', city_name)
		},
		setMyTime({ commit },time) {
		  commit('SET_MYTIME', time)
		},
		setNowTime({ commit },time) {
		  commit('SET_NOWTIME', time)
		},
		setSystemDays({ commit },day) {
		  commit('SET_SYSTEDAYS', day)
		},
		setCharteredDays({ commit },day) {
		  commit('SET_CHARTEREDAYS', day)
		},
		
		
  },
  namespaced: true,
}

export default app
