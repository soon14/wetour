<template>
	<view>
		<!-- 11111 -->
		<!-- <u-select v-model="visible" mode="mutil-column-auto" :list="list" @confirm="confirm" :mask-close-able="false" @cancel="cancel" ></u-select> -->
		<u-picker
			mode="multiSelector"
			v-model="visible"
			:default-selector="[y, z]"
			range-key="label"
			:range="multiSelector"
			@confirm="confirm"
			@columnchange="columnchange"
			@cancel="cancel"
		></u-picker>
		<!-- <u-select v-model="visible" mode="mutil-column" :list="list" @confirm="confirm"></u-select> -->
	</view>
</template>

<script>
import moment from 'moment';
import { parseTime, throttle, getLocalTime } from '@/utils/common';
export default {
	name: 'selectTime',
	data() {
		return {
			list: [],
			multiSelector: [],
			y: 0,
			z: 0,
			yList: [],
			zList: [],
			oneDayYList: [],
			oneDayzList: []
		};
	},
	created() {
		console.log('created==>');
		this.y = this.defaultValue[0];
		this.z = this.defaultValue[1];
		console.log(getLocalTime(Number(this.timeZone)), this.timeZone);
		let myTime = getLocalTime(Number(this.timeZone)).getTime() + 12 * 3600 * 1000;

		for (var i = 0; i < 24; i++) {
			this.yList.push({
				label: i < 10 ? '0' + i : i,
				value: i
			});
		}

		for (var i = 0; i < 6; i++) {
			let newi = i * 10;
			this.zList.push({
				label: i == 0 ? '00' : newi,
				value: newi
			});
		}

		let hm = parseTime(myTime, '{h}:{i}').split(':');
		let m = (Math.ceil(Number(hm[1]) / 10) * 10 + '').split('')[0] - 0;
		let h = hm[0] - 0;
		for (var i = m; i < 6; i++) {
			let newi = i * 10;
			this.oneDayzList.push({
				label: i == 0 ? '00' : newi,
				value: newi
			});
		}

		if (m == 6) {
			h = Number(h) + 1;
			this.oneDayzList = this.zList;
		}

		for (var i = h; i < 24; i++) {
			this.oneDayYList.push({
				label: i < 10 ? '0' + i : i,
				value: i
			});
		}

		if (h == 24) {
			this.oneDayYList = this.yList;
		}

		this.multiSelector = [[...this.oneDayYList], [...this.oneDayzList]];
		console.log(this.multiSelector);
		return false;

		console.log(myTime, '----------');
		let list = [];
	},
	props: {
		dialogVisible: {
			type: Boolean,
			default: false
		},
		defaultValue: {
			type: Array,
			default: [0, 0]
		},
		timeZone: {
			type: [Number, String],
			default: 8
		}
	},
	computed: {
		visible: {
			get() {
				if (this.dialogVisible) {
					uni.hideTabBar();
				} else {
					uni.showTabBar();
				}
				return this.dialogVisible;
			},
			set(val) {
				if (this.dialogVisible) {
					uni.hideTabBar();
				} else {
					uni.showTabBar();
				}
				this.$emit('update:dialogVisible', val);
			}
		}
	},
	methods: {
		confirm(e) {
			// time:1650568200000
			let { multiSelector } = this;
			let time = multiSelector[0][this.y].label + ':' + multiSelector[1][this.z].label;
			this.$emit('confirm', { time, default:[this.y,this.z] });
		},
		cancel() {
			this.visible = false;
		},
		columnchange(data) {
			if (data.column == 0) {
				this.y = data.index;
			}
			if (data.column == 1) {
				this.z = data.index;
			}
			let yList = this.oneDayYList;
			let zList = this.zList;

			if (this.y == 0) {
				zList = this.oneDayzList;
			}
			
			console.log("sss",this.y)

			this.multiSelector = [[...yList], [...zList]];
			// uni.showToast({
			// 	title: `${data.column},${data.index}`,
			// 	duration: 2000,
			// 	icon: "none"
			// })
			console.log(data);
		}
	}
};
</script>

<style></style>
