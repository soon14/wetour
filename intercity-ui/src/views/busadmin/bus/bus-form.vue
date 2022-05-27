<template>
  <el-dialog
    :title="myType == 'look' ? '查看' : !dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label="车牌号码：" prop="number">
      <el-input v-model.trim="dataForm.number" maxlength="10" placeholder="车牌号码" :disabled="myType == 'look'"></el-input>
    </el-form-item>
    <div class="flex-between">
      <el-form-item label="车辆类型：" prop="busType">
        <el-select v-model="dataForm.busType" placeholder="车辆类型" filterable clearable :disabled="myType == 'look'">
          <el-option :label="item.label" :value="item.value" v-for="(item,index) in busTypeList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="司机姓名：" prop="driverId"  >
        <el-select v-model="dataForm.driverId" filterable clearable :disabled="myType == 'look'" placeholder="请选择司机">
          <el-option :value="item.id" :label="item.driverName + ' ' + item.mobile" v-for="item in driverList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="燃料类型：" prop="fuelType">
        <el-select v-model="dataForm.fuelType" placeholder="燃料类型" filterable clearable :disabled="myType == 'look'">
          <el-option label="汽油" :value="1"></el-option>
          <el-option label="柴油" :value="2"></el-option>
          <el-option label="电" :value="3"></el-option>
          <el-option label="混合油" :value="4"></el-option>
          <el-option label="天然气" :value="5"></el-option>
          <el-option label="液化石油" :value="6"></el-option>
          <el-option label="甲醇" :value="7"></el-option>
          <el-option label="乙醇" :value="8"></el-option>
          <el-option label="太阳能" :value="9"></el-option>
          <el-option label="混合动力" :value="10"></el-option>
          <el-option label="氢" :value="11"></el-option>
          <el-option label="生物燃料" :value="12"></el-option>
          <el-option label="其它" :value="13"></el-option>
        </el-select>
        <!-- <el-input v-model.trim="dataForm.fuelType" placeholder="燃料类型：0=油车、1=电车、2=油电混合"></el-input> -->
      </el-form-item>
    </div>
    
    <el-form-item label="车辆品牌：" prop="brand">
      <el-input v-model.trim="dataForm.brand"  maxlength="20" placeholder="车辆品牌" :disabled="myType == 'look'"></el-input>
    </el-form-item>
    
    <el-form-item label="车辆颜色" prop="colour">
      <el-input v-model.trim="dataForm.colour" maxlength="10" placeholder="车辆颜色" :disabled="myType == 'look'"></el-input>
    </el-form-item>
    <el-form-item label="发动机号" prop="engineNo">
      <el-input v-model.trim="dataForm.engineNo" maxlength="20" placeholder="发动机号" :disabled="myType == 'look'"></el-input>
    </el-form-item>
    <el-form-item label="车架号" prop="vin">
      <el-input v-model.trim="dataForm.vin" maxlength="20" placeholder="车架号" :disabled="myType == 'look'"></el-input>
    </el-form-item>
    <el-form-item label="生产日期" prop="mfg">
      <!-- <el-input v-model="dataForm.mfg" placeholder="生产日期"></el-input> -->
      <el-date-picker
        v-model="dataForm.mfg"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd"
        type="date"
        :disabled="myType == 'look'"
        placeholder="生产日期">
      </el-date-picker>
    </el-form-item>
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
    import {getObj, addObj, putObj} from '@/api/busadmin/bus'
    import { fetchList as fetchListDriver } from "@/api/busadmin/driver";

    export default {
    data () {
      return {
        visible: false,
        canSubmit: false,
        busTypeList:[
          {label:'5座普通轿车',value:1},
          {label:'7座商务车',value:2},
          {label:'12座中巴车',value:3},
          {label:'17座考斯特',value:4},
          {label:'37座大客车',value:5},
        ],
        dataForm: {
          id: 0,
          number: '',
          busType: '',
          brand: '',
          fuelType: '',
          driverId: '',
          colour: '',
          engineNo: '',
          vin: '',
          mfg: '',
          remarks: '',
          createTime: '',
          updateTime: '',
          
        },
        myType:'',
        dataRule: {
          number: [
            { required: true, message: '车牌号码不能为空', trigger: 'blur' }
          ],
          busType: [
            { required: true, message: '车辆类型不能为空', trigger: 'blur' }
          ],
          driverId: [
            { required: true, message: '司机不能为空', trigger: 'blur' }
          ],
          // brand: [
          //   { required: true, message: '品牌不能为空', trigger: 'blur' }
          // ],
          // fuelType: [
          //   { required: true, message: '燃料类型：0=油车、1=电车、2=油电混合不能为空', trigger: 'blur' }
          // ],
          // colour: [
          //   { required: true, message: '颜色不能为空', trigger: 'blur' }
          // ],
          // engineNo: [
          //   { required: true, message: '发动机号不能为空', trigger: 'blur' }
          // ],
          // vin: [
          //   { required: true, message: '车架号不能为空', trigger: 'blur' }
          // ],
          // mfg: [
          //   { required: true, message: '生产日期不能为空', trigger: 'blur' }
          // ],
          // remarks: [
          //   { required: true, message: '备注不能为空', trigger: 'blur' }
          // ]
        },
        driverList:[]
      }
    },
    methods: {
      // 重置
      resetForm() {
        this.$refs['dataForm'].resetFields();
      },
      init (id,type) {
        console.log(id,type,3333)
        this.dataForm.id = id || 0;
        this.myType = type || '';
        this.getList()
        this.visible = true;
        this.canSubmit = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            getObj(this.dataForm.id).then(response => {
                this.dataForm = response.data.data
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.canSubmit = false;
            if (this.dataForm.id) {
                putObj(this.dataForm).then(data => {
                    this.$notify.success('修改成功')
                    this.visible = false
                    this.$emit('refreshDataList')
                }).catch(() => {
                    this.canSubmit = true;
                });
            } else {
                addObj(this.dataForm).then(data => {
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
