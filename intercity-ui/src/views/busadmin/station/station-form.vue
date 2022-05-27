<template>
  <el-drawer
    :title="(type =='create' ? '添加' : type ==='edit' ? '修改' : '查看')+( dataForm.stationShape==1?'站点':'区域')"
    @close="handleClose"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
    :close-on-click-modal="false"
     :wrapperClosable="false"
    size="70%"
    :visible.sync="visible">
    <div style="margin:0 30px;width:85%;">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
        <el-form-item label="站点名称：" prop="siteName">
          <el-input v-model.trim="dataForm.siteName" placeholder="请输入站点名称(30字)" maxlength="30" :disabled="type === 'look'"></el-input>
        </el-form-item>
        <!-- <el-form-item label="省编号Code 如 3303不是必填" prop="province">
          <el-input v-model="dataForm.province" placeholder="省编号Code 如 3303不是必填"></el-input>
        </el-form-item> -->
        <div class="flex-between">
          <el-form-item label="站点类型：" prop="stationType">
            <!-- <el-input v-model="dataForm.stationType" placeholder="站点类型0 其它  1 火车站 2 景区3 医院 4 机场5 行政区 6 学校 7 汽车站 8 社区9  综合体 "></el-input> -->
            <el-select v-model="dataForm.stationType" placeholder="请选择站点类型" filterable clearable :disabled="type === 'look'">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属城市：" prop="city">
            <el-select v-model="dataForm.city" placeholder="请选择城市" @change="cityChange" filterable clearable :disabled="type === 'look'">
              <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区县：" :prop="dataForm.stationShape==2?'town':''">
            <el-select v-model="dataForm.town" placeholder="请选择区县" @change="townChange" filterable clearable :disabled="type === 'look'">
              <template v-if="dataForm.city">
                <el-option v-for="item in county[dataForm.city]" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </template>
              
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="地图选点：" prop="address" v-if="dataForm.stationShape == 1">
          <div class="flex-start">
            <el-button type="primary" @click="selectMap" >{{type === 'look'?'查看':'选点'}}</el-button>
            <div style="margin-left:10px;">详细地址：{{dataForm.address || '还未选择'}}</div>
            <!-- <el-input v-model="dataForm.address" v-show="false" v-if="type !== 'look'"></el-input> -->
          </div>
        </el-form-item>
        <el-form-item label="电子围栏：" prop="stationLocation" v-if="dataForm.stationShape == 2">
          <div class="flex-start">
            <el-button type="primary" @click="selectMap">{{type === 'look'?'查看围栏':'设置'}}</el-button>
            <div style="margin-left:10px;" v-if="type !== 'look'">{{dataForm.stationLocation.length ? '已设置围栏' : '未设置围栏'}}</div>
            <!-- <el-input v-model="dataForm.stationPoint" v-show="false"></el-input> -->
          </div>
        </el-form-item>
        <el-form-item label="备注说明：" >
          <el-input v-model.trim="dataForm.remarks" placeholder="请输入备注内容(50字)" maxlength="50" :disabled="type === 'look'"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime" v-if="type == 'look'">
          <el-input v-model.trim="dataForm.createTime"  :disabled="type == 'look'"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="createUser" v-if="type == 'look'">
          <el-input v-model.trim="dataForm.createUser"  :disabled="type == 'look'"></el-input>
        </el-form-item>
      </el-form>
      <div  class=" flex-between" style="margin-top:30px;">
        <div>

        </div>
        <div>
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()" v-if=" type !== 'look'" :loading="!canSubmit" >确定</el-button>
        </div>
      </div>
    </div>
    <mapDialog :myData="dataForm"  v-if="mapVisible" ref="map" @success="mapSuccess" @close="mapVisible = false"></mapDialog>
    
  </el-drawer>
</template>

