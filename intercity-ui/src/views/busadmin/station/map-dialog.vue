<template>
    <!-- :title="!dataForm.id ? '新增' : '修改'" -->

  <el-dialog
    :close-on-click-modal="false"
    append-to-body
    :show-close="false"
    @close="close"
    :visible.sync="visible">
    <div class="flex-between" style="margin-bottom:14px;">
      <div>
        {{ stationShape === 1 ? currentAddress : '电子围栏'}}
      </div>
      <div class="flex-start">
        <div style="margin-right:10px;">{{propsData.city | codeFil}} {{propsData.town | codeFil}}</div>
        <el-autocomplete v-model="keyword" width="280" class="inline-input" :fetch-suggestions="querySearch" placeholder="请输入地址" :maxlength="50" :trigger-on-focus="false" @select="handleSelect" popper-class="my-autocomplete" v-if="stationShape === 1 && type !== 'look'">
          <template slot-scope="{ item }">
            <div class="name">{{ item.name }}</div>
            <!-- <span class="addr">{{ item.district + item.address }}</span> -->
          </template>
        </el-autocomplete>
      </div>
      
    </div>
    <div style="position:relative;">
      <div id="container" class="container">
        &nbsp;
        
      </div>
      <img src="@/assets/images/coreImg.png" alt="" class="mapImg" style="position: absolute;left: calc(50% - 15px);top: calc(50% - 25px);width: 30px;height: 50px;z-index: 9999;" v-if="stationShape === 1 && type !== 'look'">
    </div>
    
    <div slot="footer" class="dialog-footer flex-between">
      <div v-if="stationShape === 1"></div>
      <div v-else-if="type != 'look'">
        <el-button :disabled="editorBtn" type="primary"  @click="customOpen">自定义编辑</el-button>
        <el-button :disabled="editorBtn" type="primary" @click="editorOpen">开始编辑</el-button>
        <el-button   @click="editorClose">结束编辑</el-button>
      </div>
      <div v-else></div>
      <div>
        <el-button :disabled="editorBtn" @click="visible = false">取消</el-button>
        <el-button :disabled="editorBtn" type="primary" @click="dataFormSubmit()" v-if="canSubmit && type !== 'look'">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {code} from "@/util/adcode"
