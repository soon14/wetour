// 加载列表
export const loadList = {
  data() {
    return {
      queryParams: {
        current: 1,
        size: 10,
      },
      list: [],
      more: 'more',
      timer: null,
    }
  },
  onLoad() {
    // this.loadList()
  },
  onPullDownRefresh() {
    this.queryParams = {
      current: 1,
      size: 10,
    }
    this.list = []
    this.more = 'more'
    this.loadList()
  },
  onUnload() {
    this.timer && clearTimeout(this.timer)
  },
  methods: {
    /**
     * @description: 加载列表
     * @author: lcy
     */
    async loadList() {
      const { list, more, queryParams,listKey } = this
      if (more !== 'more') return
      this.more = 'loading'
			console.log('cccccccccccc')
      try {
        const [err,{code,data}] = await this.loadListApi({ ...queryParams,...listKey })
				console.log(code,data,3333333)
				if(code === 1001) { this.load() }
				uni.stopPullDownRefresh();
		
        if (code === 0) {
          queryParams.current++
          this.more = 'more'
          this.list = [...list, ...data.records]
		  console.log("list",this.list)
          if (this.list.length >= data.total || !data.records.length)
            this.more = 'noMore'
						
        } else {
          this.more = 'error'
        }
				console.log(this.more)
      } catch (e) {
        this.more = 'error'
				uni.stopPullDownRefresh();
      }
    },
    /**
     * @description: 加载失败,点击重新加载数据
     * @author: lcy
     */
    manualLoad() {
			console.log(this.more,33333)
      if (this.more === 'error') {
        this.more = 'more'
        this.loadList()
      }
    },
  },
}

// 加载列表
export const newLoadList = {
  data() {
    return {
      queryParams: {
        page: 1,
        pagesize: 20,
      },
      list: [],
      more: 'more',
      timer: null,
			myLoading:false,
    }
  },
  onLoad() {
    // this.loadList()
  },
  onPullDownRefresh() {
    this.queryParams = {
      page: 1,
      pagesize: 20,
    }
    this.list = []
    this.more = 'more'
    this.loadList()
  },
  onUnload() {
    this.timer && clearTimeout(this.timer)
  },
  methods: {
    /**
     * @description: 加载列表
     * @author: lcy
     */
    async loadList() {
      const { list, more, queryParams,listKey } = this
      if (more !== 'more') return
      this.more = 'loading'
			this.myLoading = false
      try {
				uni.showLoading({
					title: '加载中',
				})
        const {data,code} = await this.loadListApi({ ...queryParams,...listKey })
				
				uni.hideLoading()
				this.myLoading = true
        if (code === 0) {
          queryParams.page++
          this.more = 'more'
          this.list = [...list, ...data]
          if (!data.length)
            this.more = 'noMore'
        } else {
          this.more = 'error'
        }
      } catch (e) {
				uni.hideLoading()
        this.more = 'error'
      }
    },
    /**
     * @description: 加载失败,点击重新加载数据
     * @author: lcy
     */
    manualLoad() {
      if (this.more === 'error') {
        this.more = 'more'
        this.loadList()
      }
    },
  },
}

import store from "@/store/index.js"
import {requestPost} from "@/utils/request.js" 
export const oldLoadList = {
  data() {
    return {
      start:1,
      list: [],
      more: 'more',
      timer: null,
			myLoading:false,
    }
  },
  onLoad() {
    // this.loadList()
  },
  onPullDownRefresh() {
    this.start = 1
    this.list = []
    this.more = 'more'
    this.loadList()
  },
  onUnload() {
    this.timer && clearTimeout(this.timer)
  },
  methods: {
    /**
     * @description: 加载列表
     * @author: lcy
     */
    async loadList() {
			console.log(66666666)
      const { list, more, start,listKey,apiUrl } = this
      if (more !== 'more') return
      this.more = 'loading'
			this.myLoading = false
      try {
				uni.showLoading({
					title: '加载中',
				})
				let _this = this
				let data = { start:start,user_id:store.state.user.userInfo.id,...listKey }
				requestPost(apiUrl,data,function (res) {
					uni.hideLoading()
					_this.start = _this.start+1
					_this.more = 'more'
					_this.list = [...list, ...res]
					if (!res.length)
					  _this.more = 'noMore'
				})
				// console.log(888888,res)
				
				// console.log(res,3333)
				// this.myLoading = true
				// let status = 1
    //     if (status === 2000) {
    //       start++
    //       this.more = 'more'
    //       this.list = [...list, ...data]
    //       if (!data.length)
    //         this.more = 'noMore'
    //     } else {
    //       this.more = 'error'
    //     }
      } catch (e) {
				uni.hideLoading()
        this.more = 'error'
      }
    },
    /**
     * @description: 加载失败,点击重新加载数据
     * @author: lcy
     */
    manualLoad() {
      if (this.more === 'error') {
        this.more = 'more'
        this.loadList()
      }
    },
  },
}

import {grant_login} from "@/api/user.js"
export const app = {
  methods: {
    WxLoginMixins: function (_cb, _is) {
			console.log(_cb, _is,'_cb, _is')
			let that = this;
			uni.login({
				success: function (res) {
					console.log(res);
					if (res.code) {
						uni.setStorageSync('js_code', res.code);
						if (_is === true) {
							if (typeof _cb === 'function') _cb(res.code);
						} else {
							that.GetSessionMixins(res.code, _cb);
						}
					} else {
						console.log('uni.login登录失败：' + res.errMsg);
						if (typeof _cb === 'function') _cb(false);
					}
				}, fail: function () {
					console.log('uni.login登录失败.');
					if (typeof _cb === 'function') _cb(false);
				}
			});
		},
		GetSessionMixins: function(_js_code, _cb) {
			let that = this;
			let data = { "js_code": _js_code };
			console.log('app.GetSession请求内容');
			console.log(data);
			grant_login(data).then( _json => {
				console.log('app.GetSession响应结果');
				console.log(_json);
	
				if (typeof _json === 'boolean') {
					if (typeof _cb === 'function') _cb(false);
				} else if (typeof _json === 'number') {
					if (typeof _cb === 'function') _cb(false);
				} else if (typeof _json === 'object') {
					uni.setStorageSync('openid', _json.data.openid);
					uni.setStorageSync('session_key', _json.data.session_key);
					if (typeof _cb === 'function') _cb(_json);
				} else {
					if (typeof _cb === 'function') _cb(false);
				}
			});
		},
		CheckSessionMixin (_cb) {
			let that = this;
			let code = uni.getStorageSync('js_code');
			let sess = uni.getStorageSync('session_key');
			let open = uni.getStorageSync('openid');
			if (!code || !sess || !open) {
				console.log('checkSession校验失败，js_code不存在');
				if (typeof _cb === 'function') _cb(false);
			} else {
				uni.checkSession({
					success() {
						//session_key 未过期，并且在本生命周期一直有效
						console.log('checkSession校验成功');
						if (typeof _cb === 'function') _cb(code);
					},
					fail() {
						// session_key 已经失效，需要重新执行登录流程
						console.log('checkSession校验失败');
						if (typeof _cb === 'function') _cb(false);
					}
				});
			}
		},
  },
}

export const shareHome = {
  methods: {
    onShareAppMessage() {
			return null
    //     return {
    //       title: '分享',
    //       path: '/pages/home/index',
    //       imageUrl:
    //         '分享图片',
    //     }
      },
  },
}