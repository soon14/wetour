<template>
  <el-drawer
    :title="
      dialogType == 'create' ? '添加' : dialogType === 'edit' ? '修改' : '查看'
    "
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
        label-width="120px"
      >
        <div class="flex-between">
          <el-form-item label="ID：" style="width: 50%">
            <el-input
              :value="dataForm.id"
              maxlength="50"
              :disabled="dialogType === 'look'"
            ></el-input>
          </el-form-item>
          <el-form-item label="车牌号：" style="width: 50%">
            <el-input
              :value="dataForm.number"
              maxlength="50"
              :disabled="dialogType === 'look'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="flex-between">
          <el-form-item label="归属伙伴：" style="width: 50%">
            <el-input
              :value="dataForm.partnerName"
              maxlength="50"
              :disabled="dialogType === 'look'"
            ></el-input>
          </el-form-item>
          <el-form-item label="伙伴账号：" style="width: 50%">
            <el-input
              :value="dataForm.partnerAccountName"
              maxlength="50"
              :disabled="dialogType === 'look'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="flex-between" v-if="dataForm.countryType == '0'">
          <el-form-item label="保险失效日期：" style="width: 50%">
            <el-input
              :value="dataForm.insuranceExpired"
              maxlength="50"
              :disabled="dialogType === 'look'"
            ></el-input>
          </el-form-item>
          <el-form-item label="保险状态：" style="width: 50%">
            <el-input
              :value="dataForm.insuranceExpiredStatus | statusFil"
              maxlength="50"
              :disabled="dialogType === 'look'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="flex-between">
          <el-form-item label="国家：" style="width: 50%">
            <el-input
              :value="dataForm.countryCn"
              maxlength="50"
              :disabled="dialogType === 'look'"
            ></el-input>
          </el-form-item>
          <el-form-item label="品牌：" style="width: 50%">
            <el-input
              :value="dataForm.brand"
              maxlength="50"
              :disabled="dialogType === 'look'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="flex-between">
          <el-form-item label="车型：" style="width: 50%">
            <el-input
              :value="dataForm.busTypeTitle"
              maxlength="50"
              :disabled="dialogType === 'look'"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="行驶证照片：" v-if="dataForm.country == '0'">
          <img :src="dataForm.drivingLicense" class="imgs" />
        </el-form-item>
        <el-form-item label="注册文件：" v-if="dataForm.country == '1'">
          <img
            style="width: 200px; height: 82px"
            :src="dataForm.registerFile"
            class="imgs"
          />
        </el-form-item>
        <el-form-item label="保险照片：" v-if="dataForm.country == '1'">
          <img
            style="width: 200px; height: 82px"
            :src="dataForm.insuranceImage"
            class="imgs"
          />
        </el-form-item>
        <el-form-item label="车辆照片：">
          <div class="flex-start wrap" v-if="dataForm.busImageDTO">
            <div class="imgBox">
              <img
                style="width: 82px; height: 82px"
                :src="dataForm.busImageDTO.headImage"
                class="imgs"
              />
              <div>车头</div>
            </div>
            <div class="imgBox">
              <img
                style="width: 200px; height: 82px"
                :src="dataForm.busImageDTO.sideOneImage"
                class="imgs"
              />
              <div>侧面1</div>
            </div>
            <div class="imgBox">
              <img
                style="width: 200px; height: 82px"
                :src="dataForm.busImageDTO.sideTwoImage"
                class="imgs"
              />
              <div>侧面2</div>
            </div>
            <div class="imgBox">
              <img
                style="width: 200px; height: 82px"
                :src="dataForm.busImageDTO.tailImage"
                class="imgs"
              />
              <div>车尾</div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="flex-between" style="margin-top: 30px">
        <div></div>
        <div>
          <el-button @click="visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="dataFormSubmit()"
            v-if="dialogType !== 'look'"
            :loading="!canSubmit"
            >确定</el-button
          >
        </div>
      </div>
    </div>
    <!-- <mapDialog :myData="dataForm"  v-if="mapVisible" ref="map" @success="mapSuccess" @close="mapVisible = false"></mapDialog> -->
  </el-drawer>
</template>

<script>
import { getObj, addObj, putObj } from "@/api/station";
// import mapDialog from './map-dialog'
import { city } from "@/util/city";
import { county } from "@/util/county";

export default {
  data() {
    return {
      canSubmit: true,
      mapVisible: false,
      city: city,
      county: county,
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
    busTypeFil(val) {
      const map = {
        1: "5座",
        2: "7座",
        3: "12座",
        4: "17座",
        5: "37座",
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
  },
  methods: {
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
  },
  created() {
    this.dataForm = this.dialogData;
  },
};
</script>
<style scoped lang="scss">
.dialog-footer {
  display: block;
}
</style>