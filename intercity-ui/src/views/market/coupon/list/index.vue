<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        <!-- 车辆类型 -->
        <!-- <el-select
          v-model="searchForm.busType"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="''" label="全部类型" />
          <el-option
            v-for="item in busTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
        <el-input
          v-model.trim="searchForm.id"
          placeholder="请输入优惠卷ID"
          style="width: 140px"
          class="filter-item"
          maxlength="30"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model.trim="searchForm.templateTitle"
          placeholder="请输入优惠卷名称"
          style="width: 140px"
          class="filter-item"
          maxlength="30"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model.trim="searchForm.userId"
          placeholder="请输入用户ID"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model.trim="searchForm.mobile"
          placeholder="请输入领取手机"
          style="width: 140px"
          class="filter-item"
          maxlength="20"
          @keyup.native.enter="currentChangeHandle(1)"
        />
       <el-input
          v-model.trim="searchForm.exchangeKey"
          placeholder="请输入兑换码"
          style="width: 140px"
          class="filter-item"
          maxlength="20"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-select
          v-model="searchForm.couponStatus"
          style="width: 160px"
          class="filter-item"
          filterable
          multiple
          collapse-tags
          placeholder="全部"
          clearable
        >
          <!-- <el-option value="0" label="待使用" />
          <el-option value="1" label="已使用" />
          <el-option value="2" label="已过期" />
          <el-option value="3" label="已撤回" /> -->
          <el-option value="1" label="待使用" />
          <el-option value="2" label="已使用" />
          <el-option value="3" label="已过期" />
        </el-select>

        

        <el-date-picker
          size="small"
          type="daterange"
          v-model="cartTime"
          range-separator="至"
          value-format="yyyy-MM-dd"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          style="margin-bottom: 10px; vertical-align: middle; margin-left: 10px"
        />
        
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
        <el-button
            v-if="permissions.webus_market_usercoupon_export"
            icon="el-icon-download"
            type="primary"
            plain
            class="filter-item"
            @click="exportExcel()"
            >下载</el-button
          > 
        <!-- <el-button
          v-if="permissions.busadmin_driver_add"
          icon="el-icon-plus"
          type="primary"
          class="filter-item"
          @click="addOrUpdateHandle()"
          >增加车辆</el-button
        > -->
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
          <!-- <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="车辆编号"
          >
          </el-table-column> -->
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="优惠卷ID"
          >
          </el-table-column>
          <el-table-column
            prop="templateTitle"
            header-align="center"
            align="center"
            label="优惠卷名称"
          >
          </el-table-column>
          <el-table-column
            prop="couponTypeShow"
            header-align="center"
            align="center"
            label="类型"
          >
          </el-table-column>
          <el-table-column
            prop="userId"
            header-align="center"
            align="center"
            label="用户ID"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="busType"
            header-align="center"
            align="center"
            label="车型"
          >
            <template slot-scope="scope">
               {{scope.row.busType | busTypeFil}}
            </template>
          </el-table-column> -->
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="手机号"
          >
          </el-table-column>

            
          <el-table-column
            prop="discountRealAmount"
            header-align="center"
            align="center"
            label="优惠金额"
          >
          </el-table-column>
          

          <el-table-column
            prop="useTypeShow"
            header-align="center"
            align="center"
            label="领取方式"
          >
            <!-- <template slot-scope="scope">
               {{scope.row.insuranceExpiredStatus | insuranceExpiredStatusFil}}
            </template> -->
          </el-table-column>
          <el-table-column
            prop="exchangeKey"
            header-align="center"
            align="center"
            label="兑换码"
          >
          </el-table-column>
           <el-table-column
            prop="couponStatusShow"
            header-align="center"
            align="center"
            label="状态"
          >

          
            <!-- <template slot-scope="scope">
               {{scope.row.insuranceExpiredStatus | insuranceExpiredStatusFil}}
            </template> -->
          </el-table-column>
          <el-table-column
            prop="businessTypeShow"
            header-align="center"
            align="center"
            label="使用端口"
          >
          </el-table-column>
          <el-table-column
            prop="couponEndTime"
            header-align="center"
            align="center"
            label="有效截止日期"
            width="260"
          >
            <template slot-scope="scope">
               {{scope.row.couponStartTime}} ~ {{scope.row.couponEndTime}}
            </template>
          </el-table-column>
         <el-table-column
            prop="receiveTime"
            header-align="center"
            align="center"
            label="领取时间"
            width="150"
          >
          </el-table-column>
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
              
                v-if="permissions.webus_market_usercoupon_view"
                type="text"
                size="small"
                icon="el-icon-view"
                @click="
                  addOrUpdateHandle(
                    scope.row.id,
                    'look'
                  )
                "
                >查看</el-button
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
        :dialogVisible.sync="addOrUpdateVisible"
        :dialogData="dialogData"
        :dialogType="dialogType"
        @refreshDataList="getDataList"
        @close="addOrUpdateVisible = false"
      ></table-form>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, getObj } from "@/api/market/list";

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
      cartTime: [],
      searchForm: {
        id:'',
        templateTitle:'',
        userId:'',
        mobile:'',
        exchangeKey:'',
        couponStatus:[],
        receivereceiveStartTime:'',
        receiveEndTime:'',

      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
     
      dialogType:'',
      dialogData:{},
    };
  },
  filters:{
    busTypeFil(val){
      const map = {
        1:'5座',
        2:'7座',
        3:'12座',
        4:'17座',
        5:'37座',
      }
      return map[val]
    },
    insuranceExpiredStatusFil(val){
      const map = {
        1:'已过期',
        0:'未过期',
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
    let start = parseTime(time - 90 *24 *3600 * 1000,'{y}-{m}-{d}')
    this.cartTime = [start,end]
    

    this.getDataList();

    // '2022-05-09', '2022-05-21'
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    resetForm(){
      this.searchForm = {
        id:'',
        templateTitle:'',
        userId:'',
        mobile:'',
        exchangeKey:'',
        couponStatus:[],
        receiveStartTime:'',
        receiveEndTime:'',
      }

      let time = moment(moment().format('YYYY/MM/DD'),'YYYY/MM/DD').valueOf() 
      let end = parseTime(time,'{y}-{m}-{d}')
      let start = parseTime(time - 90 *24 *3600 * 1000,'{y}-{m}-{d}')
      this.cartTime = [start,end]


      // this.cartTime = []
    },
    // 获取数据列表
    getDataList() {
      // console.log(this.cartTime)
      this.dataListLoading = true;
      if (this.cartTime && this.cartTime.length) {
        this.searchForm.receiveStartTime = this.cartTime[0] + " 00:00:00";
        this.searchForm.receiveEndTime = this.cartTime[1] + " 23:59:59";
      } else {
        this.searchForm.receiveStartTime = undefined;
        this.searchForm.receiveEndTime = undefined;
      }
      let searchForm  = Object.assign({},this.searchForm)
      searchForm.couponStatus = searchForm.couponStatus.join(',')
      
      fetchList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          ...searchForm,
        })
      ).then((response) => {
        this.dataList = response.data.data.records;
        this.totalPage = response.data.data.total;
      });
      this.dataListLoading = false;
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
      // this.addOrUpdateVisible = true;
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id,type);
      // });

      // this.dialogType = 'create'
      this.dialogType = type

      // this.addOrUpdateVisible = true;
      console.log(5555555)
      getObj(id).then(response=>{
        let data = Object.assign({},response.data.data)
        console.log(data)

        this.dialogData = data
        this.$nextTick(() => {
          this.addOrUpdateVisible = true;
        });
      })

      
    },
    // 删除
    deleteHandle(id) {
      this.$confirm("是否确认删除ID为" + id, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delObj(id);
        })
        .then((data) => {
          this.$message.success("删除成功");
          this.getDataList();
        });
    },
    //  导出excel
    exportExcel() {
      this.downBlobFile("/webusmarket/admin/usercoupon/export", this.searchForm, "用户优惠券使用列表"+parseTime(new Date(),'{y}{m}{d}{h}{i}{s}')+".xlsx");
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