<template>
  <div>
    <!--航班号-->
    <el-form-item
      label="航班号："
      prop="flightNumber"
      :rules="[
        {
          required: true,
          message: '航班号不能为空',
          trigger: 'blur',
        },
      ]"
    >
      <el-input
        v-model.trim="addForm.flightNumber"
        placeholder="请输入航班号"
        style="flex: 1; "
        class="filter-item"
        maxlength="10"
      />
    </el-form-item>

    <!--接机机场-->
    <el-form-item label="接机机场：" prop="departureAddress">
      <el-select
        v-model="addForm.departureCity"
        @change="onChangeCity"
        placeholder="请选择城市"
        style="width: 130px"
        filterable
      >
        <el-option
          v-for="(item, index) in wishairportList"
          :key="index"
          :value="item.cityCnName"
          :label="item.cityCnName"
        >
        </el-option>
      </el-select>

      <el-select
        style="flex: 1;  margin-left: 10px"
        v-model="addForm.departureAddress"
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

    <!--落地时间-->
    <el-form-item label="落地时间（当地）：" prop="departureStartTime">
      <el-date-picker
        type="datetime"
        style="flex: 1; "
        placeholder="选择日期"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyy-MM-dd HH:mm:ss"
        v-model="addForm.departureStartTime"
      ></el-date-picker>
    </el-form-item>

    <!--目的地-->
    <el-form-item
      label="目的地："
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
        placeholder="请选择城市"
        style="width: 130px"
      >
        <el-option
          v-for="(item, index) in cityList"
          :key="index"
          :value="item.city"
          :label="item.city"
        >
        </el-option>
      </el-select>
      <el-autocomplete
        style="flex: 1;  margin-left: 10px"
        :fetch-suggestions="querySearchAsync"
        v-model="addForm.destinationAddress"
        placeholder="请输入目的地"
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
        placeholder="请选择乘车儿童"
        style="flex: 1; "
        :min="0"
        :max="100"
      ></el-input-number>
    </el-form-item>

    <!--行李数量-->
    <el-form-item label="行李数量" prop="baggageNumber">
      <el-input-number
        v-model.number="addForm.baggageNumber"
        placeholder="请选择行李数量"
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
  created() {
    this.airportList.forEach((item) => {
      var index = this.wishairportList.findIndex(
        (child) => child.cityCnName == item.cityCnName
      );
      if (index == -1) {
        this.wishairportList.push(item);
      }
    });
    this.onChangeCity(this.addForm.departureCity);
  },
  data() {
    return {
      first:0,
      airports: [],
      wishairportList: [],
      pickerOptions: {
        disabledDate(time) {
          const date = new Date();
          return time.getTime() < date.getTime() - 3600 * 1000 * 12;
        },
      },
    };
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

      this.addForm.destinationAddress = ""; //目的地地址
      this.addForm.destinationCityCode = ""; //目的地城市代码对应城
      this.addForm.destinationLatitude = ""; //出发纬度
      this.addForm.destinationLongitude = ""; //出发经度
    },
    async checkeBus(rule, value, callback) {
      if (parseInt(value) >= 0 && parseInt(value) <= 10) {
        callback();
      } else {
        callback(new Error("请输入0-10的整数"));
      }
    },
    onChangeCity(value) {
      let { cityList } = this;
      cityList.forEach((item) => {
        if (item.city == value) {
          if (item.telephoneCode == "86" || item.telephoneCode == "+86") {
            this.addForm.isForeign = 0;
          } else {
            this.addForm.isForeign = 1;
          }
        }
      });
      this.airports = [];
      if(this.first<=1){
         this.first++;
         this.addForm.destinationCity = value;
      }

      this.addForm.departureAddress = "";
      this.airportList.forEach((item) => {
        if (value == item.cityCnName) {
          this.airports.push(item);
        }
      });
    },
    onChangeAirport(value) {
      var index = this.airports.findIndex((item) => item.airportName == value);
      if (index != -1) {
        console.log("sss", this.airports[index]);
        this.addForm.departureCityCode = this.airports[index].cityCnId;
        this.addForm.departureLatitude = this.airports[index].latitude;
        this.addForm.departureLongitude = this.airports[index].longitude;
      }
    },
    onAddCart() {
      if (this.addForm.cart.length < 5) {
        this.addForm.cart.push({
          number: "",
          cartType: 5,
          id: this.addForm.cart[this.addForm.cart.length - 1].id + 1,
        });
        console.log("this.addForm.cart", this.addForm.cart);
      } else {
        this.$message.error("最大可添加车型数为5");
      }
    },
    onRemoveCart(index) {
      console.log("sss");
      this.addForm.cart.splice(index);
    },
    querySearchAsync(queryString, cb) {
      var indexSelect = this.cityList.findIndex(
        (item) => item.city == this.addForm.destinationCity
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
        (item) => item.city == this.addForm.destinationCity
      );

      if (this.cityList[indexSelect].country == "中国") {
        if (!item.location.lat && !item.location.lng) {
          this.$message.error("地址无效，请重新选择");
          return;
        }
        this.addForm.destinationLatitude = item.location.lat; //出发纬度
        this.addForm.destinationLongitude = item.location.lng; //出发经度
      } else {
        if (!item.geometry.location.lat && !item.geometry.location.lng) {
          this.$message.error("地址无效，请重新选择");
          return;
        }
        this.addForm.destinationLatitude = item.geometry.location.lat; //出发纬度
        this.addForm.destinationLongitude = item.geometry.location.lng; //出发经度
      }
      this.addForm.destinationAddress = item.name; //目的地地址
      this.addForm.destinationCityCode = this.cityList[indexSelect].id; //目的地城市代码对应城市表里的I
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
    //poi搜索国外
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