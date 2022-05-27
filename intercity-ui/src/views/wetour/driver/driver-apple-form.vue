<template>
  <el-drawer
    title="司机审核"
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
      <el-form label-width="130px">
        <div class="flex-between">
          <el-form-item label="ID：" style="width: 50%">
            <el-input :value="dialogData.id" maxlength="50" disabled></el-input>
          </el-form-item>

          <el-form-item label="状态：" style="width: 50%">
            <el-input
              :value="dialogData.applyStatus | applyStatusFil"
              maxlength="50"
              disabled
            ></el-input>
          </el-form-item>
        </div>

        <div class="flex-between">
          <el-form-item label="司机号码：" style="width: 50%">
            <el-input
              :value="dialogData.prefixMobile + ' ' + dialogData.mobile"
              maxlength="50"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item label="姓名：" style="width: 50%">
            <el-input
              :value="dialogData.driverName"
              maxlength="50"
              disabled
            ></el-input>
          </el-form-item>
        </div>

        <div class="flex-between">
          <el-form-item label="驾驶证过期日期：" style="width: 50%">
            <el-input
              :value="dialogData.driverLicenseExpired"
              maxlength="50"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="性别：" style="width: 50%">
            <el-input
              :value="dialogData.gender | genderFil"
              maxlength="50"
              disabled
            ></el-input>
          </el-form-item>
        </div>

        <div class="flex-between">
          <el-form-item label="驾驶证状态：" style="width: 50%">
            <el-input
              :value="dialogData.licenseExpiredStatus | statusFil"
              maxlength="50"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="微信：" style="width: 50%">
            <el-input
              :value="dialogData.weixin"
              maxlength="50"
              disabled
            ></el-input>
          </el-form-item>
        </div>

        <div class="flex-between">
          <el-form-item label="国家：" style="width: 50%">
            <el-input
              :value="dialogData.countryCn"
              maxlength="50"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="申请时间：" style="width: 50%">
            <el-input
              :value="dialogData.applyTime"
              maxlength="50"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <div class="flex-between">
          <el-form-item label="申请人：" style="width: 50%">
            <el-input
              :value="dialogData.partnerName"
              maxlength="50"
              disabled
            ></el-input>
          </el-form-item>
        </div>

        <div class="flex-between">
          <el-form-item label="驾驶证图片：" style="width: 50%">
            <el-image
              style="width: 200px; height: 82px"
              :src="dialogData.driverLicenseImage"
              :preview-src-list="[dialogData.driverLicenseImage]"
              class="imgs"
            />
          </el-form-item>
          <el-form-item label="个人照片：" style="width: 50%">
            <el-image
              style="width: 82px; height: 82px"
              :src="dialogData.driverImage"
              :preview-src-list="[dialogData.driverImage]"
              class="imgs"
            />
          </el-form-item>
        </div>
        <el-form-item
          label="身份证照片："
          v-if="dialogData.country == '0' || dialogData.countryCn == '中国'"
        >
          <div class="flex-start wrap" v-if="dialogData.identificationImage">
            <div class="imgBox">
              <el-image
                style="width: 200px; height: 82px"
                :src="dialogData.identificationImage.split(',')[0]"
                :preview-src-list="dialogData.identificationImage.split(',')"
                class="imgs"
              />
              <div>头像面</div>
            </div>
            <div class="imgBox" style="margin-left: 30px">
              <el-image
                style="width: 200px; height: 82px"
                :src="dialogData.identificationImage.split(',')[0]"
                :preview-src-list="dialogData.identificationImage.split(',')"
                class="imgs"
              />
              <div>国徽面</div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="flex-between" style="margin-top: 30px">
        <div></div>
        <div>
          <el-button @click="visible = false">取消</el-button>
          <el-button
            v-if="permissions.wetour_driverapply_edit"
            type="danger"
            @click="rejectHandle"
            :loading="!canSubmit"
            >驳回</el-button
          >
          <el-button
            v-if="permissions.wetour_driverapply_edit"
            type="primary"
            @click="adoptHandle"
            :loading="!canSubmit"
            >通过</el-button
          >
        </div>
      </div>
    </div>
    <!-- <mapDialog :myData="dataForm"  v-if="mapVisible" ref="map" @success="mapSuccess" @close="mapVisible = false"></mapDialog> -->
    <el-dialog
      title="驳回"
      :visible.sync="dialogFormVisible"
      :before-close="handleAppleClose"
      append-to-body
      width="600px"
    >
      <!-- :center="true"   居中 -->
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <!-- <el-form-item label="票价设置：" prop="price">
          <el-input
            v-model="temp.price"
            placeholder="请输入票价"
            style="width: 180px"
          >
          </el-input>
        </el-form-item> -->
        <el-form-item>
          <div>
            是否驳回 {{ dialogData.partnerName }} 申请的
            {{ dialogData.driverName }} 的司机审核
          </div>
        </el-form-item>
        <el-form-item label="驳回原因：" prop="applyReason">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4 }"
            placeholder="请输入驳回原因"
            maxlength="30"
            show-word-limit
            v-model.trim="temp.applyReason"
            @keydown.native="pushKeyword($event)"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="setPrice">确定</el-button>
      </div>
    </el-dialog>
  </el-drawer>
