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
    <div style="margin: 0 30px; width: 85%">
      <el-form
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="130px"
      >
        <h4 class="title">基本信息</h4>
        <div class="flex-between">
          <el-form-item label="ID：" style="width: 50%" prop="id">
            {{ dataForm.id }}
          </el-form-item>

          <el-form-item
            label="伙伴名称："
            style="width: 50%"
            prop="partnerName"
          >
            {{ dataForm.partnerName }}
          </el-form-item>
        </div>

        <div class="flex-between">
          <el-form-item label="登录账号：" style="width: 50%" prop="mobile">
            {{ dataForm.mobile }}
          </el-form-item>
          <el-form-item
            label="服务城市："
            style="width: 50%"
            prop="cityIdsShow"
          >
            {{ dataForm.cityIdsShow }}
          </el-form-item>
        </div>
        <div class="flex-between">
          <el-form-item label="创建时间：" style="width: 50%" prop="createTime">
            {{ dataForm.createTime }}
          </el-form-item>
          <el-form-item label="状态：" style="width: 50%" prop="partnerStatus">
            {{ dataForm.partnerStatusShow }}
          </el-form-item>
        </div>
        <el-form-item
          v-if="dataForm.partnerStatus == 0"
          label="禁用原因："
          style="width: 50%"
          prop="createTime"
        >
          {{ dataForm.disableReason }}
        </el-form-item>
      </el-form>

      <div class="flex-center" style="margin-top: 30px">
        <el-button @click="visible = false">返回</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { partnerDetail } from "@/api/wetour/partner.js";

export default {
  data() {
    return {
      canSubmit: true,
      dataForm: {
        id: 0,
        siteName: "",
        province: "",
        city: "",
        town: "",
        stationType: "",
        stationLocation: [],
        stationShape: 0,
        stationPoint: [],
        centerPoint: [],
        remarks: "",
        createUser: "",
        createTime: "",
        updateUser: "",
        updateTime: "",
        address: "",
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
    visible: {
      get() {
        console.log(this.dialogVisible);
        if (this.dialogVisible) {
          this.partnerDetail();
        }
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
        0: "禁用",
        1: "启用",
      };
      return map[val];
    },
  },
  methods: {
    handleClose() {
      setTimeout(() => {
        this.$emit("close");
      }, 300);
    },
    partnerDetail() {
      partnerDetail(this.dialogData.id).then((response) => {
        if (response.data.code == 0) {
          this.dataForm = response.data.data;
        } else {
          this.$message.success(response.data.msg);
        }
        console.log("response", this.dataForm);
      });
    },
  },
};
</script>
<style scoped lang="scss">
.dialog-footer {
  display: block;
}
</style>