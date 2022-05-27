<template>
  <el-drawer
    :title="(dialogType =='create' ? '添加' : dialogType ==='edit' ? '修改' : '查看')"
    @close="handleClose"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
    :close-on-click-modal="false"
    :wrapperClosable="false" 
    size="85%"
    :visible.sync="visible">
    <el-scrollbar style="height: 100%">

      <div style="margin: 0 30px; width: 85%;padding-bottom: 100px;">
              
        <el-form :model="dataForm"  ref="dataForm" :rules="dataRule"   >
          <h4 class="title">基本信息</h4>
          <div class="flex-between">
            <el-form-item label="城市："  style="width:50%;" prop="data.city"   label-width="130px"> 
              <el-input v-model="dataForm.data.city"  maxlength="30" placeholder="请输入城市名称" :disabled="dialogType === 'look'"></el-input>
            </el-form-item>
            <el-form-item label="国家："  style="width:50%;" prop="data.country" label-width="130px">
              <!-- <el-input v-model="dataForm.data.country"  maxlength="30" placeholder="请输入国家名称" :disabled="dialogType === 'look'"></el-input> -->
              
              <el-select
                v-model="dataForm.data.country"
                filterable clearable
                @change="handelChange"
              >
                <el-option :value="item.country" :label="item.country" v-for="item in countryList" :key="item.country" />
                
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="所在时区："  style="width:50%;" prop="data.timeZone" label-width="130px">
              <div style="display:flex;align-items:center;">
                <el-input-number
                  v-model.number="dataForm.data.timeZone"
                  placeholder="东时区为正数西时区为负数"
                  :min="-12"
                  :max="12"
                  style="flex:1"
                  :disabled="dialogType === 'look'"
                ></el-input-number>
                <!-- <el-input v-model="dataForm.data.timeZone" maxlength="3" placeholder="东时区为正数西时区为负数"  type="number" :disabled="dialogType === 'look'"></el-input> -->
                <el-tooltip class="item" effect="dark" content="例：东八区为8，西五区为-5" placement="top">
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label="国际电话区号：" style="width:50%;" prop="data.telephoneCode" label-width="130px">
              <div style="display:flex;align-items:center;">
              <el-input v-model="dataForm.data.telephoneCode"  maxlength="10" placeholder="请输入国家区号" disabled></el-input>
               <el-tooltip class="item" effect="dark" content="例：中国为+86，美国为+1" placement="top">
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </div>
            </el-form-item>
          </div>

          <div class="flex-between">
            <el-form-item label="城市所在经度："  style="width:50%;" prop="data.lng"   label-width="130px"> 
              <el-input v-model="dataForm.data.lng"  maxlength="30" placeholder="请输入城市所在经度" disabled></el-input>
            </el-form-item>
            <el-form-item label="城市所在纬度："  style="width:50%;" prop="data.lat" label-width="130px">
              <!-- <el-input v-model="dataForm.data.country"  maxlength="30" placeholder="请输入国家名称" :disabled="dialogType === 'look'"></el-input> -->
              <el-input v-model="dataForm.data.lat"  maxlength="30" placeholder="请输入城市所在纬度" disabled></el-input>
            </el-form-item>
              
          </div>


          <div class="flex-between">
            <el-form-item label="接收短信号码："  style="width:50%;" prop="data.receiveMobile" label-width="130px">
               <div style="display:flex;align-items:center;">
                  <el-input v-model="dataForm.data.receiveMobile" placeholder="请输入接收短信号码"  :disabled="dialogType === 'look'"></el-input>
                  <el-tooltip class="item" effect="dark" content="例：东八区为8，西五区为-5" placement="top">
                    <div slot="content">
                      1、最多可以添加10个手机号码<br/>2、每个手机号码之间请用英文逗号隔开<br/>3、运营人员接到用户下单成功提醒的号码</div>
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
               </div>
              
            </el-form-item>
            <el-form-item v-if="dialogType =='edit'" label="是否开通包车：" style="width:50%;" label-width="130px">
              <el-switch
                v-model="dataForm.data.businessStatus"
                :active-value="1"
                :inactive-value="0"
                v-if="dialogType !=='create'"
              >
              </el-switch>
            </el-form-item>
          </div>
          <template v-if="dataForm.data.businessStatus == 1 && dialogType !=='create'">

            
            <h4 class="title">单日包车价格配置 <span style="font-size:14px;color:#999999;">额定里程的单位是公里，额定时间的单位是小时，车型不同产品的单位为元（人民币）</span></h4>

            <div class="avue-crud el-form-item" v-if="dataForm.dayList.length">
              <el-table :data="dataForm.dayList" border  
                row-key="stationId"
                class="myTable"
                >
                <el-table-column
                  prop="projectName"
                  header-align="center"
                  align="center"
                  label="项目名称"
                  >
                
                </el-table-column>
                
                <el-table-column
                  prop="distance"
                  header-align="center"
                  align="center"
                  label="额定里程(KM)"
                >
                  <template slot-scope="scope">
                    <!--  -->
                      <!--  -->
                    <el-form-item
                      :rules="dataRule.dayList.distance"
                      :prop="'dayList.' + scope.$index + '.distance'"
                    >
                    <!-- <div class="flex-start"> -->
                      <el-input v-model="scope.row.distance"  maxlength="30" placeholder="请输入额定里程"></el-input>
                      <!-- <div style="width:25px;">KM</div>
                    </div> -->
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="runtime"
                  header-align="center"
                  align="center"
                  label="额定时间(小时)"
                >
                  <template slot-scope="scope">
                    <!-- <div class="flex-start"> -->
                      <el-form-item
                        :rules="dataRule.dayList.runtime"
                        :prop="'dayList.' + scope.$index + '.runtime'"
                      >
                      <el-input v-model="scope.row.runtime"  maxlength="30" placeholder="请输入额定时间"></el-input>
                      </el-form-item>
                      <!-- <div style="width:5px;">H</div>
                    </div> -->
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fiveSeatPrice"
                  header-align="center"
                  align="center"
                  label="舒适5座(元/辆)"
                >
                  <template slot-scope="scope">
                      <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'dayList.' + scope.$index + '.fiveSeatPrice'"
                      >
                        <el-input v-model="scope.row.fiveSeatPrice"  maxlength="30" ></el-input>
                      </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sevenSeatPrice"
                  header-align="center"
                  align="center"
                  label="舒适7座(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'dayList.' + scope.$index + '.sevenSeatPrice'"
                      >
                        <el-input v-model="scope.row.sevenSeatPrice"  maxlength="30" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="twelveSeatPrice"
                  header-align="center"
                  align="center"
                  label="商务12座(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'dayList.' + scope.$index + '.twelveSeatPrice'"
                    >
                      <el-input v-model="scope.row.twelveSeatPrice"  maxlength="30" ></el-input>
                     </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="nineteenSeatPrice"
                  header-align="center"
                  align="center"
                  label="巴士19座(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'dayList.' + scope.$index + '.nineteenSeatPrice'"
                      >
                  <el-input v-model="scope.row.nineteenSeatPrice"  maxlength="30" ></el-input>
                     </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="thirtySevenPrice"
                  header-align="center"
                  align="center"
                  label="巴士37座(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'dayList.' + scope.$index + '.thirtySevenPrice'"
                      >
                  <el-input v-model="scope.row.thirtySevenPrice"  maxlength="30" ></el-input>
                     </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fortyNinePrice"
                  header-align="center"
                  align="center"
                  label="巴士49座(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'dayList.' + scope.$index + '.fortyNinePrice'"
                      >
                  <el-input v-model="scope.row.fortyNinePrice"  maxlength="30" ></el-input>
                     </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fortyNinePrice"
                  header-align="center"
                  align="center"
                  label="电子围栏"
                >
                  <template slot-scope="scope">
                    <el-button type="primary" @click="setMap(scope.row)" >设置</el-button>

                  </template>
                </el-table-column>
              </el-table>
            </div>
            <h4 class="title">接送机价格配置 <span style="font-size:14px;color:#999999;">上限里程内（KM），按照接送机价格计算，超出里程则全部按照长途包车逻辑计算超出里程金额(人民币)</span></h4>

            <div class="avue-crud el-form-item" >
              <el-table :data="dataForm.airportList" border  
                row-key="stationId"
                class="myTable"
                >
                <el-table-column
                  prop="airportName"
                  header-align="center"
                  align="center"
                  label="机场名称"
                  >
                
                </el-table-column>
                
                <el-table-column
                  prop="distance"
                  header-align="center"
                  align="center"
                  label="上限里程(KM)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :rules="dataRule.dayList.distance"
                      :prop="'airportList.' + scope.$index + '.distance'"
                    >
                    <el-input v-model="scope.row.distance"  maxlength="30" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                
                <el-table-column
                  prop="fiveSeatPrice"
                  header-align="center"
                  align="center"
                  label="舒适5座(元/辆)"
                >
                  <template slot-scope="scope">
                     <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'airportList.' + scope.$index + '.fiveSeatPrice'"
                      >
                      <el-input v-model="scope.row.fiveSeatPrice"  maxlength="30" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sevenSeatPrice"
                  header-align="center"
                  align="center"
                  label="舒适7座(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'airportList.' + scope.$index + '.sevenSeatPrice'"
                      >
                  <el-input v-model="scope.row.sevenSeatPrice"  maxlength="30" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="twelveSeatPrice"
                  header-align="center"
                  align="center"
                  label="商务12座(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'airportList.' + scope.$index + '.twelveSeatPrice'"
                      >
                  <el-input v-model="scope.row.twelveSeatPrice"  maxlength="30" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="nineteenSeatPrice"
                  header-align="center"
                  align="center"
                  label="巴士19座(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'airportList.' + scope.$index + '.nineteenSeatPrice'"
                      >
                  <el-input v-model="scope.row.nineteenSeatPrice"  maxlength="30" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="thirtySevenPrice"
                  header-align="center"
                  align="center"
                  label="巴士37座(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'airportList.' + scope.$index + '.thirtySevenPrice'"
                      >
                  <el-input v-model="scope.row.thirtySevenPrice"  maxlength="30" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fortyNinePrice"
                  header-align="center"
                  align="center"
                  label="巴士49座(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'airportList.' + scope.$index + '.fortyNinePrice'"
                      >
                  <el-input v-model="scope.row.fortyNinePrice"  maxlength="30" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <h4 class="title">单程包车配置 <span style="font-size:14px;color:#999999;">支付金额计算公式：（公里数-起步里程）*单价+配额+底价</span></h4>


            <div class="avue-crud el-form-item" >
              <el-table :data="dataForm.singleList" border  
                row-key="stationId"
                class="myTable"
                >
                <el-table-column
                  prop="vehicleName"
                  header-align="center"
                  align="center"
                  label="车型"
                  >
                  <!-- <template slot-scope="scope">
                    {{scope.row.vehicleType | vehicleTypeFil}}
                  </template> -->
                </el-table-column>
                
                <el-table-column
                  prop="startMileage"
                  header-align="center"
                  align="center"
                  label="起步里程(KM)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :rules="dataRule.dayList.newdistance"
                      :prop="'singleList.' + scope.$index + '.startMileage'"
                    >
                    <el-input v-model="scope.row.startMileage"  maxlength="30" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="lowestPrice"
                  header-align="center"
                  align="center"
                  label="底价(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.newPrice"
                        :prop="'singleList.' + scope.$index + '.lowestPrice'"
                      >
                    <el-input v-model="scope.row.lowestPrice"  maxlength="30" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                
                <el-table-column
                  prop="unitPrice"
                  header-align="center"
                  align="center"
                  label="单价(元/辆)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                        :rules="dataRule.dayList.Price"
                        :prop="'singleList.' + scope.$index + '.unitPrice'"
                      >
                  <el-input v-model="scope.row.unitPrice"  maxlength="30" ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="quotaPrice"
                  header-align="center"
                  align="center"
                  label="配额(元/辆)"
                >
                  <template slot-scope="scope">
                        <!-- :rules="dataRule.dayList.sevenSeatPrice" -->

                    <el-form-item
                      :rules="dataRule.dayList.sevenSeatPrice"
                        :prop="'singleList.' + scope.$index + '.quotaPrice'"
                      >
                        <el-input v-model="scope.row.quotaPrice"  maxlength="30" ></el-input>

                      <!-- <el-input-number
                        v-model.number="scope.row.quotaPrice"
                        :min="-999999.99"
                        :max="999999.99"
                        :step="0.01"
                        style="width:150px"
                      ></el-input-number> -->
                      <!-- <el-input v-model="scope.row.quotaPrice"  maxlength="30" ></el-input> -->
                    </el-form-item>
                  </template>
                </el-table-column>
                
              </el-table>
            </div>
          </template>
        </el-form>
        <div  class=" flex-between" style="margin-top:30px;">
          <div>

          </div>
          <div>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit" v-if=" dialogType !== 'look'" :loading="!canSubmit" >确定</el-button>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <mapDialog :myData="mapData"  v-if="mapVisible"  @success="chandelSuccess"
        :dialogVisible.sync="mapVisible" ref="map" @close="mapVisible = false"></mapDialog>
    <!-- 5b4RLQGqMoKWEhcTF2F9jvRvGeurBUZM -->
  </el-drawer>
