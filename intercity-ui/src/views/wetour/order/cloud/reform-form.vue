<template>
  <el-drawer
    size="70%"
    title="派单"
    direction="ltr"
    :append-to-body="true"
    :visible.sync="visible"
    :before-close="handleClose"
     :wrapperClosable="false"
  >
    <div class="content-from">
      <el-form ref="dataForm" label-width="130px">
        <h4 class="title">行程信息</h4>
        <div class="flex-between">
          <el-form-item label="用车类型：" style="width: 50%">
            {{ dialogData.charteredCarType | busTypeFil }}
          </el-form-item>
          <el-form-item label="用车时间：" style="width: 50%">
            {{ dialogData.departureStartTime }}
            {{
              dialogData.departureEndTime
                ? "- " + dialogData.departureEndTime
                : ""
            }}
          </el-form-item>
        </div>
        <div class="flex-between">
          <el-form-item label="出发地点：" style="width: 50%">
            {{ dialogData.departureAddress }}
          </el-form-item>

          <el-form-item
            v-if="dialogData.charteredCarType != 1"
            label="目的地点："
            style="width: 50%"
          >
            {{ dialogData.destinationAddress }}
          </el-form-item>
        </div>

        <div class="flex-between">
          <el-form-item label="乘车人数：" style="width: 50%">
            {{ dialogData.passengerNumber + dialogData.childNumber }}人
          </el-form-item>
          <el-form-item label="车型：" style="width: 50%">
            {{ dialogData.busTypeStr }}
          </el-form-item>
        </div>
        <el-form-item label="订单金额：" style="width: 50%">
          ¥{{
            dialogData.orderRealAmount
              ? dialogData.orderRealAmount
              : dialogData.orderAmount
          }}
        </el-form-item>

        <h4 class="title">派单操作</h4>
      </el-form>
      <div class="filter-container">
        <el-input
          v-model.trim="searchForm.city"
          placeholder="请输入城市"
          style="width: 140px"
          class="filter-item"
          maxlength="20"
        />
        <el-input
          v-model.trim="searchForm.partnerName"
          placeholder="请输入微巴伙伴"
          style="width: 140px"
          class="filter-item"
          maxlength="20"
        />
        <el-input
          v-model.trim="searchForm.mobile"
          placeholder="请输入登录号码"
          style="width: 140px"
          class="filter-item"
          maxlength="15"
        />

        <el-select
          v-if="changeDispatchState == 0"
          placeholder="请选择车型"
          v-model="searchForm.busType"
          style="width: 140px"
          class="filter-item"
          filterable
          clearable
        >
          <el-option :value="''" label="全部" />
          <el-option :value="1" label="5座普通轿车" />
          <el-option :value="2" label="7座商务车" />
          <el-option :value="3" label="17座考斯特" />
          <el-option :value="4" label="37座大客车" />
        </el-select>
        <el-select
          v-model="searchForm.inquiryStatus"
          style="width: 140px"
          class="filter-item"
          filterable
          clearable
        >
          <el-option :value="''" label="全部" />
          <el-option :value="1" label="待报价" />
          <el-option :value="2" label="已报价" />
          <el-option :value="3" label="已派单" />
        </el-select>

        <el-button
          type="primary"
          class="filter-item"
          icon="el-icon-search"
          @click="onSearch"
          >搜索</el-button
        >
      </div>

      <el-form :model="dataForm" ref="dataForm">
        <el-table
          border
          ref="dataList"
          :data="dataForm.dataList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :selectable="selectable" width="55">
          </el-table-column>

          <el-table-column
            prop="partnerName"
            header-align="center"
            align="center"
            label="微途伙伴"
          ></el-table-column>
          <el-table-column
            prop="city"
            header-align="center"
            align="center"
            label="服务城市"
          ></el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="登录账号"
          ></el-table-column>
          <el-table-column
            prop="busTypeData"
            header-align="center"
            align="center"
            label="可用车型"
          ></el-table-column>
          <el-table-column
            prop="inquiryTime"
            header-align="center"
            align="center"
            label="询价时间"
          ></el-table-column>
          <el-table-column
            prop="quoteTime"
            header-align="center"
            align="center"
            label="报价时间"
          ></el-table-column>
          <el-table-column
            prop="dispatchTime"
            header-align="center"
            align="center"
            label="派单时间"
          ></el-table-column>
          <el-table-column
            prop="inquiryStatus"
            header-align="center"
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              {{ scope.row.inquiryStatus | statusFil }}
            </template>
          </el-table-column>

          <el-table-column
            header-align="center"
            align="center"
            label="指导报价"
            width="160"
          >
            <template slot-scope="scope">
              <el-form-item
                :rules="[
                  {
                    validator: (rule, value, callback) => {
                      checkeNum(
                        multipleSelection.findIndex(
                          (item) => item.mobile == scope.row.mobile
                        ),
                        dialogData.orderAmount
                          ? dialogData.orderAmount
                          : dialogData.orderRealAmount,
                        rule,
                        value,
                        callback
                      );
                    },
                    trigger: 'blur',
                  },
                ]"
                :prop="`dataList[${scope.$index}].guideRealAmount`"
              >
                <el-input
                  oninput="if(value.length>10)value=value.slice(0,10)"
                  v-model="scope.row.guideRealAmount"
                  @blur="setInputValue"
                  :disabled="scope.row.inquiryStatus != -1"
                  placeholder="当地货币"
                  class="filter-item"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="quoteRealAmount"
            header-align="center"
            align="center"
            label="报价"
          >
            <template slot-scope="scope">
              {{ scope.row.currency }}{{ scope.row.quoteRealAmount }}
            </template>
          </el-table-column>

          <!-- @ApiModelProperty(value="是否过了订单用车时间, true=过了")
