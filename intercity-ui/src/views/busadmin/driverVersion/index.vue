<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        
        <el-input
          v-model="searchForm.versions"
          placeholder="版本号"
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
        <el-button
          class="filter-item"
          @click="resetForm"
          >重置</el-button
        >
        <el-button
          v-if="permissions.busadmin_driverversion_add"
          icon="el-icon-plus"
          class="filter-item"
          type="primary"
          @click="addOrUpdateHandle({}, 'create')"
          >增加版本</el-button
        >
        
      </div>

      <div class="avue-crud">
        <el-table :data="dataList" border v-loading="dataListLoading">
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            prop="versions"
            header-align="center"
            align="center"
            label="版本号"
          >
            <!-- </el-table-column>
                      <el-table-column
                    prop="province"
                    header-align="center"
                    align="center"
                    label="省编号Code 如 3303不是必填"> -->
          </el-table-column>
        
        <el-table-column
            prop="versionType "
            header-align="center"
            align="center"
            label="手机类型"
          >
            <template slot-scope="scope">
              {{ scope.row.versionType == 'ios' ? 'IOS' : '安卓'  }}
            </template>
          </el-table-column>
          <el-table-column
            prop="startStatus "
            header-align="center"
            align="center"
            label="启停状态"
          >
            <template slot-scope="scope">
              {{ ['-','启用中'][scope.row.startStatus] }}
            </template>
          </el-table-column>

          <!-- 0 其它  1 火车站 2 景区3 医院 4 机场5 行政区 6 学校 7 汽车站 8 社区9  综合体  -->
          <el-table-column
            prop="isForce"
            header-align="center"
            align="center"
            label="是否强制"
          >
            <template slot-scope="scope">
              {{ ['非强制','强制'][scope.row.isForce] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="updateContent"
            header-align="center"
            align="center"
            label="更新内容"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="packageUrl"
            header-align="center"
            align="center"
            label="更新地址"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="updateUser"
            header-align="center"
            align="center"
            label="操作人"
          >
          </el-table-column>
          <el-table-column
            prop="updateTime"
            header-align="center"
            align="center"
            label="操作时间"
          >
          </el-table-column>
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <!-- <el-button
                v-if="permissions.busadmin_station_view"
                type="text"
                size="small"
                icon="el-icon-view"
                @click="
                  addOrUpdateHandle(
                    scope.row.id,
                    scope.row.stationShape,
                    'look'
                  )
                "
                >查看</el-button
              > -->
              <el-button
                v-if="permissions.busadmin_driverversion_edit && scope.row.startStatus === 0"
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="
                  addOrUpdateHandle(
                    scope.row,
                    'edit'
                  )
                "
                >修改</el-button
              >
              <el-button
                v-if="permissions.busadmin_driverversion_edit && scope.row.startStatus === 0"
                type="text"
                size="small"
                @click="
                  changeHandle(
                    scope.row
                  )
                "
                >启用</el-button
              >

              <el-button
                v-if="permissions.busadmin_driverversion_del"
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="deleteHandle(scope.row.id)"
                >删除</el-button
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
import { fetchList, delObj ,updateStartStatusById } from "@/api/busadmin/version";
import TableForm from "./version-form";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dataForm: {
        key: "",
      },
      searchForm: {
        versions:'',
      },

      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dialogData:{},
      dialogType:""
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
  mounted() {
    console.log(this.permissions);
  },
  filters: {
    stationTypeFil(val) {
      let map = {
        0: "其它",
        1: "火车站",
        2: "景区",
        3: "医院",
        4: "机场",
        5: "行政区",
        6: "学校",
        7: "汽车站",
        8: "社区",
        9: "综合体",
      };
      return map[val];
    },
    stationShapeFil(val) {
      let map = {
        1: "站点",
        2: "区域",
      };
      return map[val];
    },
   
  },
  methods: {
    
    resetForm(){
      this.searchForm = {
        versions:'',
      }
    },
    // 获取数据列表
    getDataList() {
      this.addOrUpdateVisible = false;
      this.dataListLoading = true;
      fetchList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          ...this.searchForm,
        })
      ).then((response) => {
        console.log(response)
        this.dataList = response.data.data.records;
        console.log(this.dataList,33333)
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
    addOrUpdateHandle(data, type) {
      this.dialogData = data
        console.log(data,3333)
        this.dialogType = type
      this.$nextTick(() => {
        
        this.addOrUpdateVisible = true;
        
      });
    },
    changeHandle(data) {
      this.$confirm("是否确认启用ID为" + data.id, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateStartStatusById({id:data.id,startStatus:1,versionType:data.versionType});
        })
        .then((data) => {
          this.$message.success("启用成功");
          this.getDataList();
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
        "/lines/station/export",
        this.searchForm,
        "station.xlsx"
      );
    },
  },
};
</script>