</template>

<script>
import { getObj, addObj, putAppleObj } from "@/api/wetour/driver";
// import mapDialog from './map-dialog'
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      canSubmit: true,
      mapVisible: false,

      dialogFormVisible: false,
      temp: {
        applyReason: "",
      },
      rules: {
        applyReason: [
          {
            required: true,
            message: "驳回原因不能为空",
            trigger: "blur",
          },
        ],
      },
      requestLocked: false,
    };
  },
  components: {
    //   mapDialog
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
    dialogType: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
    visible: {
      get() {
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
    genderFil(val) {
      const map = {
        1: "男",
        2: "女",
      };
      return map[val];
    },
    statusFil(val) {
      const map = {
        0: "未过期",
        1: "已过期",
      };
      return map[val];
    },
    applyStatusFil(val) {
      const map = {
        1: "审核通过",
        2: "审核驳回",
        0: "待审核",
      };
      return map[val];
    },
  },
  methods: {
    // 获取关键词
    pushKeyword(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    },
    // 重置
    resetForm() {
      this.$refs["dataForm"].resetFields();
    },
    handleClose() {
      setTimeout(() => {
        this.$emit("close");
      }, 300);
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    // 删除
    rejectHandle() {
      this.dialogFormVisible = true;
      // this.$confirm("是否确认删除ID为" + id, "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      // .then(function () {
      //   return delObj(id);
      // })
      // .then((data) => {
      //   this.$message.success("删除成功");
      //   this.getDataList();
      // });
    },
    handleAppleClose() {
      this.dialogFormVisible = false;
    },
    setPrice() {
      if (this.requestLocked) return false;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp);
          // tempData.price = tempData.price - 0
          putAppleObj({
            ...tempData,
            id: this.dialogData.id,
            applyStatus: 2,
          }).then((res) => {
            this.$message.success(`驳回成功`);
            // this.$emit("refreshDataList");
            this.dialogFormVisible = false;
            this.visible = false;
          });
        }
      });
    },
    adoptHandle() {
      let id = this.dialogData.id;
      this.$confirm(
        `是否通过 ${this.dialogData.partnerName} 申请的 ${this.dialogData.driverName} 的司机审核`,
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return putAppleObj({ id, applyStatus: 1 });
        })
        .then((data) => {
          this.$message.success("审核通过");
          this.visible = false;
          // this.$emit("refreshDataList");
          // this.getDataList();
        });
    },
  },
  created() {
    console.log(666666);
  },
};
</script>
<style scoped lang="scss">
.dialog-footer {
  display: block;
}
</style>