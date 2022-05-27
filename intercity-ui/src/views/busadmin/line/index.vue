<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        <el-select
          v-model="searchForm.fromCity"
          style="width: 140px"
          class="filter-item"
          placeholder="所属城市"
          filterable clearable
        >
          <el-option :value="''" label="全部出发城市" />
          <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select
          v-model="searchForm.toCity"
          style="width: 140px"
          class="filter-item"
          placeholder="所属城市"
          filterable clearable
        >
          <el-option :value="''" label="全部到达城市" />
          <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <el-select
          v-model="searchForm.operationsMode"
          style="width: 140px"
          class="filter-item"
          placeholder="运营模式"
          filterable clearable
        >
          <el-option :value="''" label="全部模式" />
          <el-option
            v-for="item in operationsModeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          v-model="searchForm.lineName"
          placeholder="线路名称"
          style="width: 140px"
          class="filter-item"
          maxlength="30"
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
          v-if="permissions.busadmin_line_add"
          icon="el-icon-plus"
          type="primary"
          class="filter-item"
          @click="addOrUpdateHandle(0,'create')"
          >添加线路</el-button
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
            label="线路ID"
          >
          </el-table-column>
          <el-table-column
            prop="lineName"
            header-align="center"
            align="center"
            label="线路名称"
          >
          </el-table-column>
          
          <el-table-column
            prop="fromCity"
            header-align="center"
            align="center"
            label="出发城市-到达城市"
          >
            <template slot-scope="scope">
              {{scope.row.fromCity | codeFil }} - {{scope.row.toCity | codeFil }}
            </template>
          </el-table-column>
          
          <!-- <el-table-column
            prop="fromCity"
            header-align="center"
            align="center"
            label="始发站-终点站"
          >
            <template slot-scope="scope">
              {{scope.row.fromCity }} - {{scope.row.toCity }}
            </template>
          </el-table-column> -->

          <el-table-column
            prop="lineStatus"
            header-align="center"
            align="center"
            label="是否启用"
          >
            <template slot-scope="scope">
               {{['已停用','已启用'][scope.row.lineStatus]}}
            </template>
          </el-table-column>

          <el-table-column
            prop="operationsMode"
            header-align="center"
            align="center"
            label="运营模式"
          >
            <template slot-scope="scope">
               {{['站点到区域','站点到站点','区域到区域','区域到站点'][scope.row.operationsMode-1]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            header-align="center"
            align="center"
            label="票价"
          >
            <template slot-scope="scope">
              ¥ {{scope.row.price  }}
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="permissions.busadmin_line_view"
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
                v-if="permissions.busadmin_line_edit"
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="addOrUpdateHandle(scope.row.id,'edit')"
                >修改</el-button
              >

              <el-button
                v-if="scope.row.lineStatus == 0 && permissions.busadmin_line_edit"
                type="text"
                size="small"
                @click="statusHandle(scope.row.id,scope.row.lineStatus)"
                >启用</el-button
              >
              <el-button
                v-if="scope.row.lineStatus == 1 && permissions.busadmin_line_edit"
                type="text"
                size="small"
                style="color: #f56c6c;"
                @click="statusHandle(scope.row.id,scope.row.lineStatus)"
                >禁用</el-button
              >
              <el-button
                v-if="permissions.busadmin_line_edit"
                type="text"
                size="small"
                @click="priceHandle(scope.row)"
                >票价</el-button
              >
              <!-- <el-button
                v-if="permissions.busadmin_line_del"
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
      <el-dialog title="设置票价" :visible.sync="dialogFormVisible"  :before-close="handleClose" >   <!-- :center="true"   居中 -->
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="140px">
          <el-form-item label="票价设置：" prop="price">
            <el-input
              v-model="temp.price"
              placeholder="请输入票价"
              style="width: 180px"
            >
              <span slot="append">元</span>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="setPrice">确定</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, delObj, updateInfoObj } from "@/api/busadmin/line";
import TableForm from "./line-form";
import { mapGetters } from "vuex";
import { code } from "@/util/adcode";
import { city} from "@/util/city"

export default {
  data() {
    return {
      dataForm: {
        key: "",
      },
      searchForm: {
        lineName:'',
        operationsMode:'',
        fromCity:'',
        toCity:'',
      },
      city:city,
      temp:{
        price:'',
      },
      rules:{
        price: [
          {
            required: true,
            message: "票价不能为空",
            trigger: "blur",
          },
          {
            pattern:
              /^([1-9]\d{0,5})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/,
            message: "票价不能超范围（0.01~999999）",
          },
        ],
      },
      dialogFormVisible:false,
      requestLocked : false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      operationsModeList: [
        { label: "站点到区域", value: 1 },
        { label: "站点到站点", value: 2 },
        { label: "区域到区域", value: 3 },
        { label: "区域到站点", value: 4 },
      ],
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
  filters:{
    codeFil(val) {
      return code[val];
    },
  },
  methods: {
    
    resetForm(){
      this.searchForm = {
        lineName:'',
        operationsMode:'',
        fromCity:'',
        toCity:'',
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
    statusHandle(id,status) {
      this.$confirm(`确定要${status == 0 ?'启用':'禁用'}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateInfoObj({id:id,lineStatus:status == 0?1:0});
        })
        .then((data) => {
          this.$message.success(`${status == 0 ?'启用':'禁用'}成功`);
          this.getDataList();
        });
    },
    priceHandle(row){
      this.temp = {
        price:row.price,
        id:row.id,
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        console.log(this.$refs['dataForm'],3333)
          this.$refs['dataForm'].clearValidate()
      })
    },
    setPrice(){
      if(this.requestLocked) return false
      this.$refs['dataForm'].validate((valid) => {
        if(valid){
          let tempData = Object.assign({}, this.temp)
          tempData.price = tempData.price - 0
          console.log(tempData,3333)
          updateInfoObj(tempData).then(res=>{
            this.$message.success(`票价修改成功`);
            this.getDataList();
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleClose(){
      this.dialogFormVisible = false
    },
    //  导出excel
    exportExcel() {
      this.downBlobFile("/busadmin/line/export", this.searchForm, "line.xlsx");
    },
  },
};
</script>
