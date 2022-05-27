import {
	ossPolicy
} from "@/api/drivercart.js"
export function upload(path) {

	return new Promise(async (resolve, reject) => {
		ossPolicy().then(res => {
			if (res.code == 0) {
				let stroeAs = res.data.dir  + new Date().getTime() + 'wbs.png';
				let host = res.data.host
				uni.uploadFile({
					name: 'file',
					filePath: path,
					fileType: 'image',
					url: host,
					formData: {
						'key': stroeAs,
						'policy': res.data.policy,
						'signature': res.data.signature,
						'OSSAccessKeyId': res.data.accessid,
						'success_action_status': '200', //让服务端返回200,不然，默认会返回204
					},
					header: {
						"Access-Control-Allow-Origin": "*"
					},
					success(res) {
						uni.hideLoading();
						uni.showToast({
							title: '上传成功',
							icon: 'success',
							duration: 1000
						})
						console.log("res",res)
						resolve(host + '/' + stroeAs)
						//return osshost + '/' + stroeAs;
					},
					fail(e) {
						uni.showToast({
							title: '上传异常',
							icon: 'none',
						})
						reject("上传异常")
					}
				})

			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				reject(res.msg)
			}
		})
	})


}
