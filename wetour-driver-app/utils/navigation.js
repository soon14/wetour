const navTo = function navTo(name, latitude, longitude, isChain) {
	let url = "";
	if (isChain) {
		plus.nativeUI.actionSheet({ //选择菜单
			title: "选择地图应用",
			cancel: "取消",
			buttons: [{
				title: "腾讯地图"
			}, {
				title: "百度地图"
			}, {
				title: "高德地图"
			}]
		}, function(e) {
			switch (e.index) {
				//下面是拼接url,不同系统以及不同地图都有不同的拼接字段
				case 1:
					//注意referer=xxx的xxx替换成你在腾讯地图开发平台申请的key
					url = `qqmap://map/geocoder?coord=${latitude},${longitude}&referer=xxx`;
					break;
				case 2:
					url =
						`baidumap://map/marker?location=${latitude},${longitude}&title=${name}&coord_type=gcj02&src=andr.baidu.openAPIdemo`;
					break;
				case 3:
					if (plus.os.name == "Android") {
						url =
							`androidamap://viewMap?sourceApplication=appname&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`;
					} else {
						url =
							`iosamap://viewMap?sourceApplication=applicationName&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`;
					}
					break;

				default:
					break;
			}
			if (url != "") {
				url = encodeURI(url);
				plus.runtime.openURL(url, function(e) {
					plus.nativeUI.alert("本机未安装指定的地图应用");
				});
			}
		})

	} else {
		plus.nativeUI.actionSheet({ //选择菜单
			title: "选择地图应用",
			cancel: "取消",
			buttons: [{
				title: "谷歌地图"
			}]
		}, function(e) {
			switch (e.index) {
				//下面是拼接url,不同系统以及不同地图都有不同的拼接字段
				case 1:
					//注意referer=xxx的xxx替换成你在腾讯地图开发平台申请的key
					if (plus.os.name == "Android") {
						url = `google.navigation:q=${latitude},${longitude}`;
					} else {
						//url = `comgooglemaps-x-callback://?q=${name}&center=${37.759748},${-122.427135}&x-success=sourceapp://?resume=true&x-source=Nom+Nom`
						//
						//UIApplication.shared.openURL(URL(string:"https://www.google.com/maps/@42.585444,13.007813,6z")!)
						//url = `comgooglemaps://?saddr=&daddr=${latitude},${longitude}`

						//url =  `comgooglemapsurl://www.google.com/maps/@${latitude},${longitude}`
						url= `comgooglemapsurl://maps.google.com/maps?daddr=${name}&sll=${latitude},${longitude}&x-source=SourceApp&x-success=sourceapp://?resume=true`
						//url =`comgooglemaps-x-callback://?center=${latitude},${longitude}&views=traffic`

						//url = `geo:${latitude},${longitude}? q= ${name}`;

						//url = `comgooglemaps-x-callback://?q=${name}&center=${37.759748,},${-122.427135}&x-success=sourceapp://?resume=true&x-source=Nom+Nom`
					}
					break;
				default:
					break;
			}
			if (url != "") {
				url = encodeURI(url);
				plus.runtime.openURL(url, function(e) {
					console.log("e", e);
					plus.nativeUI.alert("本机未安装指定的地图应用");
				});
			}
		})
	}
}


export default navTo;
