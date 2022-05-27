<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        <el-select v-model="searchForm.lineId" style="width: 140px" class="filter-item" filterable clearable>
          <el-option :value="-1" label="全部线路" />
          <el-option :label="item.lineName" :value="item.id" v-for="item in lineList" :key="item.id" />
          <!-- <el-option label="退票时间" :value="4"  /> -->
        </el-select>

        <!-- 时间类型 -->
        <el-select v-model="searchForm.timeType" style="width: 140px" class="filter-item" filterable clearable
          @change="clearTime">
          <el-option :value="-1" label="全部时间类型" />
          <el-option label="下单时间" :value="1" />
          <el-option label="出发时间" :value="2" />
          <el-option label="出票时间" :value="3" />
          <!-- <el-option label="退票时间" :value="4"  /> -->
        </el-select>

        <el-date-picker v-model="createTimes" value-format="yyyy-MM-dd" type="daterange"
          style="margin-bottom: 10px; vertical-align: middle; margin-left: 10px" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" size="small" :disabled="searchForm.timeType == -1"
          :editable="false" :picker-options="pickerOptions" />

        <!-- 订单状态 -->
        <el-select v-model="searchForm.orderStatus" style="width: 140px" class="filter-item" filterable clearable>
          <el-option :value="-1" label="全部订单状态" />
          <el-option label="待支付" :value="1" />
          <el-option label="待派单" :value="2" />
          <el-option label="待出行" :value="3" />
          <el-option label="出行中" :value="4" />
          <el-option label="已完成" :value="5" />
          <el-option label="已退款" :value="6" />
          <el-option label="已取消" :value="0" />
        </el-select>
        <!-- 购票方式 -->
        <el-select v-model="searchForm.ticketType" style="width: 140px" class="filter-item" filterable clearable>
          <el-option :value="-1" label="全部购票方式" />
          <el-option label="线上预约" :value="1" />
          <el-option label="线下补票" :value="2" />
        </el-select>
        <!-- 验票状态 -->
        <el-select v-model="searchForm.checkStatus" style="width: 140px" class="filter-item" filterable clearable>
          <el-option :value="-1" label="全部验票状态" />
          <el-option label="已验票" :value="1" />
          <el-option label="已到达" :value="2" />
          <el-option label="未验票" :value="0" />
        </el-select>
        <el-input v-model="searchForm.orderNo" placeholder="订单号码" style="width: 140px" class="filter-item"
          maxlength="22" />

        <el-input v-model="searchForm.busNumber" placeholder="车牌号" style="width: 140px" class="filter-item"
          maxlength="10" />

        <el-input v-model="searchForm.contactsMobile" placeholder="手机号码" style="width: 140px" class="filter-item"
          maxlength="11" />
        <el-input v-model="searchForm.userMobile" placeholder="下单账号" style="width: 140px" class="filter-item"
          maxlength="11" />
        <el-button type="primary" class="filter-item" icon="el-icon-search" @click="currentChangeHandle(1)">搜索
        </el-button>
        <el-button class="filter-item" @click="resetForm">重置</el-button>
        <el-button v-if="permissions.busadmin_orderinfo_export" icon="el-icon-download" class="filter-item"
          type="primary" plain @click="exportExcel()">导出</el-button>
      </div>

      <div class="avue-crud">
        <el-table :data="dataList" border v-loading="dataListLoading">
          <!-- <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="id"
          >
          </el-table-column> -->
          <el-table-column fixed="left" prop="orderNo" header-align="center" align="center" label="订单编号" width="168">
          </el-table-column>
          <!-- <el-table-column
            prop="userId"
            header-align="center"
            align="center"
            label="用户ID"
          >
          </el-table-column> -->
          <el-table-column prop="userMobile" header-align="center" align="center" label="下单账号" width="100">
          </el-table-column>
          <el-table-column prop="contactsMobile" header-align="center" align="center" label="联系电话" width="100">
          </el-table-column>
          <el-table-column prop="contacts" header-align="center" align="center" label="姓名" show-overflow-tooltip
            width="100">
          </el-table-column>
          <el-table-column prop="orderTime" header-align="center" align="center" label="下单时间" width="140">
            <template slot-scope="scope">
              {{ parseTime(scope.row.orderTime, "{y}-{m}-{d}") }}
              {{ parseTime(scope.row.orderTime, "{h}:{i}:{s}") }}
            </template>
          </el-table-column>
          <el-table-column prop="ticketTypeShow" header-align="center" align="center" label="购票方式">
            <!-- <template slot-scope="scope">
              {{['线上预约','线下补票'][scope.row.ticketType - 1]}}
            </template> -->
          </el-table-column>
          <el-table-column prop="departureEndTime" header-align="center" align="center" label="出发时间" width="160">
            <template slot-scope="scope">
              <template v-if="
                scope.row.departureStartTime && scope.row.departureEndTime
              ">
                {{ parseTime(scope.row.departureStartTime, "{y}-{m}-{d}") }}
                {{ parseTime(scope.row.departureStartTime, "{h}:{i}") }} -
                {{ parseTime(scope.row.departureEndTime, "{h}:{i}") }}
              </template>
              <template v-else> - </template>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="departureStartTime"
            header-align="center"
            align="center"
            label="出发开始时间"
          >
          </el-table-column> -->

          <el-table-column prop="orderStatusShow" header-align="center" align="center" label="订单状态">
            <!-- <template slot-scope="scope">
              {{['已取消','待支付','待派单','待出行','出行中','已完成','已退款'][scope.row.orderStatus]}}
            </template> -->
          </el-table-column>
          <el-table-column prop="busNumber" header-align="center" align="center" label="车牌号">
          </el-table-column>
          <el-table-column prop="driverInfo" header-align="center" align="center" label="司机" show-overflow-tooltip
            width="160">
          </el-table-column>
          <!-- <el-table-column
            prop="lineId"
            header-align="center"
            align="center"
            label="线路ID"
          >
          </el-table-column>
          <el-table-column
            prop="busId"
            header-align="center"
            align="center"
            label="车辆ID"
          >
          </el-table-column>
          <el-table-column
            prop="driverId"
            header-align="center"
            align="center"
            label="司机ID"
          >
          </el-table-column>
          <el-table-column
            prop="upPoint"
            header-align="center"
            align="center"
            label="上车经纬度"
          >
          </el-table-column> -->
          <el-table-column prop="upAddress" header-align="center" align="center" label="上车地址" show-overflow-tooltip
            width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showAddressHandle(scope.row)">{{ scope.row.upName }}
              </el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="downPoint"
            header-align="center"
            align="center"
            label="下车经纬度"
          >
          </el-table-column> -->
          <el-table-column prop="downAddress" header-align="center" align="center" label="下车地址" show-overflow-tooltip
            width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showAddressHandle(scope.row)">{{ scope.row.downName }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="operationsMode" header-align="center" align="center" label="运营模式" width="100">
            <template slot-scope="scope">
              {{
                  ["站点到区域", "站点到站点", "区域到区域", "区域到站点"][
                  scope.row.operationsMode - 1
                  ]
              }}
            </template>
          </el-table-column>
          <el-table-column prop="orderNumber" header-align="center" align="center" label="售票数">
          </el-table-column>
          <el-table-column prop="checkStatusShow" header-align="center" align="center" label="验票状态">
            <!-- <template slot-scope="scope">
              {{['未验票','已验票','已到达'][scope.row.checkStatus]}}
            </template> -->
          </el-table-column>
          <el-table-column prop="checkTime" header-align="center" align="center" label="验票时间" width="135">
            <template slot-scope="scope">
              <el-button type="text" size="small" :disabled="(!scope.row.checkTime || scope.row.upDriverPoint =='[]')" @click="showLocation(scope.row, 0)">
                {{ scope.row.checkTime || "-" }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="arriveTime" header-align="center" align="center" label="到达时间" width="135">
            <template slot-scope="scope">
              <el-button type="text" size="small" :disabled="(!scope.row.arriveTime || scope.row.downDriverPoint =='[]')" @click="showLocation(scope.row, 1)">
                {{ scope.row.arriveTime || "-" }}
              </el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="dispatchType"
            header-align="center"
            align="center"
            label="派单类型 1人工正常派单 2人工改派 3自动正常派单（扫描下单那种）4自动改派（修改车辆那种)"
          >
          </el-table-column> -->
          <el-table-column prop="orderAmount" header-align="center" align="center" label="订单金额">
          </el-table-column>
          <el-table-column prop="payAmount" header-align="center" align="center" label="支付金额">
          </el-table-column>
          <el-table-column prop="discountRealAmount" header-align="center" align="center" label="优惠金额">
          </el-table-column>
          <!-- <el-table-column
            prop="couponId"
            header-align="center"
            align="center"
            label="优惠券ID 预留"
          >
          </el-table-column> -->
          <el-table-column prop="lineName" header-align="center" align="center" label="线路名称" show-overflow-tooltip
            width="160">
          </el-table-column>
          <el-table-column prop="fromCity" header-align="center" align="center" label="出发城市" show-overflow-tooltip
            width="100">
            <template slot-scope="scope">
              {{ scope.row.fromCity | codeFil }}
            </template>
          </el-table-column>
          <el-table-column prop="toCity" header-align="center" align="center" label="到达城市" show-overflow-tooltip
            width="100">
            <template slot-scope="scope">
              {{ scope.row.toCity | codeFil }}
            </template>
          </el-table-column>
          <el-table-column prop="payTime" header-align="center" align="center" label="支付时间" width="135">
            <template slot-scope="scope">
              {{ scope.row.payTime || "-" }}
            </template>
          </el-table-column>
          <el-table-column prop="ticketTime" header-align="center" align="center" label="出票时间" width="135">
            <template slot-scope="scope">
              {{ scope.row.ticketTime || "-" }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="overtimeTime"
            header-align="center"
            align="center"
            label="超时时间用于页面展示"
          >
          </el-table-column> -->
          <el-table-column prop="cancelTime" header-align="center" align="center" label="取消时间" width="135">
            <template slot-scope="scope">
              {{ scope.row.cancelTime || "-" }}
            </template>
          </el-table-column>
          <el-table-column prop="cancelReason" header-align="center" align="center" label="取消原因" show-overflow-tooltip
            width="150">
            <template slot-scope="scope">
              {{ scope.row.cancelReason || "-" }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="expired"
            header-align="center"
            align="center"
            label="过期时间戳(支付有效时间为5分钟 用于程序判断超时未支付时间戳)先预留"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="创建时间"
          >
          </el-table-column>
          <el-table-column
            prop="updateUser"
            header-align="center"
            align="center"
            label="更新人"
          >
          </el-table-column>
          <el-table-column
            prop="updateTime"
            header-align="center"
            align="center"
            label="更新时间"
          >
          </el-table-column> -->
          <el-table-column header-align="center" align="center" label="操作" fixed="right" width="320">
            <template slot-scope="scope">
              <div>
                <el-button v-if="permissions.busadmin_orderrefund_add" type="text" size="small" class="newBtn"
                  @click="chargeback(scope.row)" :disabled="
                    (scope.row.orderStatus != 2 &&
                      scope.row.orderStatus != 3 &&
                      scope.row.orderStatus != 4 &&
                      scope.row.orderStatus != 5) ||
                    (scope.row.payTime &&
                      new Date(scope.row.payTime).getTime() -
                      new Date().getTime() >
                      365 * 24 * 60 * 60 * 1000)
                  ">退款</el-button>
                <!-- || (scope.row.payTime && new Date(scope.row.payTime).getTime() - new Date().getTime() < 365*24*60*60*1000) -->
                <el-button v-if="permissions.busadmin_orderrefund_view" type="text" size="small" class="newBtn"
                  @click="chargebackTab(scope.row)">记录</el-button>
              </div>
              <div>
                <el-button v-if="permissions.busadmin_orderdispatch_add" type="text" size="small" class="newBtn"
                  @click="distribute(scope.row)" :disabled="
                    scope.row.orderStatus != 2 && scope.row.orderStatus != 3
                  ">派单</el-button>
                <el-button v-if="permissions.busadmin_dispatchrecord_view" type="text" size="small" class="newBtn"
                  @click="distributeTab(scope.row)">记录</el-button>
              </div>

              <div>
                <!--   scope.row.orderStatus != 3 && diffTime(scope.row.orderTime)-->
                <el-button v-if="permissions.busadmin_orderinfo_status" type="text" size="small" class="newBtn"
                  @click="onUpateStatus(scope.row)"
                  :disabled="(scope.row.orderStatus != 3 || diffTime(scope.row.departureStartTime))">已上车</el-button>
                  <!-- scope.row.orderStatus != 4 &&  -->
                <el-button v-if="permissions.busadmin_orderinfo_status" type="text" size="small" class="newBtn"
                  :disabled="(scope.row.orderStatus != 4 || diffTime(scope.row.departureStartTime)) "
                  @click="onUpateStatus(scope.row)">已到站</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="avue-crud__pagination">
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" background
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>

      <el-dialog title="乘客地址" :visible.sync="dialogMapVisible" width="60%" class="big-dialog" center>
        <el-form :inline="true" class="demo-form-inline search-form form-css-reset" style="text-align: left">
          <el-form-item label="上车点：">
            <el-input class="search-box" :value="dialogData.upName" disabled />
          </el-form-item>

          <el-form-item v-if="dialogData.downName" label="下车点：" style="margin-left: 30px">
            <el-input class="search-box" :value="dialogData.downName" disabled />

          </el-form-item>
        </el-form>

        <div id="container" class="container y_container zoom" />
        <!-- <el-amap
          ref="map"
          vid="amapDemo"
          class="amap-box"
          :zoom="zoom"
          :center="center"
          :map-style="mapStyle"
          :events="events"
        >
          <el-amap-marker
            v-for="(marker, index) in markers"
            :key="index"
            :position="marker.position"
            :events="marker.events"
            :visible="marker.visible"
            :draggable="marker.draggable"
            :icon="marker.icon"
            :vid="index"

          />
        </el-amap> -->
      </el-dialog>

      <!-- 退款弹框 -->
      <chargebackForm :dialogVisible.sync="chargebackVisible" v-if="chargebackVisible" :dialogData="dialogData"
        @refreshDataList="getDataList" />

      <chargebackTable :dialogVisible.sync="chargebackTabVisible" v-if="chargebackTabVisible"
        :dialogData="dialogData" />
      <!-- 派单弹框 -->
      <distributeForm :dialogVisible.sync="distributeVisible" v-if="distributeVisible" :dialogData="dialogData"
        @refreshDataList="getDataList" />

      <distributeTable :dialogVisible.sync="distributeTabVisible" v-if="distributeTabVisible"
        :dialogData="dialogData" />
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getBusInLine,
  orderRefund,
  updateCompleted,
  updateTraveling,
} from "@/api/orderinfo";
import { getLineIdAndName } from "@/api/busadmin/line";
import { mapGetters } from "vuex";
import { parseTime } from "@/util/common.js";
import { code } from "@/util/adcode";
import chargebackForm from "./chargeback-form";
import chargebackTable from "./chargeback-table";
import distributeForm from "./distribute-form";
import distributeTable from "./distribute-table";
import upImg from "@/assets/images/upImg.png";
import downImg from "@/assets/images/downImg.png";
import Map from "@/util/map";

export default {
  data() {
    return {
      dataForm: {
        key: "",
      },
      requestLocked: false,
      searchForm: {
        orderStatus: 2,
        ticketType: -1,
        timeType: -1,
        lineId: -1,
        checkStatus: -1,

        // orderStatus:0,
        // ticketType:0,
        // timeType:0,
        // checkStatus:0,

        orderNo: "",
        contactsMobile: "",
        userMobile: "",
        startTime: "",
        endTime: "",
        busNumber: "",
      },
      createTimes: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date("2019-01-01").getTime();
        },
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dialogMapVisible: false,
      chargebackVisible: false,
      chargebackTabVisible: false,
      distributeVisible: false,
      distributeTabVisible: false,
      dialogData: {},
      center: [120.007201, 30.285702], // 地图中心点坐标[经度，纬度]
      zoom: 10, // 初始化地图显示层级
      mapStyle: "amap://styles/8b6be8ec497009e17a708205348b899a", // 设置地图样式
      markers: [
        {
          position: [120.007201, 30.285702],
          events: {
            click: () => {
              console.log("click marker");
            },
            dragend: (e) => {
              console.log(e);
              // this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
              // console.log(this.markers[0].position)
            },
          },
          visible: true,
          draggable: false,
          template: "<span>1</span>",
          icon: upImg,
        },

        {
          position: [120.007201, 30.285702],
          events: {
            click: () => {
              console.log("click marker");
            },
            dragend: (e) => {
              console.log(e);
              // this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
              // console.log(this.markers[0].position)
            },
          },
          visible: true,
          draggable: false,
          template: "<span>1</span>",
          icon: downImg,
        },
      ],
      events: {
        init: (o) => {
          // console.log(o.getCenter())
          console.log(this.$refs.map.$$getInstance());
          o.getCity((result) => {
            console.log(result);
          });
        },
      },
      lineList: [],
    };
  },
  components: {
    // TableForm,
    chargebackForm,
    distributeForm,
    chargebackTable,
    distributeTable,
  },
  created() {
    this.timestamp();
    this.getDataList();
    this.getLineIdAndName();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  filters: {
    codeFil(val) {
      return code[val];
    },
  },
  methods: {
    timestamp() {
      var date = new Date();
      const newyear = date.getFullYear();
      const newmonth = date.getMonth() + 1 > 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
      const day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate();
      console.log("今天", newyear + "-" + newmonth + "-" + day);
      this.nowtamp = new Date(newyear + "-" + newmonth + "-" + day + " 00:00:00").getTime();
    },
    diffTime(datetime) {
      var time = new Date(datetime).getTime();
      console.log("time", time);
      console.log("nowtamp", time - this.nowtamp);
      console.log("dise", time - this.nowtamp > 0 ? true : false);
      return time - this.nowtamp > 0 ? true : false
    },
    //验票时间和到达时间查看位置
    showLocation(row, type) {
      this.dialogMapVisible = true;
      this.dialogData = row;
      let map;
      console.log("row", row);
      //downDriverPoint 已到达 upDriverPoint已上车
      let point =
        type == 0
          ? JSON.parse(row.upDriverPoint)
          : JSON.parse(row.downDriverPoint);
      console.log("sss", point)
      if (point.length > 0) {
        Map("67e52de474cfc324b4b4d5255e4bc785").then(
          (AMap) => {
            map = new AMap.Map("container", {
              center: point,
              zoom: 13,
              resizeEnable: true,
            });
            var pointMarker = new AMap.Marker({
              position: point,
              icon: type == 0 ? upImg : downImg,
              map: map,
            });
            // 调整视野达到最佳显示区域
            map.setFitView([pointMarker]);
          },
          (e) => {
            console.log("地图加载失败", e);
          }
        );
      } else {
        this.$message.error("数据点又问题");
        Map("67e52de474cfc324b4b4d5255e4bc785").then(
          (AMap) => {
            map = new AMap.Map("container", {
              center: [120.210792, 30.246026],
              zoom: 13,
              resizeEnable: true,
            });
          },
          (e) => {
            console.log("地图加载失败", e);
          }
        );
      }
    },
    //更新状态
    onUpateStatus(row) {
      this.$alert(
        row.orderStatus == 3 ? "是否已上车" : "是否已达到",
        "提示",
        {
          confirmButtonText: "确定",
          callback: (action) => {
            if (row.orderStatus == 3) {
              updateTraveling(row.id)
                .then((res) => {
                  const code = response.data.code;
                  if (code == 0) {
                    this.$message.success("状态更新成功！");
                  } else {
                    this.$message.error(res.msg);
                  }
                })
                .catch((e) => {
                  this.$message.error(e.msg);
                });
            } else {
              updateCompleted(row.id)
                .then((res) => {
                  const code = response.data.code;
                  if (code == 0) {
                    this.$message.success("状态更新成功！");
                  } else {
                    this.$message.error(res.msg);
                  }
                })
                .catch((e) => {
                  this.$message.error(e.msg);
                });
            }
            this.getDataList();
          },
        }
      );
    },
    getLineIdAndName() {
      getLineIdAndName().then((res) => {
        console.log(res, 33333);

        this.lineList = res.data.data;
        console.log(res, 33333);
      });
    },
    // 显示地图坐标信息
    showAddressHandle(row) {
      // upPoint:[],
      // downPoint:[],
      console.log(row, 3333);

      let upPoint = JSON.parse(row.upPoint);
      let downPoint = JSON.parse(row.downPoint);

      console.log(upPoint, downPoint);
      this.dialogData = row;
      this.center = [
        (Number(upPoint[0]) + Number(downPoint[0])) / 2,
        (Number(upPoint[1]) + Number(downPoint[1])) / 2,
      ];
      this.markers[0].position = upPoint;
      this.markers[1].position = downPoint;

      this.$nextTick(() => {
        this.dialogMapVisible = true;
        this.getMap();
        // setTimeout(()=>{
        //   console.log(333333,333333)
        //   var map = new AMap.Map('amapDemo', {
        //     resizeEnable: true,
        //     zoom: 16,
        //     center: _this.center
        //   })
        //   map.setFitView()
        // },500)
        // map.setFitView()
      });
    },
    getMap() {
      const self = this;
      let map;
      Map("67e52de474cfc324b4b4d5255e4bc785").then(
        (AMap) => {
          map = new AMap.Map("container", {
            center: self.center,
            zoom: 13,
            resizeEnable: true,
          });
          var startMarker = new AMap.Marker({
            // position: self.title === '站点位置' ? self.routeArr : self.routeArr[0],
            position: self.markers[0].position,
            icon: upImg,
            map: map,
            // size: [16, 16],
            // offset: new AMap.Pixel(-20, -32)
          });
          var endMarker = new AMap.Marker({
            position: self.markers[1].position,
            icon: downImg,
            map: map,
            // size: [16, 16],
            // offset: new AMap.Pixel(-20, -32)
          });

          // 调整视野达到最佳显示区域
          map.setFitView([startMarker, endMarker]);
        },
        (e) => {
          console.log("地图加载失败", e);
        }
      );
    },
    // 退款
    chargeback(row) {
      if (this.requestLocked) return false;
      // this.requestLocked = true

      this.chargebackVisible = true;
      this.dialogData = row;
    },
    chargebackTab(row) {
      this.chargebackTabVisible = true;
      this.dialogData = row;
    },
    distribute(row) {
      if (this.requestLocked) return false;
      this.requestLocked = true;
      getBusInLine(row.lineId)
        .then((res) => {
          console.log(res.data, "===============");
          this.dialogData = {
            busList: res.data.data,
            ...row,
          };
          console.log(this.dialogData, 33333333333333333333);
          this.requestLocked = false;
          this.distributeVisible = true;
        })
        .catch(() => {
          this.requestLocked = false;
        });
    },
    distributeTab(row) {
      this.distributeTabVisible = true;
      this.dialogData = row;
    },
    resetForm() {
      this.searchForm = {
        orderStatus: -1,
        ticketType: -1,
        timeType: -1,
        checkStatus: -1,
        orderNo: "",
        mobile: "",
        startTime: "",
        busNumber: "",

        endTime: "",
      };
      this.createTimes = [];
    },
    clearTime() {
      // this.createTimes = []
    },
    parseTime(time, cFormat) {
      return parseTime(time, cFormat);
    },
    // 获取数据列表
    getDataList() {
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
        this.searchForm.startTime = this.createTimes[0] + " 00:00:00";
        this.searchForm.endTime = this.createTimes[1] + " 23:59:59";
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
      });
      this.dataListLoading = false;
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    mycurrentChange() {
      this.dataListLoading = true;
      // setTimeout(()=>{
      this.currentChangeHandle(1);
      // },2000)
    },
    //  导出excel
    exportExcel() {
      this.downBlobFile(
        "/busadmin/order/info/export",
        this.searchForm,
        "orderinfo.xlsx"
      );
    },
  },
};
</script>
<style lang="scss" scoped>
#container {
  width: 100%;
  height: 500px;
}

.newBtn {
  padding: 5px 0;
}
</style>