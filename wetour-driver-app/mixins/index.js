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
		async chageList() {
			this.queryParams = {
				current: 1,
				size: 10,
			}
			this.list = []
			this.more = 'more'
			this.loadList()
		},

		/**
		 * @description: 加载列表
		 * @author: lcy
		 */
		async loadList() {
			const {
				list,
				more,
				queryParams,
				listKey
			} = this
			if (more !== 'more') return
			this.more = 'loading'
			console.log('cccccccccccc')
			try {
				const {
					code,
					data
				} = await this.loadListApi({
					...queryParams,
					...listKey
				})
				console.log(code, data, 3333333)
				if (code === 1001) {
					this.load()
				}
				uni.stopPullDownRefresh();
				if (code === 0) {
					queryParams.current++
					this.more = 'more'
					this.list = [...list, ...data.records]
					console.log("list", this.list);
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
			console.log(this.more, 33333)
			if (this.more === 'error') {
				this.more = 'more'
				this.loadList()
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
