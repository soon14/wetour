<template>
  <el-dialog
    title="车辆选择"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible">
    <div class="filter-container" style="display: flex;justify-content: end;">
      <el-input
        v-model="searchForm.number"
        placeholder="车辆牌号"
        style="width: 140px"
        class="filter-item"
      />
      <el-button
        type="primary"
        class="filter-item"
        icon="el-icon-search"
        @click="currentChangeHandle(1)"
        >搜索</el-button
      >
    </div>
    <div class="avue-crud">
      <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="handleSelectionChange" height="500px">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="number"
          header-align="center"
          align="center"
          label="车牌号码"
        >
        </el-table-column>
        <el-table-column
          prop="busType"
          header-align="center"
          align="center"
          label="车辆类型"
        >
          <template slot-scope="scope">
              {{scope.row.busType | busTypeFil}}
          </template>
        </el-table-column>
          
        <el-table-column
          prop="approvedSeat"
          header-align="center"
          align="center"
          label="核定座位数"
        >
          <template slot-scope="scope">
            <!-- {{scope.row.certNo || '-'}} -->
            {{scope.row.approvedSeat}}位
          </template>
        </el-table-column>
        <el-table-column
          prop="allowSeat"
          header-align="center"
          align="center"
          label="可载乘客数"
        >
          <template slot-scope="scope">
            {{scope.row.allowSeat}}人
          </template>
        </el-table-column>
        <el-table-column
          prop="driverId"
          header-align="center"
          align="center"
          label="司机信息"
        >
          <template slot-scope="scope">
            {{scope.row.driverName}} {{scope.row.mobile}}
          </template>
        </el-table-column>
        
      </el-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="canSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {getObj, addObj, putObj} from '@/api/busadmin/driver'
    import { fetchList as fetchListBus } from "@/api/busadmin/bus";
    import { fetchList as fetchListDriver } from "@/api/busadmin/driver";

    export default {
    data () {
      return {
        visible: false,
        canSubmit: false,
        dataList: [],
        driverList:[],
        pageIndex: 1,
        pageSize: 999999,
        totalPage: 0,
        searchForm:{
          number:'',
        },
        dataListLoading:false,
        multipleSelection:[],
        busList:[]
      }
    },
    filters:{
      busTypeFil(val){
        const map = {
          1:'5座普通轿车',
          2:'7座商务车',
          3:'12座中巴车',
          4:'17座考斯特',
          5:'37座大客车',
        }
        return map[val]
      },
    },
    methods: {
      init (busList) {
        this.visible = true;
        this.canSubmit = true;
        this.busList = busList
        this.$nextTick(() => {
          this.getDataList()
          // this.getList()
        })
      },
      // 表单提交
      dataFormSubmit () {
        // console.log(this.dataList,3333)
        if(!this.multipleSelection.length){
          return this.$message.error('至少选择一个车辆');
        }
        let arr = []
        this.multipleSelection.forEach(element => {
          arr.push({
            ...element,
            status:'create',
            busId:element.id,
            id:0,
          })
        });
       
        this.$emit('selectBus',arr)
        this.visible = false
        // 请选择司机信息


        // this.$refs['dataForm'].validate((valid) => {
        //   console.log(333333)
        //   if (valid) {
        //     console.log(2222)
        //     this.canSubmit = false;
        //     let data = Object.assign({},this.dataForm)
        //     data.driverLicenseStart = data.value1[0]
        //     data.driverLicenseEnd = data.value1[1]
        //     data.driverLicenseType  = data.driverLicenseType.toUpperCase()
        //     if (this.dataForm.id) {
        //         putObj(data).then(data => {
        //             this.$notify.success('修改成功')
        //             this.visible = false
        //             this.$emit('refreshDataList')
        //         }).catch(() => {
        //             this.canSubmit = true;
        //         });
        //     } else {
        //         addObj(data).then(data => {
        //             this.$notify.success('添加成功')
        //             this.visible = false
        //             this.$emit('refreshDataList')
        //         }).catch(() => {
        //             this.canSubmit = true;
        //         });
        //     }
        //   }
        // })
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val;
        this.getDataList();
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        fetchListBus(
          Object.assign({
            current: this.pageIndex,
            size: this.pageSize,
            ...this.searchForm,
          })
        ).then((response) => {
          console.dir(response.data.data.records)
          let arr = []
          let busList = Object.assign([],this.busList)
          console.log(this.busList,3333333333333333333,response.data.data.records)
          response.data.data.records.forEach(element => {
            // this.busList
            var flag = busList.some(item=>item.busId === element.id)
            console.log(flag,element)
            if(!flag){
              arr.push({
                ...element,
                driverId:'',
                driverNmae:'',
              })
            }
          });
          this.dataList = arr
          this.totalPage = response.data.data.total;
        });
        this.dataListLoading = false;
      },
      getList(){
        // 
        fetchListDriver(
          Object.assign({
            current: this.pageIndex,
            size: this.pageSize,
          })
        ).then((response) => {
          this.driverList = response.data.data.records
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val,33333)
      }
    }
  }
</script>