private Boolean overStartTimeState; -->
          <el-table-column
            header-align="center"
            align="center"
            label="操作"
            width="140"
          >
            <template slot-scope="scope">
              <el-button
                v-if="permissions.wetour_orderinquiry_inquiry"
                type="text"
                size="small"
                @click="onEnquiry(scope.row)"
                :style="{
                  color:
                    scope.row.inquiryStatus == -1 &&
                    !dialogData.overStartTimeState
                      ? '#409EFF'
                      : '#999DA4',
                }"
                >询价
              </el-button>
              <el-button
                v-if="permissions.wetour_orderinquiry_dispatch"
                type="text"
                size="small"
                @click="onSend(scope.row)"
                :style="{
                  color:
                    scope.row.inquiryStatus == 2 || scope.row.inquiryStatus == 8
                      ? '#409EFF'
                      : '#999DA4',
                }"
                >派单</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <el-button
        v-if="permissions.wetour_orderinquiry_inquiry"
        :disabled="
          dataForm.dataList.findIndex(
            (val) => val.inquiryStatus == -1 && !dialogData.overStartTimeState
          ) == -1
        "
        style="margin-top: 30px"
        type="primary"
        @click="onAllEnquiry"
        >批量询价
      </el-button>
      <div class="flex-center" style="margin-top: 40px">
        <el-button @click="handleClose">返回</el-button>
      </div>
    </div>
    <sendDialog
      v-if="sendformDialog.visible"
      :type="sendformDialog.type"
      :dialogData="sendformDialog.data"
      :partnerId="sendformDialog.partnerId"
      :changeDispatchState="changeDispatchState"
      :dialogVisible.sync="sendformDialog.visible"
      @success="visible = false"
    ></sendDialog>
  </el-drawer>
</template>

