<template>
  <el-drawer
    size="70%"
    title="用户优惠券详情"
    direction="ltr"
    :append-to-body="true"
    :visible.sync="visible"
    :before-close="handleClose"
     :wrapperClosable="false"
  >
    <el-scrollbar style="height: 100%">
      <div style="margin: 0 30px; width: 85%;padding-bottom: 100px;">
        <el-form
          :model="dataForm"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
          label-width="130px"
        >
          <h4 class="title">基本信息</h4>
          <div class="flex-between">
            <el-form-item label="优惠券模板标题：" style="width: 50%" prop="id">
              {{ dialogData.templateTitle }}
            </el-form-item>

            <el-form-item
              label="优惠券类型："
              style="width: 50%"
              prop="partnerName"
            >
              {{ dialogData.couponTypeShow }}
              <template v-if="dialogData.couponType == 1">
                满{{dialogData.withRealAmount}}减{{dialogData.reduceRealAmount}}
              </template>
              <template v-else>
                满{{dialogData.withRealAmount}}打{{dialogData.discount}}折,最多优惠{{dialogData.maxDiscountRealAmount}}元
              </template>
            </el-form-item>
          </div>


          <!-- <div class="flex-between">
            <el-form-item label="发放数量：" style="width: 50%" prop="createTime">
              {{ dialogData.createTime }}
            </el-form-item>
            <el-form-item label="创建人：" style="width: 50%" prop="partnerStatus">
              {{ dialogData.partnerStatusShow }}
            </el-form-item>
          </div> -->



          <div class="flex-between">
            <el-form-item label="使用端口：" style="width: 50%" prop="businessTypeShow">
              {{ dialogData.businessTypeShow }}
            </el-form-item>
            <el-form-item
              label="归属用户ID："
              style="width: 50%"
              prop="cityIdsShow"
            >
              {{ dialogData.userId }}
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="用户手机号：" style="width: 50%" prop="createTime">
              {{ dialogData.mobile }}
            </el-form-item>
            <el-form-item label="优惠券状态：" style="width: 50%" prop="partnerStatus">
              {{ dialogData.couponStatusShow }}
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="优惠券说明：" style="width: 50%" prop="createTime">
              <div v-html="changeLine(dialogData.templateDesc)"></div>
            </el-form-item>
          </div>
          <!-- <el-form-item
            v-if="dialogData.partnerStatus == 0"
            label="禁用原因："
            style="width: 50%"
            prop="createTime"
          >
            {{ dialogData.disableReason }}
          </el-form-item> -->
          <h4 class="title">领取信息</h4>
          <div class="flex-between">
            <el-form-item label="领取方式：" style="width: 50%" prop="createTime">
              {{ dialogData.useTypeShow }}
            </el-form-item>
            <el-form-item label="仅新用户可领：" style="width: 50%" prop="partnerStatus" v-if="dialogData.useType != 1">
              {{ dialogData.userStateShow }}
            </el-form-item>
          </div>
          <div class="flex-between" v-if="dialogData.useType != 1">
            <el-form-item label="每人领取张数：" style="width: 50%" prop="createTime">
              {{ dialogData.userLimitType == 0 ? '不限' : dialogData.userLimitNumber }}
            </el-form-item>
            <el-form-item label="可领取时间段：" style="width: 50%" prop="partnerStatus">
              {{ dialogData.startTime }} - {{ dialogData.endTime }}
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="领取时间：" style="width: 50%" prop="createTime">
              {{ dialogData.receiveTime }}
            </el-form-item>
            <el-form-item label="兑换码：" style="width: 50%" prop="partnerStatus" v-if="dialogData.useType == 3">
              {{ dialogData.exchangeKey }}
            </el-form-item>
          </div>

          <h4 class="title">使用信息</h4>
          <div class="flex-between">
            <el-form-item label="使用时间：" style="width: 50%" prop="createTime">
              {{ dialogData.useTime  || '-' }}
            </el-form-item>
            <el-form-item label="使用订单号：" style="width: 50%" prop="partnerStatus">
              {{ dialogData.orderNo  || '-' }}
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="优惠金额：" style="width: 50%" prop="discountRealAmount">
              {{ dialogData.discountRealAmount == 0 ? 0 : ( dialogData.discountRealAmount || '-') }}

            </el-form-item>
            <el-form-item label="订单金额：" style="width: 50%" prop="orderRealAmount">
              {{ dialogData.orderRealAmount == 0 ? 0 : ( dialogData.orderRealAmount || '-') }}
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="优惠券有效期：" style="width: 50%" prop="createTime">
              {{ dialogData.couponStartTime }} ~ {{ dialogData.couponEndTime }}
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="生效时间：" style="width: 50%" prop="createTime">
              {{ dialogData.weekConfig | weekConfigFil }}
            </el-form-item>
          </div>
          <div class="flex-between"  v-if="dialogData.businessType == 1">
            <el-form-item label="可用业务类型：" style="width: 50%" prop="createTime">
              {{ dialogData.charteredTypeConfigStr || '不限' }}
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="可用城市选择：" style="width: 50%" prop="createTime">
              {{ dialogData.cityConfigStr || '不限' }}
            </el-form-item>
          </div>
          <div class="flex-between" v-if="dialogData.businessType == 1">
            <el-form-item label="可用车型：" style="width: 50%" prop="createTime">
              {{ dialogData.busTypeConfigStr  || '不限'}}
            </el-form-item>
          </div>
          <!-- <div class="flex-between">
            <el-form-item label="可用商品(旅游)：" style="width: 50%" prop="createTime">
              {{ dialogData.createTime }}
            </el-form-item>
          </div> -->
          <div class="flex-between"  v-if="dialogData.businessType == 2">
            <el-form-item label="可用线路：" style="width: 50%" prop="createTime">
              {{ dialogData.lineConfigStr || '不限' }}
            </el-form-item>
          </div>
        </el-form>

        <div class="flex-center" style="margin-top: 30px">
          <el-button @click="visible = false">返回</el-button>
        </div>
      </div>
    </el-scrollbar>

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
    weekConfigFil(val){
      if(!val) return '不限'
      const map = {
        0:'周日',
        1:'周一',
        2:'周二',
        3:'周三',
        4:'周四',
        5:'周五',
        6:'周六',
      }
      let arr = val.split(','),newArr = []
      arr.forEach(element => {
        newArr.push(map[element])
      });
      return newArr.join(',')
    },
  },
  methods: {
    handleClose() {
      setTimeout(() => {
        this.$emit("close");
      }, 300);
    },
    changeLine(str){
      return str.replace(/\n/g,'<br>')
    },
   
  },
};
</script>
<style scoped lang="scss">
.dialog-footer {
  display: block;
}
</style>