<template>
	<u-popup v-model="visible"  mode="center" border-radius="16" @close="close">
		<view class="tipView">
			<image :src="dialogData.type == 'success' ? successImg : errorImg" mode="" class="typeImg"></image>
			<view class="contentText" v-if="dialogData.title">
				{{dialogData.title}}
				<template v-if="time">({{num}})</template>
			</view>
			<view class="content" v-if="dialogData.content">
				{{dialogData.content}}
			</view>
			<view class="flex-center">
				<view class="confirmBtn" @click="confirm">
					{{dialogData.confirmButtonText}}
				</view>
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
	export default{
		data(){
			return {
				successImg:'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/newImg/successImg.png',
				errorImg:'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/newImg/errorImg.png',
				num : 0,
				time : null,
			}
		},
		props:{
			dialogData: {
				type: Object,
				default: () => ({
					content: "1111111",  //显示的文字内容
					title:'1111',
					type:'success',  //成功失败 以及显示的体表
					time:0, //是否倒计时关闭
					btns:true, //默认显示按钮
					cancelButtonText:'取消', //取消按钮的文本内容	
					confirmButtonText:'确定' //确定按钮的文本内容		
				})
			},
			dialogVisible: {
				type: Boolean,
				default: false
			},
			
		},
		mounted(){
			console.log(6666666)
			if(this.dialogData.time){
				this.num = this.dialogData.time
				this.time = setInterval(()=>{
					this.num --
					if(this.num === 0){
						clearInterval(this.time)
						this.time = null
						this.cancel()
					}
				},1000)
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
		methods:{
			close() {
				if(this.time){
					clearInterval(this.time)
					this.time = null
				}
				this.$emit('update:dialogVisible',false)
			},
			cancel(){
				this.close()
			},
			confirm(){
				
				this.$emit('confirm',this.close)
			},
		}
	}
</script>

<style scoped lang="scss">
	.tipView{
		width: 590rpx;
		padding: 60rpx 70rpx;
		text-align: center;
	}
	.typeImg{
		width: 128rpx;
		height: 128rpx;
		
		margin-bottom: 40rpx;
	}
	.contentText{
		@include fs(32rpx,600,#272727,45rpx);
		margin-bottom: 28rpx;
	}
	.content{
		@include fs(28rpx,400,#555,42rpx);
		margin-bottom: 28rpx;
	}
	.cancelBtn{
		width: 264rpx;
		height: 88rpx;
		background: #FFFFFF;
		border: 1rpx solid #BDBDBD;
		opacity: 1;
		border-radius: 88rpx;
		@include fs(28rpx,400,#111111,88rpx);
		text-align: center;
	}
	.confirmBtn{
		width: 264rpx;
		height: 88rpx;
		background: #111111;
		opacity: 1;
		border-radius: 88rpx;
		@include fs(28rpx,600,#fff,88rpx);
		text-align: center;
	}
</style>
