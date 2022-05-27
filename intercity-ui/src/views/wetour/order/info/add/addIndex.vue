<template>
  <el-drawer
    size="70%"
    ref="drawer"
    direction="ltr"
    title="新增订单"
    
    @close="handleClose"
    :visible.sync="visible"
     :wrapperClosable="false"
  >
    <div class="content-from">
      <div class="flex-center">
        <el-radio-group
          v-model="addForm.charteredCarType"
          @change="onChangeType"
        >
          <el-radio-button :label="4">单程</el-radio-button>
          <el-radio-button :label="1">日租</el-radio-button>
          <el-radio-button :label="2">接机</el-radio-button>
          <el-radio-button :label="3">送机</el-radio-button>
        </el-radio-group>
      </div>
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addRules"
        label-width="150px"
      >
        <h4 class="title">行程信息</h4>
        <!--单程-->
        <single-way
          v-if="addForm.charteredCarType == 4"
          :cityList="cityList"
          :addForm.sync="addForm"
          :addRules.sync="addRules"
        ></single-way>
        <!--日租-->
        <day-rent
          v-else-if="addForm.charteredCarType == 1"
          :cityList="cityList"
          :addForm.sync="addForm"
          :addRules.sync="addRules"
        ></day-rent>
        <!--接机-->
        <join-plane
          v-else-if="addForm.charteredCarType == 2"
          :cityList="cityList"
          :airportList.sync="airportList"
          :addForm.sync="addForm"
          :addRules.sync="addRules"
        ></join-plane>
        <!--送机-->
        <send-plance
          v-else
          :cityList="cityList"
          :airportList.sync="airportList"
          :addForm.sync="addForm"
          :addRules.sync="addRules"
        ></send-plance>

        <h4 class="title">用户信息</h4>

        <el-form-item label="联系号码：" prop="phone">
          <el-select
            v-model="addForm.phoneCode"
            style="width: 130px"
            class="filter-item"
            filterable
          >
            <el-option
              v-for="(item, index) in countryList"
              :key="index"
              :value="item.phoneCode"
              :label="item.phoneCode"
            >
            </el-option>
          </el-select>

          <el-input
            oninput="if(value.length>20)value=value.slice(0,20)"
            style="flex: 1; margin-left: 10px"
            v-model.number="addForm.phone"
            placeholder="请输入号码"
            class="filter-item"
            type="number"
            clearable
          />
        </el-form-item>

        <el-form-item label="联系人：" prop="contactName">
          <el-input
            v-model.trim="addForm.contactName"
            placeholder="请输入联系人"
            style="flex: 1;"
            class="filter-item"
            maxlength="20"
            clearable
          />
        </el-form-item>
         <el-form-item label="微信号" prop="weixin">
           <el-input
             v-model.trim="addForm.weixin"
             placeholder="请输入微信号"
             style="flex: 1;"
             class="filter-item"
             maxlength="20"
             clearable
           />
         </el-form-item>

        <el-form-item prop="certificateType" label="证件类型：">
          <el-select
            v-model="addForm.certificateType"
            style="width: 130px"
            class="filter-item"
            filterable
          >
            <el-option :value="1" label="身份证号" />
            <el-option :value="2" label="护照号" />
          </el-select>
          <el-input
            style="flex: 1; margin-left: 10px"
            v-model.trim="addForm.certificateNo"
            placeholder="请输入证件号"
            class="filter-item"
            maxlength="20"
            clearable
          />
        </el-form-item>

        <el-form-item prop="orderRemark" label="行程备注">
          <!-- <el-input
            v-model="addForm.orderRemark"
            placeholder="请输入行程备注"
            type="textarea"
            maxlength="500" 
            style="flex: 1;" 
            show-word-limit
            class="filter-item" 
           :autosize="{ minRows: 4, maxRows: 6}"
          /> -->

          <el-input
           type="textarea"
            maxlength="500" 
            style="flex: 1;" 
            show-word-limit
            class="filter-item" 
            v-model="addForm.orderRemark" 
           :autosize="{ minRows: 4, maxRows: 10}"
           placeholder="请输入行程备注">
         </el-input>
         
        </el-form-item>
        <el-form-item>
          <el-button
            type="text"
            size="small"
            @click="setText(1)"
            >黄石4日</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="setText(2)"
            >黄石5日</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="setText(3)"
            >落基4日</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="setText(4)"
            >落基5日</el-button
          >
        </el-form-item>
        

        <h4 class="title">订单信息</h4>
        <el-form-item prop="orderAmount" label="订单价格">
          <el-input-number
            style="flex: 1;"
            class="filter-item"
            v-model.number="addForm.orderAmount"
            placeholder="请输入数量"
            :min="0.01"
            :max="10000000"
            
          ></el-input-number>
        </el-form-item>

        <el-form-item prop="orderChannel" label="订单来源">
          <el-select
            v-model="addForm.orderChannel"
            style="flex: 1;"
            class="filter-item"
            filterable
          >
            <!-- <el-option :value="0" label="小程序(线上)" /> -->
            <el-option :value="1" label="线下" />
            <el-option :value="2" label="携程" />
            <el-option :value="3" label="飞猪" />
            <el-option :value="4" label="美团" />
            <el-option :value="5" label="百度" />
          </el-select>
        </el-form-item>

        <el-form-item prop="thirdOrderNo" label="来源平台订单号">
          <el-input
            v-model.trim="addForm.thirdOrderNo"
            placeholder="请输入来源平台订单号"
            style="flex: 1;"
            class="filter-item"
            maxlength="30"
            clearable
          />
        </el-form-item>

        <el-form-item prop="innerRemark" label="内部备注">
          <!-- <el-input -->
            <!-- v-model="addForm.innerRemark" -->
            <!-- placeholder="请输入内部备注" -->
            <!-- style="flex: 1;" -->
            <!-- class="filter-item" -->
            <!-- show-word-limit -->
            <!-- maxlength="500" -->
            <!-- type="textarea" -->
            <!-- :autosize="{ minRows: 2, maxRows: 6}" -->
          <!-- /> -->

         <el-input
           type="textarea"
            maxlength="500" 
            style="flex: 1;" 
            show-word-limit
            class="filter-item" 
            v-model="addForm.innerRemark" 
           :autosize="{ minRows: 4, maxRows: 10}"
           placeholder="请输入内部备注">
         </el-input>
        </el-form-item>

        <el-form-item prop="isPay" label="是否支付">
          <el-radio-group v-model="addForm.isPay" style="flex: 1;margin-top: 7px;">
            <el-radio :label="1">已经支付</el-radio>
            <el-radio :label="0">尚未支付</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div class="flex-center" style="margin: 60px 0px">
        <el-button style="margin: 0 60px" @click="visible = false"
          >返回</el-button
        >

        <el-button style="margin: 0 60px" type="primary" @click="onCreateOrder(1)"
          >创建订单</el-button
        >

          <el-button v-if="addForm.isPay==0" style="margin: 0 60px" type="primary" @click="onCreateOrder(0)"
         >支付订单</el-button
        >
      </div>
    </div>

  </el-drawer>

  
