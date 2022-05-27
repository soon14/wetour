<template>
  <el-drawer
    title="详情"
    @close="handleClose"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
    :close-on-click-modal="false"
    size="70%"
    :visible.sync="visible"
     :wrapperClosable="false"
  >
    <el-scrollbar style="height: 100%; overflow-x: hidden">
      <div style="margin: 0 30px; width: 95%; padding-bottom: 100px">
        <el-form :model="dataForm" ref="dataForm" label-width="130px">
          <h4 class="title">申请信息</h4>
          <div class="flex-between">
            <el-form-item label="记录ID" style="width: 50%" prop="id">
              {{ dataForm.id }}
            </el-form-item>

            <el-form-item
              label="申请时间："
              style="width: 50%"
              prop="createTime"
            >
              {{ dataForm.createTime }}
            </el-form-item>
          </div>

          <div class="flex-between">
            <el-form-item
              label="申请人："
              style="width: 50%"
              prop="partnerName"
            >
              {{ dataForm.partnerName }}
            </el-form-item>
            <el-form-item
              label="账号："
              style="width: 50%"
              prop="partnerAccountName"
            >
              {{ dataForm.partnerAccountName }}
            </el-form-item>
          </div>

          <div class="flex-between">
            <el-form-item
              label="结算总金额："
              style="width: 50%"
              prop="totalRealAmount"
            >
              {{ dataForm.currency }}{{ dataForm.totalRealAmount }}
            </el-form-item>

            <el-form-item
              label="实际结算总金额："
              style="width: 50%"
              prop="totalSettleRealAmount"
            >
              {{ dataForm.currency }}{{ dataForm.totalSettleRealAmount }}
            </el-form-item>
          </div>
          <el-form-item
            label="订单数："
            style="width: 50%"
            prop="totalOrderNumber"
          >
            {{ dataForm.totalOrderNumber }}
          </el-form-item>

          <div class="flex-between">
            <el-form-item
              label="审核状态："
              style="width: 50%"
              prop="applyStatus"
            >
              {{ dataForm.applyStatus | applyStatusFil }}
            </el-form-item>
            <el-form-item
              v-if="dataForm.applyStatus != 0"
              label="审核时间："
              style="width: 50%"
              prop="applyTime"
            >
              {{ dataForm.applyTime }}
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="服务国家：" style="width: 50%" prop="country">
              {{ dataForm.country }}
            </el-form-item>
            <el-form-item
              v-if="dataForm.applyStatus != 0"
              label="审核人："
              style="width: 50%"
              prop="applyUser"
            >
              {{ dataForm.applyUser }}
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item
              label="结算方式："
              style="width: 50%"
              prop="settleType"
            >
              {{ dataForm.settleType | settleTypeFil }}
            </el-form-item>

            <el-form-item
              label="卡号："
              style="width: 50%"
              prop="applyUser"
              v-if="dataForm.settleType == 1"
            >
              {{ dataForm.settleAccount }}
            </el-form-item>
            <el-form-item
              label="账号："
              style="width: 50%"
              prop="applyUser"
              v-else
            >
              {{ dataForm.settleAccount }}
            </el-form-item>
          </div>

          <div class="flex-between" v-if="dataForm.settleType == 1">
            <el-form-item
              label="持卡人姓名："
              style="width: 50%"
              prop="country"
            >
              {{ dataForm.bankOwnerName }}
            </el-form-item>
            <el-form-item label="开户行：" style="width: 50%" prop="applyUser">
              {{ dataForm.bankName }}
            </el-form-item>
          </div>
          <div class="flex-between" v-else>
            <el-form-item label="姓名：" style="width: 50%" prop="country">
              {{ dataForm.zelleName }}
            </el-form-item>
          </div>
          <el-form-item
            label="发票照片："
            style="width: 100%"
            prop="invoiceImage"
          >
            <!-- {{ dataForm.invoiceImage }} -->
            <div style="display: flex; flex-wrap: wrap">
              <img
                style="max-width: 300px"
                v-for="(item, index) in dataForm.invoiceImage"
                :key="index"
                :src="item"
              />
            </div>
          </el-form-item>
        </el-form>
        <h4 class="title">订单信息</h4>
        <div class="avue-crud">
          <el-table :data="dataForm.adminVOList" border>
            <el-table-column
              prop="orderNo"
              header-align="center"
              align="center"
              label="订单号"
            >
            </el-table-column>
            <el-table-column
              prop="partnerName"
              header-align="center"
              align="center"
              label="服务伙伴"
            >
            </el-table-column>
            <el-table-column
              prop="partnerAccountName"
              header-align="center"
              align="center"
              label="伙伴账号"
            >
            </el-table-column>
            <el-table-column
              prop="orderChannel"
              header-align="center"
              align="center"
              label="订单来源"
            >
              <template slot-scope="scope">
                {{ scope.row.orderChannel | channelFil }}
              </template>
            </el-table-column>
            <el-table-column
              prop="departureStartTime"
              header-align="center"
              align="center"
              label="用车时间"
            >
            </el-table-column>
            <el-table-column
              prop="timeZone"
              header-align="center"
              align="center"
              label="行程"
            >
              <template slot-scope="scope">
                {{ scope.row.departureAddress
                }}{{
                  scope.row.destinationAddress
                    ? "-" + scope.row.destinationAddress
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="orderRealAmount"
              header-align="center"
              align="center"
              label="订单金额"
            >
              <template slot-scope="scope">
                {{ scope.row.currency }}{{ scope.row.orderRealAmount }}
              </template>
            </el-table-column>

            <el-table-column
              prop="surplusRealAmount"
              header-align="center"
              align="center"
              label="退款剩余"
            >
              <template slot-scope="scope">
                {{ scope.row.surplusRealAmount }}
              </template>
            </el-table-column>


            
            <el-table-column
              prop="waitSettleRealAmount"
              header-align="center"
              align="center"
              label="待结算金额"
            >
              <template slot-scope="scope">
                {{ scope.row.currency }}{{ scope.row.waitSettleRealAmount }}
              </template>
            </el-table-column>
            <el-table-column
              prop="applyStatus"
              header-align="center"
              align="center"
              label="实际结算金额"
            >
              <template slot-scope="scope">
                {{ scope.row.currency }}
                <input
                  class="input_spec"
                  v-if="dataForm.applyStatus === 0"
                  @input="
                    scope.row.actualSettleRealAmount =
                      scope.row.actualSettleRealAmount.match(/\d+(\.\d{0,2})?/)
                        ? scope.row.actualSettleRealAmount.match(
                            /\d+(\.\d{0,2})?/
                          )[0]
                        : ''
                  "
                  v-model="scope.row.actualSettleRealAmount"
                />
                <span v-else>{{ scope.row.actualSettleRealAmount }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="serviceEndTime"
              header-align="center"
              align="center"
              label="结束服务时间"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="flex-center" style="margin-top: 30px">
          <el-button
            v-if="
              dataForm.applyStatus === 0 &&
              permissions.wetour_settlerecord_reject
            "
            @click="launchHandle(1)"
            >驳回申请</el-button
          >
          <el-button
            v-if="
              dataForm.applyStatus === 0 &&
              permissions.wetour_settlerecord_accept
            "
            @click="launchHandle(2)"
            >通过申请</el-button
          >
          <el-button @click="visible = false">返回</el-button>
        </div>
      </div>

      <el-dialog
        title="驳回"
        :visible.sync="dialogData2.visible"
        :before-close="onClose"
        append-to-body
        width="600px"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="launchForm"
          label-position="right"
          label-width="100px"
        >
          <el-form-item>
            <div v-if="dialogData2.type == 2">
              是否通过 {{ dialogData2.dataForm.name }} 申请的金额为{{
                dataForm.currency
              }}{{ dialogData2.dataForm.money }}的结算申请
            </div>
            <div v-else>
              是否驳回 {{ dialogData2.dataForm.name }} 申请的{{
                dataForm.currency
              }}{{ dialogData2.dataForm.money }}的结算审核
            </div>
          </el-form-item>
          <el-form-item
            v-if="dialogData2.type == 1"
            label="驳回理由："
            prop="reason"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              maxlength="50"
              placeholder="请输入驳回理由"
              v-model="launchForm.reason"
              @keydown.native="pushKeyword($event)"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onClose">取消</el-button>
          <el-button type="primary" @click="onConfirm(dialogData2.type)"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </el-scrollbar>
  </el-drawer>
</template>

<script>
import {
  accountDetail,
  accountAccept,
  accountReject,
} from "@/api/wetour/financial";
import { accAdd } from "@/util/common.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      canSubmit: true,
      // 是否显示弹出层
      visible: false,
      dataForm: {
        applyStatus: "",
      },
      launchForm: {
        id: "",
        reason: "",
      },
      dialogData2: {
        type: 0,
        dataForm: "",
        visible: false,
      },
      Amount: [],
      rules: {
        reason: {
          required: true,
          message: "驳回理由不能为空",
          trigger: "blur",
        },
      },
    };
  },

  filters: {
    channelFil(val) {
      const map = {
        0: "小程序",
        1: "线下",
        2: "携程",
        3: "飞猪",
        4: "美团",
        5: "百度",
      };
      return map[val];
    },
    applyStatusFil(val) {
      const map = {
        0: "待审核",
        1: "审核通过",
        2: "审核驳回",
      };
      return map[val];
    },
    settleTypeFil(val) {
      const map = {
        1: "大陆银行卡",
        2: "zelle",
        3: "支付宝",
        4: "微信",
      };
      return map[val];
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    // 获取关键词
    pushKeyword(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    },
    init(id, isEdit) {
      console.log(id, isEdit, "123123");
      // if (id !== null) {
      //   this.dataForm.parentId = id;
      // }
      this.visible = true;
      // this.getTreeselect();
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (isEdit) {
          accountDetail(id).then((response) => {
            response.data.data.adminVOList.forEach((res) => {
              if (!res.actualSettleRealAmount) {
                res.actualSettleRealAmount = res.waitSettleRealAmount;
              }
            });
            response.data.data.invoiceImage = response.data.data.invoiceImage
              ? response.data.data.invoiceImage.split(",")
              : "";
            this.dataForm = response.data.data;
            console.log(this.dataForm.applyStatus);
          });
        } else {
          this.dataForm.deptId = undefined;
        }
      });
    },
    handleClose() {
      setTimeout(() => {
        this.$emit("close");
      }, 300);
    },
    partnerDetail() {
      accountList(this.dialogData.id).then((response) => {
        if (response.data.code == 0) {
          this.dataForm = response.data.data;
        } else {
          this.$message.success(response.data.msg);
        }
        console.log("response", this.dataForm);
      });
    },
    // 获取数据列表
    getDataList() {
      // fetchList(
      //   // Object.assign({
      //   //   ...this.searchForm,
      //   // })
      // ).then((response) => {
      //   this.dataList = response.data.data.records;
      // });
    },
    ///点击确定
    onConfirm(type) {
      const that = this;
      if (type == 2) {
        const data = {
          recordId: this.dataForm.id,
          settleRecordDetailDTOList: this.dataForm.adminVOList.map((res) => {
            return { id: res.id, settleAmount: res.actualSettleRealAmount };
          }),
        };
        accountAccept(data).then((response) => {
          if (!response.msg) {
            this.$message.success("通过成功");
            // 刷新表格
            this.$emit("refreshDataList");
            this.onClose();
          } else {
            this.$message.error(response.msg);
          }
        });
      } else {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            const data = {
              recordId: that.dataForm.id,
              applyReason: that.launchForm.reason,
            };
            console.log("驳回", data);
            accountReject(data).then((response) => {
              if (!response.msg) {
                that.$message.success("驳回成功");
                // 刷新表格
                that.$emit("refreshDataList");
                that.onClose();
              } else {
                that.$message.error(response.msg);
              }

              // this.getDataList();
            });
          } else {
            return false;
          }
        });
      }
    },
    //启动
    launchHandle(type) {
      let money = 0;
      let finall = false;
      this.dataForm.adminVOList.forEach((res) => {
        const r = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/; //保留两位小数的正数
        // 如果判断不符合正则，则不是正整数不能提交
        if (!r.test(res.actualSettleRealAmount)) {
          this.$message({
            message: "实际结算金额必须大于0并且最大只有2位小数",
            type: "warning",
          });
          finall = true;
          return false;
        }
        //实际结算金额不能超过订单金额*2
        if (res.actualSettleRealAmount > res.orderRealAmount * 2) {
          this.$message({
            message: "实际结算金额不能超过订单金额*2",
            type: "warning",
          });
          finall = true;
          return false;
        }
        money = accAdd(money, res.actualSettleRealAmount);
      });
      if (finall) {
        return false;
      }

      this.dialogData2 = {
        visible: true,
        dataForm: {
          name: this.dataForm.partnerName,
          money: money,
        },
        type,
      };
    },
    onClose() {
      this.dialogData2 = {
        type: 0,
        dataForm: "",
        visible: false,
      };
      this.launchForm = {
        id: "",
        reason: "",
      };
    },
  },
};
</script>
<style scoped lang="scss">
.dialog-footer {
  display: block;
}

.input_spec {
  width: 70%;
  // border: none;
  height: 80%;
}
</style>