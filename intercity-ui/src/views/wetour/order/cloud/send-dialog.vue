<template>
  <el-dialog
    width="600px"
    append-to-body
    :visible.sync="visible"
    :before-close="handlDialogClose"
  >
    <el-form
      ref="sendFrom"
      :rules="rules"
      :model="dialogfrom"
      class="flex-column"
      style="margin: 0px 20px"
    >
      <h3 v-if="type == 0" style="text-align: center">
        您将把行程订单派给 {{ dialogData.partnerName }} 请确认！
      </h3>
      <h3 v-else style="text-align: center">
        停止服务流程后，接单伙伴的服务将停止，也不能将此单结算给对应伙伴
      </h3>
      <el-form-item v-if="type == 1" label="" prop="stopDispatchReason">
        <el-input
          placeholder="请输入停用原因"
          v-model="dialogfrom.stopDispatchReason"
          type="textarea"
          maxlength="200"
          :rows="3"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div class="flex-center" style="margin: 0px 20px">
      <el-button @click="handlDialogClose">取消</el-button>
      <el-button type="primary" @click="handlDialogConfim">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  orderinquiryDispatchOrder,
  orderinquiryStopDispatch,
} from "@/api/wetour/order";

export default {
  props: {
    type: {
      type: Number,
      default: 0,
    },
    partnerId: {
      type: Number,
      default: 0,
    },
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
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  data() {
    return {
      dialogfrom: {
        stopDispatchReason: "",
      },
      rules: {
        stopDispatchReason: [
          {
            required: true,
            message: "停用原因不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handlDialogClose() {
      this.visible = false;
    },
    handlDialogConfim() {
      if (this.type == 0) {
        console.log("partnerId", this.dialogData);
        var data = {
          partnerId: this.partnerId, //伙伴主键ID
          inquiryId: this.dialogData.id, //询价单主键ID
          orderNo: this.dialogData.orderNo, //订单编号
          changeDispatchState: this.changeDispatchState, //是否是改派，0=不是，1=是
        };

        orderinquiryDispatchOrder(data).then((res) => {
          if (res.data.code == 0) {
            this.visible = false;
            this.$message.success("派单成功");
            this.$emit('success')
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else {
        this.$refs.sendFrom.validate((valid) => {
          if (valid) {
            orderinquiryStopDispatch(
              Object.assign({
                orderNo: this.dialogData.orderNo,
                ...this.dialogfrom,
              })
            ).then((res) => {
              if (res.data.code == 0) {
                this.visible = false;
                this.$message.success("停止派单成功");
                this.$emit('success')
              }
            });
          }
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
/deep/ .el-dialog__header {
  padding: 0px !important;
}
</style>