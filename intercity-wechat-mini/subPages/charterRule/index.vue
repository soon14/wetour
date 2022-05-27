<template>
	<web-view :src="url"></web-view>
</template>

<script>
	// import config from "@/config"
	export default {
		data() {
			return {
				// url: "https://work.weixin.qq.com/kfid/kfc9fb907d29cc8ec94"
				url:"https://www13.53kf.com/webCompany.php?arg=10569701&style=3&code_arg=5d38c8b3d25edcef6f15be87b84041a35"
			}
		},
		onLoad: function(options) {
			console.log(options, 444444444)
			// let h5url  = config.h5url;
			// let url = h5url + '/rules/charted/chartedrule.html'
			// this.url = options.url
			// console.log("====>"+url)
			// uni.setNavigationBarTitle({
			// 	title: '包车规则'
			// })
		},
	}
</script>

<style>
</style>
