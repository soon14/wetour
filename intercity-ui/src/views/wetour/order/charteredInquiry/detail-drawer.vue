<template>
  <el-drawer
    size="70%"
    ref="drawer"
    title="详情"
    direction="ltr"
    @close="handleClose"
     :wrapperClosable="false"
    :visible.sync="visible"
  >
    <el-form class="content-from" label-width="130px">
      <div class="flex-between">
        <el-form-item style="width: 50%" label="订单号：">{{
          dialogData.id
        }}</el-form-item>
        <el-form-item style="width: 50%" label="提交时间：">{{
          dialogData.createTime
        }}</el-form-item>
      </div>

      <div class="flex-between">
        <el-form-item style="width: 50%" label="回访状态：">{{
          dialogData.visitStatusShow
        }}</el-form-item>
        <el-form-item style="width: 50%" label="open ID：">{{
          dialogData.openId
        }}</el-form-item>
      </div>

      <div class="flex-between">
        <el-form-item style="width: 50%" label="乘车人数：">{{
          dialogData.passengerNumber + dialogData.childNumber
        }}</el-form-item>
        <el-form-item style="width: 50%" label="用车时间："
          >{{ dialogData.departureStartTime }} -
          {{ dialogData.departureEndTime }}</el-form-item
        >
      </div>
      <div class="flex-between">
        <el-form-item style="width: 50%" label="联系人：">{{
          dialogData.contactName
        }}</el-form-item>
        <el-form-item style="width: 50%" label="联系号码：">{{
          dialogData.contactMobile
        }}</el-form-item>
      </div>
      <div class="flex-between">
        <el-form-item style="width: 50%" label="微信号码：">{{
          dialogData.weixin
        }}</el-form-item>
        <el-form-item style="width: 50%" label="用车城市：">{{
          dialogData.city
        }}</el-form-item>
      </div>

      <el-form-item style="width: 90%" label="回访备注：">{{
        dialogData.visitRemark
      }}</el-form-item>
    </el-form>
    <div class="flex-center" style="margin: 0px 20px">
      <el-button @click="handleClose">返回</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
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
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        if(!val){
            this.$emit("refreshDataList");
          }
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  filters: {
    statusFil(val) {
      const map = {
        0: "待回访",
        1: "已回访",
      };
      return map[val];
    },
  },
  data() {
    return {};
  },

  methods: {
    handleClose() {
      this.visible = false;
    },
  },
};
</script>
