import {requestApi} from '@/utils/request'
import to from '@/utils/to.js'
import config from "@/config.js"
import store from "@/store/index.js"

//校验令牌，若有效期小于半小时自动续期
export function oauthCheckToken(data) {
  return requestApi({
    url: `/auth/oauth/check_token`,
    method: "GET",
		headers: {
			isToken: false,
			Authorization: 'Basic cGlnOnBpZw=='
		},
		data
  })
}


