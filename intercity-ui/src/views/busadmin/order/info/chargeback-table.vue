<template>
  <el-dialog
    title="退款记录"
    :close-on-click-modal="false"
    @close="close"
    width="800px"
    :visible.sync="visible">
    <div class="avue-crud">
      <el-table :data="dataList" border v-loading="dataListLoading" height="500px">
        <el-table-column
          prop="orderNo"
          header-align="center"
          align="center"
          label="订单编号"
        >
        </el-table-column>
        <el-table-column
          prop="ticketNumber"
          header-align="center"
          align="center"
          label="退票数"
        >
        </el-table-column>
          
        <el-table-column
          prop="ticketAmount"
          header-align="center"
          align="center"
          label="退款金额"
        >
        </el-table-column>
        <el-table-column
          prop="handlingFee"
          header-align="center"
          align="center"
          label="退款手续费"
        >
        </el-table-column>
        <el-table-column
          prop="refundTime"
          header-align="center"
          align="center"
          label="退款时间"
        >
        </el-table-column>


        <el-table-column
          prop="refundReason"
          header-align="center"
          align="center"
          label="退款原因"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="arrivalTime"
          header-align="center"
          align="center"
          label="到账时间"
        >
        </el-table-column>
        <el-table-column
          prop="refundStatusShow"
          header-align="center"
          align="center"
          label="退款状态"
        >
        </el-table-column>
        
        <el-table-column
          prop="createUser"
          header-align="center"
          align="center"
          label="操作人"
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
  import {getOrderRefund} from '@/api/orderinfo'

  export default {
    data () {
      
      return {
        canSubmit: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 20,
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
        console.log(555555)
        this.$emit('update:dialogVisible',false)
        
      },
      Cancel() {
        this.close()
        // this.$emit("Cancel");
      },
      getDataList() {
        this.dataListLoading = true;
        getOrderRefund(
          Object.assign({
            current: this.pageIndex,
            size: this.pageSize,
            orderId:this.dialogData.id
          })
        ).then((response) => {
          this.dataList = response.data.data.records
          this.totalPage = response.data.data.total;
        });
        this.dataListLoading = false;
      },
     
    }
  }
</script>
