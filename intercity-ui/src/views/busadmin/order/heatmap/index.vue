<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">

        

        <el-select
          v-model="searchForm.lineId"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="-1" label="全部线路" />
          <el-option :label="item.lineName" :value="item.id" v-for="item in lineList" :key="item.id" />
          <!-- <el-option label="退票时间" :value="4"  /> -->
        </el-select>


        <!-- 时间类型 -->
        <el-select
          v-model="searchForm.timeType"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="-1" label="全部时间类型" />
          <el-option label="下单时间" :value="1"  />
          <el-option label="出发时间" :value="2"  />
          <el-option label="出票时间" :value="3"  />
          <!-- <el-option label="退票时间" :value="4"  /> -->
        </el-select>

        <el-date-picker
          v-model="createTimes"
          value-format="yyyy-MM-dd"
          type="daterange"
          style="margin-bottom: 10px;vertical-align: middle;margin-left: 10px;"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          :disabled="searchForm.timeType == -1"
          :editable="false"
          :picker-options="pickerOptions"
          
        />

        <!-- 订单状态 -->
        <el-select
          v-model="searchForm.orderStatus"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="-1" label="全部订单状态" />
          <el-option label="待支付" :value="1"  />
          <el-option label="待派单" :value="2"  />
          <el-option label="待出行" :value="3"  />
          <el-option label="出行中" :value="4"  />
          <el-option label="已完成" :value="5"  />
          <el-option label="已退款" :value="6"  />
          <el-option label="已取消" :value="0"  />
        </el-select>
        <!-- 购票方式 -->
        <el-select
          v-model="searchForm.ticketType"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="-1" label="全部购票方式" />
          <el-option label="线上预约" :value="1"  />
          <el-option label="线下补票" :value="2"  />
        </el-select>
        <!-- 验票状态 -->
        <el-select
          v-model="searchForm.checkStatus"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="-1" label="全部验票状态" />
          <el-option label="已验票" :value="1"  />
          <el-option label="已到达" :value="2"  />
          <el-option label="未验票" :value="0"  />
        </el-select>
        <el-input
          v-model="searchForm.orderNo"
          placeholder="订单号码"
          style="width: 140px"
          class="filter-item"
          maxlength="22"
        />
        <el-input
          v-model="searchForm.contactsMobile"
          placeholder="手机号码"
          style="width: 140px"
          class="filter-item"
          maxlength="11"
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
      </div>
      <div class="avue-crud">
        <div id="container" class="y-map">&nbsp;</div>
      </div>
    </basic-container>


    
  </div>
</template>

<script>
import { fetchList, getBusInLine, orderRefund } from "@/api/orderinfo";
import { getLineIdAndName } from "@/api/busadmin/line"
import { mapGetters } from "vuex";
import { parseTime } from '@/util/common.js'
import { code } from "@/util/adcode";
import Map from '@/util/map'

export default {
  data() {
    return {
      dataForm: {
        key: "",
      },
      requestLocked:false,
      searchForm: {
        orderStatus:2,
        ticketType:-1,
        timeType:-1,
        lineId:-1,
        checkStatus:-1,

        // orderStatus:0,
        // ticketType:0,
        // timeType:0,
        // checkStatus:0,

        orderNo:'',
        contactsMobile:'',
        startTime:'',
        endTime:'',
      },
      createTimes:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date('2019-01-01').getTime()
        }
      },
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
      list:[],
      copyList:[],
      stopImg: require('../../../../assets/img/ordericon.png'),

    };
  },
  components: {
   
  },
  created() {
    this.getDataList();
    this.getLineIdAndName()
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  filters:{
    codeFil(val) {
      return code[val];
    },
  },
  methods: {
    getLineIdAndName(){
      getLineIdAndName().then(res=>{
      console.log(res,33333)

        this.lineList = res.data.data
        
      })
    },
    getMap() {
      // 延迟一秒加载，防止地图刷新报错
      setTimeout(() => {
        const self = this
        Map('67e52de474cfc324b4b4d5255e4bc785').then(Amap => {

          this.map = new AMap.Map('container', {
            zoom: 12,
            resizeEnable: true
          })
          this.map.add(this.list)
          // this.map.setFitView(this.copyList)

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
      }, 1000)
    },
    resetForm(){
      this.searchForm = {
        orderStatus:2,
        ticketType:-1,
        timeType:-1,
        lineId:-1,
        checkStatus:-1,
        orderNo:'',
        contactsMobile:'',
        startTime:'',
        endTime:'',
      }
      this.createTimes = []
    },
    
    parseTime(time, cFormat){
      return parseTime(time, cFormat)
    },
    // 获取数据列表
    getDataList() {
      let self = this
      // this.dataList = [{
      //   orderTime:new Date(),
      //   departureStartTime:new Date(),
      //   departureEndTime:new Date(),
      //   upAddress:'城战',
      //   downAddress:'下车地址',
      //   upPoint:[120.2926739998162, 28.134978999895548],
      //   downPoint:[119.9149680005014, 28.441969000584415],
      // }]
      this.dataListLoading = true;
      if (this.createTimes && this.createTimes.length) {
        this.searchForm.startTime = this.createTimes[0] + ' 00:00:00';
        this.searchForm.endTime = this.createTimes[1] + ' 23:59:59';
      } else {
        this.searchForm.startTime = "";
        this.searchForm.endTime = "";
      }
      fetchList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          ...this.searchForm,
        })
      ).then((response) => {
        this.dataList = response.data.data.records;
        this.totalPage = response.data.data.total;

        let myData = response.data.data.records
        myData.forEach(element => {
          console.log(element)
          var icon = new AMap.Icon({
            image: self.stopImg ,
            size: new AMap.Size(24, 24),
            imageSize: new AMap.Size(24, 24)
          })
          // 添加标记点
          const marker = new AMap.Marker({
            position: new AMap.LngLat(...JSON.parse(element.upPoint)),
            offset: new AMap.Pixel(-10, -10),
            icon: icon, // 添加 Icon 图标 URL
          })


          
          marker.content = `
            
            联系人：${element.contacts}${element.contactsMobile}
            </br>订单ID：${element.orderNo}
            </br>线路名称：${element.lineName}
            </br>出发时间：${element.departureEndTime}
            </br>乘车人数：${element.orderNumber}人
            </br>订单状态：${element.orderStatusShow}
          `

         
          marker.on('mouseover', function(e) {
            self.markerShow(e)
          })
          marker.on('mouseout', function(e) {
            self.markerHidden(e)
          })
          marker.on('click', function(e) {
            self.markerJump(e)
          })
        
          this.list.push(marker)
        });

        this.getMap()
        
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
</style>