</template>

<script>
    import {getCountrySelect, editObj, createObj,gmapPlace,checkCityName} from '@/api/wetour/cityCn'

    import mapDialog from './map-dialog'

    export default {
    data () {
      const checkPhone = (rule, value, callback)=>{
        if(value.split(',').length>10){
          callback(new Error('最多可填写10个手机号码'));
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
      const checkCityName = async (rule, value, callback)=>{
        await this.checkCity(value,rule).then(res=>{
          if(res){
            callback(new Error('城市名称已存在'))
          }else{
            callback()
          }
        })
      }
      return {
        canSubmit: true,
        mapVisible:false,
        mapData:{},
        dataForm: {
          data:{
            id: 0,
            city: '',
            country: '',
            timeZone: '',
            telephoneCode: '',
            receiveMobile: '',
            businessStatus: 0,
          }
        },
        dataRule: {
          data:{
            city: [
              { required: true, message: "城市不能为空", trigger: "blur" },
              {validator: checkCityName,trigger: 'blur'}
            ],
            price: [
              {
                required: true,
                message: "票价不能为空",
                trigger: "blur",
              }
            ],
            country: [
              { required: true, message: "国家不能为空", trigger: "change" },
            ],
            timeZone: [
              { required: true, message: "所在时区不能为空", trigger: "blur" },
              {
                pattern:
                  /^-?\d+$/,
                message: "所在时区为整数",
              },
            ],
            telephoneCode: [
              { required: true, message: "国际电话区号不能为空", trigger: "blur" },
            ],
            receiveMobile: [
              { required: true, message: "至少填写一个手机号码", trigger: "blur" },
              {validator: checkPhone,trigger: 'blur'}
            ],
          },
          dayList:{
            distance: [
              { required: true, message: "额定里程不能为空", trigger: "blur" },
              {
                pattern:
                  // /^(([1-9]\d{1,2}(\.\d{1,2})?)|\d((\.\d{1,2})?)|1000|1000.0|1000.00)$/,
                  /^(([1-9]\d{0,2})(\.\d{1,2})?|1000|1000.0|1000.00)$/,
                message: "里程范围(1～1000),正整数",
              },
              
            ],
            newdistance: [
              { required: false, message: "额定里程不能为空", trigger: "blur" },
              {
                pattern:
                  // /^(([1-9]\d{1,2}(\.\d{1,2})?)|\d((\.\d{1,2})?)|1000|1000.0|1000.00)$/,
                  /^(([1-9]\d{0,2})(\.\d{1,2})?|1000|1000.0|1000.00)$/,
                message: "里程范围(1～1000),正整数",
              },
              
            ],
            runtime: [
              { required: true, message: "额定时间不能为空", trigger: "blur" },
              {
                pattern:
                /^(([1-9]\d{0,2})(\.\d{1,2})?|1000|1000.0|1000.00)$/,
                //  /^(([1-9]\d{1,2}(\.\d{1,2})?)|\d((\.\d{1,2})?)|1000|1000.0|1000.00)$/,
                message: "时间范围(1～1000),正整数",
              },

              
            ],
            sevenSeatPrice: [
              {
                required: false,
                message: "价格不能为空",
                trigger: "blur",
              },
              {
                pattern:
                  /^([1-9]\d{0,5})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/,
                message: "价格(0.01~999999.99),两位小数",
              },
            ],
            Price: [
              {
                required: false,
                message: "价格不能为空",
                trigger: "blur",
              },
              {
                pattern:
                  /^([1-9]\d{0,5})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/,
                message: "价格(0.01~999999.99),两位小数",
              },
            ],
            newPrice: [
              {
                required: false,
                message: "价格不能为空",
                trigger: "blur",
              },
              {
                pattern:
                //   /^(([1-9]\d{1,5}(\.\d{1,2})?)|\d((\.\d{1,2})?))$/,
                // message: "价格(0~999999.99)",
                  /^([1-9]\d{0,5})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/,
                message: "价格(0.01~999999.99),两位小数",
              },
            ]
          }
          
        },
        dayList:[],
        airportList:[],
        singleList:[],
        countryList:[],
        district:null
      }
    },
    components: {
      mapDialog
    },
    props: {
      dialogData: {
        type: Object,
        default: () => ({})
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      dialogType: {
        type: String,
        default: ''
      },
    },
    computed: {
      visible: {
        get() {
          return this.dialogVisible;
        },
        set(val) {
          if(!val){
            this.$emit("refreshDataList");
          }
          this.$emit("update:dialogVisible", val); 
        }
      },
    },
    filters:{
      vehicleTypeFil(val){
        const map = {
          5:'舒适5座',
          7:'舒适7座',
          12:'商务12座',
          19:'巴士19座',
          37:'巴士37座',
          49:'巴士37座',
        }
        return map[val]?map[val]:val+'座'
      },
      statusFil(val){
        const map = {
          '0':'未过期',
          '1':'已过期',
        }
        return map[val]
      },
    },
    methods: {
      checkCity(cityName){
        console.log(this.dialogData,'----')
        return new Promise((resolve,reject)=>{
          let data = {
            cityName,
          }
          if(this.dialogType !='create'){
            data.id = this.dialogData.cityCnVO.id
          }
          checkCityName(data).then(res=>{
            resolve(res.data.data)
          })
        })
      },
      setMap(data){
        this.mapData = {
          projectType:data.projectType,
          cityLocation:data.projectType == 1 ? data.cityLocation : data.outsideLocation,
          centerLocation:data.projectType == 1 ? data.cityCenterLocation : data.outsideCenterLocation,
          city:this.dataForm.data.city,
          lng:this.dataForm.data.lng,
          lat:this.dataForm.data.lat,
        }
        this.mapVisible = true
        // console.log(this.mapData,33333)
      },
      chandelSuccess(data){
        for (const key in this.dataForm.dayList) {
          if (Object.hasOwnProperty.call(this.dataForm.dayList, key)) {
            const element = this.dataForm.dayList[key];
            if(element.projectType == data.projectType &&  data.projectType == 1){
              this.dataForm.dayList[key].cityLocation = data.stationLocation
              this.dataForm.dayList[key].cityCenterLocation = data.centerPoint
            }else if(element.projectType == data.projectType &&  data.projectType == 2){
              this.dataForm.dayList[key].outsideLocation = data.stationLocation
              this.dataForm.dayList[key].outsideCenterLocation = data.centerPoint
            }
          }
        }
        console.log(data,333334444555)
      },
      // 重置
      resetForm() {
        this.$refs['dataForm'].resetFields();
      },
      handleClose() {
        setTimeout(()=>{
          this.$emit('close')
        },300)
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      },
      handelChange(){
        this.countryList.forEach(item=>{
          if(item.country == this.dataForm.data.country) {
            this.dataForm.data.telephoneCode = item.phoneCode
            this.dataForm.data.countryCode = item.countryCode
          }
        })
        console.log(6666,this.countryList,this.dataForm.data.country)
        
      },
      dataFormSubmit(){
        console.log(this.dataForm,this.dialogType)
        let that = this
        if(this.dialogType =='create'){
          this.$refs['dataForm'].validate((valid) => {
            if(valid){
              this.countryList.forEach(item=>{
                if(item.country == this.dataForm.data.country) {
                  this.dataForm.data.telephoneCode = item.phoneCode
                  this.dataForm.data.countryCode = item.countryCode
                }
              })
              let { dataForm } = this
              console.log(dataForm,'-----aaa')
              if(dataForm.data.telephoneCode == 86){
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


                that.district.search(dataForm.data.city, function (status, result) {
                  // console.log(status, result,33333)
                  if(result.districtList){
                    dataForm.data.lat = result.districtList[0].center.lat
                    dataForm.data.lng = result.districtList[0].center.lng

                    createObj({cityCnRequestDTO:dataForm.data}).then(res=>{
                      if(res.data.code == 0 ){
                        that.$message.success(`新增成功`);
                        
                        // this.dialogFormVisible = false
                        that.visible = false
                      }
                      
                    })
                    
                  }else{
                        that.$message.error(`未找到城市`);
                    
                  }
                })
                return false
              }else{
                console.log(555555)
                let data = {
                  countryCode:that.dataForm.data.countryCode,
                  keyword:that.dataForm.data.city
                }
                gmapPlace(data).then(res=>{
                  dataForm.data.lng = res.data.data.length?res.data.data[0].geometry.location.lng:0;
                  dataForm.data.lat = res.data.data.length?res.data.data[0].geometry.location.lat:0;
                  if(dataForm.data.lng){
                    createObj({cityCnRequestDTO:dataForm.data}).then(res=>{
                      if(res.data.code == 0 ){
                        that.$message.success(`新增成功`);
                        // this.dialogFormVisible = false
                        that.visible = false
                      }
                      
                    })
                  }else{
                    that.$message.error(`未找到城市`);
                  }
                  
                })
              }

              
              
              
            }
          })
          return false
        }
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.countryList.forEach(item=>{
              if(item.country == this.dataForm.data.country) {
                this.dataForm.data.telephoneCode = item.phoneCode
                this.dataForm.data.countryCode = item.countryCode
              }
            })
            let { dataForm } = this
            let data = {
              cityCnRequestDTO:dataForm.data,
              cityDayPriceDTOS:dataForm.dayList,
              cityAirportPriceDTOS:dataForm.airportList,
              citySinglePriceDTOS:dataForm.singleList,
            }
            
            if(dataForm.data.businessStatus){
              if(!this.dataForm.dayList[0].cityCenterLocation){
                  this.$message.error(`请先设置市内包车电子围栏`);
                return false
              }
              if(!this.dataForm.dayList[1].outsideCenterLocation){
                  this.$message.error(`请先设置周边包车电子围栏`);
                return false
              }
              let dayData = {},dayErrorData = {}
              dataForm.dayList.forEach(item=>{
                // let arr = Object.keys(dayData)
                let arr = ['distance','runtime','fiveSeatPrice','sevenSeatPrice','fortyNinePrice','nineteenSeatPrice','thirtySevenPrice','twelveSeatPrice']

                if(!Object.keys(dayData).length){
                  dayData = item
                }else{
                  arr.forEach(element => {
                    // console.log(dayData[element],item[element])
                    if((dayData[element] &&!item[element] ) || (!dayData[element] &&item[element] ) ){
                      dayErrorData = item
                    }
                    return false
                  });
                }
              })
              if(Object.keys(dayErrorData).length){
                return this.$message.error('必须同时输入两个项目的价格，才能开通车型');
              }


              let airportData = {},airportErrorData = {}
              dataForm.airportList.forEach(item=>{
                let arr = ['distance','fiveSeatPrice','sevenSeatPrice','twelveSeatPrice','nineteenSeatPrice','thirtySevenPrice','fortyNinePrice']
                if(!Object.keys(airportData).length){
                  airportData = item
                }else{
                  arr.forEach(element => {
                    // console.log(dayData[element],item[element])
                    console.log(airportData[element] , item[element],airportData,item)
                    if((airportData[element] &&!item[element] )|| (!airportData[element] &&item[element] ) ){
                      console.log(676666)
                      airportErrorData = item
                    }
                    return false
                  });
                }
              })


              if(Object.keys(airportErrorData).length){
                return this.$message.error('必须同时输入所有机场的价格，才能开通车型');
              }


              let singleListData = {},singleListErrorData = {}
              dataForm.singleList.forEach(item=>{
                // console.log(!(item.lowestPrice &&  item.startMileage && item.unitPrice))
                // console.log(!(!item.lowestPrice && !item.startMileage && !item.unitPrice))
                // if(!(item.lowestPrice && item.lowestPrice>=0 && item.startMileage && item.unitPrice) && (!item.lowestPrice && !item.startMileage && !item.unitPrice)){
                if(!(item.lowestPrice && item.startMileage && item.unitPrice) && !(!item.lowestPrice && !item.startMileage && !item.unitPrice)){

                  // console.log(item,33333,item.lowestPrice , item.startMileage , item.unitPrice)
                  // console.log(item,3333)
                  singleListErrorData = item
                }
              })
              if(Object.keys(singleListErrorData).length){
                return this.$message.error('车型对于的里程，底价，单价必须都存在才可以开通');
              }
            }
            


            if(data.cityCnRequestDTO.telephoneCode == 86){
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
              that.district.search(data.cityCnRequestDTO.city, function (status, result) {
                // console.log(status, result,33333)
                console.log(result.districtList,data.cityCnRequestDTO,result.districtList.length)
                if(result.districtList.length){
                  console.log(result.districtList[0].center,result.districtList[0].center.lat)
                  data.cityCnRequestDTO.lat = result.districtList[0].center.lat
                  data.cityCnRequestDTO.lng = result.districtList[0].center.lng
                  console.log(data,'------')
                  if(data.cityCnRequestDTO.lng){
                    editObj(data).then(res=>{
                      if(res.data.code == 0 ){
                        that.$message.success(`修改成功`);
                        
                        // this.dialogFormVisible = false
                        that.visible = false
                      }
                    })
                  
                  }else{
                    that.$message.error(`未找到城市`);
                  }
                  
                }
              })
              return false
            }else{
              let datas = {
                  countryCode:data.cityCnRequestDTO.countryCode,
                  keyword:data.cityCnRequestDTO.city
                }
                gmapPlace(datas).then(res=>{
                  data.cityCnRequestDTO.lng = res.data.data.length?res.data.data[0].geometry.location.lng:0;
                  data.cityCnRequestDTO.lat = res.data.data.length?res.data.data[0].geometry.location.lat:0;
                  console.log(data.cityCnRequestDTO.lng,'======')
                  if(data.cityCnRequestDTO.lng){
                  // data.cityCnRequestDTO.lng = 0
                  // data.cityCnRequestDTO.lat = 0
                    editObj(data).then(res=>{
                      if(res.data.code == 0 ){
                        that.$message.success(`修改成功`);
                        
                        // this.dialogFormVisible = false
                        that.visible = false
                      }
                    })
                  }else{
                    that.$message.error(`未找到城市`);
                  }
                })
            }
            
          }
          
        })
        // console.log(this.dataForm)
        // console.log(this.dayList)
        // console.log(this.airportList)
        // console.log(this.singleList)
      },
      getCountrySelect(){
        getCountrySelect().then(res=>{
          console.log(res,33333)
          this.countryList = res.data.data
        })
      }
    },
    created(){
      if(this.dialogType !='create'){
        this.dialogData.singlePriceVOS.forEach((element,index) => {
          this.dialogData.singlePriceVOS[index].lowestPrice = this.dialogData.singlePriceVOS[index].lowestPrice == null ? '' : ( this.dialogData.singlePriceVOS[index].lowestPrice + '')
        });
        this.dataForm = {
          data:Object.assign({},this.dialogData.cityCnVO),
          dayList : this.dialogData.cityDayPrices?this.dialogData.cityDayPrices:[],
          airportList : this.dialogData.cityAirportPriceVOS?this.dialogData.cityAirportPriceVOS:[],
          singleList : this.dialogData.singlePriceVOS?this.dialogData.singlePriceVOS:[],
        }
      }
      this.getCountrySelect()
      // this.dayList = this.dialogData.cityDayPrices
      // this.airportList = this.dialogData.cityAirportPriceDetailFeignDTO
      // this.singleList = this.dialogData.citySinglePriceDetailFeignDTO
      console.log(this.dayList,'this.dayList')
      console.log(666666)
    },
  }
</script>
<style scoped lang="scss">
.dialog-footer{
  display: block;
}
.avue-crud /deep/ .el-form-item--small.el-form-item{
  margin-bottom: 0;
  padding: 10px 0;
}
.avue-crud /deep/ .el-table .cell{
  overflow: initial;
}
/deep/ .is-success .el-input-number__increase {
    right: 1px!important;
}
</style>