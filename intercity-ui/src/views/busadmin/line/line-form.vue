<template>
  <el-drawer
    :title="
      (myType == 'create' ? '添加' : myType === 'edit' ? '修改' : '查看') +
      '线路'
    "
    @close="handleClose"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
    :close-on-click-modal="false"
    size="70%"
    :visible.sync="visible"
    :wrapperClosable="false"
  >
    <el-scrollbar style="height: 100%">
      <div style="margin: 0 30px; width: 85%;padding-bottom: 100px;">
        <div>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            label-width="100px"
          >
            <el-form-item label="线路名称：" prop="lineName">
              <el-input
                v-model.trim="dataForm.lineName"
                placeholder="请输入站点名称(30字)"
                maxlength="30"
                :disabled="myType === 'look'"
              ></el-input>
            </el-form-item>
            <div class="flex-between">
              <el-form-item label="运营模式：" prop="operationsMode">
                <el-select
                  v-model="dataForm.operationsMode"
                  placeholder="请选择运营模式"
                  :disabled="myType === 'look'"
                  style="width: 180px"
                  @change="clearStationList"
                >
                  <el-option
                    v-for="item in operationsModeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="出发城市：" prop="fromCity">
                <el-select
                  v-model="dataForm.fromCity"
                   filterable clearable
                  placeholder="请选择出发城市"
                  :disabled="myType === 'look'"
                  style="width: 180px"
                  @change="clearStationList"
                >
                  <el-option
                    v-for="item in city"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="到达城市：" prop="toCity">
                <el-select
                  v-model="dataForm.toCity"
                  placeholder="请选择到达城市"
                   filterable clearable
                  :disabled="myType === 'look'"
                  style="width: 180px"
                  @change="clearStationList"
                >
                  <el-option
                    v-for="item in city"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="flex-between">
              <el-form-item label="票价设置：" prop="price">
                <el-input
                  v-model="dataForm.price"
                  placeholder="请输入票价"
                  style="width: 180px"
                  :disabled="myType === 'look'"
                >
                  <span slot="append">元</span>
                </el-input>
              </el-form-item>
              <el-form-item label="首班时间：" prop="startTime">
                <el-time-picker
                  v-model="dataForm.startTime"
                  style="width: 180px"
                  value-format="HH:mm:ss"
                  format="HH:mm"
                  placeholder="首班时间"
                  :disabled="myType === 'look'"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item label="末班时间：" prop="endTime">
                <el-time-picker
                  v-model="dataForm.endTime"
                  style="width: 180px"
                  value-format="HH:mm:ss"
                  format="HH:mm"
                  :disabled="myType === 'look'"
                  
                  placeholder="末班时间"
                >
                </el-time-picker>
              </el-form-item>
            </div>
            <div class="flex-between">
              <el-form-item label="预售天数：" prop="preSaleDay">
                <el-input
                  v-model="dataForm.preSaleDay"
                  placeholder="请输入天数"
                  style="width: 180px"
                  :disabled="myType === 'look'"
                  maxlength="2"
                >
                  <span slot="append">天</span>
                </el-input>
              </el-form-item>
              <el-form-item label="启用状态：" prop="lineStatus">
                <div style="width: 180px">
                  <el-switch
                    :width="56"
                    class="mySwitch"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="myType === 'look'"
                    v-model="dataForm.lineStatus"
                  >
                  </el-switch>
                </div>
              </el-form-item>
              <el-form-item style="opacity: 0">
                <el-input
                  v-model="dataForm.preSaleDay"
                  :disabled="myType === 'look'"
                  placeholder="启用状态0禁用1启用"
                ></el-input>
              </el-form-item>
            </div>

            <el-form-item label="短信推送：" prop="mobile">
              <el-input
                v-model="dataForm.mobile"
                :disabled="myType === 'look'"
                placeholder="请输入手机号，多个手机号请用英文逗号“，”隔开"
              ></el-input>
            </el-form-item>

            <el-form-item label="备注说明：">
              <el-input
                v-model="dataForm.remarks"
                placeholder="请输入备注内容(50字)"
                maxlength="50"
                :disabled="myType === 'look'"
              ></el-input>
              <!-- <el-input v-model.trim="dataForm.remarks" maxlength="50" placeholder="备注" type="textarea" show-word-limit :rows="4" :disabled="type === 'look'"></el-input> -->
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime" v-if="myType == 'look'">
              <el-input v-model.trim="dataForm.createTime"  :disabled="myType == 'look'"></el-input>
            </el-form-item>
            <el-form-item label="创建人" prop="createUser" v-if="myType == 'look'">
              <el-input v-model.trim="dataForm.createUser"  :disabled="myType == 'look'"></el-input>
            </el-form-item>
          </el-form>

          <div class="el-form-item is-required el-form-item--small">
            <div style="width: 100px" class="el-form-item__label">
              车辆信息：
            </div>
            <div class="el-form-item__content" style="margin-left: 100px" v-if="myType !== 'look'">
              <div class="add" @click="addBus">
                <i class="el-icon-circle-plus-outline"></i> 添加车辆
              </div>
            </div>
          </div>
          <div class="avue-crud el-form-item" v-if="busList.length">
            <el-table :data="busList" border>
              <el-table-column type="index" label="序号" width="50">
              </el-table-column>

              <el-table-column
                prop="number"
                header-align="center"
                align="center"
                label="车牌号"
              >
              </el-table-column>
              <el-table-column
                prop="busType"
                header-align="center"
                align="center"
                label="车辆类型"
              >
                <template slot-scope="scope">
                  {{scope.row.busType | busTypeFil}}
                </template>
              </el-table-column>
              <el-table-column
                prop="driverName"
                header-align="center"
                align="center"
                label="司机信息"
              >
                <template slot-scope="scope">
                  {{scope.row.driverName}} {{scope.row.mobile}}
                </template>
              </el-table-column>
                
              <el-table-column
                header-align="center"
                align="center"
                label="操作"
              >
                <template slot-scope="scope">
                  <!-- v-if="permissions.busadmin_station_del" -->
                  <!-- @click="deleteHandle(scope.row.id)" -->
                  <el-button
                    type="text"
                    size="small"
                    icon="el-icon-delete"
                    :disabled="myType === 'look'"
                    @click="deleteBus(scope.row, scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="el-form-item is-required el-form-item--small">
            <div style="width: 100px" class="el-form-item__label">
              站点信息：
            </div>
            <div class="el-form-item__content" style="margin-left: 100px" v-if="myType !== 'look'">
              <div class="add" @click="addStation">
                <i class="el-icon-circle-plus-outline"></i> 添加站点
              </div>
            </div>
          </div>
          <div class="avue-crud el-form-item" v-show="stationList.length">
            <el-table :data="stationList" border  
              row-key="stationId"
              class="myTable"
              >
              <el-table-column
                label="序号"
                width="50">
                <template slot-scope="scope">
                  {{ scope.$index+1 }}
                </template>
              </el-table-column>
              
              <el-table-column
                prop="siteName"
                header-align="center"
                align="center"
                label="站点名称"
              >
              </el-table-column>
              <el-table-column
                prop="stationType"
                header-align="center"
                align="center"
                label="站点类型"
              >
                <template slot-scope="scope">
                  {{ scope.row.stationType | stationTypeFil }}
                </template>
              </el-table-column>

              <el-table-column
                prop="stationShape"
                header-align="center"
                align="center"
                label="站点类型"
              >
                <template slot-scope="scope">
                  {{ scope.row.stationShape | stationShapeFil }}
                </template>
              </el-table-column>

              
              <el-table-column
                prop="runtime"
                header-align="center"
                align="center"
                label="运行时长(分钟)"
                width="160"
              >
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.runtime" controls-position="right" size="small" :min="0" :max="99999" :disabled="scope.row.type == 1 || myType === 'look'"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                prop="distance"
                header-align="center"
                align="center"
                label="距离(km)"
                width="160"
              >
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.distance" controls-position="right" size="small" :min="0" :max="99999" :disabled="scope.row.type == 1 || myType === 'look'"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                prop="city"
                header-align="center"
                align="center"
                label="所属城市"
              >
                <template slot-scope="scope">
                  {{ scope.row.city | codeFil }}<template v-if="scope.row.town"> - {{ scope.row.town | codeFil }}</template>
                </template>
              
              </el-table-column>
              <el-table-column
                prop="type"
                header-align="center"
                align="center"
                label="上下站类型"
              >
                <template slot-scope="scope">
                  {{ scope.row.type | typeFil }}
                </template>
              
              </el-table-column>
              
              <el-table-column header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    icon="el-icon-delete"
                    :disabled="myType === 'look'"
                    @click="deleteStation(scope.row,scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="flex-between" style="margin-top: 30px">
          <div></div>
          <div>
            <el-button @click="visible = false">取消</el-button>
            <el-button
              type="primary"
              @click="dataFormSubmit()"
              v-if="myType !== 'look'"
              :loading="!canSubmit"
              >确定</el-button
            >
          </div>
        </div>
      </div>
    </el-scrollbar>
    <selectBus
      v-if="addBusVisible"
      ref="addBus"
      @selectBus="selectBusFun"
    ></selectBus>
    <selectStation
      v-if="addStationVisible"
      ref="addStation"
      @select="selectStationFun"
    ></selectStation>
    
    <!-- @refreshDataList="getDataList" -->
  </el-drawer>
