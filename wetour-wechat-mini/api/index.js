import {requestApi} from '@/utils/request'
import to from '@/utils/to.js'
import config from "@/config.js"
import store from "@/store/index.js"
// 旅游页面推荐
export function linePage(data) {
  return to(
		requestApi({
		  url: '/user/line/page',
		  data: data,
		  method: "GET"
		})
	)
}

export function getLineDetail(data) {
	return requestApi({
		url: `/user/line/${data.id}`,
		// data: data,
		method: "GET"
	})
}
