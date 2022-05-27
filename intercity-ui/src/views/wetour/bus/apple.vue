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
          v-model="searchForm.id"
          placeholder="请输入记录Id"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model="searchForm.number"
          placeholder="请输入车牌号"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        
        <el-input
          v-model="searchForm.countryCn"
          placeholder="请输入国家"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
         <el-select
          v-model="searchForm.insuranceExpiredStatus"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="undefined" label="全部保险状态" />
          <el-option value="1" label="已过期" />
          <el-option value="0" label="未过期" />
          
        </el-select>

        <el-input
          v-model="searchForm.partnerName"
          placeholder="请输入申请人"
          style="width: 140px"
          class="filter-item"
          @keyup.native.enter="currentChangeHandle(1)"
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
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="记录ID"
          >
          </el-table-column>
          <el-table-column
            prop="number"
            header-align="center"
            align="center"
            label="车牌号"
          >
          </el-table-column>

          <el-table-column
            prop="countryCn"
            header-align="center"
            align="center"
            label="国家"
          >
          </el-table-column>

          <el-table-column
            prop="brand"
            header-align="center"
            align="center"
            label="品牌"
          >
          </el-table-column>

          
            
          
          <el-table-column
            prop="insuranceExpired"
            header-align="center"
            align="center"
            label="保险过期日期"
          >
          </el-table-column>

          <el-table-column
            prop="insuranceExpiredStatus"
            header-align="center"
            align="center"
            label="保险状态"
          >
            <template slot-scope="scope">
               {{scope.row.insuranceExpiredStatus | insuranceExpiredStatusFil}}
            </template>
          </el-table-column>
           <el-table-column
            prop="applyTime"
            header-align="center"
            align="center"
            label="申请时间"
          >
          </el-table-column>

          <el-table-column
            prop="partnerName"
            header-align="center"
            align="center"
            label="申请人"
          >
          </el-table-column>
          <el-table-column
            prop="applyStatus"
            header-align="center"
            align="center"
            label="状态"
          >
            <!-- licenseExpiredStatusFil -->
             <template slot-scope="scope">
               {{scope.row.applyStatus | applyStatusFil}}
            </template>
          </el-table-column>
         
         
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
              
                v-if="permissions.wetour_busapply_edit && scope.row.applyStatus == 0"
                type="text"
                size="small"
                @click="
                  addOrUpdateHandle(
                    scope.row.id,
                    'look'
                  )
                "
                >审核</el-button
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
import { fetchAppleList, delObj, getAppleObj } from "@/api/wetour/bus";
import TableForm from "./bus-apple-form";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        
      },
      searchForm: {
        id:"",
        number:'',
        partnerName:'',
        applyStatus:'',
        countryCn:'',
        endTime:'',
        gender:'',
        insuranceExpiredStatus:undefined,
      },
      createTimes:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date('2019-01-01').getTime()
        }
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      busTypeList:[
        {label:'5座普通轿车',value:1},
        {label:'7座商务车',value:2},
        {label:'12座中巴车',value:3},
        {label:'17座考斯特',value:4},
        {label:'37座大客车',value:5},
      ],
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
    applyStatusFil(val){
      const map = {
        1:'审核通过',
        2:'审核驳回',
        0:'待审核',
      }
      return map[val]
    },
  },
  components: {
    TableForm,
  },
  created() {
    this.getDataList();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    resetForm(){
      this.searchForm = {
        id:"",
        number:'',
        partnerName:'',
        applyStatus:'',
        countryCn:'',
        endTime:'',
        gender:'',
        insuranceExpiredStatus:'',
      }
      this.createTimes = []

    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      if (this.createTimes && this.createTimes.length) {
        this.searchForm.startTime = this.createTimes[0] + ' 00:00:00';
        this.searchForm.endTime = this.createTimes[1] + ' 23:59:59';
      } else {
        this.searchForm.startTime = "";
        this.searchForm.endTime = "";
      }
      fetchAppleList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          ...this.searchForm,
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
      getAppleObj(id).then(response=>{
        let data = Object.assign({},response.data.data)
        this.dialogData = data
        this.$nextTick(() => {
          this.addOrUpdateVisible = true;
        });
      })
      // this.dialogData = data

      
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
      this.downBlobFile("/busadmin/bus/export", this.searchForm, "bus.xlsx");
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