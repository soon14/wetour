<template>
  <el-dialog
    :title="myType == 'look' ? '查看' : !dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label="司机姓名" prop="driverName">
      <el-input v-model.trim="dataForm.driverName" maxlength="10" placeholder="司机姓名"  :disabled="myType == 'look'"></el-input>
    </el-form-item>
    <el-form-item label="司机手机号" prop="mobile">
      <el-input v-model.trim="dataForm.mobile" maxlength="11" placeholder="司机手机号"  :disabled="myType == 'look'"></el-input>
    </el-form-item>
    <el-form-item label="证件类型" prop="certType">
      <!-- <el-input v-model="dataForm.certType" placeholder="证件类型 1身份证 0其他"></el-input> -->
      <el-select v-model="dataForm.certType"  :disabled="myType == 'look'">
        <el-option label="身份证" :value="1"></el-option>
        <el-option label="其他" :value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="证件号码" prop="certNo" >
      <el-input v-model.trim="dataForm.certNo" @blur="blurCerNo" maxlength="30" placeholder="证件号码"  :disabled="myType == 'look'"></el-input>
    </el-form-item>
    <el-form-item label="出生日期" prop="birthday">
      <!-- <el-input v-model="dataForm.birthday" placeholder="出生日期"></el-input> -->
      <el-date-picker
        v-model="dataForm.birthday"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd"
        type="date"
         :disabled="myType == 'look'"
        placeholder="出生日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="驾照类型" prop="driverLicenseType">
      <el-input v-model.trim="dataForm.driverLicenseType" maxlength="20" placeholder="驾照类型" :disabled="myType == 'look'"></el-input>
    </el-form-item>
    <el-form-item label="驾照效期" prop="value1">
      <!-- <el-input v-model="dataForm.driverLicenseStart" placeholder="驾照有效开始时间"></el-input> -->
      <el-date-picker
        v-model="dataForm.value1"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd"
        range-separator="至"
         :disabled="myType == 'look'"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <!-- <el-form-item label="驾照有效结束时间" prop="driverLicenseEnd">
      <el-input v-model="dataForm.driverLicenseEnd" placeholder="驾照有效结束时间"></el-input>
    </el-form-item> -->
    <el-form-item label="备注" prop="remarks">
      <el-input v-model.trim="dataForm.remarks" maxlength="50" placeholder="备注" type="textarea" show-word-limit :rows="4" :disabled="myType == 'look'"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime" v-if="myType == 'look'">
      <el-input v-model.trim="dataForm.createTime"  :disabled="myType == 'look'"></el-input>
    </el-form-item>
    <el-form-item label="创建人" prop="createUser" v-if="myType == 'look'">
      <el-input v-model.trim="dataForm.createUser"  :disabled="myType == 'look'"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="resetForm()" v-if="dataForm.id == 0">重置</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="myType !== 'look'" :loading="!canSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {getObj, addObj, putObj} from '@/api/busadmin/driver'
    import { ChinaIdChecker } from '@/util/common'

    export default {
    data () {
      const checkPhone = (rule, value, callback)=>{
        if (!(/^1(3|4|5|6|7|8|9)+\d{9}$/.test(value))) {
          callback(new Error('请输入正确的手机号'));
        }else{
          callback()
        }
      }
      const checkCert = (rule, value, callback)=>{
        if (!ChinaIdChecker(value) && value != '' && this.dataForm.certType == 1) {
          callback(new Error('请输入正确的身份证号'));
        }else{
          callback()
        }
      }
      return {
        visible: false,
        canSubmit: false,
        dataForm: {
          id: 0,
          driverName: '',
          mobile: '',
          certType: '',
          certNo: '',
          birthday: '',
          driverLicenseType: '',
          driverLicenseStart: '',
          driverLicenseEnd: '',
          verifyCode: '',
          remarks: '',
          createUser: '',
          createTime: '',
          updateUser: '',
          updateTime: '',
          value1:[],
        },
        dataRule: {
          driverName: [
            { required: true, message: '司机姓名不能为空', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '司机手机号不能为空', trigger: 'blur' },
            {validator: checkPhone,trigger: 'blur'}
          ],
          certNo:[
           
            {validator: checkCert,trigger: 'blur'}
          ]
          
        },
        myType:'',
      }
    },
    methods: {
      // 重置
      resetForm() {
        this.$refs['dataForm'].resetFields();
        this.dataForm.driverLicenseStart = ''
        this.dataForm.driverLicenseEnd = ''
        console.log(this.dataForm,33333)
      },
      init (id,type) {
        this.dataForm.id = id || 0;
        this.myType = type || '';
        this.visible = true;
        this.canSubmit = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            getObj(this.dataForm.id).then(response => {
                let obj = Object.assign({},response.data.data)
                if(obj.driverLicenseStart ===  "0001-01-01 00:00:00" && obj.driverLicenseEnd === "0001-01-01 00:00:00"){
                  obj.value1 = []
                }else{
                  obj.value1 = [obj.driverLicenseStart,obj.driverLicenseEnd]
                }
                
                this.dataForm = obj
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          console.log(333333)
          if (valid) {
            console.log(2222)
            this.canSubmit = false;
            let data = Object.assign({},this.dataForm)
            data.driverLicenseStart = data.value1[0]
            data.driverLicenseEnd = data.value1[1]
            data.driverLicenseType  = data.driverLicenseType.toUpperCase()
            if (this.dataForm.id) {
              
                putObj(data).then(data => {
                    this.$notify.success('修改成功')
                    this.visible = false
                    this.$emit('refreshDataList')
                }).catch(() => {
                    this.canSubmit = true;
                });
            } else {
                addObj(data).then(data => {
                    this.$notify.success('添加成功')
                    this.visible = false
                    this.$emit('refreshDataList')
                }).catch(() => {
                    this.canSubmit = true;
                });
            }
          }
        })
      },
      blurCerNo(){
        // this.dataForm.certNo
        let bol = ChinaIdChecker(this.dataForm.certNo)
        if(bol ){
          let date = this.getBirthdayFromIdCard(this.dataForm.certNo)
          this.dataForm.birthday = date+' 00:00:00'
        }
      },
      getBirthdayFromIdCard : function(idCard) {
        var birthday = "";
        if(idCard != null && idCard != ""){
          if(idCard.length == 15){
            birthday = "19"+idCard.substr(6,6);
          } else if(idCard.length == 18){
            birthday = idCard.substr(6,8);
          }
        
          birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
        }
        
        return birthday;
      },
    }
  }
</script>