<script>
    import {getObj, addObj, putObj} from '@/api/station'
    import mapDialog from './map-dialog'
    import { city} from "@/util/city"
    import { county} from "@/util/county"

    export default {
    data () {
      const checkStation = (rule, value, callback)=>{
        if(value.length === 0){
          let test = this.dataForm.stationShape == 2? '电子围栏未设置':'站点位置不能为空'
          callback(new Error(test));
        }else{
          callback();
        }
      }
      return {
        visible: false,
        canSubmit: false,
        mapVisible:false,
        city:city,
        county:county,
        dataForm: {
          id: 0,
          siteName: '',
          province: '',
          city: '',
          town: '',
          stationType: '',
          stationLocation: [],
          stationShape: 0,
          stationPoint: [],
          centerPoint: [],
          remarks: '',
          createUser: '',
          createTime: '',
          updateUser: '',
          updateTime: '',
          address:'',
        },
        typeList:[
          {label:'火车站',value:'1'},
          {label:'景区',value:'2'},
          {label:'医院',value:'3'},
          {label:'机场',value:'4'},
          {label:'行政区',value:'5'},
          {label:'学校',value:'6'},
          {label:'汽车站',value:'7'},
          {label:'社区',value:'8'},
          {label:'综合体',value:'9'},
          {label:'其它',value:'0'},
        ],
        dataRule: {
          siteName: [
            { required: true, message: '站点名称不能为空', trigger: 'blur' }
          ],
          // province: [
          //   { required: true, message: '省编号Code 如 3303不是必填不能为空', trigger: 'blur' }
          // ],
          city: [
            { required: true, message: '城市不能为空', trigger: 'change' }
          ],
          town: [
            { required: true, message: '区县不能为空', trigger: 'blur' }
          ],
          stationType: [
            { required: true, message: '请选择站点类型', trigger: 'change' }
          ],
          stationLocation: [
            // { required: true, message: this.dataForm.stationShape == 2? '电子围栏未设置':'站点位置不能为空', trigger: 'blur' }
            {validator: checkStation,trigger: 'blur'}

          ],
          stationShape: [
            { required: true, message: '站点形状不能为空', trigger: 'blur' }
          ],
          stationPoint: [
            { required: true, message: '站点坐标不能为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '站点坐标不能为空', trigger: 'blur' }
          ],
          centerPoint: [
            { required: true, message: '中心点坐标不能为空', trigger: 'blur' }
          ],
          
          createUser: [
            { required: true, message: '创建人不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          updateUser: [
            { required: true, message: '更新人不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '更新时间不能为空', trigger: 'blur' }
          ]
        },
        type:'',
      }
    },
    components: {
      mapDialog
    },
    methods: {
      init (id,stationShape,type) {
        this.type = type
        this.dataForm.id = id || 0;
        this.dataForm.stationShape = stationShape || 0;
        this.visible = true;
        this.canSubmit = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            getObj(this.dataForm.id).then(response => {
                let data = Object.assign({},response.data.data)
                data.centerPoint = JSON.parse(data.centerPoint)
                data.stationPoint = JSON.parse(data.stationPoint)
                data.stationType = data.stationType + ''
                data.stationLocation = JSON.parse(data.stationLocation)
                data.city = data.city + ''
                data.town = data.town ? data.town + '' : ''
                this.dataForm = data
            })
          }
        })
      },
      selectMap(){
        if(!this.dataForm.city){
          return this.$message.error('请先选择城市区域');
        }
        this.mapVisible = true
        this.$nextTick(() => {
          this.$refs.map.init(0,this.dataForm.stationShape,{},this.type)
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.canSubmit = false;
            let data = Object.assign({},this.dataForm)
            data.centerPoint = JSON.stringify(data.centerPoint)
            data.stationPoint = JSON.stringify(data.stationPoint)
            data.stationLocation = JSON.stringify(data.stationLocation)
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

      // 重置
      resetForm() {
        this.$refs['dataForm'].resetFields();
      },
      handleClose() {
        setTimeout(()=>{
          this.$emit('close')
        },300)
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      },
      mapSuccess(data){
        console.log(data,3333)
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key];
            this.dataForm[key] = element
          }
        }
        console.log(this.dataForm,3333)
        // this.dataForm.address = data.address
        // this.dataForm.centerPoint = data.centerPoint
        // this.dataForm.stationPoint = data.stationPoint
      },
      cityChange(){
        this.dataForm.centerPoint = []
        this.dataForm.stationPoint = []
        this.dataForm.address = ''
        this.dataForm.stationLocation = []
        this.dataForm.town = ''
      },
      townChange(){
        this.dataForm.centerPoint = []
        this.dataForm.stationPoint = []
        this.dataForm.address = ''
        this.dataForm.stationLocation = []
      }
    },
    created(){
      
    },
  }
</script>
<style scoped lang="scss">
.dialog-footer{
  display: block;
}
</style>