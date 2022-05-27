<template>
  <el-drawer
    size="70%"
    ref="drawer"
    title="订单详情"
    direction="ltr"
    @close="handleClose"
    :visible.sync="visible"
     :wrapperClosable="false"
  >
    <el-form class="content-from" label-width="130px">
      <h4>订单信息</h4>
      <div class="flex-between">
        <el-form-item style="width: 50%" label="订单号：">{{
          resultData.orderNo
        }}</el-form-item>
        <el-form-item style="width: 50%" label="创建时间：">{{
          resultData.createTime
        }}</el-form-item>
      </div>
      <div class="flex-between">
        <el-form-item style="width: 50%" label="订单来源：">{{
          resultData.orderChannelShow
        }}</el-form-item>
        <!-- <el-form-item style="width: 50%" label="支付状态："
          >{{
          resultData.orderStatus == 11 ? '待支付' : 
        }}</el-form-item
        > -->
        <el-form-item style="width: 50%" label="订单状态：">{{
          resultData.orderStatus | statusFil
        }}</el-form-item>
      </div>
      <div class="flex-between">
        <el-form-item style="width: 50%" label="订单金额：">{{
          resultData.orderAmount
        }}</el-form-item>
        <el-form-item style="width: 50%" label="支付方式：">{{
          resultData.orderStatus == 11 ? "-" : resultData.payTypeShow
        }}</el-form-item>
      </div>


      <div class="flex-between">
        <el-form-item style="width: 50%" label="优惠金额：">{{
          resultData.discountRealAmount == 0 ? 0 : ( resultData.discountRealAmount || '-')

        }}</el-form-item>
        <el-form-item style="width: 50%" label="实付金额：">{{
          resultData.payAmount == 0 ? 0 : ( resultData.payAmount || '-')
        }}</el-form-item>
      </div>


      <div class="flex-between">
        <el-form-item style="width: 50%" label="优惠券ID：">{{
          resultData.couponId || '-'
        }}</el-form-item>
        <el-form-item style="width: 50%" label="优惠券名称：">{{
          resultData.templateTitle  || '-'
        }}</el-form-item>
      </div>




      <div class="flex-between">
        <el-form-item style="width: 50%" label="支付时间：">{{
          resultData.payTime || "-"
        }}</el-form-item>

        <el-form-item style="width: 50%" label="创建人：">{{
          resultData.createUser || "-"
        }}</el-form-item>
        <!-- <el-form-item style="width: 50%" label="交易流水号："
          >sssss</el-form-item
        > -->
      </div>

      <h4 v-if="resultData.orderStatus == 82">退款信息</h4>
      <div class="flex-between" v-if="resultData.orderStatus == 82">
        <el-form-item style="width: 50%" label="退款金额：">{{
          resultData.refund.refundAmount
        }}</el-form-item>
        <el-form-item style="width: 50%" label="退款发起时间：">{{
          resultData.refund.refundTime
        }}</el-form-item>
      </div>
      <div v-if="resultData.orderStatus == 82" class="flex-between">
        <el-form-item style="width: 50%" label="退款到账时间：">{{
          resultData.refund.arrivalTime
        }}</el-form-item>
      </div>
      <div class="flex-between">
        <h4>行程信息</h4>
        <el-button
          v-if="resultData.orderStatus == 21"
          @click="onOperate"
          class="btn-bottom"
          >去派单</el-button
        >
      </div>
      <div class="flex-between">
        <el-form-item style="width: 50%" label="用车类型：">{{
          resultData.charteredCarTypeShow
        }}</el-form-item>
        <el-form-item style="width: 50%" label="用车时间："
          >{{ notS(resultData.departureStartTime) }}
          {{
            resultData.departureEndTime
              ? ("- " + notS(resultData.departureEndTime))
              : ""
          }}</el-form-item
        >
      </div>

      <div class="flex-between">
        <el-form-item style="width: 50%" label="出发地点：">{{
          resultData.departureAddress
        }}</el-form-item>
        <el-form-item style="width: 50%" label="乘车人数："
          >成人{{ resultData.passengerNumber }}人，儿童{{
            resultData.childNumber
          }}人，行李{{ resultData.baggageNumber }}件</el-form-item
        >
      </div>

      <div class="flex-between">
        <el-form-item style="width: 50%" label="附加服务："
          >儿童座椅X{{
            resultData.additionalService
              ? resultData.additionalService.childSeat
              : 0
          }}</el-form-item
        >
        <el-form-item style="width: 50%" label="车型：">
          <span v-for="(bus, index) in resultData.busType" :key="index">
            {{ bus.busType | bugTypeFil }}X{{ bus.number }}
          </span>
        </el-form-item>
      </div>

      <div class="flex-between">
        <el-form-item style="width: 50%" label="联系号码：">{{
          resultData.contactMobile
        }}</el-form-item>
        <el-form-item style="width: 50%" label="联系人：">{{
          resultData.contactName
        }}</el-form-item>
      </div>
      <div class="flex-between">
        <el-form-item style="width: 50%" label="证件类型：">{{
          resultData.certificateTypeShow || "-"
        }}</el-form-item>
        <el-form-item style="width: 50%" label="微信：">{{
          resultData.weixin || "-"
        }}</el-form-item>
      </div>

      <el-form-item style="width: 100%" label="证件号：">{{
        resultData.certificateNo || "-"
      }}</el-form-item>

      <el-form-item style="width: 100%" label="行程备注：">
        <div v-if="resultData.orderRemark" v-html="changeLine(resultData.orderRemark)"></div>
        <template v-else>-</template>
      </el-form-item>
      <el-form-item style="width: 100%" label="内部备注：">
        <div v-if="resultData.innerRemark" v-html="changeLine(resultData.innerRemark)"></div>
        <template v-else>-</template>
      </el-form-item>
      <div class="flex-center" style="margin: 60px 0px">
        <el-button class="btn-bottom" @click="visible = false">返回</el-button>
        <el-button
          class="btn-bottom"
          @click="orderCancel"
          v-if="resultData.orderChannel > 0 && resultData.orderStatus == 11"
          >取消</el-button
        >

        <!-- resultData.orderChannel == 0 -->
        <!-- 备注：下个版本去掉上面的限制 -->
        <el-button
          class="btn-bottom"
          type="primary"
          @click="onSubmit"
          v-if="
            Number(resultData.orderStatus) > 11 &&
            Number(resultData.orderStatus) < 40 
          "
          :disabled="
            Number(resultData.orderStatus) <= 11 ||
            Number(resultData.orderStatus) >= 40
          "
          >退款</el-button
        >
        
      </div>
    </el-form>

    <el-dialog
      title="退款"
      width="600px"
      append-to-body
      :visible.sync="refundVisible"
      v-if="refundVisible"
      :before-close="handleRefundClose"
    >
      <el-form
        ref="refundForm"
        label-width="100px"
        :model="refundForm"
        :rules="refundRules"
        label-position="right"
      >
        <el-form-item label="订单金额：" prop="orderPrice">
          {{ refundForm.orderPrice }}
        </el-form-item>
        <el-form-item label="退款金额：" prop="refundPrice">
          <el-input
            type="number"
            placeholder="请输入退款金额"
            v-model="refundForm.refundPrice"
          >
          </el-input>
        </el-form-item>
        <div class="refund-txt">
          目前退款操作只能进行一次，请沟通好后再进行退款
        </div>
      </el-form>
      <div class="flex-center" style="margin: 0px 20px">
        <el-button @click="refundVisible = false">取消</el-button>
        <el-button
          type="primary"
          v-if="permissions.wetour_order_refund_add"
          @click="onRefund"
          v-loading.fullscreen.lock="fullscreenLoading"
          >退款</el-button
        >
      </div>
    </el-dialog>
    <reform-form
      :dialogData="reformformDialog.dialogData"
      :dialogVisible.sync="reformformDialog.reformlVisible"
    ></reform-form>
  </el-drawer>
