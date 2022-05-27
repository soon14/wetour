<template>
  <div>
     <!--机场-->
    <el-form-item
      label="机场："
      prop="destinationAddress"
      :rules="[
        {
          required: true,
          message: '目的地不能为空',
          trigger: 'blur',
        },
      ]"
    >
      <el-select
        v-model="addForm.destinationCity"
        @change="onChangeCity"
        placeholder="请选择城市"
        style="width: 130px"
        filterable
      >
        <el-option
          v-for="item in airportCityList"
          :key="item.id"
          :value="item.cityCnName"
          :label="item.cityCnName"
        >
        </el-option>
      </el-select>
      <el-select
        style="flex: 1;  margin-left: 10px"
        v-model="addForm.destinationAddress"
        @change="onChangeAirport"
        placeholder="请选择机场"
        filterable
      >
        <el-option
          v-for="(item, index) in airports"
          :key="index"
          :value="item.airportName"
          :label="item.airportName"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <!--出发地点-->
    <el-form-item label="出发地点：" prop="departureAddress">
      <el-select
        v-model="addForm.departureCity"
        placeholder="请选择城市"
        style="width: 130px"
        @change="handelChange"
        filterable
      >
        <el-option
          v-for="item in cityList"
          :key="item.id"
          :value="item.city"
          :label="item.city"
        >
        </el-option>
      </el-select>
      <el-autocomplete
        style="flex: 1;  margin-left: 10px"
        :fetch-suggestions="querySearchAsync"
        v-model="addForm.departureAddress"
        placeholder="请输入出发地点"
        @select="handleSelect"
      >
        <template slot-scope="{ item }">
          <span style="font-size: 14px">{{ item.name }}</span>

          <div
            style="
              font-size: 12px;
              color: #666;
              line-height: 1;
              padding-bottom: 5px;
            "
          >
            {{ item.address || item.formattedAddress }}
          </div>
        </template>
      </el-autocomplete>
    </el-form-item>

    <!--用车时间(当地)-->
    <el-form-item label="用车时间(当地)：" prop="departureStartTime">
      <el-date-picker
        type="datetime"
        style="flex: 1; "
        placeholder="选择日期"
        format="yyyy-MM-dd HH:mm"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
        v-model="addForm.departureStartTime"
      ></el-date-picker>
    </el-form-item>

    <!--乘车人数-->
    <el-form-item label="乘车人数：" prop="passengerNumber">
      <el-input-number
        v-model.number="addForm.passengerNumber"
        placeholder="请输入乘车人数"
        style="flex: 1; "
        :min="1"
        :max="100"
      ></el-input-number>
    </el-form-item>

    <!--乘车儿童-->
    <el-form-item label="乘车儿童" prop="childNumber">
      <el-input-number
        v-model.number="addForm.childNumber"
        placeholder="请输入乘车儿童"
        style="flex: 1; "
        :min="0"
        :max="100"
      ></el-input-number>
    </el-form-item>

    <!--行李数量-->
    <el-form-item label="行李数量" prop="baggageNumber">
      <el-input-number
        v-model.number="addForm.baggageNumber"
        placeholder="请输入行李数量"
        style="flex: 1; "
        :min="0"
        :max="100"
      ></el-input-number>

      <el-popover placement="right-start" width="250" trigger="hover">
        <div>
          1、行李大小计算标准为24寸行李箱<br />2、超过24寸的大行李箱,计件为2件<br />3、一个空座位可增加1件24寸李箱<br />
          注：根据实际出行人数，为你匹配合适的车型、携带行李箱禁止超过容量限制，以免车辆空间不足无法服务，如发生类似情况，司机可以拒绝服务，
          由乘客自行承担后果
        </div>
        <i slot="reference" class="el-icon-warning"></i>
      </el-popover>
    </el-form-item>

    <!--车型-->
    <div  v-for="(cart, index) in addForm.cart" :key="cart.id">
      <el-form-item
        :rules="[
          {
            validator: checkeBus,
            trigger: 'blur',
          },
        ]"
        :prop="`cart[${index}].number`"
        :label="index == 0 ? '车型：' : ''"
      >
        <el-select
          placeholder="选择车型"
          v-model="cart.busType"
          style="width: 130px"
          class="filter-item"
          filterable
          clearable
        >
          <el-option :value="5" label="5座" />
          <el-option :value="7" label="7座" />
          <el-option :value="12" label="12座" />
          <el-option :value="19" label="19座" />
          <el-option :value="37" label="37座" />
          <el-option :value="49" label="49座" />
        </el-select>

        <el-input-number
          style="flex: 1;  margin-left: 10px"
          v-model.number="cart.number"
          placeholder="请输入数量"
          :min="1"
          :max="10"
        ></el-input-number>
        <i
          @click="onAddCart"
          v-if="index == 0"
          class="el-icon-circle-plus-outline"
        ></i>
        <i
          @click="onRemoveCart(index)"
          v-else
          class="el-icon-remove-outline"
        ></i>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { commonMap, googleMap } from "@/api/wetour/order.js";
