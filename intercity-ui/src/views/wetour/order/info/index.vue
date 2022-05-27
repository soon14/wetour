<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        <el-input
          v-model.trim="searchForm.orderNo"
          placeholder="请输入订单号"
          style="width: 140px"
          class="filter-item"
          maxlength="22"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model.trim="searchForm.thirdOrderNo"
          placeholder="第三方订单号"
          style="width: 140px"
          class="filter-item"
          maxlength="22"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model.trim="searchForm.contact"
          placeholder="请输入联系人/号码"
          style="width: 140px"
          class="filter-item"
          maxlength="15"
          @keyup.native.enter="currentChangeHandle(1)"
        />

        <!-- 时间类型 -->
        <el-select
          v-model="searchForm.timeType"
          style="width: 140px"
          class="filter-item"
          filterable
        >
          <el-option :value="-1" label="全部时间类型" />
          <el-option label="用车时间" :value="1" />
          <el-option label="创建时间" :value="2" />
        </el-select>

        <el-date-picker
          size="small"
          type="daterange"
          :editable="false"
          v-model="cartTime"
          range-separator="至"
          value-format="yyyy-MM-dd"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          :picker-options="pickerOptions"
          :disabled="searchForm.timeType == -1"
          style="margin-bottom: 10px; vertical-align: middle; margin-left: 10px"
        />
        <el-select
          v-model="searchForm.orderChannels"
          style="width: 160px"
          class="filter-item"
          filterable
          multiple
          collapse-tags
          placeholder="全部"
          clearable
        >
          <!-- <el-option :value="''" label="全部" /> -->
          <el-option :value="0" label="小程序" />
          <el-option :value="1" label="线下" />
          <el-option :value="2" label="携程" />
          <el-option :value="3" label="飞猪" />
          <el-option :value="4" label="美团" />
          <el-option :value="5" label="百度" />
        </el-select>

        <el-select
          v-model="searchForm.orderStatusList"
          style="width: 160px"
          class="filter-item"
          filterable
          multiple
          collapse-tags
          placeholder="全部"
          clearable
        >
          <!-- <el-option :value="''" label="全部" /> -->
          
          <el-option :value="11" label="待支付" />
          <el-option :value="21" label="待派单" />
          <el-option :value="31" label="待服务" />
          <el-option :value="32" label="服务中" />
          <el-option :value="33" label="已服务" />
          <el-option :value="34" label="停止派单" />
          <el-option :value="42" label="已结算" />
          <el-option :value="81" label="退款中" />
          <el-option :value="82" label="已退款" />
          <el-option :value="91" label="支付超时" />
          <el-option :value="92" label="支付取消" />
        </el-select>

        <el-button
          type="primary"
          class="filter-item"
          icon="el-icon-search"
          @click="currentChangeHandle(1)"
          >搜索</el-button
        >
        <el-button class="filter-item" @click="resetForm">重置</el-button>
        <el-button
          v-if="permissions.wetour_order_info_add"
          type="primary"
          class="filter-item"
          @click="addOrder"
          >新增订单</el-button
        >
      </div>
      <div class="avue-crud">
        <el-table :data="dataList" border v-loading="dataListLoading">
          <el-table-column
            prop="orderNo"
            header-align="center"
            align="center"
            label="订单号"
          ></el-table-column>
          <el-table-column
            prop="charteredCarTypeShow"
            header-align="center"
            align="center"
            label="订单类型"
          ></el-table-column>
          
          <el-table-column
            prop="thirdOrderNo"
            header-align="center"
            align="center"
            label="第三方订单号"
          ></el-table-column>
          <el-table-column
            prop="contactMobile"
            header-align="center"
            align="center"
            label="联系号码"
          ></el-table-column>
          <el-table-column
            prop="contactName"
            header-align="center"
            align="center"
            label="联系人"
          ></el-table-column>
          <el-table-column
            prop="cartTime"
            header-align="center"
            align="center"
            label="开始用车时间"
          >
            <template slot-scope="scope">
              {{ notS(scope.row.departureStartTime)
              }}{{
                scope.row.departureEndTime
                  ? "- " + notS(scope.row.departureEndTime)
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="departureAddress"
            header-align="center"
            align="center"
            label="行程"
          >
            <template slot-scope="scope">
              {{ scope.row.departureCity + scope.row.departureAddress }}
              {{
                scope.row.destinationAddress
                  ? " - " +
                    scope.row.destinationCity +
                    scope.row.destinationAddress
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="orderAmount"
            header-align="center"
            align="center"
            label="订单金额"
          ></el-table-column>
          <el-table-column
            prop="orderChannelShow"
            header-align="center"
            align="center"
            label="订单来源"
          ></el-table-column>
          <el-table-column
            prop="orderStatus"
            header-align="center"
            align="center"
            label="订单状态"
          >
            <template slot-scope="scope">
              {{ scope.row.orderStatus | statusFil }}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="创建时间"
          ></el-table-column>
          <el-table-column
            header-align="center"
            width="120"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                :style="{
                  color: scope.row.orderStatus == 11 ? '#409EFF' : '#999DA4',
                }"
                type="text"
                size="small"
                v-if="scope.row.orderChannelShow !== '小程序'"
                @click="onPay(scope.row,2)"
                >支付</el-button
              >

              <el-button
                  v-if="permissions.wetour_order_info_edit"
                  type="text"
                  size="small"
                  @click="onEdit(scope.row)"
                  :disabled="scope.row.orderChannel == 0 || scope.row.orderStatus == 42"
                  >编辑</el-button
                >
              

              <el-button
                type="text"
                v-if="permissions.wetour_order_info_view"
                size="small"
                @click="onDetail(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="avue-crud__pagination">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          background
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </basic-container>
    <add-drawer
      v-if="addDialog.visible"
      :dialogData="addDialog.data"
      :dialogVisible.sync="addDialog.visible"
      @success="onPay"
    ></add-drawer>
    <pay-drawer
      v-if="payDialog.visible"
      :dialogData="payDialog.data"
      :dialogVisible.sync="payDialog.visible"
      @refreshDataList="getDataList"
    ></pay-drawer>
    <detail-drawer
      v-if="detailDialog.visible"
      :dialogData="detailDialog.data"
      :dialogVisible.sync="detailDialog.visible"
      @refreshDataList="getDataList"
    ></detail-drawer>
    <edit-Drawer
      v-if="eidtDialog.visible"
      :dialogId="eidtDialog.data.id"
      @refreshDataList="getDataList"
      :dialogVisible.sync="eidtDialog.visible">
    </edit-Drawer>
  </div>
</template>

<script>
import addDrawer from "./add/addIndex.vue";
import payDrawer from "./pay-drawer.vue";
import detailDrawer from "./detail-drawer.vue";
import editDrawer from "./edit-drawer.vue";
import { orderInfoPage,orderInfo } from "@/api/wetour/order.js";
import { addItemObj } from "../../../../api/admin/dict";
import { mapGetters } from "vuex";
export default {
  components: {
    addDrawer,
    payDrawer,
    editDrawer,
    detailDrawer,
  },
  data() {
    return {
      cartTime: "",
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,

      dataListLoading: false,
      searchForm: {
        orderNo: "",
        thirdOrderNo: "",
        contact: "",

        startTime: "",
        endTime: "",
        timeType: -1,
        orderChannels: [],
        orderStatusList: [11,21,31,32,33],
      },
      addDialog: {
        data: {},
        visible: false,
      },
      eidtDialog: {
         data: {},
         visible: false,
      },
      payDialog: {
        data: {},
        visible: false,
      },
      detailDialog: {
        data: {},
        visible: false,
      },
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime();
          if (maxDate) {
            this.selectDate = "";
          }
        },
        disabledDate: (time) => {
          if (this.selectDate !== "") {
            const one = 30 * 24 * 3600 * 1000;
            const minTime = this.selectDate - one;
            const maxTime = this.selectDate + one;
            return time.getTime() < minTime || time.getTime() > maxTime;
          }
        },
      },
    };
  },
  filters: {
    statusFil(val) {
      const map = {
        11: "待支付",
        21: "待派单",
        31: "待服务",
        32: "服务中",
        33: "已服务",
        34: "停止派单",
        42: "已结算",
        81: "退款中",
        82: "已退款",
        91: "支付超时",
        92: "支付取消",
      };
      return map[val];
    },
  },
  created() {
    this.getDataList();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
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

    // 获取数据列表
    getDataList() {
      if (this.cartTime.length) {
        this.searchForm.startTime = this.cartTime[0] + " 00:00:00";
        this.searchForm.endTime = this.cartTime[1] + " 23:59:59";
      } else {
        this.searchForm.startTime = "";
        this.searchForm.endTime = "";
      }
      const searchForm = JSON.parse(JSON.stringify(this.searchForm));
      searchForm.orderChannels = this.searchForm.orderChannels.join(",");
      searchForm.orderStatusList = this.searchForm.orderStatusList.join(",");
      this.dataListLoading = true;
      orderInfoPage(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          ...searchForm,
        })
      ).then((response) => {
        this.dataList = response.data.data.records;
        this.totalPage = response.data.data.total;
      });
      this.dataListLoading = false;
    },
    //重置
    resetForm() {
      this.searchForm = {
        orderNo: "",
        thirdOrderNo: "",
        contact: "",
        startTime: "",
        endTime: "",
        timeType: -1,
        orderChannels: [],
        orderStatusList: [11,21,31,32,33],
      };
    },
    //新增订单
    addOrder() {
      this.addDialog = {
        data: {},
        visible: true,
      };
    },
    //支付
    onPay(row,type) {
      console.log("row",row)
      if (row.orderStatus == 11 || type==0) {
        orderInfo(row.id).then(res=>{
          this.payDialog = {
            data: res.data.data,
            visible: true,
          };
        })
        
      }
    },
    //编辑
    onEdit(row){
      console.log("row",row)
      this.eidtDialog = {
        data: row,
        visible: true,
      };
    },
    //详情
    onDetail(row) {
      this.detailDialog = {
        data: row,
        visible: true,
      };
    },
    //退款成功修改状态
    refreshDataList(id) {
      this.dataList.forEach((res) => {
        if (res.id === id) {
          res.orderStatus = 81;
        }
      });
      // this.getDataList()
    },
    notS(time){
      return time.slice(0,-3)
    },
  },
};
</script>