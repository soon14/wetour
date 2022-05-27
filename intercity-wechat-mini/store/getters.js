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
  isLogin: state => state.user.isLogin,
  userInfo: state => state.user.userInfo,
  orderUser: state => state.user.orderUser,
  userPhone: state => state.user.userPhone,
  invoiceData: state => state.user.invoiceData,
  receiptData: state => state.user.receiptData,
  lineDetail: state => state.line.lineDetail,
}
export default getters
