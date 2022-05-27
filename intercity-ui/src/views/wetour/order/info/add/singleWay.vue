<template>
  <div>
    <!--出发地址-->
    <el-form-item label="出发地址：" prop="departureAddress">
      <el-select
        style="width: 130px"
        placeholder="请选择城市"
        v-model="addForm.departureCity"
        filterable
        @change="handelChange($event, 1)"
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
        style="flex: 1; margin-left: 10px"
        :fetch-suggestions="
          (queryString, cb, type) => {
            querySearchAsync(queryString, cb, 1);
          }
        "
        v-model="addForm.departureAddress"
        placeholder="请输入出发地址"
        clearable
        @select="
          (item) => {
            handleSelect(item, 1);
          }
        "
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
        filterable
        @change="handelChange($event, 2)"
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
        :fetch-suggestions="
          (queryString, cb, type) => {
            querySearchAsync(queryString, cb, 2);
          }
        "
        v-model="addForm.destinationAddress"
        placeholder="请输入目的地"
        clearable
        @select="
          (item) => {
            handleSelect(item, 2);
          }
        "
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

    <!--出发时间(当地)-->
    <el-form-item label="出发时间(当地)：" prop="departureStartTime">
      <!--         :picker-options="pickerOptions" -->
      <el-date-picker
        type="datetime"
        style="flex: 1; "
        placeholder="选择日期"
        format="yyyy-MM-dd HH:mm"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
        v-model="addForm.departureStartTime"
      >
      </el-date-picker>
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
        :prop="`cart[${index}].number`"
        :label="index == 0 ? '车型：' : ''"
        :rules="[
          {
            validator: checkeBus,
            trigger: 'blur',
          },
        ]"
      >
        <el-select
          placeholder="选择车型"
          v-model="cart.busType"
          style="width: 130px"
          class="filter-item"
          filterable
        >
          <el-option :value="5" label="5座" />
          <el-option :value="7" label="7座" />
          <el-option :value="12" label="12座" />
          <el-option :value="19" label="19座" />
          <el-option :value="37" label="37座" />
          <el-option :value="49" label="49座" />
        </el-select>
        <el-input-number
          style="flex: 1; margin-left: 10px"
          v-model="cart.number"
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
          v-if="index > 0"
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
      pickerOptions: {
        disabledDate(time) {
          const date = new Date();
          return time.getTime() < date.getTime() - 3600 * 1000 * 12;
        },
      },
    };
  },
  watch: {
    cityList(one, two) {
      if (one) {
        this.indexSelect = this.cityList.findIndex(
          (item) => item.city == this.addForm.departureCity
        );
      }
    },
  },
  methods: {
    handelChange(val, type) {
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
      console.log("type",type)
      if (type == 1) {
        this.addForm.departureAddress = ""; //出发地址
        this.addForm.departureCityCode = ""; //出发
        this.addForm.departureLatitude = ""; //出发纬度
        this.addForm.departureLongitude = ""; //出发经度
      } else {
        this.addForm.destinationAddress = ""; //目的地地址
        this.addForm.destinationCityCode = ""; //目
        this.addForm.destinationLatitude = ""; //出发纬度
        this.addForm.destinationLongitude = ""; //出发经度
      }
    },
    async checkeBus(rule, value, callback) {
      if (parseInt(value) >= 0 && parseInt(value) <= 10) {
        callback();
      } else {
        callback(new Error("请输入0-10的整数"));
      }
    },
    //添加车辆
    onAddCart() {
      if (this.addForm.cart.length < 5) {
        this.addForm.cart.push({
          number: "",
          busType: "",
          id: this.addForm.cart[this.addForm.cart.length - 1].id + 1,
        });
      } else {
        this.$message.error("最大可添加车型数为5");
      }
    },
    //删除车辆
    onRemoveCart(index) {
      this.addForm.cart.splice(index);
    },
    //远程搜索
    querySearchAsync(queryString, cb, type) {
      var indexSelect = this.cityList.findIndex(
        (item) =>
          item.city ==
          (type == 1
            ? this.addForm.departureCity
            : this.addForm.destinationCity)
      );
      var city = this.cityList[indexSelect];
      if (city.country == "中国") {
        this.seachPoiChina(queryString, city.city, cb);
      } else {
        this.seachPoiForeign(queryString, city, cb);
      }
    },
    //点击选择
    handleSelect(item, type) {
      if (type == 1) {
        var indexSelect = this.cityList.findIndex(
          (item) => item.city == this.addForm.departureCity
        );
        console.log("item==>", this.cityList[indexSelect]);
        console.log("item", item);

        this.addForm.departureCityCode = this.cityList[indexSelect].id; //出发城市代码对应城市表里的ID
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
      } else {
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
        this.addForm.destinationCityCode = this.cityList[indexSelect].id; //目的地城市代码对应城市表里的ID
      }
      console.log("addForm", this.addForm);
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