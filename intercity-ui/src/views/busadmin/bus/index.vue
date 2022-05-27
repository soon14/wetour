<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        <!-- 车辆类型 -->
        <el-select
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
        </el-select>
        <el-input
          v-model="searchForm.number"
          placeholder="车辆牌号"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
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
          v-if="permissions.busadmin_driver_add"
          icon="el-icon-plus"
          type="primary"
          class="filter-item"
          @click="addOrUpdateHandle()"
          >增加车辆</el-button
        >
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
            label="车辆编号"
          >
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
            prop="driverName"
            header-align="center"
            align="center"
            label="司机信息"
          >
            <template slot-scope="scope">
              {{scope.row.driverName}} {{scope.row.mobile}}
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
              
                v-if="permissions.busadmin_bus_view"
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
              <el-button
                v-if="permissions.busadmin_bus_edit"
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="addOrUpdateHandle(scope.row.id)"
                >修改</el-button
              >
              <!-- <el-button
                v-if="permissions.busadmin_bus_del"
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="deleteHandle(scope.row.id)"
                >删除</el-button
              > -->
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
      <table-form
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></table-form>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, delObj } from "@/api/busadmin/bus";
import TableForm from "./bus-form";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        
      },
      searchForm: {
        busType:"",
        number:'',
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
      ]
    };
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
        busType:"",
        number:'',
      }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      fetchList(
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
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id,type);
      });
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