<script>
import {
  orderinquiryListOrderInquiry,
  orderinquiryBatchInquiry,
} from "@/api/wetour/order";
import SendDialog from "./send-dialog.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    SendDialog,
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
    changeDispatchState: {
      type: Number,
      default: 0,
    },
  },
  filters: {
    statusFil(val) {
      const map = {
        "-1": "待询价",
        0: "已失效",
        1: "待报价 ",
        2: "已报价",
        3: "已派单",
        4: "服务中",
        5: "已服务",
        6: "停止派单",
        7: "拒绝报价",
        8: "已被抢单",
        9: "报价超时",
      };
      return map[val];
    },
    busTypeFil(val) {
      const map = {
        1: "日租",
        2: "接机",
        3: "送机",
        4: "单程",
      };
      return map[val];
    },
  },
  data() {
    return {
      dataForm: {
        dataList: [],
      },
      searchForm: {
        city: this.dialogData.departureCity,
        partnerName: "",
        mobile: "",
        busType: "",
        inquiryStatus: "",
        orderNo: this.dialogData.orderNo,
      },

      enquiryForm: {
        inquiryPartnerDTOList: [],
        orderNo: this.dialogData.orderNo,
        changeDispatchState: this.changeDispatchState, //是否是改派，0=不是，1=是
      },

      sendformDialog: {
        type: 0,
        data: {},
        partnerId: "",
        visible: false,
      },
      check: false,
      multipleSelection: [],
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    visible: {
      get() {
        if (this.dialogVisible) {
          this.searchForm.orderNo = this.dialogData.orderNo;
          this.searchForm.city = this.dialogData.departureCity;

          this.getDataList();
        }
        return this.dialogVisible;
      },
      set(val) {
        console.log(val, "-----val");
        if (!val) {
          this.$emit("refreshDataList");
        }
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  methods: {
    //确定能否询价
    selectable(row, index) {
      if (row.inquiryStatus == -1 && !this.dialogData.overStartTimeState) {
        return true;
      } else {
        return false;
      }
    },
    setInputValue(e) {
      console.log(e.target.value, 3333);
      console.log(this.dataForm.dataList, 33333);
      if (e.target.value) {
        this.dataForm.dataList.forEach((item, index) => {
          if (!item.guideRealAmount)
            this.dataForm.dataList[index].guideRealAmount = e.target.value;
        });
      }
    },
    async checkeNum(index, price, rule, value, callback) {
      if (index != -1) {
        if (value) {
          if (
            !isNaN(value) &&
            Number(value) >= 0.01 &&
            Number(value) <= 10000000
          ) {
            callback();
          } else {
            callback(new Error("价格(0.01~10000000)"));
          }
        } else {
          return callback(new Error("价格不能为空"));
        }
      } else {
        callback();
      }
    },
    handleClose() {
      // setTimeout(() => {
      // this.$emit("close");
      this.visible = false;
      // }, 300);
    },
    onSearch() {
      this.getDataList();
    },
    //询价
    onEnquiry(row) {
      if (row.inquiryStatus == -1 && !this.dialogData.overStartTimeState) {
        this.multipleSelection = [];
        this.multipleSelection.push(row);
        this.onAllEnquiry();
      }
    },
    //派单
    onSend(row) {
      console.log("row", row.partnerId);
      if (row.inquiryStatus == 2 || row.inquiryStatus == 8) {
        this.sendformDialog = {
          type: 0,
          data: row,
          visible: true,
          partnerId: row.partnerId,
          changeDispatchState: this.changeDispatchState, //是否是改派，0=不是，1=是
        };
      }
    },
    //批量询价
    onAllEnquiry() {
      if (this.multipleSelection.length > 0) {
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            var inquiryPartnerList = [];
            this.multipleSelection.forEach((item) => {
              inquiryPartnerList.push({
                partnerId: item.partnerId,
                guideAmount: item.guideRealAmount, //指导价格
              });
            });
            this.enquiryForm.orderNo = this.dialogData.orderNo;
            this.enquiryForm.changeDispatchState = this.changeDispatchState;
            this.enquiryForm.inquiryPartnerDTOList = inquiryPartnerList;
            orderinquiryBatchInquiry(this.enquiryForm).then((response) => {
              this.getDataList();
              this.$message.success("询价成功");
            });
          }
        });
      } else {
        this.$message.error("请选择询价单");
      }
    },
    //停止服务
    onStop() {
      this.sendformDialog = {
        type: 1,
        visible: true,
        data: this.dialogData,
      };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取数据
    getDataList() {
      this.dataListLoading = true;
      orderinquiryListOrderInquiry(this.searchForm).then((response) => {
        this.dataForm.dataList = response.data.data;
      });
      this.dataListLoading = false;
    },
  },
};
</script>
<style scoped lang="scss">
/deep/ .el-dialog__header {
  padding: 0px !important;
}
.content-from {
  width: 85%;
  max-height: 90vh;
  margin: 0 30px;
  overflow-y: scroll;
}

.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>