import Map from '@/util/map'
import coreImg from "@/assets/images/coreImg.png"
export default {
  data () {
    return {
      visible: false,
      district:null,
      bounds:[],
      map:null,
      Amap:null,
      center: [],
      centerPoint:[],
      runArr:[],
      polygon: '',
      canSubmit:true,
      keyword:'',
      currentAddress:'',
      autoComplete:null,
      stationShape:0,
      editorBtn:false,
      dataForm:{
        id:0,
      },
      propsData:{

      },
      polyEditor: '',
      type:'',
      districtList:[],
      polygons:[],
      latlngArr:[]
    }
  },
  props:{
    myData:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  methods: {
    // 打开编辑
    editorOpen() {
      this.polyEditor.open()
      this.editorBtn = true
    },
    customOpen(){
      let that = this
      let newNumber = this.bounds.length/4
      let arr = []
      for (let index = 0; index < 3; index++) {
        const element = this.bounds[(newNumber*index).toFixed(0)]
        arr.push([element.lng,element.lat])
      }
      this.map.clearMap();
      that.runArr = arr
      this.newArea(this.Amap, this.map)
    },
    // 关闭编辑
    editorClose() {
      this.polyEditor.close()
      this.editorBtn = false
    },
    // 编辑结束后触发事件
    offEditor(num) {
     
    },
    querySearch(queryString, cb){
      let results = []
      if(!this.autoComplete){
        this.autoComplete= new AMap.Autocomplete({
          city:(this.propsData.town || this.propsData.city),
          citylimit:true,
          type:'05|0603|0604|0703|08|09|10|11|12|13|14|15|16|17|18|19|99',
        });
      }
      let autoComplete = this.autoComplete
      // 根据关键字进行搜索

      autoComplete.search(queryString, function(status, result) {
        console.log(result,333333)
        // 搜索成功时，result即是对应的匹配数据
        if(result.tips){
          results = result.tips
        }
        cb(results)
      })
      
    },
    handleSelect(item){
      console.log('handleSelect=1')
      if(!item.location) return this.$message.error('无效定位');

      this.keyword = item.name
      this.currentAddress = item.district+item.address
      this.center = [item.location.lng,item.location.lat]
      console.log('handleSelect=2',this.center,item,3333)
      this.map.setCenter(this.center);
      console.log('handleSelect=3')

      // this.map.panTo(this.center);
    },
    dataFormSubmit(){
      if(this.stationShape === 1){

        console.log(this.center, this.latlngArr)
        let inRing = AMap.GeometryUtil.isPointInRing(this.center, this.latlngArr)
        // 站点位置不在可用范围
        if(!inRing){
          this.$message.error('站点位置不在可用范围');
          return false
        }
        console.log(this.center,'this.center,this.center,this.center,this.center,')
        this.$emit('success',{stationLocation:[],address:this.currentAddress,stationPoint:this.center,centerPoint:this.centerPoint})
        this.visible = false



      }else{
        let arr = []
        console.log(Array.isArray(this.runArr[0]),this.runArr[0])
        if(Array.isArray(this.runArr[0])){
          arr = this.runArr
        }else{
          this.runArr.map(item => {
            const point = []
            point.push(item.lng )
            point.push(item.lat)
            return arr.push(point)
          })
        }
        this.$emit('success',{stationLocation:arr,centerPoint:this.centerPoint})
        this.visible = false
      }
    },
    logMapinfo(e){
      
      // var zoom = this.map.getZoom(); //获取当前地图级别
      var center = this.map.getCenter(); //获取当前地图中心位置
      let self = center
      console.log(center,'center=========================')
      const points = [self.R, self.Q]
      console.log(points,33333)
      this.center = points
      console.log(66666)
      this.getAddress(points)
      console.log(77777777)

      if(this.stationShape !== 1 || this.type == 'look') return false
      let inRing = AMap.GeometryUtil.isPointInRing(this.center, this.latlngArr)
      console.log(888888)

      // 站点位置不在可用范围
      if(!inRing){
        this.$message.error('站点位置不在可用范围');
      }
      
      
    },
    getAddress(points) {
      if(this.type == 'look') return false
        const geocoder = new AMap.Geocoder({ radius: 1000, extensions: 'all' })
        geocoder.getAddress(points, (status, result) => {
          if (status === 'complete' && result.regeocode) {
            this.currentAddress = result.regeocode.formattedAddress
          }
        })
      },
    init (id,stationShape,data,type) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.stationShape = stationShape

      let newData = JSON.parse(JSON.stringify(this.myData))
      this.propsData = newData
      this.type = type
      // this.canSubmit = true;
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].resetFields()
      //   if (this.dataForm.id) {
      //     getObj(this.dataForm.id).then(response => {
      //         this.dataForm = response.data.data
      //     })
      //   }
      // })
      var that = this;
      //加载行政区划插件

      setTimeout(()=>{
        if (!that.district) {
          //实例化DistrictSearch
          var opts = {
            subdistrict: 0, //获取边界不需要返回下级行政区
            extensions: "all", //返回行政区边界坐标组等具体信息
            level: "city", //查询行政级别为 市
            showbiz:false,
          };
          that.district = new AMap.DistrictSearch(opts);
        }
        //行政区查询
        console.log(newData.stationLocation,newData.stationShape,'aaaaaaaaaaaaaaaaa')
        if(newData.stationLocation.length){
          if(newData.stationShape == 1){
            // that.center = data.stationPoint
            // that.centerPoint = data.centerPoint
            // that.currentAddress = data.address  //具体地址
            // that.runArr = data.stationLocation
            // that.getmap()
          }else{
            that.center = newData.centerPoint
            that.centerPoint = newData.centerPoint
            that.currentAddress = newData.address  //具体地址
            that.runArr = newData.stationLocation
            console.log(that.propsData.town || that.propsData.city,that.runArr)
            that.district.search((that.propsData.town ? (that.propsData.town + '') : false) || (that.propsData.city + ''), function (status, result) {
              var bounds = result.districtList[0].boundaries;
              that.bounds = bounds[0]
              that.getmap()
            })
          }
          
        }else{
          that.district.search((that.propsData.town ? (that.propsData.town + '') : false) || (that.propsData.city + ''), function (status, result) {
            var bounds = result.districtList[0].boundaries;
            that.bounds = bounds[0]
            if(newData.stationShape == 1 && newData.address){
              that.center = newData.stationPoint
              that.centerPoint = [result.districtList[0].center.lng,result.districtList[0].center.lat]
              that.currentAddress = newData.address
              console.log(that.center,that.centerPoint,'---------')
            }else{
              that.center = [result.districtList[0].center.lng,result.districtList[0].center.lat]
              that.centerPoint = [result.districtList[0].center.lng,result.districtList[0].center.lat]
              that.getAddress(that.center)
            }
            
            
            
            if (bounds) {

                let arr = []
                if(newData.stationShape == 1){
                  that.districtList = result.districtList[0]
                }
                else{
                  let newNumber = bounds[0].length/400
                  if(bounds[0].length > 400){
                    for (let index = 0; index < 400; index++) {
                      const element = bounds[0][(newNumber*index).toFixed(0)]
                      arr.push([element.lng,element.lat])
                    }
                  }else{
                    for (let index = 0; index < bounds[0].length; index++) {
                      const element = bounds[0][index]
                      arr.push([element.lng,element.lat])
                    }
                  }
                }
                
                
              that.runArr = arr
            }
            that.getmap()
          })
        }
        
      },0)
    },
    
    // 初始化地图
    getmap() {
      Map('67e52de474cfc324b4b4d5255e4bc785').then(Amap => {
        const map = new Amap.Map('container', {
          center: this.center,
          zoom: this.propsData.town ? 13 : 9
          // 城市9 区域13
        })
        this.map = map
        this.Amap = Amap
        map.on('moveend', this.logMapinfo);
        // map.on('zoomend', this.logMapinfo);
        // map.setFitView()
        if(this.type == 'look' && this.stationShape === 1) {
          var marker = new AMap.Marker({
            // icon: "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
            // content:`<img src="${coreImg}" style="width: 30px;height: 50px;top:0px;left:0;" />`,
            position: this.center,
            icon: new AMap.Icon({
                size:new AMap.Size(30,50),//图标大小  
                image:coreImg,
                imageSize: new AMap.Size(30,50)
            }),
            // // offset: new AMap.Pixel(-51,8),
            offset: new AMap.Pixel(-15,-25),

            // width:'25px',
            // height:'35px'
          });
          map.add(marker);
        }
        if(this.propsData.stationShape == 1){
          this.getData()
        }else{
          this.newArea(Amap, map)
        }
        
        // 缩放地图到合适的视野级别
        
      }, e => {
        console.log('地图加载失败', e)
      })
    },
    getData() {
      var bounds = this.districtList.boundaries;

      var polygons = [],latlngArr = []
      if (bounds) {
        
        for (var i = 0, l = bounds.length; i < l; i++) {
          var polygon = new AMap.Polygon({
            map: this.map,
            strokeWeight: 1,
            strokeColor: '#0091ea',
            fillColor: '#80d8ff',
            fillOpacity: 0.2,
            path: bounds[i]
          });
          polygons.push(polygon);
          let arr=JSON.parse(JSON.stringify(bounds[i]));
          arr.map(item=>{
            latlngArr.push([item.lng,item.lat])
          })
        }


        console.log(latlngArr,polygons,'boundsboundsboundsboundsboundsboundsboundsboundsboundsboundsboundsboundsbounds')
        
        this.latlngArr = latlngArr
        this.polygons = polygons
        this.map.add(polygons)
        // this.map.setFitView()

        
      }
    },
    // 图形区域
    newArea(Amap, map) {
      var that = this;
      let path = Object.assign([],that.runArr)
      let polygonStyle = {}
      if(that.stationShape == 1){
        polygonStyle = {
          fillColor: 'transparent',
          strokeStyle: 'dashed',
        }
      }else{
        polygonStyle = {
          fillColor: '#2E89FF',
          fillOpacity: 0.1,
        }
      }
      that.polygon = new Amap.Polygon({
        // path: arr,
        path: that.stationShape == 1?path:that.runArr,
        strokeColor: '#399CFF',
        strokeWeight: 3,
        // strokeOpacity: 0.2,
        // fillOpacity: 0.4,
        zIndex: 50,
        ...polygonStyle,
        map: map,
      })
      map.add(that.polygon)
      map.setFitView()
      if(that.stationShape == 2){
        that.editorArea(Amap, map)
      }
      
      // that.$refs.map.$amap.setFitView(that.polygons); //视口自适应
    },
    // 编辑图形
    editorArea(Amap, map) {
      this.polyEditor = new Amap.PolyEditor(map, this.polygon)

      this.polyEditor.on('addnode', function(event) {
        console.log('触发事件：addnode')
      })

      this.polyEditor.on('adjust', function(event) {
        console.log('触发事件：adjust')
      })

      this.polyEditor.on('removenode', function(event) {
        console.log('触发事件：removenode')
      })

      this.polyEditor.on('end', (event) => {
        console.log('触发事件： end', this.path)
        // event.target 即为编辑后的多边形对象
        this.offEditor()
      })
    },
    close(){
      this.map && this.map.destroy();
      this.$emit('close')
    },
  },
  filters:{
    codeFil(val){
      return code[val]
    }
  }
}
</script>
<style lang="scss" scoped>
#container{
  height:500px;
  position: relative;
  
}
.my-autocomplete li .name {
    text-overflow: ellipsis;
    overflow: hidden;
}
.my-autocomplete li .addr {
    font-size: 12px;
    color: #b4b4b4;
}

/deep/ .amap-icon img, /deep/ .amap-marker-content img{
  width: auto;
  height: auto;
}
</style>