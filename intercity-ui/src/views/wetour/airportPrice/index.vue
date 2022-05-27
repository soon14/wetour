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
          v-model="searchForm.airportName"
          placeholder="请输入机场名称"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model="searchForm.cityCnName"
          placeholder="请输入城市名称"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <!-- <el-input
          v-model="searchForm.partnerAccountName"
          placeholder="请输入伙伴账号"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
        />
        <el-input
          v-model="searchForm.countryCn"
          placeholder="请输入国家"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
        />
        <el-select
          v-model="searchForm.busType"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="''" label="全部车辆类型" />
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
          
        </el-select> -->
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
          v-if="permissions.wetour_cityairportprice_add"
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
            prop="airportName"
            header-align="center"
            align="center"
            label="机场名称"
          >
          </el-table-column>
          <el-table-column
            prop="cityCnName"
            header-align="center"
            align="center"
            label="城市"
          >
          </el-table-column>
          <el-table-column
            prop="countryName"
            header-align="center"
            align="center"
            label="国家"
          >
          </el-table-column>
          <el-table-column
            prop="threeCharactersCode"
            header-align="center"
            align="center"
            label="三字代码"
          >
          </el-table-column>
          <el-table-column
            prop="longitude"
            header-align="center"
            align="center"
            label="经度"
          >
          
          </el-table-column>
          <el-table-column
            prop="latitude"
            header-align="center"
            align="center"
            label="纬度"
          >
          </el-table-column>

            
          
          <el-table-column
            prop="airportStatus"
            header-align="center"
            align="center"
            label="状态"
          >
          <template slot-scope="scope">
               {{scope.row.airportStatus | statusFil}}
            </template>
          </el-table-column>
         
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
              
                v-if="permissions.wetour_cityairportprice_edit"
                type="text"
                size="small"
                @click="
                  UpdateState(
                    scope.row.id,
                    scope.row.airportStatus==1?0:1,
                    scope.row.airportName
                  )
                "
                >{{scope.row.airportStatus==1?'禁用':'启用'}}</el-button>
              <el-button
              
                v-if="permissions.wetour_cityairportprice_edit"
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
import { fetchList, delObj, getObj,editState } from "@/api/wetour/airportPrice";
import TableForm from "./table-form";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        
      },
      searchForm: {
        airportName:"",
        cityCnName:'',
        // partnerName:'',
        // partnerAccountName:'',
        // countryCn:'',
        // insuranceExpiredStatus:'',
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
    statusFil(val){
      const map = {
        0:'禁用',
        1:'启用',
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
        airportName:"",
        cityCnName:'',
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
        this.dataList = response.data.data?response.data.data.records:[];
        this.totalPage = response.data.data?response.data.data.total:0;
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
    },
    //修改禁用启用
    UpdateState(id,type,data){
       this.$confirm(`是否将 【${data}】 的状态修改为【${type===1?'启用':'禁用'}】`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return editState(type,id);
        })
        .then((data) => {
          this.$message.success("修改成功");
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