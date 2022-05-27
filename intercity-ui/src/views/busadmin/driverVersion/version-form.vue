<template>
  <el-dialog
    :title="dialogType=='create'?'新增':'编辑'"
    :close-on-click-modal="false"
    @close="close"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="手机类型：" prop="versionType">
        <!-- <el-input v-model.trim="dataForm.versions" maxlength="10" placeholder="版本号" ></el-input> -->
        <el-select v-model="dataForm.versionType">
          <el-option value="android" label="安卓"></el-option>
          <el-option value="ios" label="ios"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本号：" prop="versions">
        <el-input v-model.trim="dataForm.versions" maxlength="10" placeholder="版本号" ></el-input>
      </el-form-item>
      <el-form-item label="更新地址：" prop="packageUrl">
        <div style="display:flex;">
          <el-input v-model.trim="dataForm.packageUrl"  placeholder="更新地址"  style="flex:1;margin-right:10px"></el-input>
          <el-upload
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            class="avatar-uploader"
            action="/admin/sys-file/upload"
            :http-request="UploadImage"
            ref="upload"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <img v-if="dataForm.packageUrl" id="avatar" :src="avatarUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" /> -->
          </el-upload>
        </div>
        
      </el-form-item>
      <el-form-item label="是否强制：" prop="isForce">
          <el-switch
            v-model="dataForm.isForce"
            :inactive-value="0"
            :active-value="1"
            >
          </el-switch>
      </el-form-item>

      <el-form-item label="更新内容：" prop="updateContent">
        <el-input v-model.trim="dataForm.updateContent" maxlength="50" placeholder="请输入更新内容" type="textarea" show-word-limit :rows="4" ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Cancel">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()"  :loading="!canSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { addObj, putObj ,UploadImageApi } from "@/api/busadmin/version";

  import { parseTime, accSub } from '@/util/common.js'
  import store from "@/store";

  export default {
    data () {
      
      return {
        canSubmit: false,
        dataForm: {
          versions:'',
          isForce:0,
          updateContent:'',
          packageUrl:'',
          startStatus:0,
        },
        myType:'',
        dataRule: {
          versionType: [
            { required: true, message: '请选择手机类型', trigger: 'change' }
          ],
          versions: [
            { required: true, message: "请输入版本号", trigger: "blur" },
          ],
          updateContent: [
            { required: true, message: '请输入更新内容', trigger: 'blur' }
          ],
          packageUrl: [
            { required: true, message: '请上传地址', trigger: 'blur' }
          ],

        },
        driverList:[],
        seatCount:0,
        avatarUrl: "",
        headers: {
          Authorization: "Bearer " + store.getters.access_token,
        },
      }
    },
    props: {
      dialogData: {
        type: Object,
        default: () => ({})
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      dialogType: {
        type: String,
        default: ''
      },
    },
    computed: {
      visible: {
        get() {
          console.log(222222)
          return this.dialogVisible;
        },
        set(val) {
          console.log(111111,val,33333)
          this.$emit("update:dialogVisible", val); 
        }
      },
    },
    created(){
      console.log(this.dialogData,'this.dialogData---------')
      if(this.dialogType == 'edit'){
        this.dataForm = Object.assign({},this.dialogData)
      }
      // this.dataForm = Object.assign({},this.dialogData)
      
      this.canSubmit = true
      // this.getList()
    },
    methods: {
      UploadImage(param){
        const formData = new FormData()
        formData.append('file', param.file)
        UploadImageApi(formData).then(response => {
          console.log('上传图片成功',response,this)
          this.dataForm.packageUrl = response.data.data.url;

          // param.onSuccess()  // 上传成功的图片会显示绿色的对勾
          // 但是我们上传成功了图片， fileList 里面的值却没有改变，还好有on-change指令可以使用
        }).catch(response => {
          // console.log('图片上传失败')
          param.onError()
        })
      },
      handleAvatarSuccess(res, file) {
        console.log(res, file,'------')
        // this.avatarUrl = URL.createObjectURL(file.raw);
        console.log(this.dataForm.packageUrl)
        this.dataForm.packageUrl = res.data.url;
        console.log(this.dataForm.packageUrl,res.data.fileName)

      },
      accSub(num1, num2){
        return accSub(num1, num2)
      },
      parseTime(time, cFormat){
        return parseTime(time, cFormat)
      },
      getOrderSeatCount(){
        let data = {
          busId:this.dataForm.busId,
          lineId:this.dialogData.lineId,
          orderNo:this.dialogData.orderNo
        }
        getOrderSeatCount(data).then(res=>{
          console.log(res)
          this.seatCount = res.data.data
        })
      },
      close() {
        console.log(555555)
        // this.visible = false
        // this.$emit('update:dialogVisible',false)
        
      },
      Cancel() {
        this.visible = false

        // this.close()
        // this.$emit("Cancel");
      },
      // 重置
      resetForm() {
        this.$refs['dataForm'].resetFields();
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            
            this.canSubmit = false;
            let api = this.dialogType === 'create' ? addObj : putObj
            // if(this.dialogType === 'create'){
            //   api = addObj
            // }else{
            //   api = putObj
            // }
            api(this.dataForm).then(res => {
                this.$notify.success('成功')
                this.visible = false
                this.$emit('refreshDataList')
            }).catch(() => {
                this.canSubmit = true;
            });
            
          }
        })
      },
      getList(){
        // 
        fetchListDriver(
          Object.assign({
            current: 1,
            size: 999999,
          })
        ).then((response) => {
          this.driverList = response.data.data.records
        });
      },
    }
  }
</script>
