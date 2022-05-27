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
          v-model.trim="searchForm.contactName"
          placeholder="请输入联系人"
          style="width: 140px"
          class="filter-item"
          maxlength="15"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model.trim="searchForm.contactMobile"
          placeholder="请输入号码"
          style="width: 140px"
          class="filter-item"
          maxlength="15"
          @keyup.native.enter="currentChangeHandle(1)"
        />

        <el-date-picker
          size="small"
          type="daterange"
          v-model="cartTime"
          range-separator="至"
          value-format="yyyy-MM-dd"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          style="margin-bottom: 10px; vertical-align: middle; margin-left: 10px"
        />

        <el-select
          v-model="searchForm.orderStatusList"
          style="width: 165px"
          class="filter-item"
          filterable
          clearable
          multiple
          collapse-tags
          placeholder="待派单"
        >
          <!-- <el-option :value="''" label="全部" /> -->
          <!-- <el-option :value="11" label="待支付" /> -->
          <el-option :value="21" label="待派单" />
          <el-option :value="31" label="待服务" />
          <el-option :value="32" label="服务中" />
          <el-option :value="33" label="已服务" />
          <el-option :value="34" label="停止派单" />
          <el-option :value="42" label="已结算" />
          <el-option :value="81" label="退款中" />
          <el-option :value="82" label="已退款" />
          <!-- <el-option :value="91" label="支付超时" /> -->
          <!-- <el-option :value="92" label="支付取消" /> -->
        </el-select>

        <el-button
          type="primary"
          class="filter-item"
          icon="el-icon-search"
          @click="currentChangeHandle(1)"
          >搜索</el-button
        >
        <el-button class="filter-item" @click="resetForm">重置</el-button>
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
            prop="thirdOrderNo"
            header-align="center"
            align="center"
            label="第三方订单号"
          ></el-table-column>
          <el-table-column
            prop="contactName"
            header-align="center"
            align="center"
            label="联系人"
          ></el-table-column>
          <el-table-column
            prop="contactMobile"
            header-align="center"
            align="center"
            label="联系号码"
          ></el-table-column>
          <el-table-column
            prop="startTime"
            header-align="center"
            align="center"
            label="用车时间"
          >
            <template slot-scope="scope">
              <span> {{ notS(scope.row.departureStartTime) }}</span>
              <span v-if="scope.row.departureEndTime"> - {{ notS(scope.row.departureEndTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="journey"
            header-align="center"
            align="center"
            label="行程"
          >
            <template slot-scope="scope">
              {{ scope.row.departureCity+ scope.row.departureAddress }} {{ scope.row.destinationAddress ? ' - ' + scope.row.destinationCity+ scope.row.destinationAddress : ''  }}
            </template>
          </el-table-column>
          <el-table-column
            prop="orderRealAmount"
            header-align="center"
            align="center"
            label="订单金额"
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
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="
                  (scope.row.orderStatus == 21 ||
                    scope.row.orderStatus == 31) &&
                  permissions.wetour_orderinquiry_dispatch
                "
                type="text"
                size="small"
                @click="operate(scope.row)"
              >
                {{ scope.row.orderStatus == 21 ? "派单" : "改派" }}</el-button
              >

              <el-button v-else type="text" size="small" style="color: #999da4"
                >派单</el-button
              >

              <el-button
                v-if="permissions.wetour_orderinquiry_view"
                type="text"
                size="small"
                @click="ondetail(scope.row)"
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

    <detail-form
      v-if="detailformDialog.detailVisible"
      :dialogData="detailformDialog.dialogData"
      :dialogVisible.sync="detailformDialog.detailVisible"
      @refreshDataList="getDataList"
      @look="onDetail"
    ></detail-form>
    <reform-form
      v-if="reformformDialog.reformlVisible"
      :dialogData="reformformDialog.dialogData"
      :changeDispatchState="reformformDialog.changeDispatchState"
      :dialogVisible.sync="reformformDialog.reformlVisible"
      @refreshDataList="getDataList"
    ></reform-form>
      <!-- @close="getDataList()" -->
    <detail-drawer
      v-if="detailDialog.visible"
      :dialogData="detailDialog.data"
      :dialogVisible.sync="detailDialog.visible"
      @refreshDataList="getDataList"
    ></detail-drawer>
  </div>
</template>

<script>
import DetailForm from "./detail-form";
import ReformForm from "./reform-form";
import detailDrawer from "../info/detail-drawer.vue";
import {
  orderinquiryListOrderInfoByPage,
  orderinquiry,
  orderInfo,
} from "@/api/wetour/order";
import { mapGetters } from "vuex";
export default {
  components: {
    DetailForm,
    ReformForm,
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

      // pickerOptions: {
      // disabledDate(time) {
      // const date = new Date();
      // return (
      // time.getTime() < date.getTime() - 3600 * 1000 * 24 ||
      // time.getTime() > date.getTime() + 3600 * 1000 * 24 * 30
      // );
      // },
      // },
      searchForm: {
        orderNo: "",
        thirdOrderNo: "",
        contactMobile: "",
        contactName: "",
        startTime: "",
        endTime: "",
        orderStatusList: [],
      },
      detailformDialog: {
        dialogData: {},
        detailVisible: false,
      },
      reformformDialog: {
        dialogData: {},
        reformlVisible: false,
        changeDispatchState: 0, //是否是改派，0=不是，1=是
      },
      detailDialog: {
        data: {},
        visible: false,
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
    onDetail(id) {
      orderInfo(id).then(res=>{
        this.detailDialog = {
          data: {...res.data.data,id},
          visible: true,
        };
      })
      // this.detailDialog = {
      //   data: row,
      //   visible: true,
      // };
    },
    notS(time){
      if( !time ) return ''
      return time.slice(0,-3)
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
    // 重置
    resetForm() {
      this.searchForm = {
        status: "",
        mobile: "",
        orderId: "",
        startTime: "",
        threeOrderId: "",
        orderStatusList: [],
      };
    },
    //获取数据
    getDataList() {
      if (this.cartTime) {
        this.searchForm.startTime = this.cartTime[0] + " 00:00:00";
        this.searchForm.endTime = this.cartTime[1] + " 23:59:59";
      } else {
        this.searchForm.startTime = undefined;
        this.searchForm.endTime = undefined;
      }
      const searchForm = JSON.parse(JSON.stringify(this.searchForm));

      searchForm.orderStatusList = this.searchForm.orderStatusList.length
        ? this.searchForm.orderStatusList.join(",")
        : "21";
      this.dataListLoading = true;
      orderinquiryListOrderInfoByPage(
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
    //操作
    operate(row) {
      orderinquiry(row.id).then((response) => {
        this.reformformDialog = {
          reformlVisible: true,
          changeDispatchState: row.orderStatus == 21 ? 0 : 1,
          dialogData: Object.assign({}, response.data.data),
        };
        console.log("thsi", this.reformformDialog);
      });
    },
    //详情
    ondetail(row) {
      orderinquiry(row.id).then((response) => {
        let data = Object.assign({}, response.data.data)
        data.id = row.id
        this.detailformDialog = {
          dialogData: data,
          detailVisible: true,
        };
      });
    },
  },
};
</script>