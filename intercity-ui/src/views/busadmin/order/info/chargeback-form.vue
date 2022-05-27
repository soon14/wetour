<template>
  <el-dialog
    title="退款操作"
    :close-on-click-modal="false"
    @close="close"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
        <el-form-item label="实付金额：" prop="number">
        <el-input :value="dialogData.payAmount" maxlength="10" placeholder="实付金额" disabled></el-input>
        </el-form-item>
        <el-form-item label="退款金额：" :prop="dialogData.payAmount == 0?'':'amount'">
        <el-input v-model.trim="dataForm.amount"  maxlength="20" placeholder="退款金额" :disabled="dialogData.payAmount == 0" ></el-input>
        </el-form-item>
        <el-form-item label="退款原因" prop="reason">
        <el-input v-model.trim="dataForm.reason" maxlength="50" placeholder="请输入退款原因" type="textarea" show-word-limit :rows="4" ></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Cancel">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()"  :loading="!canSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {orderRefund} from '@/api/orderinfo'

  export default {
    data () {
      const checkBrand = (rule, value, callback)=>{
        console.log(666666666666)
        // this.dataForm.number
        let val = Number(value),number = Number(this.dialogData.payAmount)
        console.log(val,number,33333)
        var three = /^-?\d+(\.\d{1,2})?$/;  
        console.log(val , number)
        if(isNaN(value)){
          callback(new Error('请输入正确退款金额'));
        }else if(!three.test(val)){
          callback(new Error(`最多只能保留两位小数位数`));
        }else if(val<0.01 || val > number){
          // callback(new Error(`退款金额不能超范围（0.01~${number}）`));
          callback(new Error(`退款金额超范围了`));
        }else{
          callback();
        }

        // if(bol) {
        //   callback(new Error('请输入正确的手机号'));
        // }else{
        //   callback();
        // }
        
    }
      return {
        canSubmit: false,
        dataForm: {
          amount: '',
          reason: '',
          
          
        },
        myType:'',
        dataRule: {
          amount: [
            { required: true, message: "退款金额不能为空", trigger: "blur" },
             {validator: checkBrand},
          ],
          reason: [
            { required: true, message: '请输入退款原因', trigger: 'blur' }
          ],

        },
      }
    },
    props: {
      dialogData: {
        type: Object,
        default: () => ({
          dialogTitle: "",
          dialogCon: ""
        })
      },
      dialogVisible: {
        type: Boolean,
        default: false
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
      }
    },
    created(){
      this.canSubmit = true
      console.log(this.dialogData,'------')
      if(this.dialogData.payAmount == '0'){
        this.dataForm.amount = '0'
      }
    },
    methods: {
      close() {
        console.log(555555)
        // this.visible = false

        // this.$emit('update:dialogVisible',false)
        
      },
      Cancel() {
        this.visible = false
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
            let data = {
              ...this.dataForm,
              orderId:this.dialogData.id
            }
            console.log(data)
            orderRefund(data).then(data => {
                this.$notify.success('退款发起成功，具体以到账时间为准')
                this.visible = false
                this.$emit('refreshDataList')
            }).catch(() => {
                this.canSubmit = true;
            });
          }
        })
      },
     
    }
  }
</script>
