<template>
	<u-popup v-model="visible" mode="center" border-radius="16" @close="close">
		<view class="tipView">
			<image :src="dialogData.type == 'success' ? successImg : errorImg" mode="" class="typeImg"></image>
			<view class="contentText" v-if="dialogData.content">
				{{dialogData.content}}
				<template v-if="time">({{num}})</template>
			</view>
			<view class="flex-between" v-if="dialogData.btns">
				<view class="cancelBtn" @click="cancel">
					{{dialogData.cancelButtonText}}
				</view>
				<view class="confirmBtn" @click="confirm">
					{{dialogData.confirmButtonText}}
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		data() {
			return {
				successImg: require('@/static/newImg/successImg.png'),
				errorImg: require('@/static/newImg/errorImg.png'),
				num: 0,
				time: null,
			}
		},
		props: {
			dialogData: {
				type: Object,
				default: () => ({
					index: 0,
					content: "1111111", //显示的文字内容
					type: 'success', //成功失败 以及显示的体表
					time: 0, //是否倒计时关闭
					btns: true, //默认显示按钮
					cancelButtonText: '取消', //取消按钮的文本内容	
					confirmButtonText: '确定' //确定按钮的文本内容		
				})
			},
			dialogVisible: {
				type: Boolean,
				default: false
			},

		},
		mounted() {
			console.log(6666666, '组件')
			if (this.dialogData.time) {
				this.num = this.dialogData.time
				this.time = setInterval(() => {
					this.num--
					if (this.num === 0) {
						clearInterval(this.time)
						this.time = null
						this.cancel()
					}
				}, 1000)
			}
		},
		computed: {
			visible: {
				get() {
					return this.dialogVisible;
				},
				set(val) {
					this.$emit("update:dialogVisible", val);
				}
			}
		},
		methods: {
			close() {
				if (this.time) {
					clearInterval(this.time)
					this.time = null
				}
				this.$emit('update:dialogVisible', false)
			},
			cancel() {
				this.close()
				this.$emit('close', this.dialogData.index)
			},
			confirm() {
				this.$emit('confirm', this.dialogData.index);
				this.close();
			},
		}
	}
</script>

<style scoped lang="scss">
	.tipView {
		width: 600rpx;
		padding: 60rpx 70rpx;
		text-align: center;
	}

	.typeImg {
		width: 128rpx;
		height: 128rpx;

		margin-bottom: 40rpx;
	}

	.contentText {
		@include fs(32rpx, 600, #272727, 45rpx);
		margin-bottom: 40rpx;
	}

	.cancelBtn {
		width: 200rpx;
		height: 80rpx;
		background: #FFFFFF;
		border: 1rpx solid #BDBDBD;
		opacity: 1;
		border-radius: 16rpx;
		@include fs(28rpx, 400, #555555, 78rpx);
		text-align: center;
	}

	.confirmBtn {
		width: 200rpx;
		height: 80rpx;
		background: #FFCC00;
		border: 1rpx solid #FFCC00;
		opacity: 1;
		border-radius: 16rpx;
		@include fs(28rpx, 400, #272727, 78rpx);
		text-align: center;
	}
</style>
