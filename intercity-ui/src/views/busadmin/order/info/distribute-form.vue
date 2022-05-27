<template>
  <el-dialog
    title="派单操作"
    :close-on-click-modal="false"
    @close="close"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="线路名称：">
        <!-- <el-input v-model.trim="dataForm.number" maxlength="10" placeholder="付金额" disabled></el-input> -->
        {{dialogData.lineName}}
      </el-form-item>
      <el-form-item label="出发时间：">
        {{parseTime(dialogData.departureStartTime,'{y}-{m}-{d} {h}:{i}:{s}')}} - {{parseTime(dialogData.departureEndTime,'{h}:{i}:{s}')}}
      </el-form-item>
      <el-form-item label="乘客：" >
        共{{dialogData.orderNumber}}个人
      </el-form-item>
      <el-form-item label="执行车辆：" prop="busId">
        <el-select v-model="dataForm.busId" filterable clearable @change="getOrderSeatCount">
          <el-option v-for="item in dialogData.busList" :key="item.busId + ''" :value="item.busId" :label="item.number"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="执行司机：" prop="remarks">
        <!-- <el-input v-model.trim="dataForm.remarks" maxlength="50" placeholder="请输入退款原因" type="textarea" show-word-limit :rows="4" ></el-input> -->
        {{busData.driverName || ''}}
      </el-form-item>
      <div style="margin-bottom:18px;margin-left:20px;" v-if="dataForm.busId">
        可载客{{busData.allowSeat}}人,已排乘客{{seatCount}}人,还剩{{Number(accSub(busData.allowSeat,seatCount))<=0 ? 0 : accSub(busData.allowSeat,seatCount)}}个座位
      </div>
      <el-form-item label="备注：" prop="remarks">
        <el-input v-model.trim="dataForm.remarks" maxlength="50" placeholder="请输入备注" type="textarea" show-word-limit :rows="4" ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Cancel">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()"  :loading="!canSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {orderDispatch, getOrderSeatCount } from '@/api/orderinfo'
  import { parseTime, accSub } from '@/util/common.js'

  export default {
    data () {
      
      return {
        canSubmit: false,
        dataForm: {
          busId:''
          
        },
        myType:'',
        dataRule: {
          // busId: [
          //   { required: true, message: '车牌号码不能为空', trigger: 'blur' }
          // ],
          busId: [
            { required: true, message: "请选择执行车辆", trigger: "change" },
          ],
          // remarks: [
          //   { required: true, message: '请输入备注', trigger: 'blur' }
          // ],

        },
        driverList:[],
        seatCount:0,
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
      },
      busData(){
        let obj = {}
        if(this.dataForm.busId){
          this.dialogData.busList.forEach(element => {
            if(element.busId == this.dataForm.busId) obj = element
          });
        }
        return obj
      }
    },
    created(){
      console.log(this.dialogData,'this.dialogData---------')
      // this.dataForm = Object.assign({},this.dialogData)
      
      this.canSubmit = true
      // this.getList()
    },
    methods: {
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
            let data = {
              busNumber : this.busData.number,
              busId : this.busData.busId,
              driverId : this.busData.driverId,
              driverInfo: this.busData.driverName + '-' + this.busData.mobile,
              orderId: this.dialogData.id,
              remarks: this.dataForm.remarks,
            }
            console.log(data,3333333)
            orderDispatch(data).then(res => {
                this.$notify.success('派单成功')
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
