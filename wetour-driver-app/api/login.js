import {requestApi} from '@/utils/request'
//获取验证码
export function getcode(mobile) {
  return requestApi({
    url: `/wetour/app/partner/sendcode/${mobile}`,
    data: {},
    method: "GET"
  })
}

//登录/注册
export function login(data) {
  return requestApi({
    url: `/auth/mobile/token/sms?mobile=${data.mobile}&code=${data.code}&grant_type=mobile`,
    data: {},
    method: "POST",
    header: {
     'Authorization': 'Basic d2V0b3VyLXBhcnRuZXItYXBwOndldG91ci1wYXJ0bmVyLWFwcA=='
    }
  })
}



//用户详情
export function getDetail() {
  return requestApi({
    url: `/wetour/app/partner/1`,
    data: {},
    method: "GET"
  })
}

//更新详情
export function changeDetail(data) {
  return requestApi({
    url: `/wetour/app/partner`,
    data: data,
    method: "PUT"
  })
}
//国家列表
export function getCountry(data) {
  return requestApi({
    url: `/wetour/app/city/country`,
    data: {},
    method: "GET"
  })
}
//城市列表
export function getCity(data) {
  return requestApi({
    url: `/wetour/app/city/page`,
    data: data,
    method: "GET"
  })
}