</template>

<script>
import selectBus from "./select-bus";
import selectStation from "./select-station";
import { code } from "@/util/adcode";
import Sortable from 'sortablejs'
import { getObj, addObj, putObj,getInOrderBusId } from "@/api/busadmin/line";
import { city} from "@/util/city"
export default {
  data() {
    const checkPhone = (rule, value, callback)=>{
      if(value.split(',').length>5){
        callback(new Error('最多可填写5个手机号码'));
      }else{
        let arr = value.split(',')
        if(arr.length != [...new Set(arr)].length){
          callback(new Error('有重复的手机号'));
        }else{
          let bol = false
          arr.forEach(element => {
            if(!(/^1(3|4|5|6|7|8|9)+\d{9}$/.test(element))) bol = true
          });
          if(bol) {
            callback(new Error('请输入正确的手机号'));
          }else{
            callback();
          }
        }
        
        // !(/^1(3|4|5|6|7|8|9)+\d{9}$/.test(value))
        
      }
    }
    const checkEndTime = (rule, value, callback)=>{
      let end = value.split(':'),start = this.dataForm.startTime.split(':')
      if([end[0],end[1]].join('') - [start[0],start[1]].join('') <= 0){
        callback(new Error('首班时间必须早于末班时间'));
      }else{
        callback();
      }
    }

    const checkStartTime= (rule, value, callback)=>{
      this.$refs.dataForm.validateField("endTime")
      callback();
    }
    return {
      visible: false,
      canSubmit: false,
      addBusVisible: false,
      addStationVisible: false,
      city:city,
      dataForm: {
        id: 0,
        lineName: "",
        price: "",
        fromCity: "",
        toCity: "",
        operationsMode: 1,
        preSaleDay: "",
        startTime: "",
        endTime: "",
        lineStatus: 1,
        mobile: "",
        stationInfo: "",
        stationIds: "",
        remarks: "",
        createUser: "",
        createTime: "",
        updateUser: "",
        updateTime: "",
      },
      dataRule: {
        lineName: [
          { required: true, message: "线路名称不能为空", trigger: "blur" },
        ],
        price: [
          {
            required: true,
            message: "票价不能为空",
            trigger: "blur",
          },
          {
            pattern:
              /^([1-9]\d{0,5})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/,
            message: "票价不能超范围（0.01~999999）",
          },
        ],
        fromCity: [
          { required: true, message: "请选择出发城市", trigger: "change" },
        ],
        toCity: [
          { required: true, message: "请选择到达城市", trigger: "change" },
        ],
        operationsMode: [
          { required: true, message: "请选择运营模式", trigger: "change" },
        ],
        preSaleDay: [
          { required: true, message: "请填写预售天数", trigger: "blur" },
          {
            pattern: /^(((\d|[1-9]\d)?))$/,
            message: "预售天数1到99之间的正整数",
          },
        ],
        startTime: [
          { required: true, message: "请选择首班时间", trigger: "change" },
          {validator: checkStartTime,trigger: 'change'}
        ],
        endTime: [
          { required: true, message: "末班时间不能为空", trigger: "请选择末班时间" },
          {validator: checkEndTime,trigger: 'change'}

        ],
        // lineStatus: [
        //   {
        //     required: true,
        //     message: "启用状态0禁用1启用不能为空",
        //     trigger: "blur",
        //   },
        // ],
        mobile: [
          { required: true, message: "至少填写一个手机号码", trigger: "blur" },
          {validator: checkPhone,trigger: 'blur'}
        ],
        
      },
      operationsModeList: [
        { label: "站点到区域", value: 1 },
        { label: "站点到站点", value: 2 },
        { label: "区域到区域", value: 3 },
        { label: "区域到站点", value: 4 },
      ],
      cityList: [],
      myType: "",
      busList: [],
      stationList: [],
      changeList:[],
    };
  },
  components: {
    selectBus,
    selectStation,
  },
  computed: {
    
  },
  filters: {
    stationTypeFil(val) {
      let map = {
        0: "其它",
        1: "火车站",
        2: "景区",
        3: "医院",
        4: "机场",
        5: "行政区",
        6: "学校",
        7: "汽车站",
        8: "社区",
        9: "综合体",
      };
      return map[val];
    },
    stationShapeFil(val) {
      let map = {
        1: "站点",
        2: "区域",
      };
      return map[val];
    },
    codeFil(val) {
      return code[val];
    },
    typeFil(val){
      let map = {
        1: "上车点",
        2: "下车点",
      };
      return map[val];
    },
    busTypeFil(val){
      const map = {
        1:'5座普通轿车',
        2:'7座商务车',
        3:'12座中巴车',
        4:'17座考斯特',
        5:'37座大客车',
      }
      return map[val]
    },
  },
  mounted() {
  // 阻止默认行为
    
     document.body.ondrop = function (event) {
       event.preventDefault();
       event.stopPropagation();
     };
    this.$nextTick(()=>{
      // this.rowDrop()
    })
    setTimeout(()=>{
      this.rowDrop()
    },1500)
  },
  methods: {
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.myTable .el-table__body-wrapper tbody')
      console.log(tbody,'tbody-----------------------')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.stationList.splice(oldIndex, 1)[0]
          _this.stationList.splice(newIndex, 0, currRow)
        }
      })
    },
    init(id, type) {
      this.dataForm.id = id || 0;
      this.myType = type;
      this.visible = true;
      this.canSubmit = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          getObj(this.dataForm.id).then((response) => {
            let data = Object.assign({},response.data.data)
            data.price = data.price - 0
            data.fromCity = data.fromCity + ''
            data.toCity = data.toCity + ''
            this.dataForm = data;
            this.busList = response.data.data.bus
            this.stationList = response.data.data.station
          });
          getInOrderBusId(this.dataForm.id).then(response=>{
            console.log(response.data.data,33333)
            this.changeList = response.data.data
          })
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      console.log(this.dataForm,3333)
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if(this.busList.length == 0){
            return this.$message.error("至少增加一个车辆信息");
          }
          if(this.busList.length > 100){
            return this.$message.error("车辆信息记录数超过100条");
          }

          if(this.stationList.length < 2 ){
            return this.$message.error("至少增加2个站点信息");
          }
          if(this.stationList.length > 100){
            return this.$message.error("站点信息记录数超过100条");
          }
          let upRegions = 0,downRegions = 0,upAddress=true,dwonAddress=true,upAddressData = {},dwonAddressData = {},upNum=0,downNum=0,sequence = true
          let arr = []
          for (const key in this.stationList) {
            if (Object.hasOwnProperty.call(this.stationList, key)) {
              const element = this.stationList[key];
              console.log(key,'-------------------------------')
              if(!element.runtime && element.type == 2) return this.$message.error("运营时长不能为空");
              if((Number(element.runtime) > 99999 || Number(element.runtime) <=0)   && element.type == 2) return this.$message.error("站点运营时长不能超范围（0~99999)");
              if(!element.distance  && element.type == 2) return this.$message.error("站点距离不能为空");
              if((Number(element.distance) > 99999 || Number(element.distance) <=0) && element.type == 2 ) return this.$message.error("站点距离不能超范围（0~99999)");
              if(this.stationList[Number(key)+1] && this.stationList[Number(key)+1].type - element.type <0) sequence = false
              if(element.type == 1 && element.stationShape == 2) upRegions = upRegions+1
              if(element.type == 2 && element.stationShape == 2) downRegions = downRegions+1
              if(element.type == 1 && upAddressData.city ){
                if(upAddressData.town != element.town) upAddress = false
              }else if(element.type == 1 && !upAddressData.town){
                upAddressData.town = element.town
                upAddressData.city = element.city
              }
              if(element.type == 2 && dwonAddressData.city ){
                if(dwonAddressData.town != element.town) dwonAddress = false
              }else if(element.type == 2 && !dwonAddressData.town){
                dwonAddressData.town = element.town
                dwonAddressData.city = element.city
              }
              if(element.type == 1) upNum ++
              if(element.type == 2) downNum ++

              arr.push({
                ...element,
                stationSort:key - 0 + 1
              })
            }
          }
          if(!upNum){
            return this.$message.error(`必须有一个上车${(this.dataForm.operationsMode == 1 || this.dataForm.operationsMode == 2) ? '站点' :'区域'}`);
          }
          if(!downNum){
            return this.$message.error(`必须有一个下车${(this.dataForm.operationsMode == 2 || this.dataForm.operationsMode == 4) ? '站点' :'区域'}`);
          }
          if((this.dataForm.operationsMode == 1 || this.dataForm.operationsMode == 3) && downRegions>1 ){
            return this.$message.error("下车区域不能有多个区域");
          }
          if((this.dataForm.operationsMode == 4 || this.dataForm.operationsMode == 3) && upRegions>1 ){
            return this.$message.error("上车区域不能有多个区域");
          }
          if(!upAddress){
            return this.$message.error("上车站点须在同一个区县");
          }
          if(!dwonAddress){
            return this.$message.error("下车站点须在同一个区县");
          }
          if(!sequence){
            return this.$message.error(`上下站点（区域）顺序不对`);
          }
          console.log(this.dataForm,this.busList,this.stationList)
          let object = {
            ...this.dataForm,
            price:this.dataForm.price,
            bus:[...this.busList],
            station:[...arr],
          }
          this.canSubmit = false;
          if (this.dataForm.id) {
            putObj(object)
              .then((data) => {
                this.$notify.success("修改成功");
                this.visible = false;
                this.$emit("refreshDataList");
              })
              .catch(() => {
                this.canSubmit = true;
              });
          } else {
            addObj(object)
              .then((data) => {
                this.$notify.success("添加成功");
                this.visible = false;
                this.$emit("refreshDataList");
              })
              .catch(() => {
                this.canSubmit = true;
              });
          }
        }
      });
    },
    handleClose() {
      setTimeout(() => {
      console.log(22222222)
        this.$emit("close");
      }, 300);
    },
    addBus() {
      this.addBusVisible = true;
      this.$nextTick(() => {
        this.$refs.addBus.init(this.busList);
      });
    },
    addStation() {
      let { dataForm } = this;
      if (!dataForm.operationsMode) {
        return this.$message.error("请选择运营模式");
      }
      if (!dataForm.fromCity || !dataForm.toCity) {
        return this.$message.error("请先选择出发或到达城市");
      }
      this.addStationVisible = true;
      this.$nextTick(() => {
        console.log(dataForm.operationsMode,dataForm.operationsMode == 2 ? 1 : dataForm.operationsMode == 3 ? 2 : '' )
        this.$refs.addStation.init({
          stationList:this.stationList,
          operationsMode:dataForm.operationsMode,
          fromCity:dataForm.fromCity,
          toCity:dataForm.toCity,
          stationShape:dataForm.operationsMode == 2 ? 1 : dataForm.operationsMode == 3 ? 2 : '' 
        });
      });
    },
    deleteBus(item, index) {
      if(this.changeList.indexOf(item.busId) != -1){
        return this.$message.error("当前车辆还有未完成的任务");
      }
      
      this.busList.splice(index, 1);
    },
    deleteStation(item, index) {
      this.stationList.splice(index, 1);
    },
    selectBusFun(arr) {
      console.log(arr, 333333);
      this.busList = [...this.busList, ...arr];
    },
    selectStationFun(arr){
      console.log(arr,333333)
      this.stationList = [...this.stationList, ...arr];
    },
    clearStationList(){
      this.stationList = []
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .mySwitch {
  height: 30px;
  line-height: 30px;
  .el-switch__core {
    height: 30px;
    border-radius: 15px;
    &::after {
      width: 26px;
      height: 26px;
    }
  }
  &.is-checked .el-switch__core::after {
    margin-left: -27px;
  }
}
.add {
  color: #2e89ff;
  font-size: 14px;
  line-height: 32rpx;
  cursor: pointer;
}
</style>