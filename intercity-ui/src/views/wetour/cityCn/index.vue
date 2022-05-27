<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
       
        <el-input
          v-model="searchForm.id"
          placeholder="请输入ID"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model="searchForm.country"
          placeholder="请输入国家"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model="searchForm.city"
          placeholder="请输入城市"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        
        <el-select
          v-model="searchForm.businessStatus"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="''" label="全部状态" />
          <el-option value="1" label="已开通" />
          <el-option value="0" label="未开通" />
          
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
        <el-button
          v-if="permissions.wetour_citycn_add"
          icon="el-icon-plus"
          type="primary"
          class="filter-item"
          @click="addOrUpdateHandle(0,'create')"
          >增加</el-button
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
            label="ID"
          >
          </el-table-column>
          <el-table-column
            prop="city"
            header-align="center"
            align="center"
            label="城市"
          >
          </el-table-column>
          <el-table-column
            prop="country"
            header-align="center"
            align="center"
            label="国家"
          >
          </el-table-column>
          <el-table-column
            prop="telephoneCode"
            header-align="center"
            align="center"
            label="国际电话区号"
          >
          </el-table-column>
          <el-table-column
            prop="timeZone"
            header-align="center"
            align="center"
            label="时区"
          >
          </el-table-column>
         
          
           <el-table-column
            prop="businessStatus"
            header-align="center"
            align="center"
            label="业务状态"
          >
            <template slot-scope="scope">
               {{scope.row.businessStatus | businessStatusFil}}
            </template>
          </el-table-column>
           
         
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
              
                v-if="permissions.wetour_citycn_view"
                type="text"
                size="small"
                @click="
                  addOrUpdateHandle(
                    scope.row.id,
                    'edit',
                    scope.row
                  )
                "
                >编辑</el-button
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
import { fetchList, delObj, getObj } from "@/api/wetour/cityCn";
import TableForm from "./table-form";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        
      },
      searchForm: {
        id:"",
        country:'',
        city:'',
        businessStatus:'',
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
    genderFil(val){
      const map = {
        1:'男',
        2:'女',
      }
      return map[val]
    },
    businessStatusFil(val){
      const map = {
        1:'已开通',
        0:'未开通',
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
        country:'',
        city:'',
        businessStatus:'',
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
    addOrUpdateHandle(id,type,data) {
      // this.addOrUpdateVisible = true;
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id,type);
      // });

      // this.dialogType = 'create'
      this.dialogType = type
      if(type == 'create'){
        this.addOrUpdateVisible = true;
        return false
      }
      // this.dialogData = data
      // this.$nextTick(() => {
      //   this.addOrUpdateVisible = true;
      // });
      // this.addOrUpdateVisible = true;
      // console.log(5555555)
      getObj(id).then(response=>{
        console.log(response)
        // return  false
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