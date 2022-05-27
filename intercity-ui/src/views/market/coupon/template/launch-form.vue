<template>
  <el-drawer
    title="兑换"
    @close="handleClose"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
    :close-on-click-modal="false"
    size="70%"
    :visible.sync="visible"
     :wrapperClosable="false"
  >
    <el-scrollbar style="height: 100%">
      <div style="margin: 0 30px; width: 85%;padding-bottom: 100px;">
        <el-form
          :model="dataForm"
          ref="dataForm"
          :rules="dataRule"
        >
          <!-- label-position="top" -->

          <el-form-item   prop="mobiles">
            <div >领取用户手机号码<span style="font-size:12px;color:#333;">(仅支持使用中国大陆手机号注册微信的用户)</span></div>
            <el-input
              type="textarea"
              :rows="6"
              maxlength="2400"
              placeholder="请输入手机号并用英文逗号隔开"
              :disabled="checkState"
              v-model="dataForm.mobiles">
            </el-input>
          </el-form-item>


          <el-form-item   prop="">
            <div >发放优惠券</div>
            <!-- <el-input
              type="textarea"
              :rows="6"
              maxlength="2400"
              placeholder="请输入手机号并用英文逗号隔开"
              v-model="dataForm.textarea">
            </el-input> -->
            <div class="flex-between" v-for="(item,index) in dataForm.sendDTOList" :key="index">
              <el-form-item  style="width: 45%" 
                :rules="dataRule.templateId"
                :prop="'sendDTOList.' + index + '.templateId'"
              >
                <el-select
                  v-model="dataForm.sendDTOList[index].templateId"
                  style="width: 90%"
                  class="filter-item"
                  placeholder="请选择优惠券模版"
                  clearable
                  :disabled="index == 0 || checkState"
                >
                  <el-option v-for="item in couponList" :key="item.id" :value="item.id+''" :label="`${item.id} - ${item.templateTitle}`">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item  style="width: 45%" label="每人发放" label-width="80px" 
                :rules="dataRule.sendNumber"
                :prop="'sendDTOList.' + index + '.sendNumber'"
              >
                <div class="flex-start">
                  <el-input
                    v-model="dataForm.sendDTOList[index].sendNumber"
                    maxlength="2"
                    placeholder="请输入1～10之间的数字"
                    :disabled="checkState"
                  ></el-input>
                  <div>张</div>
                </div>
              </el-form-item>
              <div style="margin-bottom: 18px;margin-left:8px;width:70px;font-size:24px" class="flex-between">
                <i class="el-icon-circle-plus-outline" style="cursor: pointer;" v-if="index == 0" @click="addSendTO"></i>
                <i class="el-icon-remove-outline" style="cursor: pointer;" v-else @click="deleteSendTO(index)"></i>
              </div>
              
            </div>
          </el-form-item>

          <el-button type="primary" class="mb20" @click="validate" :loading="loading">发放校验</el-button>
          
          <el-input
            type="textarea"
            :rows="6"
            maxlength="2400"
            placeholder="校验结果"
            readonly
            v-model="validateData">
          </el-input>



        </el-form>

        <div class="flex-between" style="margin-top: 30px">
          <div></div>
          <div>
            <el-button @click="visible = false">取消</el-button>
            <el-button
              type="primary"
              @click="dataFormSubmit"
              :disabled="!checkState"
              >发放{{checkState?('-'+downTime):''}}</el-button
            >
          </div>
        </div>
      </div>
    </el-scrollbar>
  </el-drawer>
</template>

<script>
import { getCouponSelect } from "@/api/market/template";

