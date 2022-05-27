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
          v-model="searchForm.number"
          placeholder="请输入车牌号"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model="searchForm.partnerName"
          placeholder="请输入微途伙伴"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model="searchForm.partnerAccountName"
          placeholder="请输入伙伴账号"
          style="width: 140px"
          class="filter-item"
          maxlength="20"
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
          v-model="searchForm.busType"
          style="width: 140px"
          class="filter-item"
          filterable clearable
          multiple
          collapse-tags
          placeholder="全部"
          :multiple-limit="10"
        >
          <!-- <el-option :value="''" label="全部车辆类型" /> -->
          <el-option
            v-for="item in busTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="searchForm.insuranceExpiredStatus"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="''" label="全部保险状态" />
          <el-option value="0" label="已过期" />
          <el-option value="1" label="未过期" />
          
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
            prop="number"
            header-align="center"
            align="center"
            label="车牌号"
          >
          </el-table-column>
          <el-table-column
            prop="partnerName"
            header-align="center"
            align="center"
            label="归属伙伴"
          >
          </el-table-column>
          <el-table-column
            prop="partnerAccountName"
            header-align="center"
            align="center"
            label="伙伴账号"
          >
          </el-table-column>
          <el-table-column
            prop="countryCn"
            header-align="center"
            align="center"
            label="服务国家"
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
            prop="busTypeTitle"
            header-align="center"
            align="center"
            label="车型"
          >
          </el-table-column>

            
          <el-table-column
            prop="brand"
            header-align="center"
            align="center"
            label="车辆品牌"
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
            prop="checkTime"
            header-align="center"
            align="center"
            label="审核时间"
          >
          </el-table-column>
         
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
              
                v-if="permissions.wetour_bus_view"
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
import { fetchList, delObj, getObj } from "@/api/wetour/bus";
import TableForm from "./bus-form";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        
      },
      searchForm: {
        busType:[],
        number:'',
        partnerName:'',
        partnerAccountName:'',
        countryCn:'',
        insuranceExpiredStatus:'',
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      busTypeList:[
        {label:'5座普通轿车',value:5},
        {label:'7座商务车',value:7},
        {label:'12座中巴车',value:12},
        {label:'19座考斯特',value:19},
        {label:'37座大客车',value:37},
        {label:'49座大客车',value:49},
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
        busType:[],
        number:'',
        partnerName:'',
        partnerAccountName:'',
        countryCn:'',
        insuranceExpiredStatus:'',
      }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      let searchForm  = Object.assign({},this.searchForm)
      searchForm.busType = searchForm.busType.join(',')
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