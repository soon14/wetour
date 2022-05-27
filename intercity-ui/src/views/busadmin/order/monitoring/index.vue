<template>
  <div class="mod-config">
    <basic-container>
      <!-- <div class="filter-container">
        <el-select
          v-model="searchForm.lineId"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="-1" label="全部线路" />
          <el-option :label="item.lineName" :value="item.id" v-for="item in lineList" :key="item.id" />
        </el-select>


        <el-input
          v-model="searchForm.number"
          placeholder="车辆牌号"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
        />
        <el-button
          type="primary"
          class="filter-item"
          icon="el-icon-search"
          @click="currentChangeHandle(1)"
          >搜索</el-button
        >
        <el-button
          class="filter-item"
          @click="resetForm"
          >重置</el-button
        >
      </div> -->
      <div class="avue-crud">
        <div class="searchBox" style="position: inherit;">
          <div class="operate">
            <el-autocomplete v-model="keyword" width="280" class="inline-input" :fetch-suggestions="querySearch" placeholder="车牌号查找" :maxlength="50" :trigger-on-focus="false" @select="handleSelect"  />
            <el-button size="small" width="80px" type="primary" style="margin-left:10px;" @click="search"> &nbsp;&nbsp;搜索&nbsp;&nbsp;</el-button>
          </div>
        </div>
        <div id="container" class="y-map">&nbsp;</div>
      </div>
    </basic-container>


    
  </div>
</template>

<script>
import { fetchList } from "@/api/busadmin/bus";
import { getLineIdAndName } from "@/api/busadmin/line"
import { mapGetters } from "vuex";
import { parseTime } from '@/util/common.js'
import { code } from "@/util/adcode";
import Map from '@/util/map'
import {configMqtt} from '@/config/env'

