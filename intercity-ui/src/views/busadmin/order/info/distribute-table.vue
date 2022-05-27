<template>
  <el-dialog
    title="派单记录"
    :close-on-click-modal="false"
    @close="close"
    width="800px"
    :visible.sync="visible">
    <div class="avue-crud">
      <el-table :data="dataList" border v-loading="dataListLoading" height="500px">
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          label="派单编号"
        >
        </el-table-column>
        <el-table-column
          prop="dispatchTypeShow"
          header-align="center"
          align="center"
          label="派单类型"
        >
          <!-- <template slot-scope="scope">
            {{['人工正常派单','人工改派 ','自动正常派单','自动改派'][scope.row.dispatchType - 1]}}
          </template> -->
        </el-table-column>
          
        <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          label="派单时间"
        >
        </el-table-column>
        <el-table-column
          prop="busNumber"
          header-align="center"
          align="center"
          label="执行车辆"
        >
        </el-table-column>
        <el-table-column
          prop="driverInfo"
          header-align="center"
          align="center"
          label="执行司机"
        >
        </el-table-column>


        <el-table-column
          prop="remarks"
          header-align="center"
          align="center"
          label="备注"
          show-overflow-tooltip
        >
        </el-table-column>


        <el-table-column
          prop="createUser"
          header-align="center"
          align="center"
          label="派单人"
        >
        </el-table-column>
       
        
        
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Cancel">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {getOrderDispatch} from '@/api/orderinfo'

  export default {
    data () {
      
      return {
        canSubmit: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 999999,
        totalPage: 0,
        dataListLoading:false,
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
          console.log(111111)
          this.$emit("update:dialogVisible", val); 
        }
      }
    },
    created(){
      // this.dataForm = Object.assign({},this.dialogData)
      // this.dataListLoading = true
      this.getDataList()
    },
    methods: {
      close() {
        this.$emit('update:dialogVisible',false)
        
      },
      Cancel() {
        this.close()
        // this.$emit("Cancel");
      },
      getDataList() {
        this.dataListLoading = true;
        let data = {
          current: this.pageIndex,
          size: this.pageSize,
          orderId:this.dialogData.id,
        }
        console.log(data,333333)
        getOrderDispatch(data).then((response) => {
          this.dataList = response.data.data
          // this.totalPage = response.data.data.total;
        });
        this.dataListLoading = false;
      },
     
    }
  }
</script>
