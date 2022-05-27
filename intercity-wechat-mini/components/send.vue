<template>
    <view class="sendBox" :style="[{'color':color}]" :class="[{'disabled': isTimeout || dontcanclick},{'border-box':border}]"  >
        <!-- 秒 点击获取-->
        <text v-if="isTimeout">{{timeout}}秒</text>
        <text v-else @click="sendCode">获取验证码</text>
    </view>
</template>
<script>
// import mixin from '@/mixin/common/common'
import { sendCode } from "@/api/user.js"
export default {
    name:'send',
	// mixins:[mixin],
    props:{
			//能否点击
			dontcanclick:{
					type: Boolean,  
					default: false
			},
	//手机号
			phone:{
					type: String,  
					default: ''
			},
			//颜色
			color:{
				type:String,
				default:'#333333'
			},
			//发生验证类型
			type:{
				type:Number,
				default:0
			},
			//请求地址api
			url:{
				type:String,
				default:''
			},
			required:{
				type:Boolean,
				default:false,
			},
			border:{
				type:Boolean,
				default:false,
			},
    },
    data(){
			return {
				timeout: 0,
				requestLocked : false
			}
    },
    computed: {
			isTimeout () {
				return this.timeout > 0;
			}
    },
    methods:{
			countDown () {
				var _this = this;
				function tick() {
					_this.timeout--;
					if (_this.timeout > 0) {
							setTimeout(tick, 1000);
					}
				}
				tick();
			},
			async sendCode(){
					// validate()
					console.log(!this.phone,typeof this.phone)
				if(this.requestLocked){
					return 	uni.showToast({
						title: '请勿重复提交',
						duration: 2000,
						icon: "none"
					})
				}
				if(!this.phone && this.required){
					return 	uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					})
				}
				let data = {
					phone:this.phone?this.phone:undefined,
					// type:this.type
				}
				this.requestLocked = true;
				sendCode(data).then(_json => {
					if (_json&&_json.status===2000) {
						this.timeout = 60;
						this.countDown();
						//验证码发送成功
						uni.showToast({
							title: '验证码发送成功',
							duration: 2000,
							icon: "none"
						})
					}else if(_json&&_json.status!==2000){
						uni.showToast({
							title: _json.msg,
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: '页面加载失败，请返回重试',
							icon: 'none'
						});
					}
				}).finally(()=>{
					this.requestLocked =false;
				})
				return false
				if(err)return;
				if(res.code !='0'){
					console.log(res,'code')
					this.timeout = 60;
					this.countDown();
					//验证码发送成功
					uni.showToast({
						title: '验证码发送成功',
						duration: 2000,
						icon: "none"
					})
				}
			}
    }
}
</script>
<style lang="scss">
    .sendBox{
			// position: absolute;
			// right: 0;
			display: inline-block;
			font-size: 30rpx;
			font-weight: 400;
			// bottom:16rpx;
			// top: 42rpx;
			// line-height: 34rpx;
			// padding: 4rpx 12rpx;
			// border-radius: 8rpx;
			// border:1rpx solid #fff;
    }
    .sendBox.disabled{
			cursor: no-drop;
    }
		.border-box{
			padding: 16rpx 15rpx;
			border: 1rpx solid #FF8800;
			border-radius: 16rpx;
			background-color: #fff;
			min-width: 152rpx;
			text-align: center;
		}
		.border-box.disabled{
			background-color: #DBDBDB;
			color: #999999 !important;
			border-color: #DBDBDB;
		}
</style>