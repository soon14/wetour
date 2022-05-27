<template>
  <el-drawer
    :title="(dialogType =='create' ? '添加' : dialogType ==='edit' ? '修改' : '查看')"
    @close="handleClose"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
    :close-on-click-modal="false"
    :wrapperClosable="false" 
    size="85%"
    
    :visible.sync="visible">
    <el-scrollbar style="height: 100%">
  
      <div style="margin: 0 30px; width: 85%;padding-bottom: 100px;">
              
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
          <div class="flex-between">
            <el-form-item label="机场名称："  style="width:50%;" prop="airportName"   label-width="130px"> 
              <el-input v-model="dataForm.airportName"  maxlength="30" placeholder="请输入机场名称" :disabled="dialogType === 'look'"></el-input>
            </el-form-item>
            <el-form-item label="归属城市："  style="width:50%;" prop="cityCnId" label-width="130px">

              <el-select v-model="dataForm.cityCnId" placeholder="归属城市" filterable clearable :disabled="dialogType == 'look' || dialogType == 'edit'">

                
                <el-option  :value="item.cityCnId" :label="item.cityCnName" v-for="item in cityList" :key="item.cityCnId"></el-option>
                <!-- <el-option label="汽油" :value="1"></el-option>
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
                <el-option label="其它" :value="13"></el-option> -->
              </el-select>
        <!-- <el-input v-model.trim="dataForm.fuelType" placeholder="燃料类型：0=油车、1=电车、2=油电混合"></el-input> -->
              <!-- <el-input v-model="dataForm.data.country"  maxlength="30" placeholder="请输入国家名称" :disabled="dialogType === 'look'"></el-input> -->
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="三字代码："  style="width:50%;" prop="threeCharactersCode"   label-width="130px"> 
              <el-input v-model="dataForm.threeCharactersCode"  maxlength="3" placeholder="请输入IATA代码" :disabled="dialogType === 'look' || dialogType === 'edit'"></el-input>
            </el-form-item>
            <el-form-item label="经度："  style="width:50%;" prop="longitude" label-width="130px">
              <el-input v-model="dataForm.longitude"  maxlength="10" placeholder="请输入经度" :disabled="dialogType === 'look'"></el-input>
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="纬度："  style="width:50%;" prop="latitude"   label-width="130px"> 
              <el-input v-model="dataForm.latitude"  maxlength="10" placeholder="请输入纬度" :disabled="dialogType === 'look'"></el-input>
            </el-form-item>
          </div>
        
        </el-form>
        <div  class=" flex-between" style="margin-top:30px;">
          <div>

          </div>
          <div>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit" v-if=" dialogType !== 'look'" :loading="!canSubmit" >确定</el-button>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- <mapDialog :myData="dataForm"  v-if="mapVisible" ref="map" @success="mapSuccess" @close="mapVisible = false"></mapDialog> -->
    
  </el-drawer>
</template>

<script>
    import {getCityAll, addObj, editObj,checkThreeCode} from '@/api/wetour/airportPrice'

    
