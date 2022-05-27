<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
       
        <el-input
          v-model="searchForm.partnerName"
          placeholder="请输入提交人"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @blur="searchForm.partnerName.trim()"
           @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-select
          v-model="searchForm.country"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="''" label="全部国家" />
          <el-option v-for="item in country" :key="item.country" :value="item.country" :label="item.country" />
        </el-select>
        <el-input
          v-model="searchForm.partnerAccountName"
          placeholder="请输入登录账号"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @blur="searchForm.partnerAccountName.trim()"
           @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-date-picker
          v-model="createTimes"
          value-format="yyyy-MM-dd"
          type="daterange"
          style="margin-bottom: 10px;vertical-align: middle;margin-left: 10px;"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          :editable="false"
          :picker-options="pickerOptions"
          
        />
        <el-select
          v-model="searchForm.applyStatus"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="''" label="全部状态" />
          <el-option value="0" label="待审核" />
          <el-option value="1" label="审核通过" />
          <el-option value="2" label="审核驳回" />
        </el-select>
        <el-button
          type="primary"
          class="filter-item"
          icon="el-icon-search"
          @click="currentChangeHandle(1)"
          >搜索</el-button
        >
        <el-button
          class="filter-item"
          @click="resetForm"
          >重置</el-button
        >
        <el-button v-if="permissions.wetour_settlerecord_export" icon="el-icon-download" class="filter-item" type="primary" plain @click="exportExcel()">导出</el-button>
        <!-- <el-button
            v-if="permissions.busadmin_driver_export"
            icon="el-icon-download"
            type="primary"
            plain
            class="filter-item"
            @click="exportExcel()"
            >导出</el-button
          > -->
      </div>

      <div class="avue-crud">
        <el-table :data="dataList" border v-loading="dataListLoading">
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="记录ID"
          >
          </el-table-column>
          <el-table-column
            prop="partnerName"
            header-align="center"
            align="center"
            label="提交人"
          >
          </el-table-column>
          <el-table-column
            prop="partnerAccountName"
            header-align="center"
            align="center"
            label="登录账号"
          >
          </el-table-column>
          <el-table-column
            prop="country"
            header-align="center"
            align="center"
            label="服务国家"
          >
          </el-table-column>
          <el-table-column
            prop="totalSettleRealAmount"
            header-align="center"
            align="center"
            label="总金额"
          >
          </el-table-column>
         <el-table-column
            prop="totalOrderNumber"
            header-align="center"
            align="center"
            label="订单数"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="申请时间"
          >
          </el-table-column>
          <el-table-column
            prop="remitStateShow"
            header-align="center"
            align="center"
            label="是否打款"
          >
          </el-table-column>

          
           <el-table-column
            prop="applyStatus"
            header-align="center"
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
               {{scope.row.applyStatus | applyStatusFil}}
            </template>
          </el-table-column>
           
         
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
              
                v-if="permissions.wetour_settlerecord_view"
                type="text"
                size="small"
                @click="
                  addOrUpdateHandle(
                    scope.row.id,
                    'edit',
                    scope.row
                  )
                "
                >{{scope.row.applyStatus===0?'审核':'详情'}}</el-button
              >
              <el-button
              
                v-if="permissions.wetour_settlerecord_remit && scope.row.applyStatus!= 0"
                type="text"
                size="small"
                :disabled="scope.row.remitState == 1"
                @click="
                  paymentHandle(
                    scope.row
                  )
                "
                >打款</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="avue-crud__pagination">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          background
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <!-- <table-form
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></table-form> -->
      <table-form
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></table-form>
    </basic-container>
  </div>
</template>

<script>
import { accountList,confirmRemit  } from "@/api/wetour/financial";
import { countryList } from '@/api/wetour/cityCn'
import TableForm from "./table-form";
import { mapGetters } from "vuex";
import moment from "moment"
import { parseTime } from '@/util/common.js'
export default {
  data() {
    return {
      dataForm: {
        key: "",
        
      },
      searchForm: {
        applyStatus:"", //0待审核 1审核通过 2审核驳回
        country:'',
        partnerAccountName:'',
        partnerName:'',
      },
       createTimes:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date('2019-01-01').getTime()
        }
      },
      dataList: [],
      country:[],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
    };
  },
  filters:{
    genderFil(val){
      const map = {
        1:'男',
        2:'女',
      }
      return map[val]
    },
    applyStatusFil(val){
      const map = {
        0:'待审核',
        1:'审核通过',
        2:'审核驳回'
      }
      return map[val]
    },
  },
  components: {
    TableForm,

  },
  created() {
    let time = moment(moment().format('YYYY/MM/DD'),'YYYY/MM/DD').valueOf() 
    let end = parseTime(time,'{y}-{m}-{d}')
    let start = parseTime(time - 30 *24 *3600 * 1000,'{y}-{m}-{d}')
    this.createTimes = [start,end]
    this.getDataList();
    this.countryList()
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    resetForm(){
      this.searchForm = {
        applyStatus:"", //0待审核 1审核通过 2审核驳回
        country:'',
        partnerAccountName:'',
        partnerName:'',
      }
      let time = moment(moment().format('YYYY/MM/DD'),'YYYY/MM/DD').valueOf() 
      let end = parseTime(time,'{y}-{m}-{d}')
      let start = parseTime(time - 30 *24 *3600 * 1000,'{y}-{m}-{d}')
      this.createTimes = [start,end]

    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      accountList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          ...this.searchForm,
          startTime:this.createTimes&&this.createTimes.length?this.createTimes[0] + ' 00:00:00':'',
          endTime:this.createTimes&&this.createTimes.length?this.createTimes[1] + ' 23:59:59':''
        })
      ).then((response) => {
        if(response.data.data){
          response.data.data.records.forEach(res=>{
            res.totalSettleRealAmount = res.currency+res.totalSettleRealAmount
          })
          this.dataList = response.data.data.records;
        this.totalPage = response.data.data.total;
        }
        
      });
      this.dataListLoading = false;
    },
    countryList(){
      countryList().then(res=>{
        this.country = res.data.data
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 新增 / 修改
    addOrUpdateHandle(id,type) {
      // this.dialogType = type
      
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id,type);
      });
      

      
    },

    paymentHandle(row) {
      let id = row.id;
      this.$confirm(
        `是否确定打款？`,
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return confirmRemit(id);
        })
        .then((data) => {
          this.$message.success("打款成功");
          // this.$emit("refreshDataList");
          // this.visible = false;
          this.getDataList();
        });
    },
        //  导出excel
    exportExcel() {
      this.downBlobFile(
        "/wetour/admin/orderinquirysettlerecord/export",
        {
          ...this.searchForm,
        startTime:this.createTimes&&this.createTimes.length?this.createTimes[0] + ' 00:00:00':'',
          endTime:this.createTimes&&this.createTimes.length?this.createTimes[1] + ' 23:59:59':''
          },
        "orderinquirysettlerecord_export"
      );
    },
   
  },
};
</script>

<style lang="scss" scoped>
  .imgs{
    max-width: 200px;
  }
  .imgBox{
    text-align: center;
    margin-right: 10px;
  }
  .wrap{
    flex-wrap: wrap;
  }
</style>