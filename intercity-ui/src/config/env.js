// 配置编译环境和线上环境之间的切换

const env = process.env
const baseUrl = ''
// 图表库为avue和pig2套地址
const iconfontVersion = ['667895_v7uduh4zui', '1638883_g2ywtlub7ef']
const iconfontUrl = '//at.alicdn.com/t/font_$key.css'
const codeUrl = `${window.location.origin}/code`
const actUrl = `${window.location.origin}/act/modeler.html?modelId=`
let configMqtt = process.env.VUE_APP_MQTT
let configCode = process.env.VUE_APP_CODE
let configUrl = process.env.VUE_APP_URL
console.log(env,process.env,process.env.MQTT_TYPE,'--------')
// if (env.NODE_ENV === 'development') {
//   configMqtt = 'test'
// } else if (env.NODE_ENV === 'production') {
//   configMqtt = 'prod'
// } else if (env.NODE_ENV === 'test') {
//   configMqtt = 'test'
// }

export {
  baseUrl,
  actUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env,
  configMqtt,
  configCode,
  configUrl,
}