import { resolve } from 'path'
    // import mapDialog from './map-dialog'

    export default {
    data () {
      
      const checkThreeCharactersCode = async (rule, value, callback)=>{
        await this.checkThreeCodes(value,rule).then(res=>{
          if(res){
            callback(new Error('三字代码已存在'))
          }else{
            callback()
          }
        })
      }

      

      
      return {
        canSubmit: true,
        mapVisible:false,
        dataForm: {
            id: 0,
            city: '',
            country: '',
            timeZone: '',
            telephoneCode: '',
            receiveMobile: '',
            businessStatus: 0,
        },
        dataRule: {
          
            airportName: [
              { required: true, message: "机场名称不能为空", trigger: "blur" },

            ],
            cityCnId: [
              {
                required: true,
                message: "归属城市不能为空",
                trigger: "change",
              }
            ],
            threeCharactersCode: [
              { required: true, message: "IATA代码不能为空", trigger: "blur" },
              {validator: checkThreeCharactersCode,trigger: 'blur'}

            ],
          
            longitude: [
              { required: true, message: "经度不能为空", trigger: "blur" },
            ],
            
            latitude: [
              { required: true, message: "纬度不能为空", trigger: "blur" },
            ],
          
        },
        cityList:[],
      }
    },
    components: {
    //   mapDialog
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
          return this.dialogVisible;
        },
        set(val) {
          if(!val){
            this.$emit("refreshDataList");
          }

          this.$emit("update:dialogVisible", val); 
        }
      },
    },
    filters:{
      vehicleTypeFil(val){
        const map = {
          5:'舒适5座',
          7:'舒适7座',
          12:'商务12座',
          19:'巴士19座',
          37:'巴士37座',
          49:'巴士49座',
        }
        return map[val]?map[val]:val+'座'
      },
      statusFil(val){
        const map = {
          '0':'未过期',
          '1':'已过期',
        }
        return map[val]
      },
    },
    methods: {
      checkThreeCodes(threeCharactersCode){
        console.log(this.dialogData,'-----')
        return new Promise((resolve,reject)=>{
          let data = {
            threeCharactersCode,
          }
          if(this.dialogType !='create'){
            data.id = this.dialogData.id
          }

          checkThreeCode(data).then(res=>{
            resolve(res.data.data)
          })
        })
      },
      
      // 重置
      resetForm() {
        this.$refs['dataForm'].resetFields();
      },
      handleClose() {
        console.log('myClose33333')
        setTimeout(()=>{
          this.$emit('close')
          
        },300)
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      },
      dataFormSubmit(){
        console.log(this.dataForm)
        if(this.dialogType =='create'){
          this.$refs['dataForm'].validate((valid) => {
            if(valid){
            let { dataForm, cityList } = this
            let data = Object.assign({},dataForm)
            cityList.forEach(element => {
              console.log(element,element.cityCnId == dataForm.cityCnId)
              if(element.cityCnId == dataForm.cityCnId){
                data.cityCnName = element.cityCnName
                data.countryName = element.countryName
                data.timeZone = element.timeZone
              }
            });
              addObj(data).then(res=>{
                if(res.data.code == 0 ){
                  this.$message.success(`新增成功`);
                  // this.$emit("refreshDataList");
                  // this.dialogFormVisible = false
                  this.visible = false
                }
                
              })
            }
          })
          return false
        }
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            let { dataForm, cityList } = this
            // dataForm.cityCnId
            let data = Object.assign({},dataForm)
            cityList.forEach(element => {
              console.log(element,element.cityCnId == dataForm.cityCnId)
              if(element.cityCnId == dataForm.cityCnId){
                data.cityCnName = element.cityCnName
                data.countryName = element.countryName
                data.timeZone = element.timeZone

              }
            });

            editObj(data).then(res=>{
              if(res.data.code == 0 ){
                this.$message.success(`修改成功`);
                // this.$emit("refreshDataList");
                // this.dialogFormVisible = false
                this.visible = false
              }
            })
          }
          
        })
        // console.log(this.dataForm)
        // console.log(this.dayList)
        // console.log(this.airportList)
        // console.log(this.singleList)
      },
      getCityAll(){
        getCityAll().then(res=>{
          console.log(res.data.data,33333)
          this.cityList = res.data.data
        })
      },
    },
    created(){
      if(this.dialogType !='create'){
        this.dataForm = Object.assign({},this.dialogData)
      }

      this.getCityAll()
      // this.dayList = this.dialogData.cityDayPrices
      // this.airportList = this.dialogData.cityAirportPriceDetailFeignDTO
    },
  }
</script>
<style scoped lang="scss">
.dialog-footer{
  display: block;
}
.avue-crud /deep/ .el-form-item--small.el-form-item{
  margin-bottom: 0;
  padding: 10px 0;
}
.avue-crud /deep/ .el-table .cell{
  overflow: initial;
}
</style>