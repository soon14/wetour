const getters = {
	latitude: state => state.app.latitude,
	longitude: state => state.app.longitude,
	city_id: state => state.app.city_id,
	city_name: state => state.app.city_name,
	mytime: state => state.app.mytime,
	nowtime: state => state.app.nowtime,
	system_days: state => state.app.system_days,
	chartered_days: state => state.app.chartered_days,

	access_token: state => state.user.access_token,
	refresh_token: state => state.user.refresh_token,
	timeNode: state => state.user.timeNode,
	userInfo: state => state.user.userInfo,
	skipData: state => state.user.skipData,
	accountData:state => state.user.accountData,
	totalUnreadNumber: state => state.user.totalUnreadNumber,
	prefixMobile: state => state.user.prefixMobile,
}
export default getters
