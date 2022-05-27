<template>
	<view>
		<web-view :src="url" :progress="false"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
				title:''
			}
		},
		onLoad(res) {
			this.url = decodeURIComponent(res.url)
			this.title = res.title
		},
		onReady() {
			uni.setNavigationBarTitle({
				title:this.title
			})
		}
	}
</script>

<style>

</style>
