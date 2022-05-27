<template>
  <el-drawer
    title="领取"
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

          <el-form-item label="领取二维码"  prop="">
            <qrcode
              v-if="msg"
              id="qrcode"
              ref="qrcode"
              :value="msg"
              :options="options"
              tag="img"
            />
          </el-form-item>

          <el-divider></el-divider>


          <el-form-item label="背景图"  prop="backgroundImage">
            <div>
              <el-input v-model.trim="dataForm.backgroundImage"  placeholder="更新地址"  style="flex:1;margin-right:10px" :disabled="disabled"></el-input>
              <div class="flex-start" style="margin-top:30px;"> 
                <el-upload
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  class="avatar-uploader"
                  action="/admin/sys-file/upload"
                  :http-request="UploadImage"
                  ref="upload"
                  multiple
                  :disabled="disabled"
                >
                  <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                  <img v-if="dataForm.backgroundImage" id="avatar" :src="dataForm.backgroundImage" class="avatars" />
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>

                <div style="margin-left:30px;">
                  <p>注：</p>

                  <!--  -->
                  <p>1、背景图的尺寸必须为 {{this.dialogData.businessType == 2 ? '750 * 476' : '750 * 1750'}}</p>
                  <p>2、更换后请扫码预览后再发送给用户</p>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="领取说明"  prop="activityDesc">
            <el-input
              v-model="dataForm.activityDesc"
              maxlength="200"
              :disabled="disabled"
              type="textarea"
              :autosize="{ minRows: 5}"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>



          
          



        </el-form>

        <div class="flex-between" style="margin-top: 30px">
          <div></div>
          <div>
            <el-button @click="visible = false">取消</el-button>
            <el-button
              type="primary"
              @click="disabled = false"
              v-if="disabled"
              >开始编辑</el-button
            >
            <el-button
              type="primary"
              @click="dataFormSubmit"
              v-else
              >保存</el-button
            >
          </div>
        </div>
      </div>
    </el-scrollbar>
  </el-drawer>
</template>

<script>
import { configUrl } from "@/config/env";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { getCouponActivity, updateActivityById } from "@/api/market/template";
  import store from "@/store";
import { UploadImageApi } from "@/api/busadmin/version";

export default {
  components:{
    qrcode: VueQrcode,

  },
  data() {
    return {
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      dataRule:{
        backgroundImage:[
          {
            required: true,
            message: "请上传图片",
            trigger: "change",
          }
        ],
        activityDesc:[
          {
            required: true,
            message: "请输入领取说明",
            trigger: "change",
          }
        ]
      },
      dataForm:{
        backgroundImage:'',
        activityDesc:'',
      },
      msg:'',
      options: {
        height: 200,
        width: 200,
      },
      disabled:true,
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
    getCouponActivity(){
      getCouponActivity(this.dialogData.id).then(res=>{
        console.log(res.data.data)
        this.dataForm = res.data.data
        this.$nextTick(()=>{
          if(this.dialogData.businessType == 2){
            this.msg = configUrl  + '/intercityTravel?id='+res.data.data.id
          }else{
            this.msg = configUrl  + '/wtActivity?id='+res.data.data.id
          }
          
          console.log(this.msg,'-----')
        })
      })
    },
    handleAvatarSuccess(res, file) {
      this.dataForm.backgroundImage = res.data.url;
    },
    UploadImage(param){
      const formData = new FormData()
      formData.append('file', param.file)
      UploadImageApi(formData).then(response => {
        console.log('上传图片成功',response,this)
        this.dataForm.backgroundImage = response.data.data.url;
        // 但是我们上传成功了图片， fileList 里面的值却没有改变，还好有on-change指令可以使用
      }).catch(response => {
        // console.log('图片上传失败')
        param.onError()
      })
    },
    dataFormSubmit(){
      // 
      this.$refs['dataForm'].validate((valid) => {
        if(valid){
          let data = Object.assign({},this.dataForm)
          // if(this.dialogData.businessType == 2){
            updateActivityById(data).then(res=>{
              this.visible = false
              this.$message.success(`修改成功`);
              // this.$emit('refreshDataList')
            })
          // }
        }
      })
    },
  },
  mounted(){
    this.getCouponActivity()

    

  },
  created(){
    console.log(this.dialogData,'333----')
    let num = '0'
    if(this.dialogData.userLimitType == '0'){
      num = '不限'
    }else{
      num = this.dialogData.userLimitNumber
    }
    
    let startTime = this.dialogData.startTime.replace(/-/ig,'/').split(' ')[0]
    let endTime = this.dialogData.endTime.replace(/-/ig,'/').split(' ')[0]
    this.dataForm.activityDesc = `1、可领取时间段：${startTime}~${endTime}\n2、仅限新用户领取：${this.dialogData.userState == 1 ? '是' : '否'} \n3、每人可领取张数：${num} \n
    `
  },
}
</script>
<style lang="scss" scoped>
.mb20{
  margin-bottom:20px;
}
.avatars{
  max-width: 400px;
  min-width: 200px;
}
</style>