</template>

<script>
import dayRent from "./dayRent.vue";
import singleWay from "./singleWay.vue";
import joinPlane from "./joinPlane.vue";
import sendPlance from "./sendPlance.vue";
import { rule } from "@/util/validateRules";
import { cityCnSelect, addOrderInfo, airportList } from "@/api/wetour/order.js";
import { getCountrySelect } from "@/api/wetour/cityCn.js";



export default {
  components: {
    singleWay,
    dayRent,
    joinPlane,
    sendPlance,
  },
  data() {
    return {
       payDialog: {
          data: {},
          visible: false,
       },
      addForm: {
        charteredCarType: 4, //包车类型 1日租 2接机 3 送机 4单车

        departureCity: "", //出发城市
        departureAddress: "", //出发地址
        departureCityCode: "", //出发城市代码对应城市表里的ID
        departureLatitude: "", //出发纬度
        departureLongitude: "", //出发经度

        destinationCity: "", //目的地城市
        destinationAddress: "", //目的地地址
        destinationCityCode: "", //目的地城市代码对应城市表里的ID
        destinationLatitude: 0, //目的纬度
        destinationLongitude: 0, //目的经度

        departureStartTime: "", //出发时间（用车时间）

        charteredCarRange: 1, //包车范围：1市内包车 2周边包车
        flightNumber: "", //航班号
        passengerNumber: "", //乘车人数成人
        childNumber: "", //乘车人数儿童
        baggageNumber: "", //行李数
        cart: [
          {
            id: 0,
            number: 1,
            busType: 5,
          },
        ],
        phoneCode: "", //
        phone: "",
        contactMobile: "", //联系号码
        contactName: "", //联系人名字
        weixin:"",// 微信号
        certificateType: 1, //证件类型1身份证 2护照
        certificateNo: "", //证件号码
        orderRemark: "", //订单行程备注

        orderAmount: "", //订单价格单位分
        orderChannel: 3, //渠道来源
        thirdOrderNo: "", //外部第三方订单号
        innerRemark: "", //内部备注
        isPay: 1, //是否已支付 默认已支付 1已支付 0未支付

        isForeign: 0,
      },
      addRules: {
        departureAddress: [
          {
            required: true,
            message: "出发地点不能为空",
            trigger: "blur",
          },
        ],

        departureStartTime: [
          {
            required: true,
            message: "出发时间不能为空",
            trigger: "blur",
          },
        ],

        passengerNumber: [
          {
            required: true,
            message: "成人数量不能为空",
            trigger: "blur",
          },
          { validator: rule.checkOneNum, trigger: "blur" },
        ],
        // childNumber: [
        // {
        // required: true,
        // message: "儿童数量不能为空",
        // trigger: "blur",
        // },
        // { validator: rule.checkOneNum, trigger: "blur" },
        // ],
        // baggageNumber: [
        // {
        // required: true,
        // message: "行李数量不能为空",
        // trigger: "blur",
        // },
        // { validator: rule.checkOneNum, trigger: "blur" },
        // ],
        //用户信息
        phone: [
          {
            required: true,
            message: "联系号码不能为空",
            trigger: "blur",
          },
        ],
        contactName: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: "blur",
          },
        ],

        //订单信息
        orderAmount: [
          {
            required: true,
            message: "订单价格不能为空",
            trigger: "blur",
          },
        ],
        orderChannel: [
          {
            required: true,
            message: "订单来源不能为空",
            trigger: "blur",
          },
        ],
      },
      cityList: [],
      airportList: [],
      countryList: [],
    };
  },
  props: {
    dialogData: {
      type: Object,
      default: () => ({}),
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible: {
      get() {
        if (this.dialogVisible) {
          this.cityCnSelect();
          this.getAirportList();
          this.getCountrySelect();
        }
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  methods: {
    setText(text){
      if(text == 1){
        this.addForm.orderRemark = '6月10日\n09:00盐湖城市区酒店接送\n上午：前往彩锅泉，大棱镜泉 \n下午：前往牵牛花池，老忠实间歇泉，随后到达西黄石小镇\n住：Yellowstone Country Inn或同级别酒店\n6月11日\n09:00西黄石小镇酒店接送\n上午：前往诺里斯间歇泉盆地，猛犸热泉，沸腾河，沸腾河泡温泉\n下午：前往断崖，树化石，高塔瀑布，黄石大峡谷，上下瀑布，随后到达西黄石小镇\n住：Yellowstone Country Inn或同级别酒店\n6月12日\n09:00西黄石小镇酒店接送\n上午：前往海登山谷，硫锅，泥火山，钓鱼桥\n下午：前往黄石湖，西拇指间歇泉盆地，大提顿国家公园，随后到达杰克逊小镇\n住：Elk Country Inn或同级别酒店\n6月13日\n09:00杰克逊小镇酒店接送\n上午：前往大提顿国家公园\n下午：结束行程，返回盐湖城酒店'
      }else if(text == 2){
        this.addForm.orderRemark = '6月10日\n09:00盐湖城市区酒店接送\n上午：前往彩锅泉，纪念碑间歇泉盆地 \n下午：前往艺术家调色盘，诺里斯间歇泉盆地，随后到达西黄石小镇\n住：Yellowstone Country Inn或同级别酒店\n6月11日\n09:00西黄石小镇酒店接送\n上午：前往猛犸热泉，沸腾河，沸腾河泡温泉\n下午：前往断崖，树化石，高塔瀑布，黄石大峡谷，上下瀑布，随后到达西黄石小镇\n住：Yellowstone Country Inn或同级别酒店\n6月12日\n09:00西黄石小镇酒店接送\n上午：前往海登山谷，硫锅，泥火山，钓鱼桥\n下午：前往黄石湖，西拇指间歇泉盆地，随后到达西黄石小镇\n住：Yellowstone Country Inn或同级别酒店\n6月13日\n09:00西黄石小镇酒店接送\n上午：前往大棱镜泉，饼干盆地，牵牛花池，黑沙盆地\n下午：前往老忠实间歇泉，大提顿国家公园，随后到达杰克逊小镇\n住：Elk Country Inn或同级别酒店\n6月14日\n09:00杰克逊小镇酒店接送\n上午：前往大提顿国家公园\n下午：结束行程，返回盐湖城酒店'
      }else if(text == 3){
        this.addForm.orderRemark = '6月10日\n09:00卡尔加里市区酒店接送\n上午：前往双杰克湖，明尼万卡湖（游船体验），班夫小镇，翰斯顿峡谷，上下瀑布\n下午：前往约费尔蒙班夫温泉酒店，弓河瀑布，硫磺山，班夫空中缆车，班夫上温泉，随后到达班夫小镇\n住：Banff Inn或同级别酒店\n6月11日\n09:00班夫小镇酒店接送\n上午：前往弓河，佩托湖，哥伦比亚冰原，冰川雪车探险\n下午：前往冰川天空步道，随后到达贾斯珀小镇\n住：Mount Robson Inn或同级别酒店\n6月12日\n09:00贾斯珀小镇酒店接送\n上午：前往玛琳峡谷，玛琳湖\n下午：前往露易丝湖，费尔蒙露易丝湖城堡酒店，随后到达班夫小镇\n住：Banff Inn或同级别酒店\n6月13日\n09:00班夫小镇酒店接送\n上午：前往城堡山，螺旋隧道，翡翠湖，天然桥，塔卡考瀑布，梦莲湖\n下午：结束行程，返回卡尔加里市区酒店'
      }else if(text == 4){
        this.addForm.orderRemark = '6月10日\n09:00卡尔加里市区酒店接送\n上午：前往双杰克湖，明尼万卡湖（游船体验），班夫小镇\n下午：前往翰斯顿峡谷，上下瀑布，班夫上温泉，随后到达班夫小镇\n住：Banff Inn或同级别酒店\n6月11日\n09:00班夫小镇酒店接送\n上午：前往城堡山，螺旋隧道，翡翠湖，自然桥，塔卡考瀑布\n下午：前往露易丝湖，费尔蒙露意丝湖城堡酒店，随后到达班夫小镇\n住：Banff Inn或同级别酒店\n6月12日\n09:00班夫小镇酒店接送\n上午：前往弓湖，佩托湖\n下午：前往哥伦比亚冰原，冰川雪车探险，冰川天空步道，随后到达贾斯珀小镇\n住：Mount Robson Inn或同级别酒店\n6月13日\n09:00贾斯珀小镇酒店接送\n上午：前往玛琳峡谷，玛琳湖（游船体验）\n下午：前往精灵岛，随后到达贾斯珀小镇\n住：Mount Robson Inn或同级别酒店\n6月14日\n09:00贾斯珀小镇酒店接送\n上午：前往费尔蒙班夫温泉酒店，弓河瀑布，硫磺山，班夫空中缆车\n下午：结束行程，返回卡尔加里市区酒店'
      }
    },
    onChangeType(value) {
      console.log("value", value);

      this.addForm.departureCity = ""; //出发城市
      this.addForm.departureAddress = ""; //出发地址
      this.addForm.departureCityCode= ""; //出发城市代码对应城市表里的ID
      this.addForm.departureLatitude= 0;//出发纬度
      this.addForm.departureLongitude= 0; //出发经度

      this.addForm.destinationCity = ""; //目的地城市
      this.addForm.destinationAddress = ""; //目的地地址城市
      this.addForm.destinationCityCode= ""; //目的地城市代码对应城市表里的ID
      this.addForm.destinationLatitude= 0; //目的纬度
      this.addForm.destinationLongitude= 0; //目的经度

      this.addForm.departureStartTime = ""; //出发时间（用车时间）

      this.addForm.isForeign = 0;
      this.defaultCity(this.cityList);
    },
    handleClose() {
      setTimeout(() => {
        this.$emit("close");
      }, 300);
    },
    onCreateOrder(type) {
      console.log(this.addForm,'------')
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$set(this.addForm, "busType", JSON.stringify(this.addForm.cart));
          this.$set(
            this.addForm,
            "contactMobile",
            this.addForm.phoneCode + this.addForm.phone
          );
          addOrderInfo(this.addForm).then((response) => {
            var result = response.data;
            if (result.code == 0) {
              console.log("type",type)
              console.log("response",response.data) 
            
              this.visible = false;
              this.$message.success("创建订单成功");
              this.$emit("success",response.data.data,type);
            } else {
              this.$message.error(result.msg);
            }
          });
        }
      });
    },
    //获取机场
    getAirportList() {
      airportList().then((response) => {
        var result = response.data;
        if (result.code == 0) {
          this.airportList = result.data;
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    //获得城市
    cityCnSelect() {
      cityCnSelect().then((response) => {
        var result = response.data;
        if (result.code == 0) {
          this.cityList = result.data;
          this.defaultCity(result.data);
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    //默认城市
    defaultCity(citys) {
      console.log("citys", citys);
      this.cityList.forEach((element) => {
        if (element.city == "杭州") {
          this.addForm.departureCity = element.city;
          this.addForm.destinationCity = element.city;
        }
      });
      if (!this.addForm.departureCity && citys) {
        this.addForm.departureCity = citys[0].city;
        this.addForm.destinationCity = citys[0].city;
      }
    },
    //获得国家
    getCountrySelect() {
      getCountrySelect().then((response) => {
        var result = response.data;
        if (result.code == 0) {
          result.data.forEach((element) => {
            if (element.phoneCode == "86") {
              this.addForm.phoneCode = element.phoneCode;
            }
          });
          if (!this.addForm.phoneCode) {
            this.addForm.phoneCode = result.data[0].phoneCode;
          }

          this.countryList = result.data;
        } else {
          this.$message.error(response.msg);
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.content-from {
  margin: 0 30px;
  max-height: 90vh;
  overflow-y: scroll;
}

/deep/ .el-form-item__content{
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
</style>