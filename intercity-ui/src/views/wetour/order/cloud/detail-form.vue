<template>
  <el-drawer
    title="详情"
    @close="handleClose"
    direction="ltr"
    ref="drawer"
    size="70%"
    :visible.sync="visible"
     :wrapperClosable="false"
  >
    <div class="content-from">
      <el-form ref="dataForm" :model="dialogData" label-width="130px">
        <h4 class="title">基本信息</h4>
        <div class="flex-between">
          <el-form-item label="订单号：" style="width: 50%">
            <!-- <span style="color:#409EFF;">{{ dialogData.orderNo }}</span> -->
            <el-button
                type="text"
                size="small"
                @click="ondetail"
                >{{dialogData.orderNo}}</el-button
              >
          </el-form-item>

          <el-form-item label="实付金额：" style="width: 50%">
            {{ dialogData.payRealAmount }}
          </el-form-item>
        </div>
        <el-form-item label="第三方订单号：" style="width: 50%">
          {{ dialogData.thirdOrderNo }}
        </el-form-item>
        <h4 class="title">行程信息</h4>
        <div class="flex-between">
          <el-form-item label="用车类型：" style="width: 50%">
            {{ dialogData.charteredCarType | busTypeFil }}
          </el-form-item>
          <el-form-item label="用车时间：" style="width: 50%">
            {{ notS(dialogData.departureStartTime)
            }}{{
              dialogData.departureEndTime
                ? "-" + notS(dialogData.departureEndTime)
                : ""
            }}
          </el-form-item>
        </div>
        <div class="flex-between">
          <el-form-item label="出发地点：" style="width: 50%">
            {{ dialogData.departureAddress }}
          </el-form-item>

          <el-form-item label="目的地点：" style="width: 50%">
            {{ dialogData.destinationAddress }}
          </el-form-item>
        </div>

        <div class="flex-between">
          <el-form-item label="乘车人数：" style="width: 50%">
            {{ dialogData.passengerNumber + dialogData.childNumber }}
          </el-form-item>
          <el-form-item label="状态：" style="width: 50%">
            {{ dialogData.orderStatus | statusFil }}
          </el-form-item>
        </div>

        <el-form-item label="车型：" style="width: 50%">
          {{ dialogData.busTypeStr }}
        </el-form-item>

        <div class="flex-between">
          <el-form-item label="联系人：" style="width: 50%">
            {{ dialogData.contactName }}
          </el-form-item>
          <el-form-item label="联系号码：" style="width: 50%">
            {{ dialogData.contactMobile }}
          </el-form-item>
        </div>
        <!-- <div class="flex-between" v-if="dialogData.orderStatus == 31">
          <el-form-item label="开始服务时间：" style="width: 50%">
            {{ dialogData.serviceStartTime }}
          </el-form-item>
          <el-form-item label="结束服务时间：" style="width: 50%">
            {{ dialogData.serviceEndTime }}
          </el-form-item>
        </div> -->

        <el-form-item label="行程备注：" style="width: 50%">
          {{ dialogData.orderRemark }}
        </el-form-item>

        <div class="flex-between" v-if="dialogData.orderStatus >= 31">
          <h4 class="title">派单信息</h4>
          <el-button @click="onReform(dialogData)" :disabled="dialogData.orderStatus != 31">改派</el-button>
        </div>

        <div class="flex-between">
          <el-form-item label="派单人：" style="width: 50%">
            {{ dialogData.dispatchUser }}
          </el-form-item>
          <el-form-item label="派单时间：" style="width: 50%">
            {{ dialogData.dispatchTime }}
          </el-form-item>
        </div>

        <div class="flex-between">
          <el-form-item label="开始服务时间：" style="width: 50%">
            {{ dialogData.serviceStartTime }}
          </el-form-item>
          <el-form-item
            label="结束服务时间："
            style="width: 50%"
            prop="reformTime"
          >
            {{ dialogData.serviceEndTime }}
          </el-form-item>
        </div>

        <div class="flex-between">
          <el-form-item label="停止派单时间：" style="width: 50%">
            {{ dialogData.stopDispatchTime }}
          </el-form-item>
          <el-form-item label="停止派单原因：" style="width: 50%">
            {{ dialogData.stopDispatchReason }}
          </el-form-item>
        </div>

        <!-- <h4 class="title">派单信息</h4>

        <div class="flex-between">
          <el-form-item label="派单人：" style="width: 50%">
            {{ dialogData.dispatchUser || '-' }}
          </el-form-item>
          <el-form-item label="派单时间：" style="width: 50%">
            {{ dialogData.dispatchTime || '-' }}}
          </el-form-item>
        </div>
        <div class="flex-between">
          <el-form-item label="开始服务时间：" style="width: 50%">
            {{ dialogData.serviceStartTime || '-' }}
          </el-form-item>
          <el-form-item label="结束服务时间：" style="width: 50%">
            {{ dialogData.serviceEndTime || '-' }}}
          </el-form-item>
        </div>
        <div class="flex-between">
          <el-form-item label="停止派单时间：" style="width: 50%">
            {{ dialogData.stopDispatchTime || '-' }}
          </el-form-item>
          <el-form-item label="停止派单原因：" style="width: 50%">
            {{ dialogData.stopDispatchReason || '-' }}}
          </el-form-item>
        </div> -->
        


      </el-form>



      <!-- v-if="dialogData.orderStatus >= 31" -->
      <el-table :data="dataList" border >
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          label="询价单号"
        ></el-table-column>
        <el-table-column
          prop="partnerName"
          header-align="center"
          align="center"
          label="微途伙伴"
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
          prop="guideRealAmount"
          header-align="center"
          align="center"
          label="指导价"
        ></el-table-column>
        <el-table-column
          prop="quoteRealAmount"
          header-align="center"
          align="center"
          label="报价金额"
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
          prop="remark"
          header-align="center"
          align="center"
          label="备注"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>

      <!--       v-if="permissions.wetour_orderinquiry_stop" -->
      <div class="flex-center" style="margin-top: 40px">
        <el-button
          v-if="permissions.wetour_orderinquiry_stop && (dialogData.orderStatus ==31 || dialogData.orderStatus==32)"
          type="primary"
          @click="onStop"
          >停止服务</el-button
        >
      </div>

      <reform-form
        :dialogData="reformformDialog.dialogData"
        :dialogVisible.sync="reformformDialog.reformlVisible"
      ></reform-form>

      <sendDialog
        v-if="sendformDialog.visible"
        :changeDispatchState="0"
        :type="sendformDialog.type"
        :dialogData="sendformDialog.data"
        :partnerId="sendformDialog.partnerId"
        :dialogVisible.sync="sendformDialog.visible"
        @success="visible = false"
      ></sendDialog>
    </div>
  </el-drawer>
