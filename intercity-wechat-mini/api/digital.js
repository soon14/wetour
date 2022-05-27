import {requestApi} from '@/utils/request'
//生成询价单
export function creatInquiry(data) {
  return requestApi({
		url: '/digital/api/inquiry',
		data: data,
		method: 'POST',
	})
}
//查看是否有新的报价 报价数量
export function getQuotes() {
  return requestApi({
    url: '/digital/api/users/quotes',
    method: 'GET',
  });
}