</template>
<script>
import ReformForm from "../cloud/reform-form.vue";
import {
  orderInfo,
  orderCancel,
  orderRefund,
  orderinquiry,
} from "@/api/wetour/order.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      fullscreenLoading: false,
    };
  },
  components: {
    ReformForm,
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
        if (this.dialogVisible) {
          this.getDetail();
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
    bugTypeFil(val) {
      const map = {
        5: "舒适5座",
        7: "舒适7座",
        12: "商务12座",
        17: "大巴17座",
        37: "大巴37座",
        49: "巴士49座",
      };
      return map[val];
    },
  },
  data() {
    return {
      refundForm: {
        orderPrice: 400,
        refundPrice: "",
      },
      reformformDialog: {
        dialogData: {},
        reformlVisible: false,
        changeDispatchState: 0, //是否是改派，0=不是，1=是
      },
      refundRules: {
        refundPrice: [
          {
            required: true,
            message: "退款金额不能为空",
            trigger: "blur",
          },
          {
            pattern:
              /^([1-9]\d{0,5})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/,
            message: "退款金额(0.01~999999.99)",
          },
        ],
      },
      resultData: {},
      refundVisible: false,
    };
  },

  methods: {
    onSubmit(){
      if(this.fullscreenLoading) return false
      if(this.dialogData.inputRefundType == 1){
        this.refundVisible = true;
        this.refundForm.refundPrice = this.refundForm.orderPrice
      }else{
        let data = {
          orderId: this.dialogData.id,
          refundAmount: 0,
        };
        this.fullscreenLoading = true
        orderRefund(data)
          .then((res) => {
            if (res.data.code == 0) {
              this.fullscreenLoading = false;
              this.$message.success("退款成功");
              setTimeout(()=>{
                this.getDetail()
              },1500)
            }
          })
          .catch(() => {
            this.fullscreenLoading = false;
          });
      }
      
    },
    handleClose() {
      setTimeout(() => {
        this.$emit("close");
      }, 300);
    },
    onOperate() {
      var busTypeStr = "";
      this.resultData.busType.forEach((res) => {
        busTypeStr +=
          this.$options.filters["bugTypeFil"](res.busType) +
          "x" +
          res.number +
          ",";
      });
      this.$set(
        this.resultData,
        "busTypeStr",
        busTypeStr.substring(0, busTypeStr.length - 1)
      );
      //this.$set(this.resultData, "overStartTimeState", this.resultData);
      this.reformformDialog = {
        reformlVisible: true,
        changeDispatchState: 0,
        dialogData: Object.assign({}, this.resultData),
      };
      //orderinquiry(this.resultData.id).then((response) => {
      // this.reformformDialog = {
      // reformlVisible: true,
      // changeDispatchState: row.orderStatus == 21 ? 0 : 1,
      // dialogData: Object.assign({}, response.data.data),
      // };
      // });
      // this.reformformDialog = {
      // reformlVisible: true,
      // changeDispatchState: 1,
      // dialogData: Object.assign({}, this.resultData),
      // };
    },
    onRefund() {
      console.log(55555);
      this.$refs.refundForm.validate((valid) => {
        console.log(66666);
        if (valid) {
          console.log(7777);
          let data = {
            orderId: this.dialogData.id,
            refundAmount: this.refundForm.refundPrice,
          };

          this.fullscreenLoading = true;
          orderRefund(data)
            .then((res) => {
              if (res.data.code == 0) {
                this.refundVisible = false;

                this.$message.success("退款成功");

                // setTimeout(()=>{
                this.visible = false;
                // this.getDetail();
                // this.$emit("refreshDataList",this.dialogData.id);
                // },2000)
              }
            })
            .catch(() => {
              this.fullscreenLoading = false;
            });
        }
      });
    },
    handleRefundClose() {
      this.refundVisible = false;
    },
    getDetail() {
      // console.log("sss", this.dialogData);

      orderInfo(this.dialogData.id).then((response) => {
        var result = response.data;
        this.fullscreenLoading = false;
        console.log("sssss", result);
        if (result.code == 0) {
          result.data.busType = JSON.parse(result.data.busType);
          result.data.additionalService = JSON.parse(
            result.data.additionalService
          );
          this.resultData = result.data;
          this.refundForm.orderPrice = result.data.payAmount;
          // console.log(JSON.parse(this.resultData.additionalService))
          console.log("this.resultData", this.resultData);
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    notS(time){
      if( !time ) return ''
      return time.slice(0,-3)
    },
    changeLine(str){
      return str.replace(/\n/g,'<br>')
    },
    orderCancel() {
      let id = this.dialogData.id,
        orderNo = this.resultData.orderNo;
      this.$confirm("是否确认取消ID为" + id + "的订单", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          let data = {
            id,
            orderNo,
          };
          return orderCancel(data);
        })
        .then((data) => {
          this.$message.success("取消成功");
          this.getDetail();
          // this.$emit("refreshDataList");
        });
      // this.dialogData.id
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
.flext-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
}

.txt {
  font-size: 20px;
  font-weight: bold;
  margin-right: 30px;
}

.code {
  width: 300px;
  height: 300px;
  background-color: aqua;
}

.btn {
  width: 160px;
  height: 35px;
  margin-left: 30px;
  margin-top: 265px;
}

.btn-bottom {
  margin: 0px 20px;
}

.refund-txt {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
}

.txt-warn {
  margin: 30px;
  color: red;
  font-size: 20px;
  font-weight: bold;
}
</style>