</template>

<script>
import SendDialog from "./send-dialog.vue";
import { orderinquiryListByOrderNo } from "@/api/wetour/order";
import ReformForm from "./reform-form";
import { mapGetters } from "vuex";

export default {
  components: {
    ReformForm,
    SendDialog,
  },
  data() {
    return {
      dataList: [],
      dataListLoading: false,
      sendformDialog: {
        type: 0,
        data: {},
        partnerId: "",
        visible: false,
      },
      reformformDialog: {
        dialogData: {},
        reformlVisible: false,
        changeDispatchState: 1, //是否是改派，0=不是，1=是
      },
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
    ...mapGetters(["permissions"]),
    visible: {
      get() {
        if (this.dialogVisible ) {
          this.getList();
        }
        return this.dialogVisible;
      },
      set(val) {
        if (!val) {
          this.$emit("refreshDataList");
        }
        this.$emit("update:dialogVisible", val);
      },
    },
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
  methods: {
    ondetail(){
      this.$emit('look',this.dialogData.id)
      this.visible = false
    },
    //停止服务
    onStop() {
      this.sendformDialog = {
        type: 1,
        visible: true,
        data: this.dialogData,
      };
    },
    handleClose() {
      setTimeout(() => {
        this.$emit("close");
        this.reformformDialog.reformlVisible = false;
      }, 300);
    },
    //改派
    onReform(row) {
      this.reformformDialog = {
        dialogData: row,
        reformlVisible: true,
        changeDispatchState: 1, //是否是改派，0=不是，1=是
      };
    },
    getList() {
      this.dataListLoading = true;
      orderinquiryListByOrderNo(this.dialogData.orderNo).then((response) => {
        this.dataList = response.data.data;
      });
      this.dataListLoading = false;
    },
    notS(time){
      if( !time ) return ''
      return time.slice(0,-3)
    },
  },
};
</script>
<style scoped lang="scss">
.content-from {
  width: 85%;
  max-height: 90vh;
  margin: 0 30px;
  overflow-y: scroll;
}
.dialog-footer {
  display: block;
}
</style>