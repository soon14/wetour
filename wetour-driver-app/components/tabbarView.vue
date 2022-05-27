<template>
	<u-tabbar :list="tabBar" bg-color="#ffffff" active-color="#272727" inactive-color="#555555">
	</u-tabbar>
	<!-- 	:before-switch="beforeSwitch"
		@change="changeEvent()"  -->
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			...mapGetters(['totalUnreadNumber']),
			tabBar(){
				return [{
						// pagePath(需以"/"开头)属性即可
						count: this.totalUnreadNumber,
						isDot: false,
						text: '工作台',
						customIcon: false,
						pagePath: "/pages/index/index",
						iconPath: require("@/static/tabBar/tab_work.png"),
						selectedIconPath: require("@/static/tabBar/tab_work_select.png"),
					},
					{
						text: '司机车辆',
						pagePath: "/pages/driverCart/index",
						iconPath: require("@/static/tabBar/tab_cart.png"),
						selectedIconPath: require("@/static/tabBar/tab_cart_select.png"),

						// 在此配置midButton: true   在<u-tabbar 标签内配置  :mid-button="true"  表示此项为凸起按钮项
						// midButton: true,
					},
					{
						text: '个人中心',
						pagePath: "/pages/user/index",
						iconPath: require("@/static/tabBar/tab_personal.png"),
						selectedIconPath: require("@/static/tabBar/tab_personal_select.png"),
					},
				]
			},
		},
	}
</script>

<style scoped lang="scss">
	.u-tabbar {
		/deep/ .u-tabbar__content {
			border-top: 1rpx solid #DBDBDB;
		}
	}
</style>