// import mqtt from "@/util/mqtt.js"
const mqtt = require('mqtt')
// import CryptoJS from "cryoto-js"
const CryptoJs = require('crypto-js');
export default {
  data() {
    return {
      dataForm: {
        key: "",
      },
      requestLocked:false,
      searchForm: {
        lineId:-1,
        number:'',
      },
      createTimes:[],
      keyword:'',
      keywords:"",
      dataList: [],
      pageIndex: 1,
      pageSize: 999999,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dialogMapVisible:false,
      chargebackVisible:false,
      chargebackTabVisible:false,
      distributeVisible:false,
      distributeTabVisible:false,
      dialogData:{},
      
      lineList:[],
      map:null,
      copyList:[],
      stopImg: require('../../../../assets/img/car_stop.png'),
      runImg: require('../../../../assets/img/car_run.png'),
      selimg: require('../../../../assets/img/car_sel.png'),

      client:null,


      ids: [],
      list: [],
      // copyList:[],
      driverData:{

      }
    };
  },
  components: {
   
  },
  created() {
    this.getDataList();
    this.getLineIdAndName()
  },
  destroyed(){
    if(this.client){
				// client.unsubscribe('topic/test');
				this.client.end()
				this.client = null
			}
  },
  computed: {
    ...mapGetters(["permissions",'userInfo']),
  },
  filters:{
    codeFil(val) {
      return code[val];
    },
  },
  methods: {
    search(){
      let str = null
      let keywords = this.keywords 
      console.log(keywords,this.driverData[keywords],this.driverData)
      if(!this.driverData[keywords]){
        return this.$message({ message: '没有查询到相关记录哦~' })
      }
      let it =  this.driverData[keywords].cartPoint
      this.map.setZoom(20)
      this.map.setCenter(it)


      const newIcon = new AMap.Icon({
        image: this.selimg,
        size: new AMap.Size(24, 24),
        imageSize: new AMap.Size(24, 24)
      })
      this.list[this.ids.indexOf(keywords + '')].setzIndex(150, '==============setzIndex')
      this.list[this.ids.indexOf(keywords + '')].setIcon(newIcon)


      // this.copyArr.forEach((it, index) => {
      //   if (it.bus_plate === this.keyword) {
      //     str = it
      //     //   this.map.setZoomAndCenter(20, [it.longitude / 1000000, it.latitude / 1000000])
      //     this.map.setZoom(20)
      //     this.map.setCenter([it.longitude / 1000000, it.latitude / 1000000])
      //   }
      //   const icon = new AMap.Icon({
      //     image: this.getTime(it.receive_time) + 30 * 60 < nowTime ? this.stopImg : this.runImg,
      //     size: new AMap.Size(24, 24),
      //     imageSize: new AMap.Size(24, 24)
      //   })
      //   this.list[index].setIcon(icon)
      // })
      // const newIcon = new AMap.Icon({
      //   image: this.selimg,
      //   size: new AMap.Size(24, 24),
      //   imageSize: new AMap.Size(24, 24)
      // })
      // this.list[this.ids.indexOf(str.bus_id)].setzIndex(150, '==============setzIndex')
      // this.list[this.ids.indexOf(str.bus_id)].setIcon(newIcon)
      // if (str === null) {
      //   this.$message({ message: '没有查询到相关记录哦~' })
      // }
    },
    // 输入框搜索
    querySearch(queryString, cb) {
      const results = []
      this.dataList.forEach(o => {
        if (o.number.indexOf(queryString.toUpperCase()) !== -1) {
          results.push({
            value:o.number,
            name:o.driverId
          })
        }
      })
      console.log(results,33333)
      cb(results)
    },
    handleSelect(it) {
      console.log(it,3333,this.list,3333,this.keyword)
      // 选择车牌前把所有标注点设置为100
      this.list.forEach(o => {
        o.setzIndex(100)
        console.log(o.getzIndex())
      })
      this.keywords = it.name
    },
    getLineIdAndName(){
      getLineIdAndName().then(res=>{
      console.log(res,33333)

        this.lineList = res.data.data
        
      })
    },
    getMap() {
      // 延迟一秒加载，防止地图刷新报错
      // setTimeout(() => {
        const self = this
        Map('67e52de474cfc324b4b4d5255e4bc785').then(Amap => {

          this.map = new AMap.Map('container', {
            zoom: 12,
            resizeEnable: true
          })
          this.map.add(this.list)
          this.map.setFitView(this.copyList)

          // 添加聚合组件
          const styles = [{
            url: require('../../../../assets/img/m1.png'),
            size: new AMap.Size(48, 48),
            offset: new AMap.Pixel(-16, -30)
          },
          {
            url: require('../../../../assets/img/m2.png'),
            size: new AMap.Size(48, 48),
            offset: new AMap.Pixel(-16, -30)
          },
          {
            url: require('../../../../assets/img/m3.png'),
            size: new AMap.Size(60, 60),
            offset: new AMap.Pixel(-24, -45),
            textColor: '#CC0066'
          }
          ]
          this.map.plugin(['AMap.MarkerClusterer'], function() {
            new AMap.MarkerClusterer(
              self.map,
              self.list,
              {
                styles: styles,
                maxZoom: 16
              })
          })
        }, e => {
          console.log('地图加载失败', e)
        })
      // }, 1000)
    },
    resetForm(){
      this.searchForm = {
        lineId:-1,
        number:'',
      }
      this.createTimes = []
    },
    
    connectMqtt() {
        let _this = this
        if(this.client) return false
        
        // let accessKey = 'LTAI5tPBttDUEc3Km4zzSWEr';//账号的 AccessKey，在阿里云控制台查看
        // let secretKey = '4r1TXAwb8tZLYRe5DPS5eb74mGYNbo';//账号的的 SecretKey，在阿里云控制台查看
        // let clientId =  'GID_WxMqtt@@@'+this.orderDetail.id
        // const connectUrl = 'wxs://mqtt-cn-2r42m1y4k01.mqtt.aliyuncs.com'
        
        
        // let configMqtt = config.mqtt
        // let configMqtt = 'test'
        
        console.log(configMqtt,'mqtt--------')
        let accessKey = 'LTAI5tJWHRDEF574ZWuXkQG9';//账号的 AccessKey，在阿里云控制台查看
        let secretKey = 'l8JmLVZI9ClrdvmdkD83x270wgl7E9';//账号的的 SecretKey，在阿里云控制台查看
        let clientId =  `GID_${configMqtt}_pc@@@`+this.userInfo.userId
        // let clientId =  `GID_${configMqtt}_wx@@@`+this.userInfo.userId
        console.log(clientId)
        // let clientId =  'GID_intercity_android@@@'+'17606515466'
        const connectUrl = 'wss://post-cn-7mz2m0i8p04.mqtt.aliyuncs.com'
        
        
        const options = {
            connectTimeout: 4000, // 超时时间
            // 认证信息
            clientId: clientId,
            port:443,
            // username: `Signature|${accessKey}|mqtt-cn-2r42m1y4k01`,
            username: `Signature|${accessKey}|post-cn-7mz2m0i8p04`,
            password:CryptoJs.HmacSHA1(clientId, secretKey).toString(CryptoJs.enc.Base64)
        }
        
        
        const client = mqtt.connect(connectUrl, options)
        
        let list = this.dataList
        client.on('connect', function(res) {
          console.log('连接成功',res,new Date())
          // 订阅   
          list.forEach((item)=>{
            let url = `${configMqtt}-intercity/${item.driverId}`
            client.subscribe(url,function(err){
                console.log(url,err,'err------',new Date())
            });
          })
        })

        client.on('reconnect', (error) => {
            console.log('正在重连:', error)
        })

        client.on('error', (error) => {
            console.log('连接失败:', error)
        })

        client.on('message', (topic, message) => {
            console.log('收到消息：', topic, message.toString())
            let driverId = topic.split('/')[1]
            let cartPoint =  message.toString().split(',')

            this.driverData[driverId] = {
              cartPoint,
            }
            if (this.ids.indexOf(driverId) === -1) {
              this.ids.push(driverId)

              var icon = new AMap.Icon({
                image:  this.runImg,
                size: new AMap.Size(24, 24),
                imageSize: new AMap.Size(24, 24)
              })
              // 添加标记点
              const marker = new AMap.Marker({
                position: new AMap.LngLat(cartPoint[0], cartPoint[1]),
                offset: new AMap.Pixel(-10, -10),
                icon: icon, // 添加 Icon 图标 URL
                // title: msg.data.bus_plate
              })
              // marker.content = '车号: ' + (msg.data.bus_plate || msg.data.device_number) + '<br />经度: ' + msg.data.longitude / 1000000 + '°, 纬度: ' + msg.data.latitude / 1000000 + '°' +
              //   '<br />定位时间: ' + (msg.data.location_time) +
              //   '<br />接收时间: ' + (msg.data.receive_time) +
              //   '<br />速度: ' + msg.data.speed / 100 + 'km/h, 方向: ' + msg.data.direction / 10 + '°'
              marker.bus_id = driverId

              // 设置文本标记
              marker.setLabel({
                offset: new AMap.Pixel(0, -5), // 设置文本标注偏移量
                content: `<div class='info' :class="{'active': driverId == this.keyword}">车牌号：${_this.showCartNumber(driverId)}</div>`, // 设置文本标注内容
                direction: 'top', // 设置文本标注方位
                animation: 'AMAP_ANIMATION_DROP'
              })
              // marker.on('mouseover', function(e) {
              //   self.markerShow(e)
              // })
              // marker.on('mouseout', function(e) {
              //   self.markerHidden(e)
              // })
              // marker.on('click', function(e) {
              //   self.markerJump(e)
              // })
              
              if (cartPoint.length) {
                _this.copyList.push(marker)
              }
              _this.list.push(marker)
              _this.map !== undefined ? _this.map.add(_this.list) : ''
            }else{
              // console.log('-------------- -1')
              // // 更新坐标点
              // if(driverId == 27){
              //   cartPoint[0] =  120.002916 + Math.random()*10 + ''
              //   console.log(driverId,this.ids.indexOf(driverId),this.list[this.ids.indexOf(driverId)])
              // }
              this.list[this.ids.indexOf(driverId)].setPosition(new AMap.LngLat(cartPoint[0], cartPoint[1]))
            }
            
            
        })
        this.client = client
    },
    showCartNumber(id){
      let number = ''
      this.dataList.forEach(element=>{
        if(element.driverId == id) number = element.number
      })
      return number
    },
    parseTime(time, cFormat){
      return parseTime(time, cFormat)
    },
    
    // 获取数据列表
    getDataList() {
      let self = this
      this.dataListLoading = true;
      fetchList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          ...this.searchForm,
        })
      ).then((response) => {
        this.dataList = response.data.data.records;
        this.totalPage = response.data.data.total;
        this.getMap()


        this.connectMqtt()
        
        // let myData = response.data.data.records
        // myData.forEach(element => {
        //   console.log(element)
        //   var icon = new AMap.Icon({
        //     image: self.stopImg ,
        //     size: new AMap.Size(24, 24),
        //     imageSize: new AMap.Size(24, 24)
        //   })
        //   // 添加标记点
        //   const marker = new AMap.Marker({
        //     position: new AMap.LngLat(...JSON.parse(element.upPoint)),
        //     offset: new AMap.Pixel(-10, -10),
        //     icon: icon, // 添加 Icon 图标 URL
        //   })


          
        //   marker.content = `
            
        //     联系人：${element.contacts}${element.contactsMobile}
        //     </br>订单ID：${element.orderNo}
        //     </br>线路名称：${element.lineName}
        //     </br>出发时间：${element.departureEndTime}
        //     </br>乘车人数：${element.orderNumber}人
        //     </br>订单状态：${element.orderStatusShow}
        //   `

         
        //   marker.on('mouseover', function(e) {
        //     self.markerShow(e)
        //   })
        //   marker.on('mouseout', function(e) {
        //     self.markerHidden(e)
        //   })
        //   marker.on('click', function(e) {
        //     self.markerJump(e)
        //   })
        
        //   this.list.push(marker)
        // });

        // this.getMap()
        
          // this.map !== undefined ? this.map.add(this.list) : ''
        // console.log(res,33333)
      });
      this.dataListLoading = false;
    },
    // 显示经纬度、定位时间、接收时间、速度、方向等信息
    markerShow(e) {
      const infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) })
      infoWindow.setContent(e.target.content)
      infoWindow.open(this.map, e.target.getPosition())
    },
    // 关闭信息显示
    markerHidden(e) {
      this.map.clearInfoWindow()
    },
    // 跳转车辆详情
    markerJump(e) {
      console.log(e)
      return false
      // const isTo = this.$authority(this.defined.admin, 'fleet.car.show', this.defined.buttons)
      // if (!isTo) return
      // const it = { id: e.target.bus_id }
      // this.$router.push({ name: 'cardetail', query: { it: JSON.stringify(it) }})
    },
    // 当前页
    currentChangeHandle(val) {
      // this.map && this.map.destroy()
      this.list = []
      this.pageIndex = val;
      this.getDataList();
    },
  },
};
</script>
<style lang="scss" scoped>
.amap-box {
  width: 100%;
  height: 500px;
}
#container{
  width: 100%;
  height: 800px;
}
/deep/ .amap-marker-content div {
    background-size: cover;
}
.searchBox{
  width: calc(100% - 80px);
  height: 76px;
  padding: 0 40px 0 26px;
  box-sizing: border-box;
  position: fixed;
  top:60px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
/deep/.info{
  color: #666;
}
/deep/.amap-marker-label{
  border: 1px solid #D0D8E5;
  border-radius: 5px;
  background: #fff;
}
/deep/.active{
  color: #32D3C3;
}
</style>