<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        <el-select
          v-model="searchForm.lineId"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="''" label="全部线路" />
          <el-option :label="item.lineName" :value="item.id" v-for="item in lineList" :key="item.id" />
          <!-- <el-option label="退票时间" :value="4"  /> -->
        </el-select>

        <el-select
          v-model="searchForm.city"
          style="width: 140px"
          class="filter-item"
          placeholder="所属城市"
          filterable clearable
        >
          <el-option :value="''" label="全部城市" />
          <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input
          v-model="searchForm.siteName"
          placeholder="站点名称"
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
          v-if="permissions.busadmin_station_add"
          icon="el-icon-plus"
          class="filter-item"
          type="primary"
          @click="addOrUpdateHandle(0, 1, 'create')"
          >新增站点</el-button
        >
        <el-button
          v-if="permissions.busadmin_station_add"
          icon="el-icon-plus"
          class="filter-item"
          type="primary"
          @click="addOrUpdateHandle(0, 2, 'create')"
          >新增区域</el-button
        >
      </div>

      <div class="avue-crud">
        <el-table :data="dataList" border v-loading="dataListLoading">
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="站点编号"
          >
          </el-table-column>
          <el-table-column
            prop="siteName"
            header-align="center"
            align="center"
            label="站点名称"
          >
            <!-- </el-table-column>
                      <el-table-column
                    prop="province"
                    header-align="center"
                    align="center"
                    label="省编号Code 如 3303不是必填"> -->
          </el-table-column>

          <el-table-column
            prop="stationShape"
            header-align="center"
            align="center"
            label="站点形状"
          >
            <template slot-scope="scope">
              {{ scope.row.stationShape | stationShapeFil }}
            </template>
          </el-table-column>

          <!-- 0 其它  1 火车站 2 景区3 医院 4 机场5 行政区 6 学校 7 汽车站 8 社区9  综合体  -->
          <el-table-column
            prop="stationType"
            header-align="center"
            align="center"
            label="站点类型"
          >
            <template slot-scope="scope">
              {{ scope.row.stationType | stationTypeFil }}
            </template>
          </el-table-column>
          <el-table-column
            prop="city"
            header-align="center"
            align="center"
            label="所属城市"
          >
            <template slot-scope="scope">
              {{ scope.row.city | codeFil }}<template v-if="scope.row.town"> - {{ scope.row.town | codeFil }}</template>
            </template>
          
          </el-table-column>
          <el-table-column
            prop="address"
            header-align="center"
            align="center"
            label="详细地址"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.address || "-" }}
            </template>
          </el-table-column>
          
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
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
              >
              <el-button
                v-if="permissions.busadmin_station_edit"
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="
                  addOrUpdateHandle(
                    scope.row.id,
                    scope.row.stationShape,
                    'edit'
                  )
                "
                >修改</el-button
              >
              <!-- <el-button
                v-if="permissions.busadmin_station_del"
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
        @close="addOrUpdateVisible = false"
      ></table-form>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, delObj } from "@/api/station";
import TableForm from "./station-form";
import { mapGetters } from "vuex";
import { code } from "@/util/adcode";
import { city} from "@/util/city"
import { getLineIdAndName } from "@/api/busadmin/line"

export default {
  data() {
    return {
      dataForm: {
        key: "",
      },
      searchForm: {
        city:'',
        siteName:'',
        lineId:''
      },
      city:city,

      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      lineList:[]
    };
  },
  components: {
    TableForm,
  },
  created() {
    this.getDataList();
    this.getLineIdAndName()
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
    codeFil(val) {
      return code[val];
    },
  },
  methods: {
    getLineIdAndName(){
      getLineIdAndName().then(res=>{
        this.lineList = res.data.data
      })
    },
    resetForm(){
      this.searchForm = {
        city:'',
        siteName:'',
        lineId:''

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
    addOrUpdateHandle(id, stationShape, type) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, stationShape, type);
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