export default {
  props: {
    airportList: {
      type: Array,
      default: [],
    },
    cityList: {
      type: Array,
      default: [],
    },
    addRules: {
      type: Object,
      default: () => ({}),
    },
    addForm: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    airportCityList() {
      let obj = {},
        arr = [];
      this.airportList.forEach((element) => {
        console.log(obj, !obj[element.cityCnName], element.cityCnName);
        if (!obj[element.cityCnName]) {
          arr.push(element);
          obj[element.cityCnName] = true;
        }
      });
      return arr;
    },
  },
  data() {
    return {
      first:0,
      airports: [],
      pickerOptions: {
        disabledDate(time) {
          const date = new Date();
          return time.getTime() < date.getTime() - 3600 * 1000 * 12;
        },
      },
    };
  },
  created() {
    this.onChangeCity(this.addForm.destinationCity);
  },
  methods: {
    handelChange(val) {
      console.log(val, this.cityList);
      let { cityList } = this;
      cityList.forEach((item) => {
        if (item.city == val) {
          if (item.telephoneCode == "86" || item.telephoneCode == "+86") {
            this.addForm.isForeign = 0;
          } else {
            this.addForm.isForeign = 1;
          }
        }
      });

      this.addForm.departureAddress = ""; //出发地址
      this.addForm.departureCityCode = ""; //出发城市代码对应城市表
      this.addForm.departureLatitude = ""; //出发纬度
      this.addForm.departureLongitude = ""; //出发经度
    },
    async checkeBus(rule, value, callback) {
      if (parseInt(value) >= 0 && parseInt(value) <= 10) {
        callback();
      } else {
        callback(new Error("请输入0-10的整数"));
      }
    },
    onChangeCity(value) {
      this.airports = [];
      if(this.first<=1){
        this.first++
        this.addForm.departureCity=value;
      }
      this.addForm.destinationAddress = "";
      let obj = {};
      this.airportList.forEach((item) => {
        if (value == item.cityCnName && obj) {
          this.airports.push(item);
        }
      });
    },
    onChangeAirport(value) {
      var index = this.airports.findIndex((item) => item.airportName == value);
      if (index != -1) {
        this.addForm.destinationCityCode = this.airports[index].cityCnId;
        this.addForm.destinationLatitude = this.airports[index].latitude;
        this.addForm.destinationLongitude = this.airports[index].longitude;
      }
    },
    onAddCart() {
      if (this.addForm.cart.length < 5) {
        this.addForm.cart.push({
          number: "",
          cartType: 5,
          id: this.addForm.cart[this.addForm.cart.length - 1].id + 1,
        });
      } else {
        this.$message.error("最大可添加车型数为5");
      }
    },
    onRemoveCart(index) {
      this.addForm.cart.splice(index);
    },
    querySearchAsync(queryString, cb) {
      var indexSelect = this.cityList.findIndex(
        (item) => item.city == this.addForm.departureCity
      );
      var city = this.cityList[indexSelect];
      if (city.country == "中国") {
        this.seachPoiChina(queryString, city.city, cb);
      } else {
        this.seachPoiForeign(queryString, city, cb);
      }
    },
    handleSelect(item) {
      var indexSelect = this.cityList.findIndex(
        (item) => item.city == this.addForm.departureCity
      );
      if (this.cityList[indexSelect].country == "中国") {
        if (!item.location.lat && !item.location.lng) {
          this.$message.error("地址无效，请重新选择");
          return;
        }
        this.addForm.departureLatitude = item.location.lat; //出发纬度
        this.addForm.departureLongitude = item.location.lng; //出发经度
      } else {
        if (!item.geometry.location.lat && !item.geometry.location.lng) {
          this.$message.error("地址无效，请重新选择");
          return;
        }
        this.addForm.departureLatitude = item.geometry.location.lat; //出发纬度
        this.addForm.departureLongitude = item.geometry.location.lng; //出发经度
      }
      this.addForm.departureAddress = item.name; //出发地址
      this.addForm.departureCityCode = this.cityList[indexSelect].id; //出发城市代码对应城市表
    },
    //poi搜索中国
    seachPoiChina(search, city, cb) {
      if (search == "") {
        cb([]);
        return;
      }
      if (!this.autoComplete) {
        this.autoComplete = new AMap.Autocomplete({
          city,
          citylimit: true,
          type: "01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19",
        });
      }
      let autoComplete = this.autoComplete;
      // 根据关键字进行搜索

      autoComplete.search(search, function (status, result) {
        console.log(result, 333333);
        // 搜索成功时，result即是对应的匹配数据
        let results = [],
          arr = [];
        if (result.tips) {
          results = result.tips;
        }
        // results.forEach(item=>{
        //   arr.push({
        //     name:,
        //     location:
        //   })
        // })
        cb(results);
      });
      // commonMap("place/v2/suggestion", {
      //   query: search,
      //   region: city,
      //   city_limit: "true",
      //   output: "json",
      // }).then((response) => {
      //   var data = response.data;
      //   if (data.code == 0) {
      //     var result = JSON.parse(data.data);
      //     console.log("result", result);
      //     cb(result.result);

      //     // adcode: "330105"
      //     // address: "杭州市-拱墅区-丰潭路380号"
      //     // business: ""
      //     // children: Array(6)
      //     // city: "杭州市"
      //     // cityid: "179"
      //     // district: "拱墅区"

      //     // location: Object
      //     // lat: 30.305881
      //     // lng: 120.114198
      //     // name: "城西银泰城"

      //     // province: "浙江省"
      //     // tag: "购物中心"
      //     // uid: "4fe8b3c1de3c3db59ff77939"

      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });
    },
    //poi搜索中国
    seachPoiForeign(search, city, cb) {
      if (search == "") {
        cb([]);
        return;
      }
      var param = {
        countryCode: "",
        keyword: search,
        lat: 0,
        lng: 0,
      };
      if (city.lat != 0 && city.lng != 0) {
        param.lat = city.lat;
        param.lng = city.lng;
      } else {
        param.countryCode = city.countryCode;
      }
      googleMap(param).then((response) => {
        var data = response.data;
        if (data.code == 0) {
          cb(data.data);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>

<style scoped  lang="scss">
.flex-row {
  display: flex;
  justify-content: flex-start;
}

/deep/ .el-form-item__content{
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}


/deep/ .el-icon-warning {
  margin-left: 10px;
  font-size: 20px;
}

/deep/ .el-icon-circle-plus-outline {
  margin-left: 10px;
  font-size: 20px;
  padding-top: 7px;
}

/deep/ .el-icon-remove-outline {
  margin-left: 10px;
  font-size: 20px;
  padding-top: 7px;
}
</style>