import { busCheckSendCoupon, busSendCoupon } from "@/api/busadmin/coupon"
import { wetourCheckSendCoupon, wetourSendCoupon } from "@/api/wetour/coupon"
export default {
  data() {
    const checkPhone = (rule, value, callback)=>{
      value = value.replace(/，/ig,',')
      if(value.split(',').length>200){
        callback(new Error('最多可填写200个手机号码'));
      }else{
        let arr = value.split(',')
        if(arr.length != [...new Set(arr)].length){
          callback(new Error('有重复的手机号'));
        }else{
          let bol = false
          arr.forEach(element => {
            if(!(/^1(3|4|5|6|7|8|9)+\d{9}$/.test(element))) bol = true
          });
          if(bol) {
            callback(new Error('有错误的手机号请输入正确的手机号'));
          }else{
            callback();
          }
        }
        
        // !(/^1(3|4|5|6|7|8|9)+\d{9}$/.test(value))
        
      }
    }
    return {
      dataRule:{
        mobiles:[
          { required: true, message: "至少填写一个手机号码", trigger: "blur" },
          {validator: checkPhone,trigger: 'blur'}
        ],
        templateId:[
          {
            required: true,
            message: "请选择优惠券模版",
            trigger: "change",
          }
        ],
        sendNumber:[
          {
            required: true,
            message: "发放数量不能为空",
            trigger: "blur",
          },
          {
            pattern:/^([1-9]||10)$/,
            message: "请输入1～10之间的数字",
          },
        ]
      },
      dataForm:{
        sendDTOList:[

        ],
      },
      couponList:[],
      validateData:'',
      time:null,
      downTime:0,
      checkState:false,
      loading:false,
    }
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
      default: "",  //create  新增  edit 待上架编辑   look 查看
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
  methods:{
    handleClose() {
      setTimeout(() => {
        this.$emit("close");
      }, 300);
      
    },
    getCouponSelect(){
      let data = {
        useType:1,
        businessType:this.dialogData.businessType
      }
      getCouponSelect(data).then(res=>{
        this.couponList = res.data.data
      })
    },
    addSendTO(){
      if(this.dataForm.sendDTOList.length<10){
        this.dataForm.sendDTOList.push({
          sendNumber:'',
          templateId:''
        })
      }
    },
    deleteSendTO(index){
      this.dataForm.sendDTOList.splice(index,1)
    },
    validate(){
      this.$refs['dataForm'].validate((valid) => {
        if(valid){
          let data = Object.assign({},this.dataForm)
          this.loading = true
          data.mobiles = data.mobiles.replace(/，/ig,',')
          if(this.dialogData.businessType == 2){
            busCheckSendCoupon(data).then(res=>{
              this.loading = false
              console.log(res.data.data)
              this.validateData = res.data.data.result
              // checkState
              if(res.data.data.checkState){
                if(this.time){
                  clearInterval(this.time)
                  this.time = null
                }
                // checkState
                this.downTime = 60
                this.checkState = true
                this.time = setInterval(()=>{
                  this.downTime -- 
                  if(this.downTime <=0){
                    this.checkState = false
                    clearInterval(this.time)
                    this.time = null
                  }
                },1000)
              }
              
            }).catch(()=>{
              this.loading = false
            })
          }else{
            wetourCheckSendCoupon(data).then(res=>{
              this.loading = false
              console.log(res.data.data)
              this.validateData = res.data.data.result
              // checkState
              if(res.data.data.checkState){
                if(this.time){
                  clearInterval(this.time)
                  this.time = null
                }
                // checkState
                this.downTime = 60
                this.checkState = true
                this.time = setInterval(()=>{
                  this.downTime -- 
                  if(this.downTime <=0){
                    this.checkState = false
                    clearInterval(this.time)
                    this.time = null
                  }
                },1000)
              }
            }).catch(()=>{
              this.loading = false
            })
          }
          

        }
      })
    },
    dataFormSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if(valid){
          let data = Object.assign({},this.dataForm)
          data.mobiles = data.mobiles.replace(/，/ig,',')
          if(this.dialogData.businessType == 2){
            busSendCoupon(data).then(res=>{
              this.checkState = false
              this.visible = false
              this.$message.success(`发放成功`);

              // this.$emit('refreshDataList')
            })
          }else{
            wetourSendCoupon(data).then(res=>{
              this.checkState = false
              this.visible = false
              this.$message.success(`发放成功`);

              // this.$emit('refreshDataList')
            })
          }
        }
      })
    }
  },
  mounted(){
    this.getCouponSelect()
    this.dataForm.sendDTOList.push({
      sendNumber:'',
      templateId:this.dialogData.id+''
    })
  },
  destroyed(){
    if(this.time){
      clearInterval(this.time)
      this.time = null
    }
  }
}
</script>
<style lang="scss" scoped>
.mb20{
  margin-bottom:20px;
}
</style>