<template>
  <div>
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
          v-for="(item, index) in cityList"
          :key="index"
          :value="item.city"
          :label="item.city"
        >
        </el-option>
      </el-select>
      <el-autocomplete
        style="flex: 1; margin-left: 10px"
        :fetch-suggestions="querySearchAsync"
        v-model="addForm.departureAddress"
        placeholder="请输入内容"
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
        type="datetimerange"
        v-model="rangeDate"
        style="flex: 1; "
        range-separator="至"
        end-placeholder="结束日期"
        start-placeholder="开始日期"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyy-MM-dd HH:mm:ss"
      >
      </el-date-picker>
      <span v-if="departureDay" style="margin-left: 10px"
        >{{ departureDay }}天</span
      >
    </el-form-item>

    <!--包车范围-->
    <el-form-item
      label="包车范围："
      prop="charteredCarRange"
      :rules="[
        {
          required: true,
          message: '包车范围不能为空',
          trigger: 'blur',
        },
      ]"
    >
      <el-radio-group v-model="addForm.charteredCarRange">
        <el-radio :label="1">市内包车</el-radio>
        <el-radio :label="2">周边包车</el-radio>
      </el-radio-group>
    </el-form-item>

    <!--乘车人数-->
    <el-form-item label="乘车人数：" prop="passengerNumber">
      <el-input-number
        v-model.number="addForm.passengerNumber"
        placeholder="请选择乘车人数"
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
  data() {
    return {
      rangeDate: "",
      pickerOptions: {
        disabledDate(time) {
          const date = new Date();
          return time.getTime() < date.getTime() - 3600 * 1000 * 12;
        },
      },
      autoComplete: null,
    };
  },
  computed: {
    departureDay() {
      console.log("end==>", this.addForm.departureStartTime);
      if (this.addForm.departureStartTime && this.addForm.departureEndTime) {
        var start = this.addForm.departureStartTime;
        var end = this.addForm.departureEndTime;
        // console.log("start", start);
        //console.log("end", end);
        // console.log("difference", this.difference(start, end));
        return this.difference(start, end);
      } else {
        return "";
      }
    },
  },
  watch: {
    rangeDate(date) {
      if (date) {
        this.addForm.departureStartTime = this.rangeDate[0];
        this.addForm.departureEndTime = this.rangeDate[1];
      } else {
        this.addForm.departureStartTime = "";
        this.addForm.departureEndTime = "";
      }
    },
  },
  methods: {
    // 时间差计算
    difference(beginTime, endTime) {
      var dateBegin = new Date(beginTime);
      var dateEnd = new Date(endTime);
      var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
      var dayDiff = Math.ceil(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      return dayDiff;
    },
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
      this.addForm.departureCityCode = ""; //出发城市代码对
      this.addForm.departureLatitude = ""; //出发纬度
      this.addForm.departureLongitude = ""; //出发经度
    },
    async checkeBus(rule, value, callback) {
      console.log("ss", parseInt(value));
      console.log("sssss", parseInt(value) >= 0);
      if (parseInt(value) >= 0 && parseInt(value) <= 10) {
        callback();
      } else {
        callback(new Error("请输入0-10的整数"));
      }
    },
    onAddCart() {
      if (this.addForm.cart.length < 5) {
        this.addForm.cart.push({
          cartNum: "",
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
      //console.log("city",this.cityList);
      console.log("departureCitycity", this.addForm.departureCity);
      var city = this.cityList[indexSelect];
      console.log("city", city);
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
      this.addForm.departureCityCode = this.cityList[indexSelect].id; //出发城市代码对
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
        cb(results);
      });
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