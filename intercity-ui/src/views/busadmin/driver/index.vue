<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        <el-input v-model="searchForm.mobile" placeholder="手机号" max="11" style="width: 140px" class="filter-item"/>
        <el-input v-model="searchForm.driverName" placeholder="驾驶员姓名" max="10" style="width: 140px" class="filter-item"/>
        
        <el-button type="primary" class="filter-item" icon="el-icon-search" @click="currentChangeHandle(1)">搜索</el-button>
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
          >添加驾驶员</el-button
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
            label="id"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="司机手机号"
          >
          </el-table-column>
          <el-table-column
            prop="driverName"
            header-align="center"
            align="center"
            label="司机姓名"
          >
          </el-table-column>
          
          <el-table-column
            prop="certNo"
            header-align="center"
            align="center"
            label="证件号码"
          >
            <template slot-scope="scope">
              {{scope.row.certNo || '-'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="birthday"
            header-align="center"
            align="center"
            label="出生日期"
          >
            <template slot-scope="scope">
              {{(scope.row.birthday && scope.row.birthday!=="0001-01-01 00:00:00") ? scope.row.birthday : '-'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="driverLicenseType"
            header-align="center"
            align="center"
            label="驾照类型"
          >
            <template slot-scope="scope">
              {{scope.row.driverLicenseType ? scope.row.driverLicenseType.toUpperCase() : '-' }}

            </template>
          </el-table-column>
          <el-table-column
            prop="driverLicenseStart"
            header-align="center"
            align="center"
            label="有效日期起"
          >
            <template slot-scope="scope">
              {{(scope.row.driverLicenseStart && scope.row.driverLicenseStart!=="0001-01-01 00:00:00") ? parseTime(scope.row.driverLicenseStart,'{y}-{m}-{d}') : '-'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="driverLicenseEnd"
            header-align="center"
            align="center"
            label="有效日期止"
          >
            <template slot-scope="scope">
              {{(scope.row.driverLicenseEnd && scope.row.driverLicenseEnd!=="0001-01-01 00:00:00") ? parseTime(scope.row.driverLicenseEnd,'{y}-{m}-{d}') : '-'}}

            </template>
          </el-table-column>
          <el-table-column
            prop="verifyCode"
            header-align="center"
            align="center"
            label="验证码"
          >
            <template slot-scope="scope">
              {{scope.row.verifyCode || '-'}}
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="permissions.busadmin_driver_view"
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
                v-if="permissions.busadmin_driver_edit"
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="addOrUpdateHandle(scope.row.id)"
                >修改</el-button
              >
              <!-- <el-button
                v-if="permissions.busadmin_driver_del"
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
import { fetchList, delObj } from "@/api/busadmin/driver";
import TableForm from "./driver-form";
import { mapGetters } from "vuex";
import { parseTime } from '@/util/common.js'

export default {
  data() {
    return {
      dataForm: {
        key: "",
      },
      searchForm: {
        mobile:"",
        driverName:"",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
    };
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
    parseTime(time, cFormat){
      return parseTime(time, cFormat)
    },
    resetForm(){
      this.searchForm = {
        mobile:"",
        driverName:"",
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
      this.downBlobFile(
        "/busadmin/driver/export",
        this.searchForm,
        "driver.xlsx"
      );
    },
  },
};
</script>
